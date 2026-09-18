import React, { useState, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Bookmark, 
  BookmarkCheck, 
  Filter, 
  X, 
  Building2, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Target,
  PenTool,
  CheckCircle2,
  Eye
} from "lucide-react";
import { Job, WorkplaceType, JobType, ExperienceLevel, JobCategory, UserProfile } from "../types";
import { NavTab } from "./Navbar";
import { useToast } from "./Toast";

interface JobSearchProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (jobId: string) => boolean;
  onApplyJob: (job: Job, notes?: string) => void;
  onSelectTab: (tab: NavTab) => void;
  onSelectJobForMatch: (job: Job) => void;
  onSelectJobForCoverLetter: (job: Job) => void;
  user: UserProfile | null;
}

export const JobSearch: React.FC<JobSearchProps> = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onApplyJob,
  onSelectTab,
  onSelectJobForMatch,
  onSelectJobForCoverLetter,
  user,
}) => {
  const { showToast } = useToast();
  
  // Search & Filters State
  const [keyword, setKeyword] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("all");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedExp, setSelectedExp] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minSalary, setMinSalary] = useState<number>(0);
  const [onlySaved, setOnlySaved] = useState<boolean>(false);

  // Selected job for detailed modal
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [applicationNotes, setApplicationNotes] = useState("");

  const categories: JobCategory[] = [
    "Software Engineering",
    "AI / Machine Learning",
    "Data & Analytics",
    "Marketing & Growth",
    "Product & Design",
    "Customer Support",
    "Sales & BizDev",
    "Finance & Ops"
  ];

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Keyword search (title, company, description, skills)
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const matches = 
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some(s => s.toLowerCase().includes(query)) ||
          job.description.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Location search
      if (locationSearch.trim()) {
        const query = locationSearch.toLowerCase();
        const matches = job.location.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Workplace filter
      if (selectedWorkplace !== "all" && job.workplaceType !== selectedWorkplace) {
        return false;
      }

      // Job type filter
      if (selectedJobType !== "all" && job.jobType !== selectedJobType) {
        return false;
      }

      // Experience level
      if (selectedExp !== "all" && job.experienceLevel !== selectedExp) {
        return false;
      }

      // Category
      if (selectedCategory !== "all" && job.category !== selectedCategory) {
        return false;
      }

      // Min Salary
      if (minSalary > 0 && job.salaryMax < minSalary) {
        return false;
      }

      // Only saved filter
      if (onlySaved && !savedJobIds.includes(job.id)) {
        return false;
      }

      return true;
    });
  }, [jobs, keyword, locationSearch, selectedWorkplace, selectedJobType, selectedExp, selectedCategory, minSalary, onlySaved, savedJobIds]);

  // Match score estimation for candidate
  const calculateMatchBadge = (job: Job) => {
    if (!user || !user.primarySkills) return 85;
    const userSkills = user.primarySkills.map(s => s.toLowerCase());
    const overlaps = job.skills.filter(s => userSkills.includes(s.toLowerCase()));
    const ratio = overlaps.length / Math.max(1, job.skills.length);
    const score = Math.round(70 + ratio * 28);
    return Math.min(98, Math.max(65, score));
  };

  const handleApplyConfirm = () => {
    if (applyingJob) {
      onApplyJob(applyingJob, applicationNotes);
      showToast(`Application recorded for ${applyingJob.title} at ${applyingJob.company}!`, "success");
      setApplyingJob(null);
      setApplicationNotes("");
    }
  };

  const resetFilters = () => {
    setKeyword("");
    setLocationSearch("");
    setSelectedWorkplace("all");
    setSelectedJobType("all");
    setSelectedExp("all");
    setSelectedCategory("all");
    setMinSalary(0);
    setOnlySaved(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Curated Opportunities
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover {jobs.length}+ verified positions with transparent salary bands and instant AI compatibility.
          </p>
        </div>

        {/* Quick Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="job-toggle-saved-filter"
            onClick={() => setOnlySaved(!onlySaved)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              onlySaved
                ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-xs"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? "fill-indigo-600 text-indigo-600" : ""}`} />
            <span>Saved Jobs ({savedJobIds.length})</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR & PRIMARY FILTERS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="job-search-keyword"
              type="text"
              placeholder="Job title, skill (e.g. React, Python), or company..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Location Search */}
          <div className="sm:col-span-4 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="job-search-location"
              type="text"
              placeholder="City, State, or 'Remote'..."
              value={locationSearch}
              onChange={e => setLocationSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Clear Filters Button */}
          <div className="sm:col-span-2">
            <button
              id="job-search-reset-btn"
              onClick={resetFilters}
              className="w-full h-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Workplace Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Workplace</label>
            <select
              id="filter-workplace"
              value={selectedWorkplace}
              onChange={e => setSelectedWorkplace(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="all">All Workplace Types</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Experience</label>
            <select
              id="filter-experience"
              value={selectedExp}
              onChange={e => setSelectedExp(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="all">All Experience Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Lead / Principal">Lead / Principal</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Employment Type</label>
            <select
              id="filter-jobtype"
              value={selectedJobType}
              onChange={e => setSelectedJobType(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="all">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Minimum Salary Range */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Min Salary: {minSalary === 0 ? "Any" : `$${minSalary / 1000}k+`}
            </label>
            <select
              id="filter-salary"
              value={minSalary}
              onChange={e => setMinSalary(Number(e.target.value))}
              className="w-full py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value={0}>Any Salary</option>
              <option value={80000}>$80,000+</option>
              <option value={100000}>$100,000+</option>
              <option value={140000}>$140,000+</option>
              <option value={175000}>$175,000+</option>
              <option value={200000}>$200,000+</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Sectors ({jobs.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS COUNT & STATUS */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-800 dark:text-slate-200">{filteredJobs.length}</strong> jobs</span>
        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Match scores personalized for your profile</span>
        </span>
      </div>

      {/* JOB CARDS GRID */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">No jobs matched your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keyword, lowering minimum salary threshold, or expanding workplace criteria.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredJobs.map(job => {
            const isSaved = savedJobIds.includes(job.id);
            const matchScore = calculateMatchBadge(job);

            return (
              <div
                key={job.id}
                id={`job-card-${job.id}`}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-400/70 dark:hover:border-indigo-600/70 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top row: Company & Save Button & Match Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${job.logoBg || "bg-indigo-600"} flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0`}>
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Match Score Badge */}
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>{matchScore}% Match</span>
                      </span>

                      {/* Save Job Button */}
                      <button
                        id={`job-save-btn-${job.id}`}
                        onClick={() => {
                          const saved = onToggleSave(job.id);
                          showToast(saved ? `Saved ${job.title} to bookmarks!` : `Removed from saved jobs`, "info");
                        }}
                        className={`p-2 rounded-lg border transition-colors ${
                          isSaved
                            ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400"
                            : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        }`}
                        title={isSaved ? "Saved" : "Save Job"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Badges: Workplace, Location, Salary */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{job.workplaceType} • {job.jobType}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                      <DollarSign className="w-3 h-3 text-emerald-500" />
                      <span>${job.salaryMin / 1000}k - ${job.salaryMax / 1000}k / yr</span>
                    </span>
                  </div>

                  {/* Snippet */}
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[11px]"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Posted date & Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Posted {job.postedAt}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* View Job Button */}
                    <button
                      id={`job-view-btn-${job.id}`}
                      onClick={() => setActiveJob(job)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Job</span>
                    </button>

                    {/* Save Job Button */}
                    <button
                      id={`job-save-btn-${job.id}`}
                      onClick={() => {
                        const saved = onToggleSave(job.id);
                        showToast(saved ? `Saved ${job.title} to bookmarks!` : `Removed from saved jobs`, "info");
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 ${
                        isSaved
                          ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                      <span>{isSaved ? "Saved" : "Save Job"}</span>
                    </button>

                    {/* Apply Button */}
                    <button
                      id={`job-apply-btn-${job.id}`}
                      onClick={() => setApplyingJob(job)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors flex items-center gap-1"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* JOB DETAILS MODAL */}
      {activeJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6 my-8 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${activeJob.logoBg || "bg-indigo-600"} flex items-center justify-center text-white font-extrabold text-base shrink-0`}>
                  {activeJob.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {activeJob.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeJob.company} • {activeJob.location} • {activeJob.workplaceType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                ${activeJob.salaryMin / 1000}k - ${activeJob.salaryMax / 1000}k USD / year
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {activeJob.experienceLevel}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {activeJob.jobType}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {activeJob.applicantCount} applicants
              </span>
            </div>

            {/* AI Action Shortcuts Bar */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-indigo-900 dark:text-indigo-200">
                  Analyze compatibility with your CV
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectJobForMatch(activeJob);
                    onSelectTab("job-matcher");
                    setActiveJob(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Job Matcher</span>
                </button>
                <button
                  onClick={() => {
                    onSelectJobForCoverLetter(activeJob);
                    onSelectTab("cover-letter");
                    setActiveJob(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors flex items-center gap-1"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Cover Letter</span>
                </button>
              </div>
            </div>

            {/* Description Body */}
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 max-h-96 overflow-y-auto pr-2">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1.5">Overview</h4>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                  {activeJob.description}
                </p>
              </div>

              {activeJob.responsibilities && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1.5">Key Responsibilities</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {activeJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeJob.requirements && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1.5">Requirements & Qualifications</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {activeJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeJob.benefits && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1.5">Benefits & Perks</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.benefits.map((b, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  const isSaved = onToggleSave(activeJob.id);
                  showToast(isSaved ? "Saved to bookmarks" : "Removed bookmark", "info");
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" />
                <span>{savedJobIds.includes(activeJob.id) ? "Saved" : "Save Job"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveJob(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setApplyingJob(activeJob);
                    setActiveJob(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
                >
                  Apply for this Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK APPLY MODAL */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Application</h3>
                <p className="text-xs text-slate-500">{applyingJob.title} at {applyingJob.company}</p>
              </div>
              <button onClick={() => setApplyingJob(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Candidate Profile:</span>
                <strong className="text-slate-900 dark:text-white">{user?.name || "Alex Morgan"}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Attached Resume:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{user?.cvFileName || "Alex_Morgan_Resume_2026.pdf"}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated ATS Match:</span>
                <span className="text-emerald-600 font-bold">{calculateMatchBadge(applyingJob)}%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Application Notes (e.g. referral, key highlights)
              </label>
              <textarea
                rows={3}
                placeholder="Optional notes to store on your Application Tracker..."
                value={applicationNotes}
                onChange={e => setApplicationNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setApplyingJob(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                id="apply-modal-confirm-btn"
                onClick={handleApplyConfirm}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Application</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
