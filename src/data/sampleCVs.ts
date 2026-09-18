export interface SampleCV {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  previewText: string;
  fullText: string;
}

export const SAMPLE_CVS: SampleCV[] = [
  {
    id: "cv-fullstack",
    name: "Alex Morgan",
    role: "Senior Full Stack & AI Engineer",
    experienceYears: 6,
    previewText: "6+ years experience in React, TypeScript, Node.js, and LLM integrations. Scaled SaaS systems to 500k MAU.",
    fullText: `ALEX MORGAN
San Francisco, CA | alex.morgan@example.com | (555) 234-5678 | linkedin.com/in/alexmorgan | github.com/alexmorgan

SUMMARY
Results-driven Senior Full Stack Engineer with 6+ years of experience architecting high-performance cloud applications and production LLM integrations. Specialized in React, TypeScript, Node.js, and event-driven microservices. Proven track record of boosting user engagement by 40% and cutting cloud infrastructure latency by 35%.

CORE SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5/CSS3
- Frontend: React 18, Next.js, Tailwind CSS, Vite, Redux Toolkit, Web Vitals, Responsive Design
- Backend & Cloud: Node.js, Express, REST APIs, GraphQL, PostgreSQL, Redis, Docker, AWS (S3, Lambda, ECS)
- AI & Tooling: Google Gemini API, OpenAI SDK, Vector Embeddings, LangChain, Git, CI/CD (GitHub Actions)

PROFESSIONAL EXPERIENCE
Senior Full Stack Engineer | CloudScale Technologies | 2022 – Present | San Francisco, CA
- Architected the customer dashboard serving 500,000 monthly active users using React 18 and TypeScript, reducing initial page load time by 48%.
- Integrated generative AI assistants using Gemini and vector search, increasing customer self-service resolution rates by 34%.
- Led a pod of 5 engineers, establishing strict code review standards, automated end-to-end testing with Playwright, and bi-weekly architecture RFCs.
- Reduced AWS hosting overhead by $42,000 annually through database query indexing and serverless container right-sizing.

Full Stack Software Engineer | Horizon Fintech | 2019 – 2022 | Austin, TX
- Developed real-time transaction reconciliation microservices in Node.js and PostgreSQL handling $15M daily transaction volume.
- Created reusable UI component system in Tailwind CSS and Storybook adopted across 4 distributed frontend teams.
- Collaborated with compliance teams to satisfy SOC 2 Type II audit requirements and zero-trust security policies.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2015 – 2019
Honors: Dean's Honor List, Magna Cum Laude

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate
- Certified Scrum Master (CSM)`
  },
  {
    id: "cv-marketing",
    name: "Elena Rostova",
    role: "Head of Growth & Digital Marketing",
    experienceYears: 7,
    previewText: "7 years driving B2B SaaS pipeline, paid acquisition ($1.5M budget), SEO, and conversion optimization.",
    fullText: `ELENA ROSTOVA
New York, NY | elena.rostova@example.com | (555) 876-5432 | linkedin.com/in/elenarostova

PROFESSIONAL SUMMARY
Data-driven Head of Growth with 7 years of B2B SaaS experience scaling ARR from $2M to $18M. Expert in multi-channel paid acquisition, search engine optimization (SEO), funnel conversion rate optimization (CRO), and lifecycle email automation.

CORE COMPETENCIES
- Growth Strategy: B2B SaaS Go-To-Market, Product-Led Growth (PLG), CAC/LTV Modeling, Funnel Optimization
- Acquisition Channels: Google Ads (Search/Display), LinkedIn Ads, Meta Ads, Technical SEO, Content Marketing
- Tools & Analytics: Google Analytics 4, HubSpot, Mixpanel, SEMrush, Ahrefs, Webflow, Segment, Salesforce

EXPERIENCE
Head of Growth Marketing | Elevate Cloud SaaS | 2021 – Present | New York, NY
- Managed an annual performance marketing budget of $1.8M across LinkedIn, Google, and retargeting channels, maintaining an average customer acquisition payback period under 8 months.
- Increased organic inbound pipeline by 185% through an authoritative technical SEO strategy, ranking for over 45 high-intent commercial keywords.
- Implemented automated lifecycle nurturing workflows in HubSpot, improving lead-to-MQL conversion rate from 14% to 26%.

Senior Digital Marketing Manager | PulseMetrics | 2018 – 2021 | Boston, MA
- Executed A/B testing on core landing pages, resulting in a 38% increase in free trial signups without increasing ad spend.
- Produced quarterly industry benchmark reports downloaded over 12,000 times, generating 800+ enterprise marketing qualified leads.

EDUCATION
B.A. in Marketing & Communications | Boston University | 2014 – 2018`
  },
  {
    id: "cv-datascientist",
    name: "Marcus Chen",
    role: "Senior Data Scientist & ML Engineer",
    experienceYears: 5,
    previewText: "5 years building production recommendation engines, NLP classifiers, and PyTorch deep learning models.",
    fullText: `MARCUS CHEN
Seattle, WA | marcus.chen@example.com | (555) 432-1098 | linkedin.com/in/marcuschen | github.com/marcuschen

PROFESSIONAL SUMMARY
Senior Data Scientist with 5 years of industry experience deploying machine learning, predictive modeling, and natural language processing systems at scale. Strong background in statistical modeling, recommendation algorithms, and cloud MLOps.

TECHNICAL SKILLS
- Machine Learning: Supervised/Unsupervised Learning, Transformers, NLP, Recommender Systems, A/B Testing
- Languages & Frameworks: Python (PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy), SQL, R
- Infrastructure & MLOps: Docker, Kubernetes, MLflow, AWS SageMaker, Snowflake, Apache Spark, Airflow

WORK EXPERIENCE
Senior Data Scientist | StreamPulse Media | 2022 – Present | Seattle, WA
- Designed and productionized deep learning collaborative filtering recommendation engine that boosted average user watch time by 18%.
- Built an automated model monitoring pipeline in MLflow and Prometheus, catching feature drift 3 weeks before it impacted model accuracy.
- Mentored junior data analysts in causal inference methodologies and statistical test design.

Data Scientist | FinAnalytica | 2020 – 2022 | Chicago, IL
- Developed fraud detection classification models using gradient boosted decision trees (LightGBM) saving over $2.4M in unauthorized charges.
- Created automated ETL pipelines processing 50M daily transactions using Apache Spark and Snowflake.

EDUCATION
M.S. in Data Science | University of Washington | 2018 – 2020
B.S. in Applied Mathematics | University of Illinois Urbana-Champaign | 2014 – 2018`
  }
];
