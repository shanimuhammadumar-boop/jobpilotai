import { Job, JobApplication, ApplicationStatus, UserProfile, AIUsageRecord, CVAnalysisResult, JobMatchResult } from "../types";
import { DEMO_JOBS } from "../data/demoJobs";
import { SAMPLE_CVS } from "../data/sampleCVs";

const STORAGE_KEYS = {
  USER_PROFILE: "jobpilot_user_profile",
  SAVED_JOBS: "jobpilot_saved_jobs",
  APPLICATIONS: "jobpilot_applications",
  CUSTOM_JOBS: "jobpilot_custom_jobs",
  AI_USAGE: "jobpilot_ai_usage",
  CV_ANALYSIS: "jobpilot_cv_analysis",
  JOB_MATCHES: "jobpilot_job_matches",
  THEME: "jobpilot_theme",
  AUTH_TOKEN: "jobpilot_auth_token",
};

// Initial default user profile
export const DEFAULT_USER: UserProfile = {
  id: "user-1",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "candidate",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  headline: "Senior Full Stack & AI Engineer",
  targetRole: "Senior Full Stack AI Engineer",
  location: "San Francisco, CA",
  experienceYears: 6,
  primarySkills: ["React", "TypeScript", "Node.js", "Gemini API", "Tailwind CSS", "PostgreSQL"],
  cvText: SAMPLE_CVS[0].fullText,
  cvFileName: "Alex_Morgan_Resume_2026.pdf"
};

// Default starter applications
export const DEFAULT_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Senior Full Stack AI Engineer",
    company: "Synthetix Labs",
    location: "San Francisco, CA (Remote)",
    salary: "$165k - $215k",
    status: "Interview",
    appliedDate: "2026-09-10",
    interviewDate: "2026-09-22T10:30:00",
    notes: "Completed initial recruiter screen. System design interview scheduled with VP of Engineering next Tuesday.",
    contactPerson: "Sarah Jenkins (Talent Lead)",
    jobUrl: "https://synthetixlabs.example.com"
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Lead Frontend Architect",
    company: "Veloce Cloud",
    location: "New York, NY (Hybrid)",
    salary: "$180k - $235k",
    status: "Applied",
    appliedDate: "2026-09-12",
    notes: "Submitted tailored cover letter generated via JobPilot AI highlighting Web Vitals optimization.",
    contactPerson: "David Ross",
    jobUrl: "https://velocecloud.example.com"
  },
  {
    id: "app-3",
    jobId: "job-18",
    jobTitle: "Senior Backend Engineer (Go)",
    company: "VaultPay FinTech",
    location: "Miami, FL (Remote)",
    salary: "$160k - $210k",
    status: "Offer",
    appliedDate: "2026-08-28",
    notes: "Received formal written offer! $195,000 base + 0.15% equity grant. Reviewing benefits package.",
    contactPerson: "Michael Zhang",
    jobUrl: "https://vaultpay.example.com"
  },
  {
    id: "app-4",
    jobId: "job-3",
    jobTitle: "Senior Machine Learning Engineer",
    company: "NeuralPulse",
    location: "Austin, TX (Remote)",
    salary: "$170k - $220k",
    status: "Saved",
    appliedDate: "2026-09-15",
    notes: "Need to update portfolio with LoRA fine-tuning benchmarks before submitting formal application.",
    contactPerson: "HR Team"
  },
  {
    id: "app-5",
    jobId: "job-12",
    jobTitle: "Senior DevOps & Cloud Infrastructure",
    company: "CloudSentinel",
    location: "Seattle, WA (Remote)",
    salary: "$160k - $205k",
    status: "Rejected",
    appliedDate: "2026-08-15",
    notes: "Role required 5+ years strict multi-region Kubernetes admin; invited to re-apply for full-stack role in Q4.",
    contactPerson: "Talent Acquisition"
  }
];

