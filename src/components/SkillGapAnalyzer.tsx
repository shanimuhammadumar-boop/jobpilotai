import React, { useState } from "react";
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  BookOpen, 
  Clock, 
  Compass,
  Check,
  Calendar
} from "lucide-react";
import { SkillGapResult, UserProfile } from "../types";
import { AIService } from "../services/ai";
import { useToast } from "./Toast";

interface SkillGapAnalyzerProps {
  user: UserProfile | null;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ user }) => {
  const { showToast } = useToast();

  const [targetJob, setTargetJob] = useState(user?.targetRole || "Staff AI Platform Engineer");
  const [currentSkills, setCurrentSkills] = useState(
    user?.primarySkills?.join(", ") || "React, TypeScript, Node.js, REST APIs, Tailwind CSS, Git, Docker, SQL"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SkillGapResult | null>(null);

  const handleRunAnalysis = async () => {
    if (!targetJob.trim() || !currentSkills.trim()) {
      showToast("Please enter both target role and your current skills.", "error");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await AIService.analyzeSkillGap(targetJob, currentSkills);
      setResult(res);
      showToast("Skill gap roadmap generated!", "success");
    } catch (err) {
      showToast("Failed to generate roadmap.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const presetRoles = [
    "Staff AI Engineer",
    "Principal Cloud Architect",
    "Head of Product & Growth",
    "Senior Machine Learning Engineer",
    "Director of Engineering"
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
          <span>Market Intelligence & Learning Roadmap</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Skill Gap Analyzer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Identify the exact technical and leadership capabilities standing between your current profile and higher-compensation dream roles.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        {/* Preset Roles pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-slate-400 shrink-0 font-medium">Quick Target Roles:</span>
          {presetRoles.map(role => (
            <button
              key={role}
              onClick={() => {
                setTargetJob(role);
                showToast(`Target set to ${role}`, "info");
              }}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium shrink-0 transition-colors"
            >
              {role}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Dream Job Title
            </label>
            <input
              id="skillgap-target-input"
              type="text"
              value={targetJob}
              onChange={e => setTargetJob(e.target.value)}
              placeholder="e.g. Staff AI Systems Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Current Core Skills (Comma-separated)
            </label>
            <input
              id="skillgap-current-input"
              type="text"
              value={currentSkills}
              onChange={e => setCurrentSkills(e.target.value)}
              placeholder="e.g. React, Node, Python, SQL, Docker..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Cross-referenced with hiring datasets from over 2,000+ top tech employers
          </span>
          <button
            id="skillgap-analyze-btn"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-rose-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Competency Gaps...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Skill Gaps & Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Top Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950 text-white border border-rose-900/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider">
                Roadmap for: {result.targetJob}
              </span>
              <h3 className="text-2xl font-black tracking-tight mt-1">
                Market Readiness Timeline: {result.estimatedTimeToJobReady}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Industry Hiring Demand: <strong className="text-white">{result.marketDemand}</strong>
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xs text-center shrink-0">
              <span className="text-[11px] text-slate-300 block">Skills Matched</span>
              <span className="text-2xl font-black text-emerald-400">{result.haveSkills.length} Verified</span>
            </div>
          </div>

          {/* Missing Skills Grid with Priority Levels */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Prioritized Skill Deficiencies & Next Actions</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.missingSkills.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.priority === "Critical"
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            : item.priority === "High"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.skill}
                    </h5>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                    <strong className="block text-indigo-600 dark:text-indigo-400 mb-0.5">
                      Recommended Action:
                    </strong>
                    {item.recommendedLearning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Learning Roadmap */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Step-by-Step Study & Portfolio Roadmap</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.learningRoadmap.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 relative"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{step.phase}</span>
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>
                  <h6 className="font-bold text-slate-900 dark:text-white text-xs">{step.focus}</h6>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
