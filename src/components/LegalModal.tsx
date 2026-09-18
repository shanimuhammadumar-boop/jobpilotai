import React, { useState } from "react";
import { X, ShieldCheck, FileText, Lock } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "privacy" | "terms" | "cookie";
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "privacy",
}) => {
  const [tab, setTab] = useState<"privacy" | "terms" | "cookie">(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Legal & Compliance Documents
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center text-xs font-semibold">
          <button
            onClick={() => setTab("privacy")}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === "privacy" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setTab("terms")}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === "terms" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setTab("cookie")}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === "cookie" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
            }`}
          >
            Cookie Policy
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pr-2">
          {tab === "privacy" && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">JobPilot AI Privacy Policy</h3>
              <p className="text-slate-400 text-xs">Last Updated: March 2026</p>
              <p>
                At JobPilot AI, we respect your privacy and are committed to protecting candidate personal data. This policy details how we collect, process, and protect your information when using our career co-pilot platform.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mt-2">1. Data We Collect</h4>
              <p>
                We only collect information you voluntarily provide, such as your name, email address, resume content, job application details, and interview practice notes. We do not sell or monetize personal CV information.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mt-2">2. How We Use Gemini AI</h4>
              <p>
                CV and job matching analyses are securely routed through enterprise Google Gemini API endpoints configured with strict privacy isolation. Your CV text is not stored in training corpora or used to train open models without explicit approval.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mt-2">3. Data Retention & Erasure</h4>
              <p>
                You can delete your resume data or account history at any time through your candidate dashboard settings or by clearing your local storage cache.
              </p>
            </div>
          )}

          {tab === "terms" && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Terms of Service</h3>
              <p className="text-slate-400 text-xs">Last Updated: March 2026</p>
              <p>
                Welcome to JobPilot AI. By accessing or using our website and AI tools, you agree to be bound by these Terms of Service.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mt-2">1. Permitted Use</h4>
              <p>
                JobPilot AI is provided for job seekers, career coaches, and hiring teams. You agree not to use the service for automated scraping, malicious crawling, or submitting deceptive or fraudulent employment applications.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mt-2">2. AI Output Disclaimers</h4>
              <p>
                While JobPilot AI provides cutting-edge ATS heuristics and interview coaching, hiring decisions ultimately rest with individual employers. We do not guarantee employment offers or specific salary amounts.
              </p>
            </div>
          )}

          {tab === "cookie" && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Cookie & Storage Policy</h3>
              <p className="text-slate-400 text-xs">Last Updated: March 2026</p>
              <p>
                JobPilot AI uses client-side storage technologies (including browser localStorage and session tokens) to maintain your application pipeline, saved job bookmarks, and theme preference.
              </p>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mt-2">Essential Cookies Only</h4>
              <p>
                We do not use invasive cross-site advertising trackers or sell browsing data to third-party ad networks. All storage is strictly functional to power your user dashboard and job search session.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