export const StorageService = {
  // User Profile
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },
  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  },
  clearUserProfile(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (e) {
      console.error(e);
    }
  },

  // Saved Jobs
  getSavedJobs(): string[] {
    return this.getSavedJobIds();
  },
  getSavedJobIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      return data ? JSON.parse(data) : ["job-1", "job-3"];
    } catch {
      return ["job-1", "job-3"];
    }
  },
  toggleSavedJob(jobId: string): boolean {
    return this.toggleSaveJob(jobId);
  },
  toggleSaveJob(jobId: string): boolean {
    const saved = this.getSavedJobIds();
    let isSaved = false;
    let updated: string[];
    if (saved.includes(jobId)) {
      updated = saved.filter(id => id !== jobId);
      isSaved = false;
    } else {
      updated = [...saved, jobId];
      isSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(updated));
    return isSaved;
  },

  // Applications
  getApplications(): JobApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : DEFAULT_APPLICATIONS;
    } catch {
      return DEFAULT_APPLICATIONS;
    }
  },
  saveApplications(apps: JobApplication[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    } catch (e) {
      console.error(e);
    }
  },
  addApplication(app: Omit<JobApplication, "id" | "appliedDate">): JobApplication {
    const apps = this.getApplications();
    const newApp: JobApplication = {
      ...app,
      id: "app-" + Date.now(),
      appliedDate: new Date().toISOString().split("T")[0],
    };
    const updated = [newApp, ...apps];
    this.saveApplications(updated);
    return newApp;
  },
  updateApplication(id: string, updates: Partial<JobApplication>): void {
    const apps = this.getApplications();
    const updated = apps.map(app => (app.id === id ? { ...app, ...updates } : app));
    this.saveApplications(updated);
  },
  updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string, interviewDate?: string): void {
    const updates: Partial<JobApplication> = { status };
    if (notes !== undefined) updates.notes = notes;
    if (interviewDate !== undefined) updates.interviewDate = interviewDate;
    this.updateApplication(id, updates);
  },
  deleteApplication(id: string): void {
    const apps = this.getApplications();
    const updated = apps.filter(app => app.id !== id);
    this.saveApplications(updated);
  },

  // Jobs (combining demo jobs with custom admin-added jobs)
  getJobs(): Job[] {
    return this.getAllJobs();
  },
  getAllJobs(): Job[] {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_JOBS);
      const customJobs: Job[] = custom ? JSON.parse(custom) : [];
      return [...customJobs, ...DEMO_JOBS];
    } catch {
      return DEMO_JOBS;
    }
  },
  addJob(job: Partial<Job>): Job {
    const defaultJob: Omit<Job, "id" | "postedAt" | "applicantCount"> = {
      title: job.title || "Software Professional",
      company: job.company || "Innovate Corp",
      location: job.location || "Remote",
      workplaceType: job.workplaceType || "Remote",
      jobType: job.jobType || "Full-time",
      experienceLevel: job.experienceLevel || "Senior Level",
      category: job.category || "Software Engineering",
      salaryMin: job.salaryMin || 130000,
      salaryMax: job.salaryMax || 180000,
      salaryCurrency: "USD",
      description: job.description || "Exciting opportunity to build impactful systems.",
      responsibilities: job.responsibilities || ["Architect scalable solutions", "Collaborate with cross-functional teams"],
      requirements: job.requirements || ["3+ years relevant engineering experience"],
      skills: job.skills || ["TypeScript", "React"],
      benefits: job.benefits || ["Competitive compensation", "Health insurance", "Remote flexibility"],
      featured: job.featured || false,
    };
    return this.addCustomJob(defaultJob);
  },
  addCustomJob(job: Omit<Job, "id" | "postedAt" | "applicantCount">): Job {
    const all = this.getAllJobs();
    const newJob: Job = {
      ...job,
      id: "custom-job-" + Date.now(),
      postedAt: "Just now",
      applicantCount: 0,
    };
    try {
      const existingCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_JOBS);
      const parsed: Job[] = existingCustom ? JSON.parse(existingCustom) : [];
      parsed.unshift(newJob);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_JOBS, JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
    return newJob;
  },
  deleteJob(id: string): void {
    try {
      const existingCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_JOBS);
      if (existingCustom) {
        const parsed: Job[] = JSON.parse(existingCustom);
        const filtered = parsed.filter(j => j.id !== id);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_JOBS, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error(e);
    }
  },

  // AI Usage Log
  getAIUsageLogs(): AIUsageRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_USAGE);
      if (data) return JSON.parse(data);
      // Seed default logs for Admin view
      const starterLogs: AIUsageRecord[] = [
        { id: "log-1", tool: "CV Analyzer", timestamp: "10 mins ago", userId: "user-1", userEmail: "alex.morgan@example.com", tokensUsed: 1420, status: "success" },
        { id: "log-2", tool: "Job Matcher", timestamp: "35 mins ago", userId: "user-1", userEmail: "alex.morgan@example.com", tokensUsed: 1850, status: "success" },
        { id: "log-3", tool: "Cover Letter AI", timestamp: "1 hour ago", userId: "user-2", userEmail: "elena.r@example.com", tokensUsed: 980, status: "success" },
        { id: "log-4", tool: "Interview AI", timestamp: "2 hours ago", userId: "user-3", userEmail: "marcus.c@example.com", tokensUsed: 2200, status: "success" },
        { id: "log-5", tool: "Skill Gap", timestamp: "4 hours ago", userId: "user-4", userEmail: "sophia.t@example.com", tokensUsed: 1120, status: "success" },
      ];
      return starterLogs;
    } catch {
      return [];
    }
  },
  logAIUsage(tool: AIUsageRecord["tool"], tokens: number = 1200): void {
    const logs = this.getAIUsageLogs();
    const user = this.getUserProfile();
    const newLog: AIUsageRecord = {
      id: "log-" + Date.now(),
      tool,
      timestamp: "Just now",
      userId: user.id,
      userEmail: user.email,
      tokensUsed: tokens,
      status: "success",
    };
    try {
      localStorage.setItem(STORAGE_KEYS.AI_USAGE, JSON.stringify([newLog, ...logs.slice(0, 49)]));
    } catch (e) {
      console.error(e);
    }
  },

  // Theme
  getTheme(): "dark" | "light" {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as "dark" | "light") || "light";
  },
  setTheme(theme: "dark" | "light"): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};
