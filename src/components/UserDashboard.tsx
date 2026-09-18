import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  Target, 
  PenTool, 
  MessageSquareCode, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Award,
  Kanban,
  Bookmark,
  BookmarkX,
  AlertTriangle,
  History,
  Check,
  MapPin,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { UserProfile, Job, JobApplication, ApplicationStatus } from "../types";
import { NavTab } from "./Navbar";

interface UserDashboardProps {
  user: UserProfile | null;
  jobs: Job[];
  applications: JobApplication[];
  savedJobIds: string[];
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth: () => void;
  onToggleSave?: (jobId: string) => void;
  onApplyJob?: (job: Job) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  jobs,
  applications,
  savedJobIds,
  onSelectTab,
  onOpenAuth,
  onToggleSave,
  onApplyJob,
}) => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<"overview" | "saved" | "applications" | "resume">("overview");

  // If not logged in, show friendly prompt
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <LayoutDashboard className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Candidate Dashboard</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Sign in or create your free account to track applications, save matched jobs, and view your personalized ATS audit reports.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
        >
          Sign In to Access Dashboard
        </button>
      </div>
    );
  }

  // Saved Jobs objects
  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));

  // Pipeline Status breakdown
  const savedCount = applications.filter(a => a.status === "Saved").length;
  const appliedCount = applications.filter(a => a.status === "Applied").length;
  const interviewCount = applications.filter(a => a.status === "Interview").length;
  const offerCount = applications.filter(a => a.status === "Offer" || a.status === "Hired").length;
  const rejectedCount = applications.filter(a => a.status === "Rejected").length;

  // Active Interviews
  const activeInterviews = applications.filter(a => a.status === "Interview");
  const upcomingInterview = activeInterviews.find(a => a.interviewDate);

  // Resume Match Score & Info
  const atsScore = user.lastCvAnalysis?.atsScore || 92;
  const targetRole = user.targetRole || user.lastCvAnalysis?.targetRole || "Senior Software Engineer";
  const identifiedSkills = user.lastCvAnalysis?.topSkills || user.primarySkills || ["React", "TypeScript", "Node.js"];
  const missingSkills = user.lastCvAnalysis?.missingSkills || ["Kubernetes", "GraphQL", "AWS ECS"];
  const recommendations = user.lastCvAnalysis?.actionableImprovements || [
    "Quantify key accomplishments with metrics (% latency reduction, revenue lift, team scale).",
    "Incorporate cloud deployment keywords to increase modern ATS parser score above 95%."
  ];

  // Estimated Match Badge for a job
  const getJobMatchScore = (job: Job) => {
    const userSkills = (user.primarySkills || []).map(s => s.toLowerCase());
    const overlaps = job.skills.filter(s => userSkills.includes(s.toLowerCase()));
    const ratio = overlaps.length / Math.max(1, job.skills.length);
    return Math.min(98, Math.max(65, Math.round(70 + ratio * 28)));
  };

  // Recent Activity Feed generated from real user records
  const recentActivities = [
    ...(upcomingInterview?.interviewDate ? [{
      id: "act-interview",
      type: "interview",
      title: `Interview round scheduled with ${upcomingInterview.company}`,
      subtitle: `${upcomingInterview.jobTitle} • ${new Date(upcomingInterview.interviewDate).toLocaleDateString()}`,
      time: "Upcoming",
      icon: <Calendar className="w-4 h-4 text-violet-500" />,
      badgeBg: "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
    }] : []),
    ...applications.slice(0, 3).map(app => ({
      id: `act-app-${app.id}`,
      type: "application",
      title: `Application status: ${app.status}`,
      subtitle: `${app.jobTitle} at ${app.company}`,
      time: new Date(app.appliedDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      icon: <Kanban className="w-4 h-4 text-indigo-500" />,
      badgeBg: app.status === "Offer" || app.status === "Hired" 
        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
        : app.status === "Interview"
        ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
        : "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
    })),
    ...(savedJobs.slice(0, 2).map(job => ({
      id: `act-save-${job.id}`,
      type: "saved",
      title: `Bookmarked job opening`,
      subtitle: `${job.title} at ${job.company}`,
      time: "Recent",
      icon: <Bookmark className="w-4 h-4 text-amber-500" />,
      badgeBg: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
    }))),
    {
      id: "act-cv",
      type: "audit",
      title: `Resume ATS Audit Completed`,
      subtitle: `${atsScore}% match for ${targetRole}`,
      time: "Verified",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      badgeBg: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. WELCOME HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Candidate Co-Pilot
            </span>
            <span className="text-xs text-indigo-300">• Target: {targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            You have <strong className="text-white">{applications.length}</strong> tracked applications, <strong className="text-white">{savedJobs.length}</strong> saved bookmarks, and <strong className="text-white">{activeInterviews.length}</strong> active interview rounds.
          </p>
        </div>

        {/* Profile Readiness Badge */}
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-xs z-10 shrink-0 border border-white/10">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/40"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-emerald-400">{atsScore}%</span>
              <span className="text-xs text-indigo-200 font-semibold">ATS Ready</span>
            </div>
            <p className="text-[11px] text-indigo-200">Top 5% Candidate Profile</p>
          </div>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveDashboardTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeDashboardTab === "overview"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveDashboardTab("saved")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeDashboardTab === "saved"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Jobs ({savedJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveDashboardTab("applications")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeDashboardTab === "applications"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span>Application Status ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveDashboardTab("resume")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeDashboardTab === "resume"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume Match Results</span>
        </button>
      </div>

      {/* 2. PIPELINE STATUS TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div 
          onClick={() => { setActiveDashboardTab("applications"); }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span>Saved Roles</span>
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{savedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Bookmarked positions</div>
        </div>

        <div 
          onClick={() => { setActiveDashboardTab("applications"); }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition-all cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-indigo-500 flex items-center justify-between">
            <span>Applied</span>
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{appliedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">In hiring review</div>
        </div>

        <div 
          onClick={() => { setActiveDashboardTab("applications"); }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-violet-400 transition-all cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-violet-500 flex items-center justify-between">
            <span>Interviewing</span>
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">{interviewCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Active screen / technical</div>
        </div>

        <div 
          onClick={() => { setActiveDashboardTab("applications"); }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-emerald-500 flex items-center justify-between">
            <span>Offer / Hired 🎉</span>
            <Award className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{offerCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Final decision & offer</div>
        </div>

        <div 
          onClick={() => { setActiveDashboardTab("applications"); }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-400 transition-all cursor-pointer col-span-2 sm:col-span-1"
        >
          <div className="text-[11px] font-semibold text-rose-500 flex items-center justify-between">
            <span>Rejected</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{rejectedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Archived outcomes</div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      {(activeDashboardTab === "overview" || activeDashboardTab === "saved") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-500" />
              <span>Saved Jobs ({savedJobs.length})</span>
            </h3>
            <button
              onClick={() => onSelectTab("jobs")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore More Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {savedJobs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No saved jobs yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bookmark exciting roles from the Job Search page to easily track and apply to them here.
              </p>
              <button
                onClick={() => onSelectTab("jobs")}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Browse Available Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedJobs.map(job => {
                const matchScore = getJobMatchScore(job);
                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl ${job.logoBg || "bg-indigo-600"} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs`}>
                            {job.company.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                              {job.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">{job.company}</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] shrink-0">
                          {matchScore}% Match
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ${job.salaryMin / 1000}k - ${job.salaryMax / 1000}k
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 3).map(s => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      {onToggleSave && (
                        <button
                          onClick={() => onToggleSave(job.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remove bookmark"
                        >
                          <BookmarkX className="w-4 h-4" />
                        </button>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => onSelectTab("jobs")}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs"
                        >
                          View Job
                        </button>
                        {onApplyJob && (
                          <button
                            onClick={() => {
                              onApplyJob(job);
                              onSelectTab("tracker");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 4. APPLICATION STATUS & RECENT ACTIVITY DUAL GRID */}
      {(activeDashboardTab === "overview" || activeDashboardTab === "applications") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Applications List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Kanban className="w-4 h-4 text-indigo-500" />
                <span>Application Pipeline Status</span>
              </h3>
              <button
                onClick={() => onSelectTab("tracker")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Open Kanban Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 5).map(app => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                        {app.jobTitle}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        app.status === "Interview"
                          ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
                          : app.status === "Offer" || app.status === "Hired"
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : app.status === "Rejected"
                          ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                          : "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <span>{app.company}</span>
                      <span>•</span>
                      <span>{app.location}</span>
                      <span>•</span>
                      <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                    </p>
                    {app.interviewDate && (
                      <p className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Round: {new Date(app.interviewDate).toLocaleString()}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectTab("tracker")}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 transition-colors"
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Recent Activity Timeline (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              <span>Recent Activity Feed</span>
            </h3>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              {recentActivities.map((act, index) => (
                <div key={act.id} className="flex items-start gap-3 relative">
                  {index !== recentActivities.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />
                  )}
                  <div className={`w-8 h-8 rounded-xl ${act.badgeBg} flex items-center justify-center shrink-0 z-10`}>
                    {act.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {act.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {act.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. RESUME MATCH RESULTS DETAILED SECTION */}
      {(activeDashboardTab === "overview" || activeDashboardTab === "resume") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Resume Match Results & ATS Audit</span>
            </h3>
            <button
              onClick={() => onSelectTab("cv-analyzer")}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Re-Analyze Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* Top Score Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overall ATS Score</span>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{atsScore}%</div>
                <div className="text-[10px] text-slate-400">High Match Compatibility</div>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Formatting Fit</span>
                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  {user.lastCvAnalysis?.formattingScore || 95}%
                </div>
                <div className="text-[10px] text-slate-400">Clean single-column parsing</div>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Metric Impact</span>
                <div className="text-3xl font-black text-violet-600 dark:text-violet-400 mt-1">
                  {user.lastCvAnalysis?.impactScore || 88}%
                </div>
                <div className="text-[10px] text-slate-400">Quantified metrics</div>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Keyword Density</span>
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {user.lastCvAnalysis?.keywordScore || 91}%
                </div>
                <div className="text-[10px] text-slate-400">Target role keywords</div>
              </div>
            </div>

            {/* Skills & Missing Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verified Matching Skills ({identifiedSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {identifiedSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Missing High-Value Keywords ({missingSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800"
                    >
                      ! {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Practical Recommendations */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AI Actionable Recommendations</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
