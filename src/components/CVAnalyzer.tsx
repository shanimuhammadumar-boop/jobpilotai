import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  RefreshCw, 
  ArrowRight, 
  Check, 
  TrendingUp,
  Target,
  Briefcase,
  Building2,
  Sliders,
  Award
} from "lucide-react";
import { CVAnalysisResult, UserProfile, Job } from "../types";
import { SAMPLE_CVS } from "../data/sampleCVs";
import { AIService } from "../services/ai";
import { useToast } from "./Toast";
import { NavTab } from "./Navbar";

interface CVAnalyzerProps {
  user: UserProfile | null;
  jobs?: Job[];
  onUpdateUserCV: (cvText: string, analysis?: CVAnalysisResult, fileName?: string) => void;
  onSelectTab: (tab: NavTab) => void;
  onSelectJobForCoverLetter?: (job: Job) => void;
}

export const CVAnalyzer: React.FC<CVAnalyzerProps> = ({ 
  user, 
  jobs = [],
  onUpdateUserCV, 
  onSelectTab,
  onSelectJobForCoverLetter 
}) => {
  const { showToast } = useToast();
  const [activeInputTab, setActiveInputTab] = useState<"paste" | "upload">("paste");
  const [cvText, setCvText] = useState(user?.cvText || SAMPLE_CVS[0].fullText);
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Senior Full Stack AI Engineer");
  const [fileName, setFileName] = useState(user?.cvFileName || "My_Resume.pdf");
  
  // Target Job matching mode
  const [targetJobMode, setTargetJobMode] = useState<"general" | "specific">("specific");
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [customJobDesc, setCustomJobDesc] = useState<string>("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(user?.lastCvAnalysis || null);
  const [copied, setCopied] = useState(false);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

  // Handle File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCvText(content);
        showToast(`Loaded ${file.name} successfully!`, "success");
      }
    };
    reader.readAsText(file);
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCvText(content);
        showToast(`Dropped and loaded ${file.name}!`, "success");
      }
    };
    reader.readAsText(file);
  };

  // Run AI analysis
  const runAnalysis = async () => {
    if (!cvText.trim()) {
      showToast("Please paste your resume text or upload a file first.", "error");
      return;
    }

    setIsAnalyzing(true);
    try {
      let jobTargetObj: { title?: string; company?: string; description?: string; skills?: string[] } | undefined = undefined;

      if (targetJobMode === "specific") {
        if (selectedJobId === "custom") {
          jobTargetObj = {
            title: targetRole,
            company: "Target Employer",
            description: customJobDesc || "Custom job description provided by candidate.",
            skills: ["React", "TypeScript", "System Design", "Cloud Infrastructure"]
          };
        } else if (selectedJob) {
          jobTargetObj = {
            title: selectedJob.title,
            company: selectedJob.company,
            description: selectedJob.description,
            skills: selectedJob.skills
          };
        }
      }

      const result = await AIService.analyzeCV(cvText, targetRole, jobTargetObj);
      setAnalysisResult(result);
      onUpdateUserCV(cvText, result, fileName);
      
      const score = result.jobMatchScore ?? result.atsScore;
      showToast(`Resume Audit Complete! Match Score: ${score}/100`, "success");
    } catch (err) {
      showToast("Analysis encountered an issue. Using cached audit.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyReport = () => {
    if (!analysisResult) return;
    const matchScore = analysisResult.jobMatchScore ?? analysisResult.atsScore;
    const report = `JOBPILOT AI – RESUME AUDIT & MATCH REPORT
Target Position: ${analysisResult.targetJobTitle || targetRole} ${analysisResult.targetCompany ? `at ${analysisResult.targetCompany}` : ""}
Match Score: ${matchScore}/100 (${analysisResult.atsCompatibility} Compatibility)
ATS Formatting: ${analysisResult.formattingScore}/100 | Impact: ${analysisResult.impactScore}/100 | Keywords: ${analysisResult.keywordScore}/100

EXECUTIVE SUMMARY:
${analysisResult.summary}

KEY STRENGTHS IDENTIFIED:
${analysisResult.strengths.map(s => "• " + s).join("\n")}

IDENTIFIED MISSING SKILLS:
${analysisResult.missingSkills.map(m => "• " + m).join("\n")}

SPECIFIC IMPROVEMENTS:
${analysisResult.actionableImprovements.map(a => "• " + a).join("\n")}

EXTRACTED SKILLS:
${analysisResult.topSkills.join(", ")}
`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    showToast("Resume Audit Report copied to clipboard!", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const displayMatchScore = analysisResult ? (analysisResult.jobMatchScore ?? analysisResult.atsScore) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Resume Analyzer & Job Fit Auditor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Resume Analyzer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upload or paste your resume to analyze it against specific open jobs. Uncover your 0–100 match score, missing required skills, and tailored improvement suggestions.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        {/* Preset Sample CVs bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="font-semibold text-slate-500">Quick Test with Sample Resumes:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CVS.map(sample => (
              <button
                key={sample.id}
                onClick={() => {
                  setCvText(sample.fullText);
                  setTargetRole(sample.role);
                  setFileName(`${sample.name.replace(/\s+/g, "_")}_Resume.pdf`);
                  showToast(`Loaded ${sample.name}'s resume (${sample.role})`, "info");
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-200 transition-colors"
              >
                {sample.name} ({sample.role.split("&")[0].trim()})
              </button>
            ))}
          </div>
        </div>

        {/* TARGET JOB SELECTOR (Feature #1) */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Analyze Resume Against Selected Job
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTargetJobMode("specific")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  targetJobMode === "specific"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Match to Specific Job
              </button>
              <button
                type="button"
                onClick={() => setTargetJobMode("general")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  targetJobMode === "general"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                General Role Audit
              </button>
            </div>
          </div>

          {targetJobMode === "specific" ? (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Select Target Job from JobPilot:
                  </label>
                  <select
                    id="resume-selected-job"
                    value={selectedJobId}
                    onChange={e => {
                      setSelectedJobId(e.target.value);
                      const found = jobs.find(j => j.id === e.target.value);
                      if (found) {
                        setTargetRole(found.title);
                        showToast(`Targeting ${found.title} at ${found.company}`, "info");
                      }
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>
                        {j.title} • {j.company} ({j.location})
                      </option>
                    ))}
                    <option value="custom">✏️ Paste Custom Job Description Below</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Target Role Title
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {selectedJobId === "custom" ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Paste Target Job Description:
                  </label>
                  <textarea
                    rows={3}
                    value={customJobDesc}
                    onChange={e => setCustomJobDesc(e.target.value)}
                    placeholder="Paste job requirements, required technologies, and responsibilities..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              ) : selectedJob ? (
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{selectedJob.company}</span>
                      <span className="text-slate-400">•</span>
                      <span>{selectedJob.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      Required Skills: {selectedJob.skills.join(", ")}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold">
                    ${selectedJob.salaryMin / 1000}k - ${selectedJob.salaryMax / 1000}k • {selectedJob.workplaceType}
                  </span>
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Target Role / Industry Title
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Machine Learning Engineer, VP of Product..."
                className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          )}
        </div>

        {/* INPUT TABS: Paste vs Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Candidate Resume
            </label>
            <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveInputTab("paste")}
                className={`py-1 px-3 rounded-lg transition-colors text-center ${
                  activeInputTab === "paste"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setActiveInputTab("upload")}
                className={`py-1 px-3 rounded-lg transition-colors text-center ${
                  activeInputTab === "upload"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Upload Document
              </button>
            </div>
          </div>

          {activeInputTab === "upload" ? (
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 hover:bg-indigo-50/20 transition-colors"
            >
              <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                Drag and drop your resume file here, or browse
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT, MD files</p>
              <label className="mt-4 inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                Choose File
                <input type="file" accept=".pdf,.docx,.txt,.md" onChange={handleFileUpload} className="hidden" />
              </label>
              {fileName && (
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  Loaded: <strong className="text-indigo-600 dark:text-indigo-400">{fileName}</strong>
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Paste plain text or markdown resume content</span>
                <span>{cvText.length} characters</span>
              </div>
              <textarea
                id="cv-text-input"
                rows={9}
                placeholder="Paste your resume / CV text here..."
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            Powered by Gemini 3.8 Flash • Evaluates skill overlap, ATS parseability & missing keywords
          </span>
          <button
            id="cv-analyze-btn"
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Resume against Job...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume & Calculate Match Score</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Top Score Banner with Match Score 0-100 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white border border-indigo-900/60 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    displayMatchScore >= 80 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                      : displayMatchScore >= 65 
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}>
                    {displayMatchScore >= 80 ? "High Match Alignment" : displayMatchScore >= 65 ? "Moderate Alignment" : "Skill Gap Identified"}
                  </span>
                  <span className="text-xs text-indigo-200">
                    Target: <strong>{analysisResult.targetJobTitle || targetRole}</strong>
                    {analysisResult.targetCompany && ` at ${analysisResult.targetCompany}`}
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
                  <span>Match Score:</span>
                  <span className={displayMatchScore >= 80 ? "text-emerald-400" : displayMatchScore >= 65 ? "text-amber-400" : "text-rose-400"}>
                    {displayMatchScore}/100
                  </span>
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Circular Gauge Representation */}
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-xs shrink-0 self-start md:self-auto">
                <div className="text-center">
                  <div className={`text-3xl sm:text-4xl font-black ${
                    displayMatchScore >= 80 ? "text-emerald-400" : displayMatchScore >= 65 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {displayMatchScore}%
                  </div>
                  <div className="text-[11px] text-indigo-200 uppercase font-semibold tracking-wider mt-0.5">
                    Match Score
                  </div>
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div className="text-xs space-y-1 text-slate-300">
                  <div>ATS Formatting: <strong className="text-white">{analysisResult.formattingScore}%</strong></div>
                  <div>Impact Metrics: <strong className="text-white">{analysisResult.impactScore}%</strong></div>
                  <div>Keyword Alignment: <strong className="text-white">{analysisResult.keywordScore}%</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* MISSING SKILLS & SPECIFIC IMPROVEMENTS (Core Requirement #1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Skills Identified */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Identified Missing Skills
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  {analysisResult.missingSkills.length} Identified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Skills required or preferred for this position that were not detected in your resume:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {analysisResult.missingSkills.map((gap, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Improvements */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-5 h-5" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Specific Improvements for this Job
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Targeted Suggestions
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Actionable revisions to maximize interview invitation probability:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {analysisResult.actionableImprovements.map((act, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Strengths & Found Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Strengths */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Key Strengths Identified</h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {analysisResult.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extracted Skills Matrix */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Award className="w-5 h-5 text-indigo-500" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Extracted Candidate Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysisResult.topSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {analysisResult.softSkills && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 block mb-1.5">Soft & Leadership Competencies:</span>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.softSkills.map((soft, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400"
                      >
                        {soft}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={copyReport}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Report Copied to Clipboard" : "Copy Full Audit Report"}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              {selectedJob && onSelectJobForCoverLetter && (
                <button
                  onClick={() => {
                    onSelectJobForCoverLetter(selectedJob);
                    onSelectTab("cover-letter");
                    showToast(`Prefilled cover letter for ${selectedJob.title}`, "info");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Generate Tailored Cover Letter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onSelectTab("job-matcher")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Explore Smart Job Matches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
