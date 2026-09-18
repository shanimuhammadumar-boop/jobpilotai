import { Job } from "../types";

export const DEMO_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Full Stack AI Engineer",
    company: "Synthetix Labs",
    logoBg: "bg-indigo-600",
    location: "San Francisco, CA",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "AI / Machine Learning",
    salaryMin: 165000,
    salaryMax: 215000,
    salaryCurrency: "USD",
    description: "Synthetix Labs is building the next-generation workflow orchestration engine powered by LLMs. We are looking for a Senior Full Stack Engineer to lead our client-facing AI agent studio, optimizing streaming interactions and autonomous agent loops.",
    responsibilities: [
      "Architect and ship scalable frontend UI in React, TypeScript, and Tailwind.",
      "Integrate generative AI APIs with streaming Server-Sent Events and WebSocket channels.",
      "Collaborate directly with product and design to iterate on novel AI agent user experiences.",
      "Mentor mid-level engineers and drive technical design reviews."
    ],
    requirements: [
      "5+ years of full-stack TypeScript/Node.js and modern React development.",
      "Hands-on experience with LLM orchestration (Gemini, LangChain, or direct model SDKs).",
      "Solid knowledge of asynchronous event-driven state and distributed systems.",
      "Strong communication and autonomous decision-making skills in a fast-paced environment."
    ],
    skills: ["React", "TypeScript", "Node.js", "Gemini API", "Vector Databases", "Tailwind CSS"],
    benefits: ["Unlimited PTO", "$1,000 WFH Stipend", "Top-tier Health/Dental/Vision", "401(k) 4% match"],
    postedAt: "2 days ago",
    featured: true,
    applicantCount: 42,
    applyUrl: "https://synthetixlabs.example.com/careers/lead-ai"
  },
  {
    id: "job-2",
    title: "Lead Frontend Architect",
    company: "Veloce Cloud",
    logoBg: "bg-blue-600",
    location: "New York, NY",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    experienceLevel: "Lead / Principal",
    category: "Software Engineering",
    salaryMin: 180000,
    salaryMax: 235000,
    salaryCurrency: "USD",
    description: "Join Veloce Cloud to lead frontend architecture across our global edge computing dashboard. You will establish coding standards, performance budgets, design systems, and micro-frontend boundaries.",
    responsibilities: [
      "Own the core web architecture and design system component library.",
      "Profile and optimize Web Vitals for latency-critical dashboard visualizations.",
      "Lead cross-team RFCs on state management and build toolchains."
    ],
    requirements: [
      "7+ years architecting large-scale React or Next.js applications.",
      "Deep mastery of web performance, browser rendering engines, and TypeScript.",
      "Experience with monorepos, micro-frontends, and automated CI/CD pipelines."
    ],
    skills: ["React", "TypeScript", "Vite", "Design Systems", "Web Vitals", "GraphQL"],
    benefits: ["Equity grants", "Flexible work schedule", "Annual learning budget $2,500", "Gym membership"],
    postedAt: "1 day ago",
    featured: true,
    applicantCount: 29
  },
  {
    id: "job-3",
    title: "Senior Machine Learning Engineer",
    company: "NeuralPulse",
    logoBg: "bg-purple-600",
    location: "Austin, TX",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "AI / Machine Learning",
    salaryMin: 170000,
    salaryMax: 220000,
    salaryCurrency: "USD",
    description: "NeuralPulse develops real-time biosignal anomaly detection models. We are seeking a Senior ML Engineer to train, fine-tune, and deploy multimodal transformer models at scale.",
    responsibilities: [
      "Design and fine-tune transformer models for multimodal time-series and tabular data.",
      "Build high-throughput low-latency inference pipelines on Kubernetes with TensorRT.",
      "Implement model monitoring, data drift alarms, and automated retraining pipelines."
    ],
    requirements: [
      "MS or PhD in Computer Science, AI, or equivalent practical experience.",
      "4+ years deploying production ML models using PyTorch, Triton, and Kubeflow.",
      "Solid understanding of attention mechanisms and LoRA fine-tuning."
    ],
    skills: ["Python", "PyTorch", "MLOps", "Kubernetes", "Transformers", "Docker"],
    benefits: ["Remote-first company", "Comprehensive health benefits", "Quarterly team offsites", "Equipment allowance"],
    postedAt: "3 days ago",
    featured: true,
    applicantCount: 37
  },
  {
    id: "job-4",
    title: "Staff Data Engineer",
    company: "OmniMetrics Data",
    logoBg: "bg-emerald-600",
    location: "Seattle, WA",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "Data & Analytics",
    salaryMin: 155000,
    salaryMax: 195000,
    salaryCurrency: "USD",
    description: "OmniMetrics processes over 10 billion events daily for Fortune 500 enterprises. We are looking for an experienced Data Engineer to modernize our real-time streaming pipeline using Snowflake, dbt, and Kafka.",
    responsibilities: [
      "Develop real-time and batch ingestion pipelines handling petabytes of telemetry.",
      "Model clean dimensional data warehouses using dbt and Snowflake.",
      "Enforce data governance, quality contracts, and schema validation."
    ],
    requirements: [
      "5+ years building distributed data pipelines with Python/SQL.",
      "Demonstrated experience with Snowflake, Apache Kafka, and dbt.",
      "Strong understanding of lakehouse architectures and cost optimization."
    ],
    skills: ["Python", "SQL", "Snowflake", "dbt", "Apache Kafka", "Airflow"],
    benefits: ["401(k) matching", "Parental leave 16 weeks", "Relocation assistance", "Commuter benefits"],
    postedAt: "4 days ago",
    applicantCount: 18
  },
  {
    id: "job-5",
    title: "Head of Growth & Performance Marketing",
    company: "HyperScale SaaS",
    logoBg: "bg-rose-600",
    location: "San Francisco, CA",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Lead / Principal",
    category: "Marketing & Growth",
    salaryMin: 140000,
    salaryMax: 185000,
    salaryCurrency: "USD",
    description: "HyperScale SaaS is scaling from $5M to $25M ARR. We need an analytical, hands-on growth marketing leader to oversee paid acquisition, SEO loops, lifecycle marketing, and conversion rate optimization.",
    responsibilities: [
      "Manage a $200k/month paid acquisition budget across Google, LinkedIn, and Meta.",
      "Design data-backed conversion experiments across landing pages and onboarding flows.",
      "Work closely with product to drive product-led growth (PLG) viral loops."
    ],
    requirements: [
      "6+ years in B2B SaaS growth marketing with demonstrable pipeline generation.",
      "Deep expertise in Google Ads, Meta Ads, HubSpot, and Google Analytics 4.",
      "Strong quantitative mindset with comfort in SQL or BI dashboarding."
    ],
    skills: ["Growth Marketing", "B2B SaaS", "Paid Acquisition", "SEO", "HubSpot", "Google Analytics"],
    benefits: ["Competitive equity", "Health stipend", "Remote flexible hours", "Annual bonus"],
    postedAt: "5 days ago",
    applicantCount: 54
  },
  {
    id: "job-6",
    title: "Senior Product Designer (UI/UX)",
    company: "Aura Design Systems",
    logoBg: "bg-violet-600",
    location: "Los Angeles, CA",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "Product & Design",
    salaryMin: 135000,
    salaryMax: 175000,
    salaryCurrency: "USD",
    description: "Aura creates modern creative tools for game developers and 3D artists. We are looking for a Senior Product Designer with obsessive craft, impeccable taste in typography, and a deep understanding of complex workflows.",
    responsibilities: [
      "Design end-to-end user journeys for desktop and browser-based 3D workspace tools.",
      "Maintain and evolve our design tokens and Figma component libraries.",
      "Conduct user interviews, usability tests, and synthesize qualitative feedback."
    ],
    requirements: [
      "4+ years designing high-density SaaS or creative pro software.",
      "Exceptional portfolio showcasing typography, micro-interactions, and spatial design.",
      "Proficiency in Figma, prototyping tools, and basic understanding of CSS/HTML."
    ],
    skills: ["Figma", "UI/UX Design", "Design Systems", "User Research", "Prototyping"],
    benefits: ["$3,000 home studio setup", "Annual design conference trips", "Medical/Dental/Vision", "Unlimited books"],
    postedAt: "Just now",
    featured: true,
    applicantCount: 63
  },
  {
    id: "job-7",
    title: "Customer Support Engineering Lead",
    company: "Helios API",
    logoBg: "bg-amber-600",
    location: "Chicago, IL",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    category: "Customer Support",
    salaryMin: 85000,
    salaryMax: 115000,
    salaryCurrency: "USD",
    description: "Helios API powers financial data connectivity. As our Support Engineering Lead, you will bridge the gap between developer customers and our core engineering teams, debugging API issues and authoring documentation.",
    responsibilities: [
      "Investigate developer bug reports, inspect HTTP webhooks, and isolate network issues.",
      "Write reproducible bug test cases and author SDK technical documentation.",
      "Manage customer ticket escalations and build support automation tools."
    ],
    requirements: [
      "2+ years experience in technical customer support or developer advocacy.",
      "Ability to read and debug REST APIs, JSON payloads, and basic Python/JavaScript.",
      "Empathetic, clear written communication skills."
    ],
    skills: ["Technical Support", "REST APIs", "Debugging", "Zendesk", "JavaScript", "Documentation"],
    benefits: ["100% remote", "Health insurance", "Internet subsidy", "Generous paid time off"],
    postedAt: "6 days ago",
    applicantCount: 31
  },
  {
    id: "job-8",
    title: "Enterprise Account Executive (FinTech)",
    company: "Apex Payments",
    logoBg: "bg-teal-600",
    location: "New York, NY",
    workplaceType: "On-site",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "Sales & BizDev",
    salaryMin: 130000,
    salaryMax: 260000,
    salaryCurrency: "USD",
    description: "Apex Payments provides cross-border treasury settlements. We are looking for a quota-crushing Enterprise Account Executive to close $100k+ ACV contracts with international banking partners.",
    responsibilities: [
      "Own full sales lifecycle from prospecting discovery to multi-stakeholder contract negotiation.",
      "Partner with Solutions Architects to execute technical product proof-of-concepts.",
      "Consistently exceed quarterly revenue quotas."
    ],
    requirements: [
      "5+ years closing enterprise SaaS deals in FinTech or payments.",
      "Proven track record of beating $1M+ annual quotas.",
      "Deep executive relationship management and MEDDPICC qualification mastery."
    ],
    skills: ["Enterprise Sales", "B2B SaaS", "MEDDPICC", "Contract Negotiation", "Salesforce"],
    benefits: ["Uncapped commission", "Presidents Club luxury retreat", "Full executive healthcare", "Transit pass"],
    postedAt: "3 days ago",
    applicantCount: 22
  },
  {
    id: "job-9",
    title: "Senior Financial Analyst & FP&A",
    company: "Quantum Ventures",
    logoBg: "bg-slate-700",
    location: "Boston, MA",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    category: "Finance & Ops",
    salaryMin: 110000,
    salaryMax: 140000,
    salaryCurrency: "USD",
    description: "Quantum Ventures is seeking a sharp Senior Financial Analyst to lead cash flow forecasting, board reporting, cohort margin analysis, and venture capital fund modeling.",
    responsibilities: [
      "Build dynamic 3-statement financial forecasting models and scenario planners.",
      "Prepare monthly investor reporting decks and SaaS unit economics dashboards.",
      "Partner with department leaders to monitor headcount and vendor spend."
    ],
    requirements: [
      "3-5 years of investment banking, private equity, or high-growth tech FP&A experience.",
      "Advanced Excel/Google Sheets financial modeling capabilities.",
      "Knowledge of GAAP, ASC 606 revenue recognition, and SaaS metrics (LTV, CAC, NRR)."
    ],
    skills: ["Financial Modeling", "FP&A", "SaaS Metrics", "Excel", "Data Analysis", "Budgeting"],
    benefits: ["Annual performance bonus", "401(k) matching", "Tuition reimbursement", "Comprehensive healthcare"],
    postedAt: "1 week ago",
    applicantCount: 26
  },
  {
    id: "job-10",
    title: "Junior Frontend Developer",
    company: "Spark Digital",
    logoBg: "bg-cyan-600",
    location: "Denver, CO",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Entry Level",
    category: "Software Engineering",
    salaryMin: 70000,
    salaryMax: 90000,
    salaryCurrency: "USD",
    description: "Spark Digital is looking for an enthusiastic Junior Frontend Developer eager to learn modern React, Tailwind, and component-driven web development alongside senior mentors.",
    responsibilities: [
      "Implement responsive web pages according to Figma specifications.",
      "Write unit tests and ensure cross-browser compatibility.",
      "Participate actively in code reviews, daily standups, and pair programming."
    ],
    requirements: [
      "Solid knowledge of HTML5, CSS3, JavaScript (ES6+), and React basics.",
      "Familiarity with Git version control and GitHub workflows.",
      "Strong curiosity, passion for UI craftsmanship, and problem-solving mindset."
    ],
    skills: ["JavaScript", "React", "HTML5", "CSS3", "Git", "Tailwind CSS"],
    benefits: ["Dedicated senior engineer mentorship", "Home office budget", "Health insurance", "20 days PTO"],
    postedAt: "4 days ago",
    applicantCount: 88
  },
  {
    id: "job-11",
    title: "AI Prompt Engineer & Evaluator",
    company: "CognitiveMatrix",
    logoBg: "bg-fuchsia-600",
    location: "San Jose, CA",
    workplaceType: "Remote",
    jobType: "Contract",
    experienceLevel: "Mid Level",
    category: "AI / Machine Learning",
    salaryMin: 95000,
    salaryMax: 135000,
    salaryCurrency: "USD",
    description: "CognitiveMatrix is testing next-gen reasoning models. We need a creative, rigorous AI Prompt Engineer to develop benchmark test suites, evaluate hallucinations, and optimize prompt system instructions.",
    responsibilities: [
      "Create edge-case benchmark datasets for complex reasoning and factual grounding.",
      "Formulate few-shot prompt templates and test parameter sensitivities.",
      "Automate LLM-as-a-judge evaluation frameworks and synthesize quality reports."
    ],
    requirements: [
      "2+ years experience working directly with frontier LLMs (Gemini, Claude, GPT).",
      "Strong analytical and writing capabilities in English.",
      "Basic Python scripting skills for parsing JSON datasets and running API batch scripts."
    ],
    skills: ["Prompt Engineering", "LLM Evaluation", "Python", "Few-Shot Learning", "Gemini API"],
    benefits: ["Flexible contract hours", "Competitive hourly rate", "Possibility of full-time conversion"],
    postedAt: "2 days ago",
    applicantCount: 45
  },
  {
    id: "job-12",
    title: "Senior DevOps & Cloud Infrastructure Engineer",
    company: "CloudSentinel",
    logoBg: "bg-sky-700",
    location: "Seattle, WA",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "Software Engineering",
    salaryMin: 160000,
    salaryMax: 205000,
    salaryCurrency: "USD",
    description: "CloudSentinel provides continuous cloud compliance. We need a Senior DevOps Engineer to manage our multi-region Kubernetes clusters on Google Cloud and AWS using Terraform.",
    responsibilities: [
      "Maintain infrastructure as code across multi-cloud environments.",
      "Build zero-downtime CI/CD deployment pipelines with GitHub Actions.",
      "Optimize observability stacks (Prometheus, Grafana, OpenTelemetry) and incident response."
    ],
    requirements: [
      "5+ years operating production Kubernetes and cloud infrastructure (GCP/AWS).",
      "Expert knowledge of Terraform, Docker, Helm, and Linux systems administration.",
      "Deep understanding of zero-trust security and SOC 2 compliance."
    ],
    skills: ["Kubernetes", "Terraform", "Google Cloud", "AWS", "CI/CD", "Docker"],
    benefits: ["On-call compensation", "Comprehensive healthcare", "401(k) match", "Annual technology stipend"],
    postedAt: "5 days ago",
    applicantCount: 34
  },
  {
    id: "job-13",
    title: "Content Marketing & SEO Specialist",
    company: "TrendWave Media",
    logoBg: "bg-orange-600",
    location: "Austin, TX",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    category: "Marketing & Growth",
    salaryMin: 75000,
    salaryMax: 98000,
    salaryCurrency: "USD",
    description: "TrendWave Media helps direct-to-consumer brands grow. We are seeking a creative Content Marketer who loves keyword research, high-ranking longform guides, and viral LinkedIn case studies.",
    responsibilities: [
      "Write 3-4 high-value SEO articles, guides, and customer teardowns per week.",
      "Conduct keyword research using Ahrefs and optimize on-page meta structures.",
      "Repurpose articles into engaging newsletters and social media threads."
    ],
    requirements: [
      "3+ years writing for tech or B2B SaaS audiences.",
      "Demonstrated track record of ranking articles in top 3 Google search positions.",
      "Familiarity with CMS platforms (WordPress, Webflow) and basic HTML."
    ],
    skills: ["Content Writing", "SEO", "Ahrefs", "Copywriting", "CMS", "Content Strategy"],
    benefits: ["Flexible schedule", "Full health benefits", "Co-working space pass", "Wellness stipend"],
    postedAt: "1 week ago",
    applicantCount: 52
  },
  {
    id: "job-14",
    title: "Product Operations Manager",
    company: "FleetPath Logistics",
    logoBg: "bg-emerald-700",
    location: "Atlanta, GA",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    category: "Product & Design",
    salaryMin: 95000,
    salaryMax: 125000,
    salaryCurrency: "USD",
    description: "FleetPath coordinates freight for over 50,000 truckers nationwide. As Product Operations Manager, you will streamline launch readiness, feedback loops, and internal tooling.",
    responsibilities: [
      "Coordinate release readiness across Product, Sales, and Operations teams.",
      "Analyze user feedback tickets and summarize feature requests for Product Managers.",
      "Configure internal automation tools and tracking dashboards."
    ],
    requirements: [
      "3+ years in product operations, program management, or business analytics.",
      "Expertise in SQL, Jira, Notion, and Zapier/Make automations.",
      "Superb cross-functional stakeholder management."
    ],
    skills: ["Product Operations", "SQL", "Jira", "Process Optimization", "Agile"],
    benefits: ["Health & dental", "401(k) match", "Generous PTO", "Continuing education stipend"],
    postedAt: "3 days ago",
    applicantCount: 19
  },
  {
    id: "job-15",
    title: "Business Development Representative (BDR)",
    company: "DataShield Security",
    logoBg: "bg-blue-800",
    location: "San Francisco, CA",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    experienceLevel: "Entry Level",
    category: "Sales & BizDev",
    salaryMin: 65000,
    salaryMax: 95000,
    salaryCurrency: "USD",
    description: "Kickstart your tech sales career at DataShield Security! You will generate outbound qualified leads for our enterprise cybersecurity software, booking meetings for Senior Account Executives.",
    responsibilities: [
      "Conduct outbound cold prospecting across email, phone, and LinkedIn.",
      "Qualify prospective enterprise customers against ICP criteria.",
      "Achieve monthly targets for booked demo meetings."
    ],
    requirements: [
      "High energy, resilience, and curiosity about cybersecurity.",
      "Excellent verbal and written communication.",
      "Experience with LinkedIn Sales Navigator or cold outreach is a plus."
    ],
    skills: ["Cold Outreach", "Sales Prospecting", "CRM", "Communication", "Lead Generation"],
    benefits: ["Clear promotion path to Account Executive", "Commission accelerator", "Medical/Dental", "Catered lunches"],
    postedAt: "6 days ago",
    applicantCount: 67
  },
  {
    id: "job-16",
    title: "Senior Data Scientist (Recommender Systems)",
    company: "StreamSphere",
    logoBg: "bg-red-600",
    location: "Los Angeles, CA",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "Data & Analytics",
    salaryMin: 165000,
    salaryMax: 210000,
    salaryCurrency: "USD",
    description: "StreamSphere powers personalized video streaming for 40M subscribers. We are seeking a Senior Data Scientist to architect real-time collaborative filtering and deep learning recommendation models.",
    responsibilities: [
      "Design personalized ranking algorithms that optimize watch time and retention.",
      "Conduct robust A/B testing and Bayesian inference experiments.",
      "Deploy scalable feature stores and embedding search systems."
    ],
    requirements: [
      "4+ years building production recommendation engines or ranking models.",
      "Strong foundations in Python, PyTorch, SQL, and two-tower recommendation architectures.",
      "Demonstrated ability to translate business metrics into ML objective functions."
    ],
    skills: ["Python", "Machine Learning", "Recommendation Systems", "A/B Testing", "PyTorch", "SQL"],
    benefits: ["Streaming subscription reimbursement", "100% remote", "Health/Life insurance", "Equity"],
    postedAt: "4 days ago",
    applicantCount: 39
  },
  {
    id: "job-17",
    title: "Customer Onboarding & Success Manager",
    company: "TeamWork Flow",
    logoBg: "bg-teal-700",
    location: "Dallas, TX",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    category: "Customer Support",
    salaryMin: 80000,
    salaryMax: 105000,
    salaryCurrency: "USD",
    description: "Guide new enterprise clients through their first 90 days on TeamWork Flow's project collaboration platform, ensuring high activation rates, user adoption, and long-term retention.",
    responsibilities: [
      "Lead kickoff calls and customized training webinars for enterprise customer teams.",
      "Monitor health metrics and proactively intervene with at-risk accounts.",
      "Partner with product teams to relay client feature requests."
    ],
    requirements: [
      "3+ years in SaaS Customer Success or Account Management.",
      "Strong presentation skills and high emotional intelligence.",
      "Experience with Gainsight, ChurnZero, or Salesforce."
    ],
    skills: ["Customer Success", "Onboarding", "Client Retention", "Training", "Account Management"],
    benefits: ["Flexible PTO", "Health insurance", "Annual wellness stipend", "Home office budget"],
    postedAt: "1 week ago",
    applicantCount: 44
  },
  {
    id: "job-18",
    title: "Senior Backend Engineer (Go & Microservices)",
    company: "VaultPay FinTech",
    logoBg: "bg-indigo-700",
    location: "Miami, FL",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "Software Engineering",
    salaryMin: 160000,
    salaryMax: 210000,
    salaryCurrency: "USD",
    description: "VaultPay handles ledger transactions for modern banking apps. We are hiring a Senior Backend Engineer to write rock-solid, concurrent Go microservices with strict idempotent guarantees.",
    responsibilities: [
      "Design high-throughput banking ledger microservices in Go.",
      "Optimize PostgreSQL queries, connection pooling, and transactional locks.",
      "Implement gRPC communication protocols and comprehensive integration test suites."
    ],
    requirements: [
      "5+ years backend engineering with 3+ years writing Go in production.",
      "Deep understanding of distributed consensus, ACID compliance, and database indexing.",
      "Experience with Docker, Kubernetes, and Kafka."
    ],
    skills: ["Golang", "PostgreSQL", "Microservices", "Docker", "gRPC", "Distributed Systems"],
    benefits: ["Competitive equity", "Full health coverage", "Flexible vacation", "Annual summit in Miami"],
    postedAt: "Just now",
    featured: true,
    applicantCount: 30
  },
  {
    id: "job-19",
    title: "Director of Enterprise Sales",
    company: "Veritas AI",
    logoBg: "bg-purple-800",
    location: "New York, NY",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    experienceLevel: "Executive",
    category: "Sales & BizDev",
    salaryMin: 210000,
    salaryMax: 350000,
    salaryCurrency: "USD",
    description: "Veritas AI provides enterprise LLM security and safety firewalls. We are hiring a Director of Enterprise Sales to recruit, coach, and scale our regional Account Executive sales team.",
    responsibilities: [
      "Lead and mentor a team of 6-8 Enterprise Account Executives.",
      "Own the $12M annual new bookings revenue target.",
      "Participate directly in key negotiations with Fortune 100 CISOs and CIOs."
    ],
    requirements: [
      "8+ years enterprise SaaS software sales with 3+ years in direct first-line sales leadership.",
      "Demonstrated history of building high-performing sales cultures that hit quota.",
      "Deep network among enterprise security and IT buyers."
    ],
    skills: ["Sales Leadership", "Executive Negotiation", "Enterprise Software", "Revenue Forecasting"],
    benefits: ["Significant executive stock option package", "Luxury executive medical plan", "Global travel allowance"],
    postedAt: "3 days ago",
    applicantCount: 14
  },
  {
    id: "job-20",
    title: "Corporate Controller & Accounting Director",
    company: "Beacon HealthTech",
    logoBg: "bg-emerald-800",
    location: "San Diego, CA",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    experienceLevel: "Executive",
    category: "Finance & Ops",
    salaryMin: 175000,
    salaryMax: 225000,
    salaryCurrency: "USD",
    description: "Beacon HealthTech is preparing for an upcoming Series C and eventual IPO. We are seeking a meticulous Corporate Controller to oversee month-end closes, external audits, and tax compliance.",
    responsibilities: [
      "Manage all accounting operations including Billing, A/R, A/P, GL, and Revenue Recognition.",
      "Coordinate quarterly financial reviews and annual Big 4 audits.",
      "Ensure technical compliance with US GAAP and healthcare regulatory guidelines."
    ],
    requirements: [
      "Active CPA license and 7+ years progressive corporate accounting experience.",
      "Strong knowledge of NetSuite, Stripe Billing, and US GAAP revenue recognition.",
      "Prior experience in healthcare technology or public accounting is strongly preferred."
    ],
    skills: ["US GAAP", "Corporate Accounting", "Financial Audits", "NetSuite", "Tax Compliance"],
    benefits: ["Full health coverage", "401(k) 5% match", "Executive bonus plan", "Relocation assistance"],
    postedAt: "5 days ago",
    applicantCount: 15
  },
  {
    id: "job-21",
    title: "AI Research Scientist (Agentic Workflows)",
    company: "Nexus Autonomy",
    logoBg: "bg-indigo-900",
    location: "San Francisco, CA",
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    category: "AI / Machine Learning",
    salaryMin: 190000,
    salaryMax: 260000,
    salaryCurrency: "USD",
    description: "Nexus Autonomy is pushing the boundaries of multi-agent collaboration and reasoning planning. We seek an AI Research Scientist to experiment with novel tool-calling paradigms and self-correcting agent chains.",
    responsibilities: [
      "Conduct empirical experiments on agent self-reflection, planning, and memory architectures.",
      "Publish findings at top AI conferences (NeurIPS, ICML, ICLR) and translate into production code.",
      "Collaborate with runtime engineers to reduce tool-calling latency."
    ],
    requirements: [
      "PhD or equivalent research publication track record in Machine Learning or NLP.",
      "Extensive experience with transformer architectures and reasoning benchmark evaluation.",
      "Proficient in PyTorch, Python, and modern inference frameworks."
    ],
    skills: ["AI Research", "NLP", "PyTorch", "Multi-Agent Systems", "Python", "Transformers"],
    benefits: ["Top 1% research compute cluster access", "Full conference travel funding", "Comprehensive health", "Equity"],
    postedAt: "Just now",
    featured: true,
    applicantCount: 28
  }
];
