import React from "react";
import { Sparkles, Shield, Heart, ExternalLink, Download } from "lucide-react";
import { NavTab } from "./Navbar";

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenLegal: (tab: "privacy" | "terms" | "cookie") => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenLegal }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                JobPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              Your AI-powered career co-pilot. Supercharge your job search, optimize your CV for ATS filters, generate tailored cover letters, and master technical & behavioral interviews.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All AI Systems Operational</span>
              </div>
              <span className="text-xs text-slate-400">v2.4.0 (Production)</span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onSelectTab("jobs")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Find Jobs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("tracker")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Application Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("dashboard")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Candidate Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("admin")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>Admin Portal</span>
                  <Shield className="w-3 h-3 text-purple-500" />
                </button>
              </li>
              <li>
                <a
                  href="./jobpilotai-dist.zip"
                  download="jobpilotai-dist.zip"
                  className="hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400"
                  title="Download complete static dist ZIP for GitHub Pages"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Dist ZIP</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: AI Co-Pilot Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">AI Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onSelectTab("cv-analyzer")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ATS CV Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("job-matcher")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Job Matcher
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("cover-letter")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cover Letter AI
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("interview-prep")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Interview Practice AI
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("skill-gap")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Skill Gap Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Trust & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onOpenLegal("privacy")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal("terms")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal("cookie")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cookie Policy
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-400 block pt-1">
                  SOC 2 Type II Certified Architecture
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} JobPilot AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built for modern career excellence</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Powered by Google Gemini 3
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
