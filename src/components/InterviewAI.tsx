import React, { useState } from "react";
import { 
  MessageSquareCode, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Lightbulb, 
  ChevronRight, 
  Send,
  Award,
  BookOpen
} from "lucide-react";
import { InterviewFeedback, UserProfile } from "../types";
import { AIService } from "../services/ai";
import { useToast } from "./Toast";

interface InterviewAIProps {
  user: UserProfile | null;
}

interface QuestionItem {
  id: number;
  type: string;
  question: string;
  tip: string;
  sampleAnswer: string;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    type: "Behavioral (STAR)",
    question: "Tell me about a time you had to resolve a high-stakes disagreement with a principal architect or engineering manager about system design.",
    tip: "Use STAR: Detail the Situation, your specific Task, the collaborative Action you took with objective benchmarks, and the final positive Result.",
    sampleAnswer: "At my previous company, we were debating whether to migrate our notification pipeline to a Kafka cluster or use AWS SQS. The principal engineer preferred Kafka for raw throughput, while I was concerned about our team's operational overhead. I benchmarked our peak load at 8,000 events/sec and created a proof-of-concept showing SQS with FIFO queues satisfied our SLA at 1/5th the infrastructure cost. We mutually agreed on SQS, saving approximately $4,500/month and eliminating 3 on-call maintenance incidents."
  },
  {
    id: 2,
    type: "Technical Architecture",
    question: "How would you design a rate-limiter for an AI API platform that handles 50,000 requests/sec with tier-based tenant quotas?",
    tip: "Discuss token bucket or sliding window log algorithms, Redis caching, distributed synchronization, and handling fail-open vs fail-closed edge cases.",
    sampleAnswer: "I would implement a distributed Token Bucket algorithm backed by Redis clusters with sliding window keys. To minimize latency at 50,000 req/sec, local in-memory caching with batched Redis sync via Lua scripts would prevent database lock contention. Each tenant's tier and quota would be encoded in JWT claims. If Redis experiences transient packet loss, we fail-open for paid tier tenants to protect user experience."
  },
  {
    id: 3,
    type: "Situational & Crisis",
    question: "A critical customer-facing production bug occurred 20 minutes before a major client demo. How do you respond and organize the fix?",
    tip: "Focus on containment, blameless communication, rapid rollback vs hotfix evaluation, and post-incident root-cause analysis.",
    sampleAnswer: "My first priority is blast-radius mitigation. Rather than rushing an unreviewed code patch under pressure, I immediately check feature flags or revert the recent deployment to restore stability within 4 minutes. I communicate status transparently to the solutions engineering team with an estimated recovery time. Once stable, I write a reproduction test, deploy the hotfix through standard CI/CD, and document a blameless post-mortem."
  },
  {
    id: 4,
    type: "Leadership & Culture",
    question: "How do you handle a junior engineer on your squad who is consistently missing sprint deadlines and seems disengaged?",
    tip: "Demonstrate empathy, 1-on-1 root-cause discovery, breaking down tasks into smaller milestones, and proactive mentorship.",
    sampleAnswer: "I schedule a private 1-on-1 to listen and understand if the hurdle is technical ambiguity, tooling blockers, or burnout. Often missed deadlines stem from tasks being too broadly scoped. I help them break user stories into half-day deliverable subtasks, pair program on their first PR of the sprint, and celebrate their wins publicly in standup to rebuild momentum and confidence."
  }
];

export const InterviewAI: React.FC<InterviewAIProps> = ({ user }) => {
  const { showToast } = useToast();

  const [jobTitle, setJobTitle] = useState(user?.targetRole || "Senior Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Senior Level");
  const [interviewType, setInterviewType] = useState("Behavioral (STAR)");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);

  const activeQ = DEFAULT_QUESTIONS[currentQuestionIndex];

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) {
      showToast("Please write or insert your practice answer first.", "error");
      return;
    }

    setIsEvaluating(true);
    try {
      const result = await AIService.getInterviewFeedback(
        jobTitle,
        experienceLevel,
        interviewType,
        activeQ.question,
        userAnswer
      );
      setFeedback(result);
      showToast(`Answer reviewed! Score: ${result.score}/100`, "success");
    } catch (err) {
      showToast("Could not complete evaluation.", "error");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setUserAnswer("");
    setCurrentQuestionIndex((prev) => (prev + 1) % DEFAULT_QUESTIONS.length);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-semibold">
          <MessageSquareCode className="w-3.5 h-3.5 text-violet-500" />
          <span>Interactive Mock Coaching</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Interview Practice AI Coach
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Master behavioral and technical interviews with personalized feedback, STAR framework scoring, and model answers.
        </p>
      </div>

      {/* Role & Setup Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target Position</label>
          <input
            type="text"
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Seniority Level</label>
          <select
            value={experienceLevel}
            onChange={e => setExperienceLevel(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Lead / Principal">Lead / Principal</option>
            <option value="Director / Executive">Director / Executive</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Focus Domain</label>
          <select
            value={interviewType}
            onChange={e => setInterviewType(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="Behavioral (STAR)">Behavioral (STAR Method)</option>
            <option value="Technical Architecture">Technical Architecture</option>
            <option value="Situational & Crisis">Situational & Crisis</option>
            <option value="Leadership & Culture">Leadership & Culture</option>
          </select>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold">
              Question {currentQuestionIndex + 1} of {DEFAULT_QUESTIONS.length}
            </span>
            <span className="text-slate-400 font-medium">{activeQ.type}</span>
          </div>

          <button
            onClick={handleNextQuestion}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Skip to Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          "{activeQ.question}"
        </h3>

        {/* Pro Tip Callout */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/70 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Coach Tip:</span> {activeQ.tip}
          </div>
        </div>

        {/* User Answer Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Your Response</span>
            <button
              onClick={() => {
                setUserAnswer(activeQ.sampleAnswer);
                showToast("Loaded sample STAR answer", "info");
              }}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Insert Sample High-Performing Answer
            </button>
          </div>
          <textarea
            id="interview-answer-input"
            rows={6}
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Type your response here. For behavioral questions, structure it with Situation, Task, Action, and quantifiable Result..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <button
            id="interview-submit-btn"
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md hover:shadow-violet-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Response...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit Answer for AI Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* FEEDBACK DISPLAY */}
      {feedback && (
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Top Score Banner */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessment Result</span>
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                AI Coach Performance Evaluation
              </h4>
            </div>
            <div className="flex items-center gap-3 bg-violet-50 dark:bg-violet-950/80 px-4 py-2 rounded-xl border border-violet-200 dark:border-violet-800">
              <div className="text-3xl font-black text-violet-600 dark:text-violet-400">
                {feedback.score}
              </div>
              <div className="text-[11px] text-violet-800 dark:text-violet-300 font-semibold leading-tight">
                / 100 <br /> Readiness
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {feedback.feedback}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>What You Did Well</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {feedback.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to improve */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Areas to Polish</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {feedback.areasToImprove.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">!</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Answer */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <span>Recommended Model Answer (STAR Framework)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic">
              "{feedback.suggestedBetterAnswer}"
            </p>
          </div>

          {/* Next button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Practice Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
