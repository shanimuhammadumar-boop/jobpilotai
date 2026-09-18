import React, { useState } from "react";
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Sparkles, 
  Kanban, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  X,
  Activity,
  Cpu,
  Download
} from "lucide-react";
import { Job, UserProfile, JobCategory, WorkplaceType, JobType, ExperienceLevel } from "../types";
import { useToast } from "./Toast";

interface AdminDashboardProps {
  jobs: Job[];
  onAddJob: (job: Partial<Job>) => void;
  onDeleteJob: (jobId: string) => void;
  currentUser: UserProfile | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  jobs,
  onAddJob,
  onDeleteJob,
  currentUser,
}) => {
  const { showToast } = useToast();
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("San Francisco, CA");
  const [newWorkplace, setNewWorkplace] = useState<WorkplaceType>("Remote");
  const [newJobType, setNewJobType] = useState<JobType>("Full-time");
  const [newCategory, setNewCategory] = useState<JobCategory>("Software Engineering");
  const [newExp, setNewExp] = useState<ExperienceLevel>("Senior Level");
  const [newSalaryMin, setNewSalaryMin] = useState(140000);
  const [newSalaryMax, setNewSalaryMax] = useState(195000);
  const [newDescription, setNewDescription] = useState("");
  const [newSkills, setNewSkills] = useState("React, TypeScript, Node.js");

  // Mock candidates registered
  const [mockUsers, setMockUsers] = useState([
    { id: "usr-1", name: "Alex Morgan", email: "alex.morgan@example.com", role: "Candidate", status: "Active", joined: "Jan 12, 2026", cvUploaded: true },
    { id: "usr-2", name: "David Chen", email: "david.chen@example.com", role: "Candidate", status: "Active", joined: "Feb 04, 2026", cvUploaded: true },
    { id: "usr-3", name: "Elena Rostova", email: "elena.r@example.com", role: "Admin", status: "Active", joined: "Jan 02, 2026", cvUploaded: false },
    { id: "usr-4", name: "Marcus Vance", email: "marcus.v@example.com", role: "Candidate", status: "Active", joined: "Feb 18, 2026", cvUploaded: true },
    { id: "usr-5", name: "Aria Thorne", email: "aria.thorne@example.com", role: "Candidate", status: "Active", joined: "Mar 01, 2026", cvUploaded: true }
  ]);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) {
      showToast("Please provide job title and company.", "error");
      return;
    }

    const skillsArray = newSkills.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

    onAddJob({
      title: newTitle,
      company: newCompany,
      location: newLocation,
      workplaceType: newWorkplace,
      jobType: newJobType,
      category: newCategory,
      experienceLevel: newExp,
      salaryMin: Number(newSalaryMin),
      salaryMax: Number(newSalaryMax),
      description: newDescription || "We are seeking a talented professional to scale our technical capabilities.",
      skills: skillsArray.length > 0 ? skillsArray : ["React", "TypeScript", "Engineering"],
      postedAt: "Just now",
      applicantCount: 0,
      logoBg: "bg-indigo-600"
    });

    showToast(`Published new job: ${newTitle} at ${newCompany}!`, "success");
    setIsAddJobOpen(false);
    setNewTitle("");
    setNewCompany("");
    setNewDescription("");
  };

  const toggleUserRole = (id: string) => {
    setMockUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextRole = u.role === "Candidate" ? "Admin" : "Candidate";
        showToast(`Changed ${u.name}'s role to ${nextRole}`, "info");
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Platform Operations & Intelligence
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <a
            href="./jobpilotai-dist.zip"
            download="jobpilotai-dist.zip"
            className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            title="Download full static site ZIP file ready for GitHub Pages"
          >
            <Download className="w-4 h-4" />
            <span>Download GitHub Pages ZIP</span>
          </a>

          <button
            onClick={() => setIsAddJobOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job Requisition</span>
          </button>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Candidates</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">1,482</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">+14% this month</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Live Job Postings</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{jobs.length}</div>
          <div className="text-xs text-slate-400 mt-1">Verified active listings</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Operations Run</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">18,420</div>
          <div className="text-xs text-slate-400 mt-1">Gemini API requests</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Applications Tracked</span>
            <Kanban className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-black text-violet-600 dark:text-violet-400 mt-1">4,390</div>
          <div className="text-xs text-slate-400 mt-1">Across 5 pipeline stages</div>
        </div>
      </div>

      {/* SYSTEM TELEMETRY & AI USAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Feature Breakdown */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>AI Feature Utilization & Token Distribution</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>ATS Resume Analyzer</span>
                <span className="text-indigo-600 dark:text-indigo-400">42% (7,736 queries)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                <div className="bg-indigo-600 h-2 rounded-full w-[42%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Precision Job Matcher</span>
                <span className="text-emerald-600 dark:text-emerald-400">28% (5,157 queries)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                <div className="bg-emerald-600 h-2 rounded-full w-[28%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Cover Letter AI</span>
                <span className="text-amber-600 dark:text-amber-400">18% (3,315 queries)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                <div className="bg-amber-500 h-2 rounded-full w-[18%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Interactive Interview Coach</span>
                <span className="text-violet-600 dark:text-violet-400">12% (2,210 queries)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                <div className="bg-violet-500 h-2 rounded-full w-[12%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Health Telemetry */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>Infrastructure Health</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-slate-500">Gemini 3.8 Flash</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 210ms avg
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-slate-500">Server Route Gateway</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 99.98% Uptime
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-slate-500">Local Persistence Engine</span>
              <span className="font-bold text-indigo-600">Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* JOBS MANAGEMENT TABLE */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span>Active Job Postings Directory ({jobs.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Role & Company</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Type / Location</th>
                <th className="py-3 px-3">Salary Band</th>
                <th className="py-3 px-3">Applicants</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {jobs.slice(0, 10).map(j => (
                <tr key={j.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">{j.title}</div>
                    <div className="text-[11px] text-slate-400">{j.company}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                      {j.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{j.workplaceType} • {j.location}</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold">
                    ${j.salaryMin/1000}k - ${j.salaryMax/1000}k
                  </td>
                  <td className="py-2.5 px-3">{j.applicantCount} applied</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        onDeleteJob(j.id);
                        showToast(`Removed job listing: ${j.title}`, "info");
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                      title="Remove Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DIRECTORY TABLE */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-500" />
          <span>Registered Candidates & Access Roles</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Joined Date</th>
                <th className="py-3 px-3">CV Uploaded</th>
                <th className="py-3 px-3 text-right">Role Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {mockUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === "Admin" ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300" : "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{u.joined}</td>
                  <td className="py-2.5 px-3">
                    {u.cvUploaded ? <span className="text-emerald-500 font-bold">Yes</span> : <span className="text-slate-400">No</span>}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => toggleUserRole(u.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-[11px] font-semibold"
                    >
                      Toggle to {u.role === "Candidate" ? "Admin" : "Candidate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD JOB MODAL */}
      {isAddJobOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Post New Job Opening</h3>
              <button onClick={() => setIsAddJobOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Senior Machine Learning Eng"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={e => setNewCompany(e.target.value)}
                    placeholder="e.g. OpenAI"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Workplace</label>
                  <select
                    value={newWorkplace}
                    onChange={e => setNewWorkplace(e.target.value as WorkplaceType)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as JobCategory)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing & Growth">Marketing & Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience</label>
                  <select
                    value={newExp}
                    onChange={e => setNewExp(e.target.value as ExperienceLevel)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead / Principal">Lead / Principal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary Min ($)</label>
                  <input
                    type="number"
                    value={newSalaryMin}
                    onChange={e => setNewSalaryMin(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary Max ($)</label>
                  <input
                    type="number"
                    value={newSalaryMax}
                    onChange={e => setNewSalaryMax(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={e => setNewSkills(e.target.value)}
                  placeholder="React, TypeScript, PyTorch, Kubernetes"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Description</label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe the role mission and expectations..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddJobOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
