import React, { useState } from "react";
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  Download, 
  RefreshCw, 
  Check, 
  Building2, 
  Briefcase, 
  Sliders,
  Send,
  FileText,
  MessageSquare,
  Share2
} from "lucide-react";
import { Job, UserProfile } from "../types";
import { AIService } from "../services/ai";
import { useToast } from "./Toast";

interface CoverLetterAIProps {
  jobs: Job[];
  user: UserProfile | null;
  selectedJob?: Job | null;
}

export const CoverLetterAI: React.FC<CoverLetterAIProps> = ({ jobs, user, selectedJob }) => {
  const { showToast } = useToast();

  const [jobTitle, setJobTitle] = useState(selectedJob?.title || jobs[0]?.title || "Senior Full Stack AI Engineer");
  const [company, setCompany] = useState(selectedJob?.company || jobs[0]?.company || "Synthetix Labs");
  const [jobDescription, setJobDescription] = useState(
    selectedJob?.description || jobs[0]?.description || "Building high-performance AI web applications with React, TypeScript, Node.js and Gemini SDKs."
  );
  const [candidateExperience, setCandidateExperience] = useState(
    user?.lastCvAnalysis?.summary || "Over 7 years architecting scalable full-stack applications, leading agile squads, and delivering mission-critical cloud features."
  );
  const [tone, setTone] = useState("Professional and confident");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Two generated outputs: Professional Cover Letter + Short Application Message
  const [generatedLetter, setGeneratedLetter] = useState<string>("");
  const [generatedShortMessage, setGeneratedShortMessage] = useState<string>("");
  
  const [activeOutputTab, setActiveOutputTab] = useState<"cover-letter" | "short-message">("cover-letter");
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedShortMessage, setCopiedShortMessage] = useState(false);

  // Quick select job
  const handleSelectJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const j = jobs.find(job => job.id === e.target.value);
    if (j) {
      setJobTitle(j.title);
      setCompany(j.company);
      setJobDescription(
        `${j.description}\n\nRequirements:\n${j.requirements?.join("\n") || ""}`
      );
      showToast(`Prefilled details for ${j.title} at ${j.company}`, "info");
    }
  };

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !company.trim()) {
      showToast("Please specify the job title and company name.", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await AIService.generateApplicationAssistant(
        jobTitle,
        company,
        jobDescription,
        candidateExperience,
        tone
      );
      setGeneratedLetter(result.coverLetter);
      setGeneratedShortMessage(result.shortMessage);
      showToast("Cover letter and short application message generated!", "success");
    } catch (err) {
      showToast("Failed to generate application materials.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLetter = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    showToast("Cover letter copied to clipboard!", "success");
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleCopyShortMessage = () => {
    if (!generatedShortMessage) return;
    navigator.clipboard.writeText(generatedShortMessage);
    setCopiedShortMessage(true);
    showToast("Short application message copied to clipboard!", "success");
    setTimeout(() => setCopiedShortMessage(false), 2000);
  };

  const handleDownloadLetter = () => {
    if (!generatedLetter) return;
    const blob = new Blob([generatedLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Cover_Letter_${company.replace(/\s+/g, "_")}_${jobTitle.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Downloaded cover letter as .txt file", "info");
  };

  const handleDownloadShortMessage = () => {
    if (!generatedShortMessage) return;
    const blob = new Blob([generatedShortMessage], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Short_Message_${company.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Downloaded short message as .txt file", "info");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <PenTool className="w-3.5 h-3.5 text-amber-500" />
          <span>AI Job Application Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Job Application Assistant
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Paste any job description to automatically generate both a comprehensive customized cover letter and a punchy short application message for recruiters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: 5 cols */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>Job Description & Role Parameters</span>
          </h3>

          {/* Quick select demo jobs */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Load from Verified Job:
            </label>
            <select
              onChange={handleSelectJob}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="">Choose an open position...</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} at {j.company}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                id="cover-letter-title-input"
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company Name *
              </label>
              <input
                id="cover-letter-company-input"
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Synthetix Labs, Stripe"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Job Description / Requirements *
              </label>
              <span className="text-[11px] text-slate-400">Paste job requirements</span>
            </div>
            <textarea
              id="job-description-paste"
              rows={5}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description or key responsibilities here..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Experience / Standout Highlights
            </label>
            <textarea
              rows={3}
              value={candidateExperience}
              onChange={e => setCandidateExperience(e.target.value)}
              placeholder="Mention your biggest technical achievements, years of experience, or leadership scale..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Desired Tone & Voice
            </label>
            <select
              id="cover-letter-tone-select"
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="Professional and confident">Professional & Confident</option>
              <option value="Enthusiastic and high-growth startup">Enthusiastic Startup Pace</option>
              <option value="Concise, direct and impact-driven">Concise & Metric-Driven</option>
              <option value="Executive leadership and strategic">Executive Leadership</option>
            </select>
          </div>

          <button
            id="cover-letter-generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-amber-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Application Package...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Application Assistant Materials</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output View: 7 cols */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Output Selector Tabs */}
          <div className="p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 flex items-center gap-2">
            <button
              onClick={() => setActiveOutputTab("cover-letter")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeOutputTab === "cover-letter"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Customized Cover Letter</span>
              {generatedLetter && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              onClick={() => setActiveOutputTab("short-message")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeOutputTab === "short-message"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span>Short Application Message</span>
              {generatedShortMessage && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          </div>

          {/* OUTPUT CONTAINER */}
          {activeOutputTab === "cover-letter" ? (
            /* TAB 1: COVER LETTER */
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Tailored Formal Cover Letter
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Formatted for ATS parsers & hiring managers
                  </div>
                </div>

                {generatedLetter && (
                  <div className="flex items-center gap-2">
                    <button
                      id="regenerate-cover-letter-btn"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title="Regenerate Cover Letter"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                      <span>Regenerate</span>
                    </button>
                    <button
                      id="copy-cover-letter-btn"
                      onClick={handleCopyLetter}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLetter ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleDownloadLetter}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                      title="Download as .txt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {generatedLetter ? (
                <div className="flex-1">
                  <textarea
                    rows={18}
                    value={generatedLetter}
                    onChange={e => setGeneratedLetter(e.target.value)}
                    className="w-full h-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-200 resize-none"
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    No Cover Letter Generated Yet
                  </h4>
                  <p className="text-xs max-w-xs text-slate-500">
                    Paste a job description on the left and click "Generate Application Assistant Materials".
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: SHORT APPLICATION MESSAGE */
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Recruiter Outreach & Short Application Note
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Ideal for LinkedIn InMail, recruiter email outreach, or quick-apply cover notes
                  </div>
                </div>

                {generatedShortMessage && (
                  <div className="flex items-center gap-2">
                    <button
                      id="regenerate-short-message-btn"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title="Regenerate Short Message"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                      <span>Regenerate</span>
                    </button>
                    <button
                      id="copy-short-message-btn"
                      onClick={handleCopyShortMessage}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedShortMessage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedShortMessage ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleDownloadShortMessage}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                      title="Download as .txt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {generatedShortMessage ? (
                <div className="flex-1 space-y-4">
                  <textarea
                    rows={12}
                    value={generatedShortMessage}
                    onChange={e => setGeneratedShortMessage(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                  />
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Pro-tip:</strong> Send this message directly to the hiring manager or technical recruiter on LinkedIn within 24 hours of submitting your application for up to 3x higher interview response rates.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    No Short Application Message Yet
                  </h4>
                  <p className="text-xs max-w-xs text-slate-500">
                    Click "Generate Application Assistant Materials" to craft both your formal cover letter and this outreach note simultaneously.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
