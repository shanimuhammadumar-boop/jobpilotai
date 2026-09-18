import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound,
  CheckCircle2
} from "lucide-react";
import { UserProfile } from "../types";
import { useToast } from "./Toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Please enter email and password.", "error");
      return;
    }

    const newUser: UserProfile = {
      id: "usr-" + Date.now(),
      name: name.trim() || email.split("@")[0],
      email,
      role: "candidate",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      headline: "Software Professional",
      targetRole: "Senior Software Engineer",
      location: "San Francisco, CA",
      experienceYears: 4,
      primarySkills: ["React", "TypeScript", "Node.js", "Docker", "SQL"],
      cvText: "",
      cvFileName: "Resume.pdf"
    };

    onLogin(newUser);
    showToast(`Welcome to JobPilot AI, ${newUser.name}!`, "success");
    onClose();
  };

  const handleDemoCandidateLogin = () => {
    const candidateUser: UserProfile = {
      id: "demo-candidate-1",
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
      role: "candidate",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      headline: "Senior Full Stack & AI Engineer",
      targetRole: "Senior Full Stack AI Engineer",
      location: "San Francisco, CA",
      experienceYears: 6,
      primarySkills: ["React", "TypeScript", "Node.js", "Python", "Docker", "REST APIs", "Tailwind CSS"],
      cvText: "Alex Morgan - Senior Full Stack AI Engineer with 6+ years experience...",
      cvFileName: "Alex_Morgan_Resume_2026.pdf"
    };
    onLogin(candidateUser);
    showToast("Logged in as Alex Morgan (Candidate)", "success");
    onClose();
  };

  const handleDemoAdminLogin = () => {
    const adminUser: UserProfile = {
      id: "demo-admin-1",
      name: "Elena Rostova",
      email: "elena.r@jobpilot.ai",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      headline: "Platform Operations Director",
      targetRole: "Platform Director",
      location: "San Francisco, CA",
      experienceYears: 10,
      primarySkills: ["Product Strategy", "System Architecture", "AI Operations"],
      cvText: ""
    };
    onLogin(adminUser);
    showToast("Logged in as Elena Rostova (Admin)", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              JobPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center text-xs font-semibold">
          <button
            onClick={() => setTab("signin")}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === "signin" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === "signup" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Demo Buttons */}
        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 block">
            Instant 1-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoCandidateLogin}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Candidate Demo</span>
            </button>
            <button
              onClick={handleDemoAdminLogin}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {tab === "signup" && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all mt-2"
          >
            {tab === "signin" ? "Sign In to JobPilot" : "Create Free Account"}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
