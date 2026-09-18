import { CVAnalysisResult, JobMatchResult, InterviewFeedback, SkillGapResult, Job, SmartJobMatchRecommendation } from "../types";
import { StorageService } from "./storage";

export const AIService = {
  // 1. CV Analysis (with optional targeted job analysis)
  async analyzeCV(
    cvText: string, 
    targetRole: string = "Senior Software Engineer",
    selectedJob?: { title?: string; company?: string; description?: string; skills?: string[] }
  ): Promise<CVAnalysisResult> {
    try {
      const res = await fetch("/api/ai/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cvText, 
          targetRole,
          selectedJobTitle: selectedJob?.title,
          selectedCompany: selectedJob?.company,
          selectedJobDescription: selectedJob?.description,
          selectedJobSkills: selectedJob?.skills
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          StorageService.logAIUsage("CV Analyzer", 1450);
          return {
            ...json.data,
            analyzedAt: new Date().toISOString(),
            targetRole,
            targetJobTitle: selectedJob?.title,
            targetCompany: selectedJob?.company,
            jobMatchScore: json.data.jobMatchScore ?? json.data.atsScore,
          };
        }
      }
    } catch (err) {
      console.warn("Server AI route failed, using local analysis engine", err);
    }

    // Heuristic Fallback
    StorageService.logAIUsage("CV Analyzer", 800);
    const textLower = cvText.toLowerCase();
    
    // Detect keywords
    const potentialSkills = [
      "React", "TypeScript", "JavaScript", "Node.js", "Python", "SQL", "Tailwind CSS",
      "Docker", "AWS", "Kubernetes", "GraphQL", "Git", "Next.js", "CI/CD", "REST APIs",
      "Agile", "Scrum", "Product Strategy", "SEO", "Google Analytics", "Figma", "MLOps", "Go", "Java"
    ];
    const detected = potentialSkills.filter(s => textLower.includes(s.toLowerCase()));
    const topSkills = detected.length >= 4 ? detected.slice(0, 8) : ["TypeScript", "React", "Node.js", "REST APIs", "SQL", "Git"];

    // Compute ATS heuristic score based on length and structure
    const hasMetrics = /\b(\d+%|\$\d+|\d+x|\d+ years|\d+ users|\d+k)\b/i.test(cvText);
    const hasEducation = /education|bachelor|master|degree|university/i.test(cvText);
    const hasExperience = /experience|work history|employment|senior|lead/i.test(cvText);

    let baseScore = 78;
    if (hasMetrics) baseScore += 8;
    if (hasEducation) baseScore += 5;
    if (hasExperience) baseScore += 5;
    const finalScore = Math.min(96, Math.max(68, baseScore));

    // If targeted against a specific job, calculate specific match score and missing skills
    let jobMatchScore = finalScore;
    let missingSkills = [
      "Cloud orchestration (Kubernetes / Terraform) could be made more explicit in project summaries",
      "CI/CD automated regression test coverage metrics",
      "Cross-functional mentorship and design review leadership examples"
    ];
    let actionableImprovements = [
      "Include more concrete numerical outcomes (e.g. 'reduced latency by 35%' or 'served 100k+ MAU') in bullet points.",
      "Add a dedicated 'Core Competencies & Tools' section at the top to optimize automated ATS scanning.",
      "Ensure standard month/year formatting (e.g. 'May 2022 – Present') for all work history entries."
    ];

    if (selectedJob) {
      const requiredSkills = selectedJob.skills || [];
      const matched = requiredSkills.filter(s => textLower.includes(s.toLowerCase()));
      const missing = requiredSkills.filter(s => !textLower.includes(s.toLowerCase()));
      
      const skillMatchPct = requiredSkills.length > 0 ? (matched.length / requiredSkills.length) * 100 : 80;
      jobMatchScore = Math.round(skillMatchPct * 0.7 + finalScore * 0.3);

      if (missing.length > 0) {
        missingSkills = missing.map(m => `Missing required skill: ${m}`);
      }
      actionableImprovements = [
        `Explicitly highlight ${matched.slice(0, 2).join(" & ") || "core technical capabilities"} in your latest role bullets to align directly with ${selectedJob.company || "the company"}.`,
        missing.length > 0 ? `Incorporate experience or relevant certifications around ${missing.slice(0, 2).join(" and ")} to satisfy screening filters.` : `Highlight your proficiency with production scale and distributed systems.`,
        `Tailor your professional summary to reference ${selectedJob.title || "this target position"} directly.`
      ];
    }

    return {
      atsScore: finalScore,
      formattingScore: 92,
      impactScore: hasMetrics ? 88 : 72,
      keywordScore: Math.min(95, 70 + topSkills.length * 3),
      structureScore: 90,
      jobMatchScore,
      targetJobTitle: selectedJob?.title,
      targetCompany: selectedJob?.company,
      summary: selectedJob 
        ? `CV analyzed directly against ${selectedJob.title} at ${selectedJob.company || "employer"}. Shows a ${jobMatchScore}% alignment with key job requirements, with clear areas for targeted keyword optimization.`
        : `Comprehensive CV with strong demonstrated background for ${targetRole}. Displays clear progression, modern technical capabilities, and quantifiable impact across prior roles.`,
      topSkills,
      softSkills: ["Cross-functional Leadership", "Clear Technical Communication", "System Problem Solving", "Agile Execution"],
      strengths: [
        "Well-organized reverse chronological layout optimal for automated ATS parsers",
        hasMetrics ? "Quantifiable business impact metrics ($ savings, % speedups) highlight senior readiness" : "Clear task accountability and scope in recent positions",
        "Modern technology stack aligns tightly with current enterprise hiring requirements"
      ],
      missingSkills,
      actionableImprovements,
      atsCompatibility: jobMatchScore >= 85 ? "High" : "Medium",
      analyzedAt: new Date().toISOString(),
      targetRole: selectedJob?.title || targetRole,
    };
  },

  // 2. Job Matching
  async matchJob(cvText: string, jobDescription: string, jobTitle?: string, company?: string): Promise<JobMatchResult> {
    try {
      const res = await fetch("/api/ai/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription, jobTitle, company }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          StorageService.logAIUsage("Job Matcher", 1600);
          return json.data;
        }
      }
    } catch (err) {
      console.warn("AI match route fallback:", err);
    }

    // Heuristic Fallback
    StorageService.logAIUsage("Job Matcher", 950);
    const cvLower = cvText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    const techTokens = ["react", "typescript", "node", "python", "sql", "aws", "docker", "kubernetes", "graphql", "tailwind", "api", "agile", "lead", "product", "analytics"];
    const matchedTokens: string[] = [];
    const missingTokens: string[] = [];

    techTokens.forEach(token => {
      const inJob = jobLower.includes(token);
      const inCV = cvLower.includes(token);
      if (inJob && inCV) matchedTokens.push(token.toUpperCase());
      else if (inJob && !inCV) missingTokens.push(token.toUpperCase());
    });

    const matchPct = Math.min(94, Math.max(62, 70 + matchedTokens.length * 4 - missingTokens.length * 3));

    return {
      matchPercentage: matchPct,
      skillsMatch: Math.min(96, matchPct + 4),
      experienceMatch: Math.max(65, matchPct - 5),
      educationMatch: 90,
      cultureMatch: 85,
      matchingKeywords: matchedTokens.length > 0 ? matchedTokens : ["REACT", "TYPESCRIPT", "REST APIS", "GIT", "AGILE"],
      missingKeywords: missingTokens.length > 0 ? missingTokens : ["TERRAFORM", "GRAPHQL", "KUBERNETES"],
      keyStrengths: [
        `Candidate's core technical toolkit overlaps heavily with ${company || "the company"}'s primary stack.`,
        "Proven experience with scalable application architecture and team delivery.",
        "Demonstrated track record of delivering end-to-end features on schedule."
      ],
      gapsIdentified: [
        "Could emphasize specific cloud infrastructure deployments or DevOps workflows.",
        "Target job asks for explicit experience in high-throughput data processing."
      ],
      recommendedCVEdits: [
        `Explicitly weave keywords (${missingTokens.slice(0, 2).join(", ") || "Cloud Architecture"}) into your most recent position bullet points.`,
        "Tailor your summary statement to mention this company's industry niche and mission.",
        "Highlight collaborative cross-functional initiatives in your top project showcase."
      ],
      interviewProbability: matchPct >= 80 ? "High" : "Moderate",
    };
  },

  // 3. AI Job Application Assistant (Cover Letter + Short Application Message)
  async generateApplicationAssistant(
    jobTitle: string,
    company: string,
    jobDescription: string,
    candidateExperience: string,
    tone: string = "Professional and confident"
  ): Promise<{ coverLetter: string; shortMessage: string }> {
    try {
      const res = await fetch("/api/ai/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, company, jobDescription, candidateExperience, tone }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.coverLetter) {
          StorageService.logAIUsage("Cover Letter AI", 1100);
          return {
            coverLetter: json.coverLetter,
            shortMessage: json.shortMessage || `Hi Hiring Team at ${company}, I am very excited to apply for the ${jobTitle} role. With my hands-on background and proven delivery in this space, I am confident I can make an immediate high-impact contribution. Looking forward to connecting!`
          };
        }
      }
    } catch (err) {
      console.warn("AI cover letter route fallback:", err);
    }

    // Heuristic Fallback
    StorageService.logAIUsage("Cover Letter AI", 750);
    const currentDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    
    const coverLetter = `${currentDate}

Hiring Team at ${company}
Re: Application for ${jobTitle}

Dear ${company} Hiring Team,

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${company}. Having closely followed ${company}'s impressive growth and product innovation, I was immediately drawn to this opportunity to contribute my skills and passion to your engineering and product objectives.

${candidateExperience ? `In my recent roles, ${candidateExperience.trim()}` : `With a comprehensive background in modern software engineering and building customer-facing digital products, I have consistently driven measurable improvements in application performance, team velocity, and user satisfaction.`} What excites me most about ${company} is your commitment to high technical standards and user-centric problem solving. 

Throughout my career, I have prioritized clean architecture, rigorous automated testing, and transparent cross-functional collaboration. Whether diagnosing complex edge cases or architecting scalable microservices, I take pride in taking full ownership from initial technical specifications to zero-downtime production deployment.

I would welcome the opportunity to discuss how my technical expertise, problem-solving mindset, and dedication can help ${company} achieve its upcoming roadmap milestones. Thank you for your time and consideration.

Warm regards,

Alex Morgan
Senior Software Engineer
(555) 234-5678 | alex.morgan@example.com
linkedin.com/in/alexmorgan`;

    const shortMessage = `Hi Hiring Team at ${company},

I noticed the ${jobTitle} role at ${company} and wanted to reach out directly. Given my experience building scalable modern applications and driving core product velocity, I am confident I can create immediate value for your engineering roadmap. 

I've submitted my application through JobPilot AI and would love to connect briefly if my background aligns with what you're seeking.

Best regards,
Alex Morgan`;

    return { coverLetter, shortMessage };
  },

  async generateCoverLetter(
    jobTitle: string,
    company: string,
    jobDescription: string,
    candidateExperience: string,
    tone: string = "Professional and confident"
  ): Promise<string> {
    const res = await this.generateApplicationAssistant(jobTitle, company, jobDescription, candidateExperience, tone);
    return res.coverLetter;
  },

  // 4. Smart Job Match
  async smartJobMatch(
    skills: string[],
    experience: string,
    desiredJob: string,
    jobs: Job[]
  ): Promise<SmartJobMatchRecommendation[]> {
    try {
      const res = await fetch("/api/ai/smart-job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, experience, desiredJob, availableJobs: jobs }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          StorageService.logAIUsage("Job Matcher", 1500);
          const mapped: SmartJobMatchRecommendation[] = [];
          for (const item of json.data) {
            const foundJob = jobs.find(j => j.id === item.jobId);
            if (foundJob) {
              mapped.push({
                job: foundJob,
                matchScore: item.matchScore ?? 85,
                matchReason: item.matchReason || `Matches your ${skills.slice(0, 2).join(", ")} toolkit and experience level.`,
                matchedSkills: item.matchedSkills || [],
                missingSkills: item.missingSkills || [],
                experienceFit: item.experienceFit || "Strong",
              });
            }
          }
          if (mapped.length > 0) {
            return mapped.sort((a, b) => b.matchScore - a.matchScore);
          }
        }
      }
    } catch (err) {
      console.warn("AI smart job match route fallback:", err);
    }

    // Heuristic Fallback
    StorageService.logAIUsage("Job Matcher", 900);
    const candidateSkillsLower = skills.map(s => s.toLowerCase().trim());
    const desiredLower = desiredJob.toLowerCase().trim();

    return jobs.map(job => {
      const jobSkills = job.skills || [];
      const matchedSkills = jobSkills.filter(s => 
        candidateSkillsLower.some(cs => s.toLowerCase().includes(cs) || cs.includes(s.toLowerCase()))
      );
      const missingSkills = jobSkills.filter(s => !matchedSkills.includes(s));

      const titleOverlap = desiredLower && (
        job.title.toLowerCase().includes(desiredLower) || 
        desiredLower.split(" ").some(w => w.length > 3 && job.title.toLowerCase().includes(w))
      );

      const skillRatio = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) : 0.6;
      let baseScore = Math.round(55 + skillRatio * 35);
      if (titleOverlap) baseScore += 10;
      const matchScore = Math.min(98, Math.max(45, baseScore));

      let experienceFit: "Strong" | "Good" | "Potential" = "Good";
      if (matchScore >= 85) experienceFit = "Strong";
      else if (matchScore < 70) experienceFit = "Potential";

      let matchReason = "";
      if (matchedSkills.length >= 3) {
        matchReason = `Exceptional stack overlap with ${matchedSkills.slice(0, 3).join(", ")}. Role scope directly matches your target of ${desiredJob || job.title}.`;
      } else if (matchedSkills.length > 0) {
        matchReason = `Strong foundation in ${matchedSkills.join(", ")}, with great growth opportunity in ${missingSkills.slice(0, 2).join(", ") || "adjacent areas"}.`;
      } else {
        matchReason = `Transferable domain engineering skills aligned with ${job.category} and ${job.experienceLevel} responsibilities.`;
      }

      return {
        job,
        matchScore,
        matchReason,
        matchedSkills,
        missingSkills,
        experienceFit,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  },

  // 4. Interview AI Practice & Feedback
  async getInterviewFeedback(
    jobTitle: string,
    experienceLevel: string,
    interviewType: string,
    question: string,
    userAnswer: string
  ): Promise<InterviewFeedback> {
    try {
      const res = await fetch("/api/ai/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, experienceLevel, interviewType, question, userAnswer }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          StorageService.logAIUsage("Interview AI", 1350);
          return json.data;
        }
      }
    } catch (err) {
      console.warn("AI interview feedback fallback:", err);
    }

    // Heuristic Fallback
    StorageService.logAIUsage("Interview AI", 600);
    const answerWordCount = userAnswer.trim().split(/\s+/).length;
    const hasSituation = /when|at my previous|during|in a project|we had/i.test(userAnswer);
    const hasResult = /result|outcome|increased|reduced|achieved|improved|learned/i.test(userAnswer);

    let score = 75;
    if (answerWordCount >= 40) score += 8;
    if (hasSituation) score += 5;
    if (hasResult) score += 7;
    score = Math.min(95, score);

    return {
      score,
      feedback: `Strong response with solid technical context and authentic phrasing. You clearly demonstrated your problem-solving process and personal accountability.`,
      strengths: [
        "Articulated the context and core challenge clearly",
        "Demonstrated proactive initiative and technical ownership",
        "Used authentic, professional tone without relying on scripted buzzwords"
      ],
      areasToImprove: [
        hasResult ? "Deepen the technical explanation of trade-offs considered" : "State the measurable outcome (e.g. % improvement or business impact) more definitively using the STAR result phase",
        "Highlight how you communicated with stakeholders or teammates during the resolution"
      ],
      suggestedBetterAnswer: `To answer this with the STAR framework: "At my previous company, we faced a critical challenge where [Situation]. My primary task was to [Task]. I immediately took action by [Action 1: specific technical decision] and [Action 2: collaborative alignment with teammates]. As a result, we [Measurable Result: e.g. reduced incident downtime by 60% and improved team deployment confidence]. This taught me the value of [Key Takeaway]."`
    };
  },

  // 5. Skill Gap Analyzer
  async analyzeSkillGap(targetJob: string, currentSkills: string[] | string): Promise<SkillGapResult> {
    const skillsArray = Array.isArray(currentSkills)
      ? currentSkills
      : currentSkills.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/ai/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetJob, currentSkills: skillsArray }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          StorageService.logAIUsage("Skill Gap", 1200);
          return json.data;
        }
      }
    } catch (err) {
      console.warn("AI skill gap fallback:", err);
    }

    // Heuristic Fallback
    StorageService.logAIUsage("Skill Gap", 700);
    return {
      targetJob,
      haveSkills: skillsArray.slice(0, 5),
      missingSkills: [
        {
          skill: "Distributed Systems & Cloud Orchestration",
          priority: "Critical",
          reason: "Modern high-paying roles require mastery of container lifecycle, Kubernetes clusters, and cloud-native resilience.",
          recommendedLearning: "Complete hands-on Kubernetes CKA prep labs or build a multi-container Docker Swarm project with automated CI/CD."
        },
        {
          skill: "System Design & Caching Architecture",
          priority: "High",
          reason: "Senior interviews heavily weigh trade-offs between Redis caching, read replicas, and event-driven message queues.",
          recommendedLearning: "Study Alex Xu's System Design Interview volume 1 & 2, and implement a distributed rate-limiter in Go/Node.js."
        },
        {
          skill: "Observability & Performance Profiling",
          priority: "Medium",
          reason: "Top engineering teams require engineers to instrument code with OpenTelemetry, Prometheus metrics, and distributed tracing.",
          recommendedLearning: "Set up Grafana and OpenTelemetry on a sample microservice to trace slow database queries."
        }
      ],
      learningRoadmap: [
        { phase: "Week 1-2", focus: "Architecture Fundamentals", action: "Review distributed consensus, DB indexing, and microservice patterns." },
        { phase: "Week 3-4", focus: "Containerization & Cloud", action: "Deploy an end-to-end Kubernetes application with Helm charts and monitoring." },
        { phase: "Week 5-6", focus: "Portfolio & Mock Interviews", action: "Build an open-source AI agent system showcase with live benchmarks." }
      ],
      marketDemand: "Very High",
      estimatedTimeToJobReady: "3-5 weeks of focused study"
    };
  }
};
