export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type WorkplaceType = "Remote" | "Hybrid" | "On-site";
export type ExperienceLevel = "Entry Level" | "Mid Level" | "Senior Level" | "Lead / Principal" | "Executive";
export type JobCategory = 
  | "Software Engineering" 
  | "AI / Machine Learning" 
  | "Data & Analytics" 
  | "Marketing & Growth" 
  | "Product & Design" 
  | "Customer Support" 
  | "Sales & BizDev" 
  | "Finance & Ops";

export interface Job {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  logoBg?: string;
  location: string;
  workplaceType: WorkplaceType;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  category: JobCategory;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedAt: string;
  featured?: boolean;
  applicantCount: number;
  applyUrl?: string;
}

export type ApplicationStatus = "Saved" | "Applied" | "Interview" | "Offer" | "Rejected" | "Hired";

export interface JobApplication {
  id: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  status: ApplicationStatus;
  appliedDate: string;
  interviewDate?: string;
  notes?: string;
  contactPerson?: string;
  jobUrl?: string;
}

export interface CVAnalysisResult {
  atsScore: number;
  formattingScore: number;
  impactScore: number;
  keywordScore: number;
  structureScore: number;
  summary: string;
  topSkills: string[];
  softSkills: string[];
  strengths: string[];
  missingSkills: string[];
  actionableImprovements: string[];
  atsCompatibility: "High" | "Medium" | "Low";
  analyzedAt: string;
  targetRole?: string;
  // Targeted job match additions
  targetJobTitle?: string;
  targetCompany?: string;
  jobMatchScore?: number;
}

export interface SmartJobMatchRecommendation {
  job: Job;
  matchScore: number;
  matchReason: string;
  whyMatches?: string;
  matchedSkills: string[];
  missingSkills: string[];
  experienceFit: "Strong" | "Good" | "Potential";
}

export interface JobMatchResult {
  matchPercentage: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  cultureMatch: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  keyStrengths: string[];
  gapsIdentified: string[];
  recommendedCVEdits: string[];
  interviewProbability: "High" | "Moderate" | "Low";
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  context: string;
  sampleAnswer: string;
}

export interface InterviewFeedback {
  score: number;
  feedback: string;
  strengths: string[];
  areasToImprove: string[];
  suggestedBetterAnswer: string;
}

export interface SkillGapItem {
  skill: string;
  priority: "Critical" | "High" | "Medium";
  reason: string;
  recommendedLearning: string;
}

export interface SkillGapResult {
  targetJob: string;
  haveSkills: string[];
  missingSkills: SkillGapItem[];
  learningRoadmap: { phase: string; focus: string; action: string }[];
  marketDemand: "High" | "Very High" | "Moderate";
  estimatedTimeToJobReady: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "admin";
  avatar: string;
  headline: string;
  targetRole: string;
  location: string;
  experienceYears: number;
  primarySkills: string[];
  cvText: string;
  cvFileName?: string;
  lastCvAnalysis?: CVAnalysisResult;
}

export interface AIUsageRecord {
  id: string;
  tool: "CV Analyzer" | "Job Matcher" | "Cover Letter AI" | "Interview AI" | "Skill Gap";
  timestamp: string;
  userId: string;
  userEmail: string;
  tokensUsed: number;
  status: "success" | "cached";
}

export interface AppNotification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
