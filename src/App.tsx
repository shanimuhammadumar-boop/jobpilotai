import React, { useState, useEffect } from "react";
import { ToastProvider, useToast } from "./components/Toast";
import { Navbar, NavTab } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { JobSearch } from "./components/JobSearch";
import { CVAnalyzer } from "./components/CVAnalyzer";
import { JobMatcher } from "./components/JobMatcher";
import { CoverLetterAI } from "./components/CoverLetterAI";
import { InterviewAI } from "./components/InterviewAI";
import { ApplicationTracker } from "./components/ApplicationTracker";
import { SkillGapAnalyzer } from "./components/SkillGapAnalyzer";
import { UserDashboard } from "./components/UserDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthModal } from "./components/AuthModal";
import { LegalModal } from "./components/LegalModal";
import { StorageService } from "./services/storage";
import { Job, UserProfile, JobApplication, ApplicationStatus, CVAnalysisResult } from "./types";

function MainApp() {
  const { showToast } = useToast();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>("home");

  // User & Data State
  const [user, setUser] = useState<UserProfile | null>(() => StorageService.getUserProfile());
  const [jobs, setJobs] = useState<Job[]>(() => StorageService.getJobs());
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => StorageService.getSavedJobs());
  const [applications, setApplications] = useState<JobApplication[]>(() => StorageService.getApplications());

  // Deep linking between tools (e.g. Job -> Job Matcher or Job -> Cover Letter)
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<Job | null>(null);
  const [selectedJobForCoverLetter, setSelectedJobForCoverLetter] = useState<Job | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<"privacy" | "terms" | "cookie">("privacy");

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("jobpilot_theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("jobpilot_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("jobpilot_theme", "light");
    }
  }, [isDark]);

  // Tab change helper with smooth scroll to top
  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Saved Jobs toggle
  const handleToggleSave = (jobId: string) => {
    const isSaved = StorageService.toggleSavedJob(jobId);
    setSavedJobIds(StorageService.getSavedJobs());
    return isSaved;
  };

  // Apply from Job Search
  const handleApplyJob = (job: Job, notes?: string) => {
    StorageService.addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salary: `$${job.salaryMin / 1000}k - $${job.salaryMax / 1000}k`,
      status: "Applied",
      notes: notes || "Applied via JobPilot AI with tailored resume."
    });
    setApplications(StorageService.getApplications());
  };

  // Add manual application
  const handleAddApplication = (app: Partial<JobApplication>) => {
    if (!app.jobTitle || !app.company) return;
    StorageService.addApplication({
      jobTitle: app.jobTitle,
      company: app.company,
      location: app.location || "Remote",
      salary: app.salary || "Competitive",
      status: app.status || "Applied",
      notes: app.notes,
      interviewDate: app.interviewDate,
      contactPerson: app.contactPerson,
      jobUrl: app.jobUrl
    });
    setApplications(StorageService.getApplications());
  };

  // Update status in tracker
  const handleUpdateStatus = (id: string, status: ApplicationStatus, notes?: string, interviewDate?: string) => {
    StorageService.updateApplicationStatus(id, status, notes, interviewDate);
    setApplications(StorageService.getApplications());
  };

  // Delete application
  const handleDeleteApplication = (id: string) => {
    StorageService.deleteApplication(id);
    setApplications(StorageService.getApplications());
  };

  // Update candidate CV
  const handleUpdateUserCV = (cvText: string, analysis?: CVAnalysisResult, fileName?: string) => {
    if (!user) {
      // If anonymous, create default profile
      const defaultUser: UserProfile = {
        id: "usr-" + Date.now(),
        name: "Alex Morgan",
        email: "alex.morgan@example.com",
        role: "candidate",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        headline: "Senior Full Stack & AI Engineer",
        targetRole: analysis?.targetRole || "Senior Software Engineer",
        location: "San Francisco, CA",
        experienceYears: 6,
        primarySkills: analysis?.topSkills || ["React", "TypeScript", "Node.js"],
        cvText,
        cvFileName: fileName || "Alex_Morgan_Resume_2026.pdf",
        lastCvAnalysis: analysis,
      };
      StorageService.saveUserProfile(defaultUser);
      setUser(defaultUser);
    } else {
      const updated: UserProfile = {
        ...user,
        cvText,
        cvFileName: fileName || user.cvFileName || "My_Resume.pdf",
        lastCvAnalysis: analysis || user.lastCvAnalysis,
        targetRole: analysis?.targetRole || user.targetRole,
        primarySkills: analysis?.topSkills?.length ? analysis.topSkills : user.primarySkills,
      };
      StorageService.saveUserProfile(updated);
      setUser(updated);
    }
  };

  // Admin: Add Job
  const handleAddJob = (job: Partial<Job>) => {
    StorageService.addJob(job);
    setJobs(StorageService.getJobs());
  };

  // Admin: Delete Job
  const handleDeleteJob = (jobId: string) => {
    StorageService.deleteJob(jobId);
    setJobs(StorageService.getJobs());
  };

  // User Auth
  const handleLogin = (newUser: UserProfile) => {
    StorageService.saveUserProfile(newUser);
    setUser(newUser);
  };

  const handleLogout = () => {
    StorageService.clearUserProfile();
    setUser(null);
    showToast("Signed out successfully.", "info");
  };

  const handleOpenLegal = (tab: "privacy" | "terms" | "cookie") => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        user={user}
        savedJobsCount={savedJobIds.length}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === "home" && <LandingPage onSelectTab={handleSelectTab} />}

        {currentTab === "jobs" && (
          <JobSearch
            jobs={jobs}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSave}
            onApplyJob={handleApplyJob}
            onSelectTab={handleSelectTab}
            onSelectJobForMatch={job => {
              setSelectedJobForMatch(job);
              handleSelectTab("job-matcher");
            }}
            onSelectJobForCoverLetter={job => {
              setSelectedJobForCoverLetter(job);
              handleSelectTab("cover-letter");
            }}
            user={user}
          />
        )}

        {currentTab === "cv-analyzer" && (
          <CVAnalyzer
            user={user}
            jobs={jobs}
            onUpdateUserCV={handleUpdateUserCV}
            onSelectTab={handleSelectTab}
            onSelectJobForCoverLetter={job => setSelectedJobForCoverLetter(job)}
          />
        )}

        {currentTab === "job-matcher" && (
          <JobMatcher
            jobs={jobs}
            user={user}
            initialJob={selectedJobForMatch}
            savedJobIds={savedJobIds}
            onToggleSaveJob={handleToggleSave}
            onSelectTab={handleSelectTab}
            onSetCoverLetterJob={job => setSelectedJobForCoverLetter(job)}
            onAddApplication={handleAddApplication}
          />
        )}

        {currentTab === "cover-letter" && (
          <CoverLetterAI
            jobs={jobs}
            user={user}
            selectedJob={selectedJobForCoverLetter}
          />
        )}

        {currentTab === "interview-prep" && <InterviewAI user={user} />}

        {currentTab === "tracker" && (
          <ApplicationTracker
            applications={applications}
            jobs={jobs}
            onAddApplication={handleAddApplication}
            onUpdateStatus={handleUpdateStatus}
            onDeleteApplication={handleDeleteApplication}
          />
        )}

        {currentTab === "skill-gap" && <SkillGapAnalyzer user={user} />}

        {currentTab === "dashboard" && (
          <UserDashboard
            user={user}
            jobs={jobs}
            applications={applications}
            savedJobIds={savedJobIds}
            onSelectTab={handleSelectTab}
            onOpenAuth={() => setIsAuthOpen(true)}
            onToggleSave={handleToggleSave}
            onApplyJob={handleApplyJob}
          />
        )}

        {currentTab === "admin" && (
          <AdminDashboard
            jobs={jobs}
            onAddJob={handleAddJob}
            onDeleteJob={handleDeleteJob}
            currentUser={user}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} onOpenLegal={handleOpenLegal} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      {/* Legal Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

