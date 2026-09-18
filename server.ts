import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({ status: "ok", aiConfigured: hasKey });
});

// Download Dist ZIP endpoint
app.get(["/download-dist-zip", "/api/download-dist-zip", "/jobpilotai-dist.zip"], (_req, res) => {
  const candidates = [
    path.join(process.cwd(), "public", "jobpilotai-dist.zip"),
    path.join(process.cwd(), "dist", "jobpilotai-dist.zip"),
    path.join(process.cwd(), "jobpilotai-dist.zip"),
  ];

  for (const zipPath of candidates) {
    if (fs.existsSync(zipPath)) {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="jobpilotai-dist.zip"');
      return res.sendFile(zipPath);
    }
  }

  return res.status(404).send("ZIP file not found. Please run the build script first.");
});

// AI CV Analysis Endpoint
app.post("/api/ai/analyze-cv", async (req, res) => {
  try {
    const { cvText, targetRole, selectedJobTitle, selectedCompany, selectedJobDescription, selectedJobSkills } = req.body;
    if (!cvText) {
      return res.status(400).json({ error: "CV text is required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({ fallback: true, message: "No Gemini API key configured. Using local AI evaluation engine." });
    }

    const hasTargetJob = Boolean(selectedJobTitle || selectedJobDescription);
    const prompt = `You are an elite Applicant Tracking System (ATS) auditor and career strategist.
Analyze the following candidate CV${targetRole ? ` for the target role: ${targetRole}` : ""}.
${hasTargetJob ? `
CRITICAL TARGET JOB REQUIREMENT:
The user wants to analyze their resume against this SPECIFIC JOB:
- Job Title: ${selectedJobTitle || targetRole || "Selected Role"}
- Company: ${selectedCompany || "Target Employer"}
- Job Skills: ${Array.isArray(selectedJobSkills) ? selectedJobSkills.join(", ") : selectedJobSkills || "Standard requirements"}
- Job Description Context:
${(selectedJobDescription || "").slice(0, 3000)}
` : ""}

Return ONLY valid JSON matching this exact structure (no markdown formatting, no code block fence, raw JSON only):
{
  "atsScore": 85,
  "formattingScore": 90,
  "impactScore": 80,
  "keywordScore": 82,
  "structureScore": 88,
  ${hasTargetJob ? `"jobMatchScore": 84,` : `"jobMatchScore": 85,`}
  "summary": "Concise executive overview of the CV profile.",
  "topSkills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6"],
  "softSkills": ["Communication", "Leadership", "Problem Solving"],
  "strengths": ["Strong measurable results with metrics", "Clear technical progression", "Relevant modern stack"],
  "missingSkills": [${hasTargetJob ? `"Specific Skill required by ${selectedJobTitle || "job"}", "Missing required technology"` : `"Cloud orchestration (Kubernetes)", "CI/CD automated testing"`}],
  "actionableImprovements": [
    "Quantify impact in the most recent role by adding percentage revenue or efficiency metrics.",
    "Add a dedicated Skills Matrix section near the top for automated ATS parsing.",
    ${hasTargetJob ? `"Tailor bullet points to explicitly mention ${selectedJobTitle || "the target role"} keywords."` : `"Standardize date formats to Month YYYY for flawless ATS indexing."`}
  ],
  "atsCompatibility": "High"
}

Candidate CV:
${cvText.slice(0, 8000)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("Gemini CV analysis error:", err?.message);
    return res.json({ fallback: true, error: err?.message });
  }
});

// AI Job Matcher Endpoint
app.post("/api/ai/match-job", async (req, res) => {
  try {
    const { cvText, jobDescription, jobTitle, company } = req.body;
    if (!cvText || !jobDescription) {
      return res.status(400).json({ error: "cvText and jobDescription are required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({ fallback: true, message: "No Gemini key configured. Using local matching engine." });
    }

    const prompt = `You are an expert tech recruiter and ATS matching algorithm. Compare this candidate's CV against the job description for ${jobTitle || "the role"} at ${company || "the company"}.

Return ONLY valid JSON matching this structure (no markdown, no backticks, raw JSON):
{
  "matchPercentage": 82,
  "skillsMatch": 85,
  "experienceMatch": 80,
  "educationMatch": 90,
  "cultureMatch": 85,
  "matchingKeywords": ["React", "TypeScript", "Microservices", "REST APIs", "Agile"],
  "missingKeywords": ["GraphQL", "AWS Lambda", "Terraform"],
  "keyStrengths": ["Direct experience with high-scale web systems", "Strong engineering fundamentals"],
  "gapsIdentified": ["Lacks explicit mention of infrastructure as code"],
  "recommendedCVEdits": [
    "Highlight experience with cloud deployments in your lead project description.",
    "Explicitly include 'Agile/Scrum' in your core competencies list."
  ],
  "interviewProbability": "High"
}

Candidate CV:
${cvText.slice(0, 6000)}

Job Description:
${jobDescription.slice(0, 6000)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("Gemini job match error:", err?.message);
    return res.json({ fallback: true, error: err?.message });
  }
});

// AI Job Application Assistant Endpoint (Cover Letter + Short Application Message)
app.post("/api/ai/generate-cover-letter", async (req, res) => {
  try {
    const { jobTitle, company, jobDescription, candidateExperience, tone } = req.body;
    if (!jobTitle || !company) {
      return res.status(400).json({ error: "jobTitle and company are required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({ fallback: true, message: "No Gemini key configured. Using local generator." });
    }

    const prompt = `You are an elite career strategist and executive application assistant.
Target Role: ${jobTitle}
Company: ${company}
Desired Tone: ${tone || "Professional and confident"}
Candidate Experience/Highlights: ${candidateExperience || "Experienced professional with proven track record in relevant technologies and team collaboration."}
Job Context: ${jobDescription ? jobDescription.slice(0, 3000) : "Industry standard role requirements"}

Generate TWO items in valid JSON (no markdown formatting, no code fences):
1. "coverLetter": A comprehensive, compelling 3-4 paragraph formal cover letter with date placeholder, greeting, value proposition, relevant achievements matching ${company}, and professional sign-off.
2. "shortMessage": A punchy, concise 2-3 sentence application message tailored for a LinkedIn recruiter InMail, direct hiring manager email, or fast-apply note.

JSON Structure:
{
  "coverLetter": "Full formal cover letter...",
  "shortMessage": "Hi [Hiring Manager / Team], I noticed the ${jobTitle} opening at ${company} and wanted to reach out..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({
      success: true,
      coverLetter: parsed.coverLetter || response.text,
      shortMessage: parsed.shortMessage || `Hi Hiring Team at ${company}, I am very interested in the ${jobTitle} position. With my relevant background and proven delivery record, I am confident I can make an immediate positive impact on your team. I would welcome the opportunity to connect briefly to discuss how my skill set aligns with your roadmap.`
    });
  } catch (err: any) {
    console.error("Gemini cover letter error:", err?.message);
    return res.json({ fallback: true, error: err?.message });
  }
});

// AI Smart Job Match Endpoint
app.post("/api/ai/smart-job-match", async (req, res) => {
  try {
    const { skills, experience, desiredJob, availableJobs } = req.body;
    const ai = getAIClient();

    if (!ai || !availableJobs || !Array.isArray(availableJobs)) {
      return res.json({ fallback: true, message: "Using local smart match ranker" });
    }

    const prompt = `You are a Smart Job Match recommendation engine.
Candidate Profile:
- Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "Not specified"}
- Experience Level / Years: ${experience || "Mid to Senior"}
- Desired Job / Target Title: ${desiredJob || "Software Professional"}

Available Jobs to evaluate (up to 12 jobs):
${JSON.stringify(availableJobs.slice(0, 12).map((j: any) => ({
  id: j.id,
  title: j.title,
  company: j.company,
  skills: j.skills,
  experienceLevel: j.experienceLevel,
  descriptionSnippet: (j.description || "").slice(0, 150)
})))}

Evaluate each available job against the candidate's skills, experience, and desired job.
Return valid JSON (no markdown):
{
  "recommendations": [
    {
      "jobId": "job-1",
      "matchScore": 92,
      "matchReason": "Direct match for your React and TypeScript skillset with senior responsibilities that match your 5+ years experience.",
      "matchedSkills": ["React", "TypeScript"],
      "missingSkills": ["GraphQL"],
      "experienceFit": "Strong" // "Strong" | "Good" | "Potential"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ success: true, data: parsed.recommendations || [] });
  } catch (err: any) {
    console.error("Gemini smart match error:", err?.message);
    return res.json({ fallback: true, error: err?.message });
  }
});

// AI Interview Practice & Feedback Endpoint
app.post("/api/ai/interview-feedback", async (req, res) => {
  try {
    const { jobTitle, experienceLevel, interviewType, question, userAnswer } = req.body;
    if (!question || !userAnswer) {
      return res.status(400).json({ error: "question and userAnswer are required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({ fallback: true, message: "No Gemini key. Using local evaluation engine." });
    }

    const prompt = `You are a senior hiring manager conducting an interview for a ${experienceLevel || "Mid-Senior"} ${jobTitle || "Professional"} (${interviewType || "Behavioral"} interview).

Question Asked: "${question}"
Candidate's Answer: "${userAnswer}"

Evaluate the candidate's answer. Return ONLY raw valid JSON (no markdown formatting):
{
  "score": 85,
  "feedback": "Detailed 2-3 sentence evaluation of the answer.",
  "strengths": ["Clear context provided", "Demonstrated accountability", "Logical flow"],
  "areasToImprove": ["Could use the STAR method more strictly", "Needs more specific quantifiable results"],
  "suggestedBetterAnswer": "A polished, world-class example answer following the STAR (Situation, Task, Action, Result) methodology."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("Gemini interview feedback error:", err?.message);
    return res.json({ fallback: true, error: err?.message });
  }
});

// AI Skill Gap Analyzer Endpoint
app.post("/api/ai/skill-gap", async (req, res) => {
  try {
    const { targetJob, currentSkills } = req.body;
    if (!targetJob) {
      return res.status(400).json({ error: "targetJob is required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({ fallback: true, message: "No Gemini key. Using local gap analyzer." });
    }

    const prompt = `You are a career development architect.
Target Job: ${targetJob}
Current Candidate Skills: ${Array.isArray(currentSkills) ? currentSkills.join(", ") : currentSkills}

Analyze what skills the candidate already possesses versus what they need to master to land this job at top compensation.
Return ONLY valid JSON (no markdown):
{
  "haveSkills": ["Skill A", "Skill B"],
  "missingSkills": [
    {
      "skill": "Skill Name",
      "priority": "Critical", // "Critical" | "High" | "Medium"
      "reason": "Why this skill is mandatory for this role",
      "recommendedLearning": "Top resource, project idea, or certification to acquire this skill in 2-4 weeks"
    }
  ],
  "learningRoadmap": [
    { "phase": "Week 1-2", "focus": "Core Fundamentals", "action": "Complete hands-on project" },
    { "phase": "Week 3-4", "focus": "Advanced Specialization", "action": "Build portfolio artifact" }
  ],
  "marketDemand": "High",
  "estimatedTimeToJobReady": "4-6 weeks"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("Gemini skill gap error:", err?.message);
    return res.json({ fallback: true, error: err?.message });
  }
});

// Vite middleware setup
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JobPilot AI server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
