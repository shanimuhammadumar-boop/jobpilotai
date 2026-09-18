import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Target, 
  PenTool, 
  MessageSquareCode, 
  Kanban, 
  TrendingUp, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Briefcase, 
  Zap, 
  Award, 
  Clock, 
  Users
} from "lucide-react";
import { motion } from "motion/react";
import { NavTab } from "./Navbar";

interface LandingPageProps {
  onSelectTab: (tab: NavTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectTab }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does JobPilot AI improve my chances with Applicant Tracking Systems (ATS)?",
      a: "JobPilot AI uses deep semantic parsing trained on modern ATS algorithms (like Greenhouse, Lever, and Workday). It analyzes your resume against target job descriptions, identifying missing core keywords, formatting flaws, and weak impact metrics, then provides actionable phrasing to boost your parse rate above 90%."
    },
    {
      q: "Is my personal resume and career data kept private and secure?",
      a: "Absolutely. We treat your personal data with enterprise-grade privacy standards. Your CV content is processed transiently for analysis and never sold to third-party data brokers or used to train open models without your explicit consent."
    },
    {
      q: "Can I practice technical as well as behavioral interview questions?",
      a: "Yes! The Interview AI module includes tailored question banks across Technical Architecture, Behavioral (using the STAR framework), Situational, and Executive Leadership scenarios across 12+ career domains."
    },
    {
      q: "How does the Job Matcher calculate my compatibility percentage?",
      a: "The Job Matcher evaluates 4 key dimensions: Hard & Soft Skills overlap, Experience level and scope, Educational and certification relevance, and Company culture keywords. You receive a transparent breakdown with exactly which keywords are present or missing."
    },
    {
      q: "Can I use JobPilot AI for free?",
      a: "Yes, our core tier is 100% free for job seekers, including realistic demo jobs, CV auditing, job matching, cover letter generation, and application tracking."
    }
  ];

  return (
    <div className="space-y-24 py-6 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Decorative background glow */}
        <div className="absolute inset-0 -top-10 flex items-center justify-center -z-10 pointer-events-none overflow-hidden">
          <div className="w-[580px] h-[360px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Next-Gen Career Intelligence • Powered by Gemini AI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Find Your Next Job{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Smarter With AI
          </span>
        </h1>

        {/* Short Subtitle */}
        <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Accelerate your search with instant resume ATS matching, real-time salary transparency, customized AI cover letters, and an automated application tracker.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            id="hero-find-jobs-btn"
            onClick={() => onSelectTab("jobs")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Find Jobs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            id="hero-analyze-resume-btn"
            onClick={() => onSelectTab("cv-analyzer")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base shadow-xs hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Analyze My Resume</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Instant ATS Compatibility Audit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Over 20+ Realistic Demo Roles</span>
          </div>
        </div>

        {/* ANIMATED DASHBOARD PREVIEW */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="relative p-2 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-200/70 to-slate-100/30 dark:from-slate-800/80 dark:to-slate-900/40 border border-slate-300/80 dark:border-slate-700/80 shadow-2xl backdrop-blur-sm">
            {/* Window bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 rounded-t-xl mb-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-3 py-0.5 rounded-md">
                jobpilot-ai.app/workspace
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live AI Co-Pilot</span>
              </div>
            </div>

            {/* Dashboard Inner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-left p-2 sm:p-4 bg-slate-50/90 dark:bg-slate-950/80 rounded-xl">
              {/* Left Widget: CV Score */}
              <div className="md:col-span-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold uppercase tracking-wider">ATS Score</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">Ready to Send</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">92</span>
                    <span className="text-sm font-semibold text-slate-400">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Top 5% candidate compatibility. High keyword density for React, Node, and Cloud.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Next step:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline" onClick={() => onSelectTab("cv-analyzer")}>
                    View Detailed Audit →
                  </span>
                </div>
              </div>

              {/* Center Widget: Live Job Match */}
              <div className="md:col-span-5 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider">Top Job Match</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold text-[10px]">96% Match</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Senior Full Stack AI Engineer</h4>
                <p className="text-xs text-slate-500">Synthetix Labs • San Francisco, CA (Remote)</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">React</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">TypeScript</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">Gemini API</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-semibold text-emerald-600">$165k - $215k</span>
                </div>
                <button
                  onClick={() => onSelectTab("jobs")}
                  className="mt-4 w-full py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-center"
                >
                  Quick Apply with AI CV
                </button>
              </div>

              {/* Right Widget: Interview Readiness */}
              <div className="md:col-span-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Practice Coach</span>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/80 flex items-center justify-center text-violet-600 dark:text-violet-400">
                      <MessageSquareCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Behavioral AI</div>
                      <div className="text-[10px] text-slate-400">STAR Scoring</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    "Tell me about a time you optimized a slow query under pressure."
                  </p>
                </div>
                <div className="mt-3">
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                    AI Feedback: Score 88/100
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-[88%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="border-y border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">94%</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">Interview Callback Rate</div>
              <div className="text-xs text-slate-400 mt-0.5">Over 3.8x baseline resumes</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">45,000+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">CVs Analyzed & Scored</div>
              <div className="text-xs text-slate-400 mt-0.5">Validated against ATS parsers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">$24,500</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">Average Salary Increase</div>
              <div className="text-xs text-slate-400 mt-0.5">Based on placed candidates</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">15 hrs</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">Weekly Time Saved</div>
              <div className="text-xs text-slate-400 mt-0.5">In job search and tailoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Streamlined Process</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            How JobPilot AI accelerates your career
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
            Three simple steps to transform your job search from a frustrating numbers game into a precision-engineered campaign.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative text-left">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-lg mb-5">
              01
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Upload or Paste Your CV</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
              Drop your resume in PDF or paste text. Our AI performs an instant 24-point ATS audit checking formatting, impact metrics, keyword density, and structural clarity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative text-left">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 font-extrabold text-lg mb-5">
              02
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Match Roles & Generate Letters</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
              Explore curated jobs across engineering, design, marketing, and sales. Instantly compare compatibility and generate tailored, high-converting cover letters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-lg mb-5">
              03
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Practice & Track to Offer</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
              Rehearse targeted interview questions with real-time AI critique, track your active application pipeline on the Kanban board, and close six-figure offers.
            </p>
          </div>
        </div>
      </section>

      {/* 4. AI TOOLS SUITE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">All-In-One Toolkit</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            AI Tools Built Specifically for Job Seekers
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Every feature designed to address real hurdles in modern hiring pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tool 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400/60 dark:hover:border-indigo-600/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI CV Analyzer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Extract skills, calculate ATS score, pinpoint formatting flaws, and receive targeted bullet-point rewrite suggestions with quantified metrics.
              </p>
            </div>
            <button
              onClick={() => onSelectTab("cv-analyzer")}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
            >
              <span>Launch CV Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400/60 dark:hover:border-emerald-600/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Precision Job Matcher</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Paste any job description to get a percentage score, missing required skills, matching keywords, and custom resume tweaks for that specific opening.
              </p>
            </div>
            <button
              onClick={() => onSelectTab("job-matcher")}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all"
            >
              <span>Match a Job Description</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400/60 dark:hover:border-amber-600/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cover Letter AI</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Generate tailored, convincing cover letters aligned with the exact hiring company and role tone—without boring generic clichés.
              </p>
            </div>
            <button
              onClick={() => onSelectTab("cover-letter")}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:gap-2 transition-all"
            >
              <span>Draft a Cover Letter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-violet-400/60 dark:hover:border-violet-600/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interview AI Coach</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Rehearse real interview questions one by one. Receive an instant score, strengths, critique, and ideal model answers built on the STAR methodology.
              </p>
            </div>
            <button
              onClick={() => onSelectTab("interview-prep")}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:gap-2 transition-all"
            >
              <span>Practice Interviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-400/60 dark:hover:border-rose-600/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill Gap Analyzer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Identify which skills are holding you back from high-paying roles and follow a customized 4-week study and project roadmap to bridge the gap.
              </p>
            </div>
            <button
              onClick={() => onSelectTab("skill-gap")}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:gap-2 transition-all"
            >
              <span>Analyze Skill Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-400/60 dark:hover:border-sky-600/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Kanban className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Tracker</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Stay organized across Saved, Applied, Interview, Offer, and Rejected stages. Record recruiter notes, interview dates, and monitor your response rate.
              </p>
            </div>
            <button
              onClick={() => onSelectTab("tracker")}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:gap-2 transition-all"
            >
              <span>Open Tracker Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. CANDIDATE TESTIMONIALS */}
      <section className="border-t border-slate-200 dark:border-slate-800 py-16 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Success Stories</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Loved by engineers, marketers, and product leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "I was getting ghosted by ATS algorithms for 3 months. After running my resume through JobPilot AI and applying the keyword recommendations, I had 4 recruiter callbacks within 10 days and landed a $185k offer."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Candidate"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Sarah Kowalski</div>
                  <div className="text-xs text-slate-400">Now Senior Frontend at Stripe</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "The Interview AI coach was a game changer for me. Rehearsing system design trade-offs and getting immediate critiques on my STAR structure made me completely calm in my final loop."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Candidate"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Devon Mitchell</div>
                  <div className="text-xs text-slate-400">Staff AI Engineer at Datadog</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "Drafting cover letters used to take me 45 minutes each. JobPilot AI produces genuine, company-specific letters in 10 seconds. I tracked 30 applications seamlessly without messy spreadsheets."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Candidate"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Clara Lin</div>
                  <div className="text-xs text-slate-400">Head of Growth at Veloce</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
              >
                <button
                  id={`faq-btn-${idx}`}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 shrink-0 text-indigo-500" /> : <ChevronDown className="w-5 h-5 shrink-0 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take flight with JobPilot AI?
            </h2>
            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              Join thousands of job seekers who landed interviews at leading technology, finance, and creative companies with our AI co-pilot.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="cta-banner-start-btn"
                onClick={() => onSelectTab("jobs")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 hover:scale-105 transition-all"
              >
                Start Exploring 20+ Jobs
              </button>
              <button
                id="cta-banner-cv-btn"
                onClick={() => onSelectTab("cv-analyzer")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-500/50 text-white font-semibold text-sm transition-all"
              >
                Audit My CV Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
