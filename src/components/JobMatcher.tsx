import React, { useState } from "react";
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  Sliders,
  Check,
  UserCheck,
  FileText,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { Job, JobMatchResult, UserProfile, SmartJobMatchRecommendation, ApplicationStatus } from "../types";
import { SAMPLE_CVS } from "../data/sampleCVs";
import { AIService } from "../services/ai";
import { useToast } from "./Toast";
import { NavTab } from "./Navbar";

interface JobMatcherProps {
  jobs: Job[];
  user: UserProfile | null;
  initialJob?: Job | null;
  savedJobIds?: string[];
  onToggleSaveJob?: (jobId: string) => boolean;
  onSelectTab: (tab: NavTab) => void;
  onSetCoverLetterJob: (job: Job) => void;
  onAddApplication?: (app: { jobTitle: string; company: string; location?: string; salary?: string; status?: ApplicationStatus; notes?: string }) => void;
}

const COMMON_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "AWS", "Next.js", 
  "Tailwind CSS", "Docker", "Kubernetes", "PostgreSQL", "GraphQL", 
  "Gemini API", "Machine Learning", "System Design", "CI/CD"
];

export const JobMatcher: React.FC<JobMatcherProps> = ({
  jobs,
  user,
  initialJob,
  savedJobIds = [],
  onToggleSaveJob,
  onSelectTab,
  onSetCoverLetterJob,
  onAddApplication
}) => {
  const { showToast } = useToast();

  // Mode: "smart-match" (entered skills, experience, desired job) vs "deep-cv-audit"
  const [activeMode, setActiveMode] = useState<"smart-match" | "deep-cv-audit">("smart-match");

  // SMART MATCH FORM STATE
  const [skillsInput, setSkillsInput] = useState<string>(
    user?.primarySkills?.join(", ") || "React, TypeScript, Node.js, Tailwind CSS, PostgreSQL"
  );
  const [experienceInput, setExperienceInput] = useState<string>(
    user?.experienceYears ? `${user.experienceYears} years` : "5 years (Senior Level)"
  );
  const [desiredJobInput, setDesiredJobInput] = useState<string>(
    user?.targetRole || "Senior Full Stack AI Engineer"
  );
  const [isSmartMatching, setIsSmartMatching] = useState(false);
  const [recommendations, setRecommendations] = useState<SmartJobMatchRecommendation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // DEEP CV COMPARISON STATE
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJob?.id || jobs[0]?.id || "");
  const [jobTitle, setJobTitle] = useState(initialJob?.title || jobs[0]?.title || "Senior Full Stack AI Engineer");
  const [company, setCompany] = useState(initialJob?.company || jobs[0]?.company || "Synthetix Labs");
  const [jobDescription, setJobDescription] = useState(initialJob?.description || jobs[0]?.description || "");
  const [cvText, setCvText] = useState(user?.cvText || SAMPLE_CVS[0].fullText);
  const [isComparing, setIsComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<JobMatchResult | null>(null);

  // Prefill from user profile
  const handleAutoFillProfile = () => {
    if (user) {
      setSkillsInput(user.primarySkills?.join(", ") || "React, TypeScript, Node.js");
      setExperienceInput(`${user.experienceYears || 5} years (${user.experienceYears && user.experienceYears >= 5 ? "Senior Level" : "Mid Level"})`);
      setDesiredJobInput(user.targetRole || "Senior Full Stack Engineer");
      showToast("Prefilled from your candidate profile!", "success");
    } else {
      setSkillsInput("React, TypeScript, Python, Node.js, Docker, AWS");
      setExperienceInput("6 years (Senior Level)");
      setDesiredJobInput("Senior Software Engineer");
      showToast("Loaded standard senior profile!", "info");
    }
  };

  const handleToggleSkillPill = (skill: string) => {
    const list = skillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    
    if (list.includes(skill)) {
      setSkillsInput(list.filter(s => s !== skill).join(", "));
    } else {
      setSkillsInput([...list, skill].join(", "));
    }
  };

  // Run Smart Job Match
  const runSmartMatch = async () => {
    if (!skillsInput.trim() || !desiredJobInput.trim()) {
      showToast("Please enter your skills and desired job title.", "error");
      return;
    }

    setIsSmartMatching(true);
    try {
      const skillsArray = skillsInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const recs = await AIService.smartJobMatch(skillsArray, experienceInput, desiredJobInput, jobs);
      setRecommendations(recs);
      setHasSearched(true);
      showToast(`Found ${recs.length} matching jobs for your profile!`, "success");
    } catch (err) {
      showToast("Error processing job matches.", "error");
    } finally {
      setIsSmartMatching(false);
    }
  };

  // Run Deep CV Comparison
  const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jId = e.target.value;
    setSelectedJobId(jId);
    const found = jobs.find(j => j.id === jId);
    if (found) {
      setJobTitle(found.title);
      setCompany(found.company);
      setJobDescription(
        `${found.description}\n\nResponsibilities:\n${found.responsibilities?.join("\n") || ""}\n\nRequirements:\n${found.requirements?.join("\n") || ""}`
      );
      showToast(`Selected ${found.title} at ${found.company}`, "info");
    }
  };

  const runDeepCompare = async () => {
    if (!jobDescription.trim() || !cvText.trim()) {
      showToast("Please provide both the Job Description and your CV text.", "error");
      return;
    }

    setIsComparing(true);
    try {
      const result = await AIService.matchJob(cvText, jobDescription, jobTitle, company);
      setCompareResult(result);
      showToast(`Compatibility Match: ${result.matchPercentage}%`, "success");
    } catch (err) {
      showToast("Failed to complete match analysis.", "error");
    } finally {
      setIsComparing(false);
    }
  };

  const handleSaveToTracker = (job: Job) => {
    if (onAddApplication) {
      onAddApplication({
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        salary: `$${job.salaryMin / 1000}k - $${job.salaryMax / 1000}k`,
        status: "Saved",
        notes: `Saved via Smart Job Match with ${job.workplaceType} setup.`
      });
      showToast(`Added ${job.title} to Application Tracker (Saved)!`, "success");
    } else if (onToggleSaveJob) {
      onToggleSaveJob(job.id);
      showToast(`Saved ${job.title}!`, "success");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Target className="w-3.5 h-3.5 text-emerald-500" />
          <span>Intelligent Career Matching Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smart Job Match
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enter your skills, experience, and desired position to uncover which jobs fit your profile best, along with clear AI explanations for why each role matches.
        </p>
      </div>

      {/* TABS: Smart Match vs Deep CV Comparison */}
      <div className="flex justify-center">
        <div className="p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 flex items-center gap-2 max-w-md w-full">
          <button
            onClick={() => setActiveMode("smart-match")}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeMode === "smart-match"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Profile Smart Match</span>
          </button>
          <button
            onClick={() => setActiveMode("deep-cv-audit")}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeMode === "deep-cv-audit"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Deep CV vs Single Job Audit</span>
          </button>
        </div>
      </div>

      {/* MODE 1: SMART JOB MATCH (FEATURE #3) */}
      {activeMode === "smart-match" ? (
        <div className="space-y-8 animate-in fade-in">
          {/* PROFILE CRITERIA INPUT FORM */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <span>Your Profile Criteria</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify your skills and preferences to find matched openings from our curated database.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoFillProfile}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Auto-fill from Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Desired Job Title */}
              <div className="md:col-span-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Desired Job Title *
                </label>
                <input
                  id="smart-match-desired-job"
                  type="text"
                  value={desiredJobInput}
                  onChange={e => setDesiredJobInput(e.target.value)}
                  placeholder="e.g. Senior Full Stack AI Engineer, Frontend Lead, ML Engineer..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Experience Level / Years */}
              <div className="md:col-span-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Experience Level & Years *
                </label>
                <input
                  id="smart-match-experience"
                  type="text"
                  value={experienceInput}
                  onChange={e => setExperienceInput(e.target.value)}
                  placeholder="e.g. 5+ years (Senior Level), Mid-level (3-5 years)..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Skills Input */}
              <div className="md:col-span-12 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Skills (comma separated) *
                  </label>
                  <span className="text-[11px] text-slate-400">Click suggestion pills below to add or remove</span>
                </div>
                <input
                  id="smart-match-skills"
                  type="text"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js, Python, AWS, Docker, Tailwind"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white font-mono"
                />

                {/* Suggested skill chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COMMON_SKILLS.map(skill => {
                    const isIncluded = skillsInput.toLowerCase().includes(skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkillPill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isIncluded
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300"
                        }`}
                      >
                        {isIncluded ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                AI analyzes qualification overlap against all {jobs.length} verified jobs.
              </span>
              <button
                id="run-smart-match-btn"
                onClick={runSmartMatch}
                disabled={isSmartMatching}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-emerald-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSmartMatching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Matching with Openings...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Find Matching Jobs</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RECOMMENDATIONS LIST */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recommended Jobs Matching Your Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ranked by compatibility percentage with detailed match explanations.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  {recommendations.length} Roles Recommended
                </span>
              </div>

              <div className="space-y-4">
                {recommendations.map(rec => {
                  const job = rec.job;
                  const isSaved = savedJobIds.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all space-y-4"
                    >
                      {/* Top Job Line */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              {rec.matchScore}% Match
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {job.workplaceType} • {job.jobType}
                            </span>
                          </div>
                          
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {job.title}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <DollarSign className="w-3.5 h-3.5" />
                              ${job.salaryMin / 1000}k - ${job.salaryMax / 1000}k
                            </span>
                          </div>
                        </div>

                        {/* Save & Apply actions */}
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <button
                            onClick={() => handleSaveToTracker(job)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                              isSaved
                                ? "bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                            title="Save to Application Tracker"
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-500" : ""}`} />
                            <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              onSetCoverLetterJob(job);
                              onSelectTab("cover-letter");
                              showToast(`Loaded ${job.title} into Application Assistant!`, "info");
                            }}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <span>Application Assistant</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* WHY THIS JOB MATCHES (Key Requirement #3) */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Why this job matches your profile:</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                          {rec.matchReason || rec.whyMatches}
                        </p>
                      </div>

                      {/* SKILLS BREAKDOWN: Matched vs Missing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="font-semibold text-slate-500 block mb-1.5">
                            Matching Skills Detected ({rec.matchedSkills.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {rec.matchedSkills.map((s: string) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium"
                              >
                                ✓ {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {rec.missingSkills && rec.missingSkills.length > 0 && (
                          <div>
                            <span className="font-semibold text-slate-500 block mb-1.5">
                              Missing / Desired Skills ({rec.missingSkills.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {rec.missingSkills.map((s: string) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium"
                                >
                                  • {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MODE 2: DEEP CV AUDIT (PRESERVED PREVIOUS COMPONENT LOGIC) */
        <div className="space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Job Description input */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <span>Target Position</span>
                </h3>
                <span className="text-xs text-slate-400">Step 1: Select or Paste Job</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Load from Verified Job:
                </label>
                <select
                  value={selectedJobId}
                  onChange={handleJobSelect}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                >
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
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Description & Requirements
                </label>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste requirements, responsibilities, and required stack..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Right: Resume CV input */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Candidate Resume</span>
                </h3>
                <span className="text-xs text-slate-400">Step 2: Provide CV Content</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resume Content
                </label>
                <textarea
                  rows={13}
                  value={cvText}
                  onChange={e => setCvText(e.target.value)}
                  placeholder="Paste your CV text here..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <button
                onClick={runDeepCompare}
                disabled={isComparing}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isComparing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing ATS Alignment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Deep Compatibility Match</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Deep Compare Result */}
          {compareResult && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Audit Result: {compareResult.matchPercentage}% Alignment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated for {company} — {jobTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
                      onSetCoverLetterJob(currentJob);
                      onSelectTab("cover-letter");
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Generate Cover Letter for this Job</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Matched Skills & Qualifications ({compareResult.matchingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {compareResult.matchingKeywords.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Missing Keywords & Gap Areas ({compareResult.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {compareResult.missingKeywords.map((k: string) => (
                      <span key={k} className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800">
                        ! {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {compareResult.recommendedCVEdits?.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    Resume Tailoring Suggestions:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {compareResult.recommendedCVEdits.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
