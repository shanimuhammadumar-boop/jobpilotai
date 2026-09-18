import React, { useState } from "react";
import { 
  Kanban, 
  Table as TableIcon, 
  Plus, 
  Search, 
  Building2, 
  Calendar, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  DollarSign, 
  MapPin, 
  Bookmark, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Filter
} from "lucide-react";
import { ApplicationStatus, JobApplication, Job } from "../types";
import { useToast } from "./Toast";

interface ApplicationTrackerProps {
  applications: JobApplication[];
  jobs: Job[];
  onAddApplication: (app: Partial<JobApplication>) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus, notes?: string, interviewDate?: string) => void;
  onDeleteApplication: (id: string) => void;
}

// 5 core pipeline stages requested: Saved -> Applied -> Interview -> Offer -> Rejected (+ Hired)
const STAGES: { id: ApplicationStatus; label: string; color: string; badgeBg: string }[] = [
  { id: "Saved", label: "Saved", color: "border-slate-300 dark:border-slate-700", badgeBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
  { id: "Applied", label: "Applied", color: "border-indigo-400 dark:border-indigo-600", badgeBg: "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" },
  { id: "Interview", label: "Interview", color: "border-violet-400 dark:border-violet-600", badgeBg: "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300" },
  { id: "Offer", label: "Offer", color: "border-emerald-400 dark:border-emerald-600", badgeBg: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" },
  { id: "Rejected", label: "Rejected", color: "border-rose-300 dark:border-rose-800", badgeBg: "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300" }
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  jobs,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication,
}) => {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // New Application Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("Remote");
  const [newSalary, setNewSalary] = useState("$150k - $185k");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("Saved");
  const [newNotes, setNewNotes] = useState("");
  const [newInterviewDate, setNewInterviewDate] = useState("");

  // Quick prefill from demo jobs
  const handleSelectDemoJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const j = jobs.find(job => job.id === e.target.value);
    if (j) {
      setNewTitle(j.title);
      setNewCompany(j.company);
      setNewLocation(j.location);
      setNewSalary(`$${j.salaryMin/1000}k - $${j.salaryMax/1000}k`);
    }
  };

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) {
      showToast("Please enter a job title and company name.", "error");
      return;
    }

    onAddApplication({
      jobTitle: newTitle,
      company: newCompany,
      location: newLocation,
      salary: newSalary,
      status: newStatus,
      notes: newNotes,
      interviewDate: newInterviewDate || undefined,
    });

    showToast(`Added ${newTitle} at ${newCompany} (${newStatus}) to tracker!`, "success");
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewCompany("");
    setNewNotes("");
    setNewInterviewDate("");
    setNewStatus("Saved");
  };

  const handleSaveEdit = () => {
    if (!editingApp) return;
    onUpdateStatus(editingApp.id, editingApp.status, editingApp.notes, editingApp.interviewDate);
    showToast("Application updated successfully!", "success");
    setEditingApp(null);
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = !searchQuery.trim() ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    if (statusFilter === "Hired") {
      return app.status === "Hired" || app.status === "Offer";
    }
    return app.status === statusFilter;
  });

  // Pipeline stats
  const totalApps = applications.length;
  const savedCount = applications.filter(a => a.status === "Saved").length;
  const appliedCount = applications.filter(a => a.status === "Applied").length;
  const interviewCount = applications.filter(a => a.status === "Interview").length;
  const offerCount = applications.filter(a => a.status === "Offer" || a.status === "Hired").length;
  const rejectedCount = applications.filter(a => a.status === "Rejected").length;

  const getNextStage = (current: ApplicationStatus): ApplicationStatus | null => {
    switch (current) {
      case "Saved": return "Applied";
      case "Applied": return "Interview";
      case "Interview": return "Offer";
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and move your applications across 5 stages: <strong className="text-indigo-600 dark:text-indigo-400">Saved → Applied → Interview → Offer → Rejected</strong>. Data is stored locally.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Table View</span>
            </button>
          </div>

          <button
            id="add-application-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Save New Job</span>
          </button>
        </div>
      </div>

      {/* QUICK STATUS SUMMARY TILES: 5 stages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div 
          onClick={() => setStatusFilter(statusFilter === "Saved" ? "all" : "Saved")}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "Saved" ? "border-slate-500 bg-slate-100 dark:bg-slate-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span>1. Saved</span>
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{savedCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === "Applied" ? "all" : "Applied")}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "Applied" ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300"
          }`}
        >
          <div className="text-[11px] font-semibold text-indigo-500 flex items-center justify-between">
            <span>2. Applied</span>
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{appliedCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === "Interview" ? "all" : "Interview")}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "Interview" ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/40" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-300"
          }`}
        >
          <div className="text-[11px] font-semibold text-violet-500 flex items-center justify-between">
            <span>3. Interview</span>
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">{interviewCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === "Offer" ? "all" : "Offer")}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "Offer" ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300"
          }`}
        >
          <div className="text-[11px] font-semibold text-emerald-500 flex items-center justify-between">
            <span>4. Offer 🎉</span>
            <Award className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{offerCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === "Rejected" ? "all" : "Rejected")}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            statusFilter === "Rejected" ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/40" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300"
          }`}
        >
          <div className="text-[11px] font-semibold text-rose-500 flex items-center justify-between">
            <span>5. Rejected</span>
            <X className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company, notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">All Statuses ({totalApps})</option>
            <option value="Saved">Saved ({savedCount})</option>
            <option value="Applied">Applied ({appliedCount})</option>
            <option value="Interview">Interview ({interviewCount})</option>
            <option value="Offer">Offer ({offerCount})</option>
            <option value="Rejected">Rejected ({rejectedCount})</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STAGES.map(col => {
            const colApps = filteredApps.filter(a => {
              if (col.id === "Hired") {
                return a.status === "Hired" || a.status === "Offer";
              }
              return a.status === col.id;
            });

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 p-3 min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {col.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.badgeBg}`}>
                      {colApps.length}
                    </span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px] pr-1">
                  {colApps.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No roles in {col.label}
                    </div>
                  ) : (
                    colApps.map(app => (
                      <div
                        key={app.id}
                        className={`p-4 rounded-xl bg-white dark:bg-slate-900 border ${col.color} shadow-2xs hover:shadow-md transition-all space-y-3 group`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                              {app.jobTitle}
                            </h4>
                            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-indigo-500" />
                              <span>{app.company}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setEditingApp(app)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 opacity-60 group-hover:opacity-100"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {app.location}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {app.salary}
                          </span>
                        </div>

                        {app.interviewDate && (
                          <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-900 text-[11px] text-violet-700 dark:text-violet-300 flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                            <span>Round: {new Date(app.interviewDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        {app.notes && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                            "{app.notes}"
                          </p>
                        )}

                        {/* Status Mover & Quick Advance */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                          {getNextStage(app.status) && (
                            <button
                              id={`advance-stage-btn-${app.id}`}
                              onClick={() => {
                                const next = getNextStage(app.status)!;
                                onUpdateStatus(app.id, next);
                                showToast(`Moved ${app.jobTitle} to ${next}!`, "success");
                              }}
                              className="w-full py-1.5 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>Move to {getNextStage(app.status)}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          <div className="flex items-center justify-between">
                            <select
                              id={`status-select-${app.id}`}
                              value={app.status}
                              onChange={e => {
                                onUpdateStatus(app.id, e.target.value as ApplicationStatus);
                                showToast(`Updated to ${e.target.value}`, "info");
                              }}
                              className="text-[11px] py-1 px-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                            >
                              <option value="Saved">Saved</option>
                              <option value="Applied">Applied</option>
                              <option value="Interview">Interview</option>
                              <option value="Offer">Offer</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Hired">Hired</option>
                            </select>

                            <button
                              onClick={() => {
                                onDeleteApplication(app.id);
                                showToast(`Removed ${app.jobTitle}`, "info");
                              }}
                              className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Location & Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Interview / Date</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                      No applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                        <div className="font-bold">{app.jobTitle}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{app.company}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <div>{app.location}</div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{app.salary}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={e => {
                            onUpdateStatus(app.id, e.target.value as ApplicationStatus);
                            showToast(`Updated to ${e.target.value}`, "info");
                          }}
                          className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                        >
                          <option value="Saved">Saved</option>
                          <option value="Applied">Applied</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        {app.interviewDate ? (
                          <span className="px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-semibold">
                            {new Date(app.interviewDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingApp(app)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                          title="Edit Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onDeleteApplication(app.id);
                            showToast(`Deleted ${app.jobTitle}`, "info");
                          }}
                          className="p-1 text-rose-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD APPLICATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save / Track Job</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Prefill from Open Job (Optional)
                </label>
                <select
                  onChange={handleSelectDemoJob}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="">Select an opening...</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} at {j.company}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Eng"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={e => setNewCompany(e.target.value)}
                    placeholder="e.g. Stripe, OpenAI"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="Remote / City"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={e => setNewSalary(e.target.value)}
                    placeholder="$160k - $200k"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={newInterviewDate}
                    onChange={e => setNewInterviewDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Notes / Recruiter Contact</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Referral contact, tech stack notes, key interview takeaways..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT APPLICATION MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit {editingApp.jobTitle}
              </h3>
              <button onClick={() => setEditingApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Pipeline Status</label>
                <select
                  value={editingApp.status}
                  onChange={e => setEditingApp({ ...editingApp, status: e.target.value as ApplicationStatus })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                >
                  <option value="Saved">Saved</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={editingApp.interviewDate ? editingApp.interviewDate.substring(0, 16) : ""}
                  onChange={e => setEditingApp({ ...editingApp, interviewDate: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Notes & Follow-ups</label>
                <textarea
                  rows={3}
                  value={editingApp.notes || ""}
                  onChange={e => setEditingApp({ ...editingApp, notes: e.target.value })}
                  placeholder="Add notes from technical screens or salary expectations..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
