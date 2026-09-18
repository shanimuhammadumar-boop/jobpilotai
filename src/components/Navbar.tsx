import React, { useState } from "react";
import { 
  Sparkles, 
  Search, 
  FileText, 
  Target, 
  PenTool, 
  MessageSquareCode, 
  Kanban, 
  TrendingUp, 
  LayoutDashboard, 
  ShieldCheck, 
  Bookmark, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User as UserIcon,
  ChevronDown,
  LogOut
} from "lucide-react";
import { UserProfile } from "../types";

export type NavTab = 
  | "home" 
  | "jobs" 
  | "cv-analyzer" 
  | "job-matcher" 
  | "cover-letter" 
  | "interview-prep" 
  | "tracker" 
  | "skill-gap" 
  | "dashboard" 
  | "admin";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfile | null;
  savedJobsCount: number;
  onOpenAuth: () => void;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  savedJobsCount,
  onOpenAuth,
  onLogout,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItem = (tab: NavTab, label: string, icon: React.ReactNode) => {
    const isActive = currentTab === tab;
    return (
      <button
        id={`nav-link-${tab}`}
        onClick={() => {
          onSelectTab(tab);
          setMobileMenuOpen(false);
          setToolsDropdownOpen(false);
        }}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
          isActive
            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const isAIToolActive = ["cv-analyzer", "job-matcher", "cover-letter", "interview-prep", "skill-gap"].includes(currentTab);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <button
            id="nav-logo-btn"
            onClick={() => onSelectTab("home")}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent">
                  JobPilot
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  AI
                </span>
              </div>
              <span className="block text-[11px] text-slate-400 font-medium leading-none">
                Career Co-Pilot
              </span>
            </div>
          </button>

          {/* Desktop Primary Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItem("home", "Home", null)}
            {navItem("jobs", "Find Jobs", <Search className="w-4 h-4" />)}
            
            {/* AI Tools Dropdown */}
            <div className="relative">
              <button
                id="nav-dropdown-tools"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isAIToolActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI Tools</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {toolsDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <button
                    onClick={() => { onSelectTab("cv-analyzer"); setToolsDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="font-semibold text-xs">AI CV Analyzer</div>
                      <div className="text-[11px] text-slate-400">Score & improve CVs</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onSelectTab("job-matcher"); setToolsDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Target className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-xs">Job Matcher</div>
                      <div className="text-[11px] text-slate-400">Compatibility analysis</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onSelectTab("cover-letter"); setToolsDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <PenTool className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-semibold text-xs">Cover Letter AI</div>
                      <div className="text-[11px] text-slate-400">Tailored letters in seconds</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onSelectTab("interview-prep"); setToolsDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <MessageSquareCode className="w-4 h-4 text-violet-500" />
                    <div>
                      <div className="font-semibold text-xs">Interview AI</div>
                      <div className="text-[11px] text-slate-400">Interactive mock feedback</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onSelectTab("skill-gap"); setToolsDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <TrendingUp className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className="font-semibold text-xs">Skill Gap Analyzer</div>
                      <div className="text-[11px] text-slate-400">Personalized study roadmap</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {navItem("tracker", "Tracker", <Kanban className="w-4 h-4" />)}
            {navItem("dashboard", "Dashboard", <LayoutDashboard className="w-4 h-4" />)}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* Saved Jobs Quick Button */}
          <button
            id="nav-saved-jobs-btn"
            onClick={() => onSelectTab("jobs")}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Saved Jobs"
          >
            <Bookmark className="w-5 h-5" />
            {savedJobsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-indigo-600 text-white rounded-full flex items-center justify-center">
                {savedJobsCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            id="nav-theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Admin Tab Shortcut */}
          <button
            id="nav-admin-btn"
            onClick={() => onSelectTab("admin")}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              currentTab === "admin"
                ? "bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Admin</span>
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                id="nav-user-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => { onSelectTab("dashboard"); setUserDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left mt-1"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    <span>Candidate Dashboard</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="nav-signin-btn"
              onClick={onOpenAuth}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-500/25 transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-1 shadow-2xl animate-in slide-in-from-top-4">
          <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider px-3 py-1">Navigation</div>
          {navItem("home", "Home", null)}
          {navItem("jobs", "Find Jobs", <Search className="w-4 h-4" />)}
          {navItem("tracker", "Application Tracker", <Kanban className="w-4 h-4" />)}
          {navItem("dashboard", "User Dashboard", <LayoutDashboard className="w-4 h-4" />)}
          {navItem("admin", "Admin Dashboard", <ShieldCheck className="w-4 h-4 text-purple-500" />)}

          <div className="pt-2 font-semibold text-xs text-slate-400 uppercase tracking-wider px-3 py-1">AI Co-Pilot Tools</div>
          {navItem("cv-analyzer", "AI CV Analyzer", <FileText className="w-4 h-4 text-indigo-500" />)}
          {navItem("job-matcher", "Job Matcher", <Target className="w-4 h-4 text-emerald-500" />)}
          {navItem("cover-letter", "Cover Letter AI", <PenTool className="w-4 h-4 text-amber-500" />)}
          {navItem("interview-prep", "Interview AI", <MessageSquareCode className="w-4 h-4 text-violet-500" />)}
          {navItem("skill-gap", "Skill Gap Analyzer", <TrendingUp className="w-4 h-4 text-rose-500" />)}

          {!user && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
