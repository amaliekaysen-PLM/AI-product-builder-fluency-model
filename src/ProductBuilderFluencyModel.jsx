import { useState, useCallback, useMemo } from "react";
import { ChevronDown, ChevronRight, Target, BookOpen, Wrench, Users, Brain, Zap, Eye, Layers, BarChart3, Lightbulb, ArrowRight, CheckCircle2, Circle, X, Info, Filter, Plus, Trash2, UserPlus, PieChart, Calendar, Headphones, ExternalLink, GraduationCap, ClipboardList } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const STAGES = [
  { id: 1, name: "Ad Hoc", tag: "Unstructured Dabbling", color: "#8494a7", bg: "#eef1f5", orgStage: "—", description: "May chat with ChatGPT or Gemini occasionally, but AI isn't part of real work. No structure, no intent. Below minimum expectation." },
  { id: 2, name: "AI-Enabled", tag: "Individual Adopter", color: "#e8a32e", bg: "#fdf6e8", orgStage: "Stage 1: Scattered", description: "Uses AI tools individually for personal productivity. AI is a helper, not yet a workflow partner." },
  { id: 3, name: "AI-Augmented", tag: "Systematic Builder", color: "#3366cc", bg: "#eaf0fa", orgStage: "Stage 1→2 Transition", description: "AI systematically embedded in daily workflow. Reliable prompts, consistent quality. Can teach others." },
  { id: 4, name: "AI-Amplified", tag: "Product Builder", color: "#1e2a3a", bg: "#e8ecf2", orgStage: "Stage 2: Centralized", description: "Deploys AI agents across discovery and delivery. Leads AI strategy. The PM/UX boundary blurs." },
  { id: 5, name: "AI-Native", tag: "Transformative", color: "#2a7d5f", bg: "#e8f5ef", orgStage: "Stage 3: Platform", description: "Discovery and delivery merge into continuous AI-powered loops. Orchestrates autonomous agents. Defines what great looks like." },
];

const VALUE_STREAMS = [
  { id: "sense", name: "Sense", subtitle: "Discovery & Research", icon: "Eye", description: "Gathering and analyzing customer feedback, usage data, market signals, and user needs to understand problems worth solving." },
  { id: "shape", name: "Shape", subtitle: "Strategy & Prototyping", icon: "Lightbulb", description: "Translating insights into solution concepts, prototyping ideas, and de-risking bets before committing to build." },
  { id: "build", name: "Build", subtitle: "Delivery & Design Systems", icon: "Layers", description: "Defining requirements, creating designs, contributing to design systems, and participating in the delivery process." },
  { id: "optimize", name: "Optimize", subtitle: "Metrics & Learning", icon: "BarChart3", description: "Measuring success, running experiments, using data to continuously improve, and closing the learning loop." },
  { id: "craft", name: "AI Product Craft", subtitle: "Building AI Experiences", icon: "Brain", description: "Conceiving, scoping, designing, and shipping AI-powered and agentic experiences for customers." },
  { id: "ways", name: "Ways of Working", subtitle: "Collaboration & Growth", icon: "Users", description: "Integrating AI into daily workflow, collaborating with the team, and contributing to the community's growth." },
];

const ROLE_COLORS = {
  pm: { bg: "#e0eaf8", text: "#2a4d8f", border: "#7ea6d6", label: "PM" },
  ux: { bg: "#fdf0e0", text: "#8b5e20", border: "#e8c88a", label: "UX" },
  shared: { bg: "#e8ecf2", text: "#1e2a3a", border: "#a0b0c4", label: "Shared" },
};

// ─── RUBRIC DATA (deeply expanded UX content) ────────────────────────────────

const RUBRIC = {
  sense: {
    1: {
      pm: "Reads support tickets one by one. Conducts interviews and synthesizes notes by hand. Relies on gut feel and anecdotal evidence. Might ask ChatGPT a question occasionally but doesn't apply AI to actual research tasks.",
      ux: "Runs usability tests manually — one session at a time, handwritten notes, post-it affinity mapping. Journey maps and personas created from scratch each time. Insight reports take 1–2 weeks. May have tried pasting a transcript into Gemini once, but it's not part of the workflow. Research repository is a messy folder of PDFs nobody revisits.",
      shared: "AI isn't part of discovery. You might dabble with a chatbot for a quick question, but synthesis is slow, manual, and disconnected from any AI tool.",
      signal: "Synthesis of 10+ interviews takes you days. If you've used AI for research, it was a one-off experiment you didn't repeat."
    },
    2: {
      pm: "Uses AI to summarize individual documents, draft interview questions, or search for competitive information. Still does most synthesis and pattern-finding manually.",
      ux: "Uses AI to draft discussion guides, generate initial persona hypotheses, or summarize individual session recordings. May use AI image tools for mood boards or concept inspiration. Pattern-finding across sessions is still manual — you paste one transcript at a time. Affinity mapping is still post-its.",
      shared: "AI helps with isolated tasks but isn't part of the research system. You do the real analysis yourself.",
      signal: "You paste a transcript into Claude occasionally but do the real synthesis work yourself. AI saves you 30 minutes, not days."
    },
    3: {
      pm: "Systematically synthesizes interview transcripts and support tickets at scale. Has built reusable prompt workflows for recurring research tasks. Cross-references AI-identified patterns against raw data. Surfaces quantitative signals from qualitative data.",
      ux: "Uses AI to analyze usability findings across 10+ sessions simultaneously — clustering pain points, severity ratings, and behavioral patterns. Generates data-informed persona updates and journey map revisions from real session data. Automates research tagging and repository organization. Uses AI to identify accessibility issues from session recordings. Can process a full usability study in hours, not weeks.",
      shared: "Can process 20+ inputs in hours. Cross-references AI insights with primary sources. Quality is consistently high and verifiable.",
      signal: "You have go-to prompt workflows for research synthesis. You process a full study in hours. You always verify AI patterns against raw data."
    },
    4: {
      pm: "AI agents monitor customer feedback, competitor moves, and market signals continuously. Insights arrive proactively. PM curates and validates, spending time on judgment. Feedback summaries are automated and routed to stakeholders.",
      ux: "AI agents continuously monitor product experience quality — tracking usability patterns, accessibility regressions, design system adoption gaps, and UX debt accumulation across the product surface. Automated heuristic evaluations flag new issues. AI identifies emerging user mental models from behavioral data. Continuous unmoderated testing runs with AI-analyzed results feeding directly into the insight pipeline.",
      shared: "Insights arrive before you go looking. You spend most research time on strategic interpretation, not data collection. Discovery is semi-autonomous.",
      signal: "You have AI agents monitoring experience quality and feedback. You focus on which problems matter, not on finding them."
    },
    5: {
      pm: "Continuous AI-powered sensing engine. Live data from customer interactions, usage, and market trends feeds structured insight pipelines. 10x shorter cycle to identify opportunities.",
      ux: "Real-time experience intelligence: AI monitors every user touchpoint, detects friction patterns as they emerge, identifies accessibility barriers from live interaction data, and predicts UX issues before they manifest at scale. Research and live-product signals are unified into a single continuous insight stream. The UX researcher role shifts entirely to strategic interpretation and problem framing — the system handles observation and pattern detection.",
      shared: "Discovery runs continuously without manual triggering. Focus entirely on strategic interpretation. The system observes; you decide what matters.",
      signal: "Your discovery process runs itself. You orchestrate what to investigate, not how to investigate it."
    }
  },
  shape: {
    1: {
      pm: "Writes specs and requirements manually. Waits for design and engineering to build prototypes. Ideas validated through lengthy spec-review cycles. May have asked ChatGPT to help phrase something, but AI isn't part of ideation or strategy work.",
      ux: "Creates wireframes and mockups in Figma one concept at a time. Design exploration is linear — sketch → wireframe → mockup → prototype, each step sequential. Ideation relies on whiteboard sessions. May have seen AI design tools demoed but hasn't used them for real work. A concept exploration cycle takes 1–2 weeks minimum.",
      shared: "The shape process hasn't been touched by AI. Any chatbot usage is casual — not connected to how you actually ideate, spec, or prototype.",
      signal: "You haven't used AI to generate a design concept, prototype, or solution alternative for a real project."
    },
    2: {
      pm: "Uses AI to draft PRDs, user stories, competitive analyses. Has tried an AI prototyping tool once or twice. Still relies on traditional handoff to design/engineering.",
      ux: "Uses AI to generate UI copy, explore layout alternatives, create placeholder content, or brainstorm design directions. May use Midjourney/DALL-E for visual inspiration. Has tried AI-assisted wireframing but still primarily works in Figma for all design decisions. Explores maybe 2–3 concepts where previously it was 1–2, but the workflow is still designer-driven end-to-end.",
      shared: "AI helps with content and initial ideation but the design/spec process itself hasn't changed fundamentally.",
      signal: "You use AI for copy and brainstorming but haven't built a functional prototype with AI or explored 5+ design alternatives for a concept."
    },
    3: {
      pm: "Regularly builds functional AI prototypes to validate ideas before engineering commitment. Uses AI to generate multiple solution alternatives and test hypotheses rapidly. Prototype-to-production lead time significantly reduced.",
      ux: "Uses AI to rapidly generate and evaluate 5–10 design concepts where before you'd explore 2–3. Creates interactive prototypes with AI assistance (Claude artifacts, Cursor, v0) that users can actually click through. Uses AI to stress-test designs against edge cases, generate realistic test data, and produce design variations for different user segments. Explores information architecture alternatives with AI. Design sprints compress from 5 days to 1–2 days because concept generation is 10x faster.",
      shared: "You've built 3+ working prototypes with AI. Validate ideas in days, not weeks. Explore 5x more solution space.",
      signal: "You validate ideas with working prototypes before writing the final spec or design. You explore more concepts than ever before."
    },
    4: {
      pm: "Prototyping is daily. AI co-pilots generate, iterate, and test concepts in parallel. Uses synthetic personas for initial validation. De-risks ideas systematically.",
      ux: "AI generates production-fidelity prototypes from sketches, verbal descriptions, or design system tokens. Designs with real data (not Lorem ipsum). Tests with AI-simulated user journeys and synthetic personas before recruiting real participants. Uses AI to generate all responsive breakpoints, dark mode variants, and accessibility alternatives simultaneously. Can run a complete design sprint in a single day — from problem framing through tested prototype.",
      shared: "Multiple experiments per week. AI-generated prototypes look and feel like your actual product. Test before you commit.",
      signal: "The boundary between exploring and building has blurred. Ideas go from insight to testable artifact in hours, not weeks."
    },
    5: {
      pm: "Seamless idea-to-validated-prototype pipeline. AI generates production-ready prototypes from insight summaries. PM focuses entirely on strategic decisions about which bets to make.",
      ux: "AI generates full interaction flows, design system-compliant UIs, motion design, micro-interactions, and accessibility-checked prototypes autonomously from problem descriptions. The designer's role is creative direction, quality curation, and pushing beyond what AI generates — bringing the human insight, emotional intelligence, and aesthetic judgment that elevates good design to great. Design exploration is unbounded; the constraint is judgment, not execution capacity.",
      shared: "10x experiments, 10x faster prototype-to-production. The boundary between prototype and product has dissolved.",
      signal: "You spend time on creative direction and strategic judgment. Execution is handled. You push beyond what AI suggests."
    }
  },
  build: {
    1: {
      pm: "Traditional spec writing, manual handoff to engineering. Specs are static docs that go stale quickly. Engineers regularly ask for clarification. Might use Gemini to rephrase a sentence but AI isn't part of the delivery process.",
      ux: "Designs handed off as static Figma files with redline specs. Design QA is manual pixel-checking. Design system contributions are slow. Responsive behavior described in written notes. Accessibility annotations added as an afterthought. Dev handoff meetings are long because the artifacts don't speak for themselves.",
      shared: "Handoff is a bottleneck. Static documents go stale. Any AI usage is superficial (rephrasing, spell-check level) — not integrated into the build process.",
      signal: "Your specs/designs are static documents. You spend significant time in handoff meetings explaining what you meant."
    },
    2: {
      pm: "Uses AI to improve spec quality — better acceptance criteria, edge case coverage, clearer language. May generate test cases with AI.",
      ux: "Uses AI to generate design documentation, write component specs, create interaction descriptions, and produce accessibility annotations. May use AI to auto-generate responsive design notes from Figma files. Design QA checklist generated by AI. The handoff process is still traditional (Figma → Jira → engineering), but the artifacts are higher quality and more complete.",
      shared: "Output quality improved but the fundamental process — create artifact, hand off, wait — hasn't changed.",
      signal: "Engineers comment that spec/design quality improved. But you're still in the handoff-and-wait cycle."
    },
    3: {
      pm: "Specs include AI-native sections: feasibility assessment, trust/autonomy design, data requirements, monitoring plans. Uses AI to keep documentation in sync with development.",
      ux: "AI assists with design system compliance checking (does this match our Taco components?), automated accessibility audits against WCAG standards, and responsive variation generation. Design documentation auto-generated from Figma files and stays in sync. Contributes to the design system with AI-assisted component documentation, usage guidelines, and pattern libraries. Can generate coded component examples from designs.",
      shared: "Templates include AI-specific sections. Documentation stays current automatically. Feasibility assessed before engineering starts.",
      signal: "Your design system contributions are AI-assisted. Accessibility audits run automatically. Documentation updates itself."
    },
    4: {
      pm: "Drafts specs directly in the development environment using AI coding assistants. Specs are living artifacts aligned with codebase. Can prototype directly in the codebase.",
      ux: "Designs directly in code with AI assistance — shipping UI/UX improvements without waiting for engineering handoff. Uses Cursor or similar tools to implement design changes in the actual codebase. Design system contributions go from Figma concept to coded, documented, tested component with AI acceleration. Can fix visual bugs, adjust spacing, update typography, and refine interactions directly. Design QA happens in the browser, not in Figma vs. screenshot comparisons.",
      shared: "The handoff gap between product, design, and engineering has narrowed dramatically. Everyone builds. Everyone ships.",
      signal: "You work in the codebase alongside engineers. Your contributions go to production. Handoff meetings are rare."
    },
    5: {
      pm: "Discovery and delivery are continuous. PRDs feed into agentic build workflows. PM sets intent and constraints; AI agents execute, test, and review.",
      ux: "AI agents implement design decisions at scale — generating responsive layouts, running accessibility checks, maintaining design system coherence, and producing polished UI from design tokens and intent descriptions. The designer defines the creative direction, quality bar, and experience principles; AI agents handle the implementation, variation generation, and compliance checking. Design system evolution is semi-autonomous — the system proposes component updates based on usage patterns and design drift detection.",
      shared: "You set direction and guardrails; AI agents execute. Review and steer rather than specify every detail. 10x shipping velocity.",
      signal: "Shipping speed has fundamentally changed. You orchestrate outcomes; AI handles the making."
    }
  },
  optimize: {
    1: {
      pm: "Depends on analysts for all data questions. Reviews dashboards passively. Limited experimentation. Ships features and hopes they work. Hasn't thought to use AI for data interpretation.",
      ux: "Reviews usability test results reactively after someone runs a study. No systematic tracking of UX metrics (task completion, error rates, SUS scores). Design decisions based on intuition and stakeholder opinions. Accessibility audits happen only when compliance requires it. Doesn't know if the last design change actually improved anything.",
      shared: "You check metrics after launch, not during development. A/B testing feels like a big production. AI hasn't entered your optimization workflow.",
      signal: "You don't know the task completion rate for your last feature. You haven't tried asking AI to help interpret a metric or find a pattern."
    },
    2: {
      pm: "Uses AI to generate basic data queries or interpret dashboard results. Experimentation still ad-hoc and infrequent.",
      ux: "Uses AI to summarize usability test findings and generate initial heuristic evaluations. Can ask basic questions about UX metrics. May use AI to analyze a few session recordings. Still relies on dedicated researchers for deep analysis. Has looked at analytics but doesn't regularly self-serve on UX data.",
      shared: "You can ask AI to help interpret a metric trend. Still rely on specialists for most data and research work.",
      signal: "You've tried AI for data/research questions a few times but it's not habitual. You still wait for someone else to run the study."
    },
    3: {
      pm: "Independently queries product data using AI. Sets up and monitors experiments with AI assistance. AI surfaces anomalies and generates hypotheses from usage data.",
      ux: "Uses AI to analyze heatmaps, session recordings, and interaction patterns at scale — processing hundreds of sessions to identify usability patterns. Runs automated heuristic evaluations against Nielsen's heuristics and WCAG guidelines. Self-serves on UX metrics: task completion, error rates, time-on-task, SUS scores. Sets up A/B tests for design variants. Uses AI to identify accessibility issues from real usage data, not just audits.",
      shared: "Answer your own data questions in minutes. Run experiments regularly. AI spots patterns you'd miss manually.",
      signal: "You know your UX metrics cold. You run design experiments regularly. AI helps you find usability issues at scale."
    },
    4: {
      pm: "AI-driven experimentation is standard. AI analyzes live product data, surfaces actionable insights proactively. Insights feed directly back into discovery.",
      ux: "AI continuously monitors experience quality across every touchpoint — tracking UX degradation, accessibility regressions, design system drift, and interaction pattern changes. Surfaces UX debt proactively ('users are increasingly failing on this flow'). Runs continuous unmoderated benchmarking. AI generates design improvement hypotheses from behavioral data. A/B tests design variants automatically and reports confidence levels.",
      shared: "AI surfaces insights proactively — you don't always have to go looking. Experiment velocity has increased significantly.",
      signal: "AI tells you when experience quality drops before users complain. Your optimization loop is continuous, not quarterly."
    },
    5: {
      pm: "Fully AI-powered optimization loop. AI continuously analyzes usage, runs micro-experiments, surfaces recommendations. PM decides strategic priorities.",
      ux: "AI autonomously optimizes micro-interactions, copy, layout density, and progressive disclosure based on live user behavior — within designer-defined guardrails and quality standards. Continuous accessibility monitoring ensures WCAG compliance in real-time. AI detects when design patterns no longer serve users and proposes alternatives with supporting evidence. The designer defines the experience principles and quality bar; the system handles measurement, detection, and incremental optimization.",
      shared: "Optimization runs continuously. AI recommends what to improve based on evidence. You decide what matters; the system measures everything else.",
      signal: "Experience optimization runs itself within your guardrails. You set the quality bar; AI maintains and raises it."
    }
  },
  craft: {
    1: {
      pm: "May use ChatGPT or Gemini for personal tasks, but no working understanding of AI capabilities in a product context. Cannot assess whether AI is appropriate for a use case. Treats AI as a black box. Defers entirely to engineering.",
      ux: "May have tried AI chatbots personally, but no understanding of AI interaction patterns or how to design for probabilistic systems. Designs AI features like deterministic features — no consideration for confidence levels, fallback states, or progressive trust. Doesn't know the difference between a rule-based system and an LLM.",
      shared: "Personal chatbot use doesn't translate to product craft. When someone says 'add AI to this,' neither the PM nor the designer can evaluate whether it makes sense or how it should work.",
      signal: "You use ChatGPT or Gemini personally, but can't articulate how an LLM differs from traditional software or why AI features need different design patterns."
    },
    2: {
      pm: "Basic understanding of LLM capabilities and limitations. Can identify potential AI use cases but struggles to scope them. Relies heavily on engineering for feasibility.",
      ux: "Understands basic AI interaction patterns: autocomplete, suggestions, chat interfaces, summarization UIs. Can sketch AI features but lacks confidence in edge cases (what happens when the AI is wrong? how confident should the UI appear?). Knows that AI needs different UX than deterministic features but isn't sure of the specific patterns. Has studied examples from other products (ChatGPT, Copilot, Notion AI) but hasn't designed an AI experience from scratch.",
      shared: "You know the basics but rely heavily on specialists to assess feasibility, define edge cases, and design the full experience.",
      signal: "You can name 3 good and 3 bad AI interaction patterns. You've studied other AI products but haven't shipped your own."
    },
    3: {
      pm: "Confidently evaluates AI feasibility for e-conomic's domain. Defines trust levels, guardrails, HITL patterns, and AI-specific success metrics. Manages the full AI feature lifecycle.",
      ux: "Designs complete AI experiences with confidence: trust/autonomy spectrums (AI suggests → AI acts with confirmation → AI acts autonomously), progressive disclosure of AI capability, transparent confidence indicators, meaningful error states and fallbacks, and human override mechanisms. Owns the AI UX pattern library for the team. Can design for the spectrum from 'AI drafts, human edits' to 'AI acts, human monitors.' Understands how to build trust incrementally in financial/accounting contexts where errors have real consequences. Designs feedback mechanisms (thumbs up/down, corrections, escalation) that improve the AI over time.",
      shared: "Can scope an AI feature end-to-end — including UX patterns, trust model, error handling, and success metrics. Owns the result post-launch.",
      signal: "You've shipped AI features with clear trust models and guardrails. You can design the full experience without help."
    },
    4: {
      pm: "Designs sophisticated agentic products with multi-step AI workflows, autonomy levels, and progressive trust for financial data. Leads AI product strategy for their area.",
      ux: "Designs agentic experiences where AI acts on behalf of accountants and bookkeepers — multi-step workflows with appropriate checkpoints, audit trails, and transparency about what the agent did and why. Creates trust frameworks specific to financial contexts (where a wrong automated bank reconciliation has real consequences). Designs the 'autonomy ramp' — how users gradually grant more autonomy as they build confidence. Pioneers new interaction patterns: AI-initiated actions, proactive suggestions, ambient intelligence, and multi-modal experiences. Defines the AI UX standards and design patterns for the organization.",
      shared: "You've designed and shipped agentic features. You define AI experience strategy for your area. Others seek your guidance.",
      signal: "You're the go-to person for AI experience design. You've designed multi-step agentic flows with real trust models."
    },
    5: {
      pm: "Leading new ways of building product. Designs autonomous systems within guardrails. Pushes frontiers of AI-powered accounting/financial software. Defines best practices for the org.",
      ux: "Pioneers entirely new interaction paradigms for AI-native financial products — experiences that couldn't exist without AI. Designs for a world where the accounting software anticipates needs, acts proactively, and learns from every interaction. Creates the design language for autonomous financial agents: how they communicate intent, request permission, report results, and escalate uncertainty. Defines the ethical design framework for AI autonomy in financial contexts. Work influences how the industry thinks about AI UX in fintech.",
      shared: "You're redefining what financial software can be. Your work influences how the industry thinks about AI product design.",
      signal: "You're designing experiences that didn't exist before. You define the playbook others follow."
    }
  },
  ways: {
    1: {
      pm: "May use ChatGPT, Claude, or Gemini for the occasional personal question, but no AI in the actual PM workflow. Uses only traditional tools and processes for real work. May be skeptical or curious but hasn't acted on it.",
      ux: "Design process unchanged from 2–3 years ago. Uses Figma, Miro, and traditional tools exclusively. May have tried an AI chatbot for a personal task or seen a demo, but hasn't applied AI to any design activity. May view AI as a threat to design craft rather than an enabler.",
      shared: "Your real workflow hasn't changed. Any AI use is casual and personal — not connected to how you do your job. The gap between dabbling and working with AI is the gap this model is designed to close.",
      signal: "If asked 'how has AI changed your work?', the honest answer is 'it hasn't, really.' You've dabbled, but nothing stuck."
    },
    2: {
      pm: "Uses AI assistants for individual tasks — drafting, research, stakeholder comms. Attends AI learning sessions. Starting to share what works with peers.",
      ux: "Uses AI for isolated design tasks: generating UI copy, creating image assets, brainstorming color palettes, writing documentation. Attends AI demos and has tried several AI tools. Curious and actively experimenting but hasn't changed the core design process. Shares interesting AI finds in Slack. Starting to see where AI could help but hasn't built habits yet.",
      shared: "AI is a side tool you use a few times a week. It saves time on individual tasks but hasn't changed how you work fundamentally.",
      signal: "You use Claude a few times a week. You've shared a useful prompt or tool find with the team."
    },
    3: {
      pm: "AI embedded in daily workflow — comms, analysis, planning, stakeholder updates. Contributes to prompt library. Presents at AI Friday. Coaches peers. Visible productivity improvement.",
      ux: "AI integrated into the entire design process: research synthesis, ideation, concept generation, documentation, design review prep, and presentation creation. Has built personal AI workflows for recurring design tasks (e.g., 'analyze this usability study', 'generate component documentation', 'prepare design review summary'). Shares AI-design techniques at AI Friday. Mentors other designers. Contributes AI-generated design tools and templates to the shared library. Colleagues notice the speed and breadth of design exploration.",
      shared: "Colleagues notice your productivity. You've contributed 5+ prompts/workflows to shared resources. You've helped at least one peer level up.",
      signal: "People ask 'how did you do that so fast?' AI has visibly changed your output quality and speed."
    },
    4: {
      pm: "Built personal AI automation workflows for recurring tasks. Leads workshops and training sessions. Shapes team AI practices and standards. Champions AI-first approaches.",
      ux: "Built AI-assisted design workflows that others adopt — templates, prompt chains, evaluation frameworks. Leads design+AI workshops showing how AI changes the design process (not just individual tasks). Defines AI-UX standards and contributes to the design system's AI component patterns. Cross-functional AI design leadership — engineers and PMs seek your input on AI experience questions. Actively challenges traditional design processes when AI offers a better path.",
      shared: "You've automated repetitive tasks with AI agents. You lead training sessions. Engineering and design see you as a strong AI partner.",
      signal: "You actively challenge 'we've always done it this way.' Others follow your lead on AI-first approaches."
    },
    5: {
      pm: "AI is invisible infrastructure — it's just how work gets done. Champions AI-first ways of working across the org. Defines what great AI-augmented PM work looks like.",
      ux: "AI is seamlessly woven into every design activity — it's invisible, like electricity. Pioneers new design workflows that didn't exist before AI. Teaches beyond the design team — influences how the whole product org works. Contributes to the design profession's understanding of AI-era practice through talks, writing, or open-source contributions. New designers learn by observing your process. The distinction between 'designing' and 'designing with AI' has disappeared.",
      shared: "People don't describe you as 'using AI' — it's just how you work. You influence practices beyond your team. New people learn by watching you.",
      signal: "When someone asks 'do you use AI?', the question feels odd — like asking 'do you use the internet?' It's just part of everything."
    }
  }
};

// ─── TOOLS DATA ──────────────────────────────────────────────────────────────

const TOOLS = {
  sense: [
    { name: "Claude / ChatGPT / Gemini", use: "Research synthesis, interview analysis, pattern extraction, competitive intelligence", stages: [2,3,4,5], roles: ["pm","ux"] },
    { name: "Dovetail / Condens", use: "AI-powered qualitative research repository — auto-tagging, theme detection, insight clustering", stages: [3,4,5], roles: ["ux"] },
    { name: "EcoAI", use: "Internal e-conomic AI tool for domain-specific insights and analysis", stages: [2,3,4,5], roles: ["pm","ux"] },
    { name: "Pendo / Amplitude", use: "AI-powered product analytics — behavioral segmentation, anomaly detection, funnel analysis", stages: [3,4,5], roles: ["pm"] },
    { name: "Hotjar / FullStory AI", use: "AI-analyzed session recordings, heatmaps, frustration detection, UX metric tracking", stages: [3,4,5], roles: ["ux"] },
    { name: "Maze / UserTesting AI", use: "Unmoderated testing with AI analysis — task completion, click paths, sentiment", stages: [3,4,5], roles: ["ux"] },
    { name: "Cowork Agents", use: "Automated feedback monitoring, insight routing, continuous discovery pipelines", stages: [4,5], roles: ["pm","ux"] },
  ],
  shape: [
    { name: "Claude Artifacts / v0", use: "Rapid interactive prototyping from verbal descriptions — working UIs in minutes", stages: [2,3,4,5], roles: ["pm","ux"] },
    { name: "Cursor / Bolt / Lovable", use: "AI-assisted code prototyping — from concept to clickable prototype", stages: [3,4,5], roles: ["pm","ux"] },
    { name: "Figma AI / Magician", use: "AI-assisted design exploration — layout generation, copy, icon search, image generation", stages: [2,3,4,5], roles: ["ux"] },
    { name: "Claude / Gemini for specs", use: "PRD drafting, user story generation, edge case analysis, strategy frameworks", stages: [2,3,4,5], roles: ["pm"] },
    { name: "Relume / Galileo AI", use: "AI wireframe and sitemap generation from descriptions", stages: [3,4,5], roles: ["ux"] },
    { name: "Synthetic user testing", use: "AI-simulated user sessions for early validation before recruiting real participants", stages: [4,5], roles: ["pm","ux"] },
  ],
  build: [
    { name: "Cursor", use: "AI-assisted development — designers and PMs building in the codebase", stages: [3,4,5], roles: ["pm","ux"] },
    { name: "Claude / Gemini for specs", use: "Living spec generation, acceptance criteria, AI feasibility sections, edge cases", stages: [2,3,4,5], roles: ["pm"] },
    { name: "Figma Dev Mode + AI", use: "Auto design-to-dev specs, component documentation, responsive annotations", stages: [3,4,5], roles: ["ux"] },
    { name: "Storybook + AI", use: "Component documentation, visual regression testing, accessibility checks", stages: [3,4,5], roles: ["ux"] },
    { name: "axe / Stark AI", use: "Automated accessibility auditing integrated into design and development workflow", stages: [3,4,5], roles: ["ux"] },
    { name: "GitHub Copilot", use: "AI pair programming for prototypes, design system contributions, and direct code contributions", stages: [4,5], roles: ["pm","ux"] },
  ],
  optimize: [
    { name: "AI-powered analytics", use: "Natural language data querying, anomaly detection, automated dashboards", stages: [2,3,4,5], roles: ["pm"] },
    { name: "Hotjar / FullStory AI", use: "AI-analyzed session recordings, heatmaps, UX metrics, frustration signals", stages: [3,4,5], roles: ["ux"] },
    { name: "Claude / Gemini for analysis", use: "Metric interpretation, hypothesis generation, experiment design, reporting", stages: [2,3,4,5], roles: ["pm","ux"] },
    { name: "Maze / Optimal Workshop", use: "Continuous UX benchmarking, tree testing, card sorting with AI analysis", stages: [3,4,5], roles: ["ux"] },
    { name: "Experimentation platforms", use: "AI-assisted A/B testing, statistical analysis, micro-experiments", stages: [3,4,5], roles: ["pm","ux"] },
    { name: "AI observability tools", use: "Monitor AI feature performance — accuracy, latency, trust signals, cost", stages: [4,5], roles: ["pm"] },
  ],
  craft: [
    { name: "LLM Playgrounds", use: "Test prompts, compare models, measure quality before production", stages: [3,4,5], roles: ["pm","ux"] },
    { name: "Anthropic Console", use: "Prompt engineering, evaluation, and iteration for AI features", stages: [3,4,5], roles: ["pm"] },
    { name: "AI UX pattern libraries", use: "Reference patterns for trust, autonomy, confidence, transparency, error states", stages: [3,4,5], roles: ["ux"] },
    { name: "Feature flags (LaunchDarkly)", use: "Progressive rollout, A/B test AI vs non-AI, gradual autonomy ramp", stages: [3,4,5], roles: ["pm","ux"] },
    { name: "Responsible AI toolkit", use: "Bias assessment, hallucination risk framework, privacy impact, transparency audit", stages: [4,5], roles: ["pm","ux"] },
  ],
  ways: [
    { name: "Claude / Gemini / ChatGPT", use: "Daily AI assistant — specs, designs, research, analysis, communication", stages: [2,3,4,5], roles: ["pm","ux"] },
    { name: "Cowork", use: "Multi-step workflow automation for recurring PM and design tasks", stages: [3,4,5], roles: ["pm","ux"] },
    { name: "Shared Prompt Library (Slite)", use: "Curated, tested prompts for common PM and UX tasks — research, specs, design docs", stages: [3,4,5], roles: ["pm","ux"] },
    { name: "AI Friday Demos", use: "Weekly knowledge sharing — present an AI use case, what worked, what didn't", stages: [2,3,4,5], roles: ["pm","ux"] },
    { name: "Maven / Product School", use: "AI PM Bootcamp, Agent Certification, AIPC — structured external learning", stages: [2,3,4,5], roles: ["pm"] },
    { name: "IxDF / NNg AI courses", use: "Interaction Design Foundation and Nielsen Norman Group AI-specific UX courses", stages: [2,3,4,5], roles: ["ux"] },
  ],
};

// ─── TRANSITION DATA ─────────────────────────────────────────────────────────

const TRANSITIONS = [
  {
    from: 1, to: 2, title: "From Dabbling to Daily Use", timeline: "4–6 weeks",
    actions: [
      { action: "Set up your AI toolkit properly", detail: "Get Claude Pro access. Set up Gemini. Make AI your default starting point — before Google, before a blank doc or canvas. Move from casual chatting to intentional work use.", role: "shared" },
      { action: "Complete the foundation workshop", detail: "Prompt engineering for your role. PMs: practice with specs, research synthesis, stakeholder updates. UX: practice with research plans, design documentation, usability finding summaries.", role: "shared" },
      { action: "Build a daily habit", detail: "Use AI for at least one task every workday for 4 weeks. Track what you used it for in a simple log. Share one highlight per week.", role: "shared" },
      { action: "AI product sense 101", detail: "Half-day workshop: what AI can and can't do, how LLMs work (conceptually), why AI features need different UX patterns. Everyone should attend.", role: "shared" },
      { action: "Study 5 AI products deeply (UX)", detail: "Analyze the UX of 5 AI products (ChatGPT, Copilot, Notion AI, Linear AI, Perplexity). Document: how do they handle uncertainty? How do they build trust? What patterns do they share?", role: "ux" },
    ]
  },
  {
    from: 2, to: 3, title: "From Helper to Workflow Partner", timeline: "2–3 months",
    actions: [
      { action: "Build reusable prompt workflows", detail: "For your top 5 recurring tasks, create tested, reusable prompts. PMs: PRDs, user stories, data queries. UX: research synthesis, design docs, heuristic evaluations. Contribute to the shared library.", role: "shared" },
      { action: "Complete the prototyping bootcamp", detail: "PMs: build functional prototypes with Cursor/Claude. UX: integrate AI into design exploration — generate and test 5x more concepts per sprint. Everyone builds a working prototype for a real product idea.", role: "shared" },
      { action: "Systematize research synthesis", detail: "Process 10+ inputs at once with AI. PMs: support tickets, interview transcripts. UX: usability sessions, behavioral data. Cross-reference against raw data. Document your workflow.", role: "shared" },
      { action: "Build the AI UX pattern library (UX)", detail: "Document AI interaction patterns for e-conomic: confidence indicators, trust progression, error states, human override, feedback mechanisms. Create reusable Figma components for AI-specific UI patterns.", role: "ux" },
      { action: "Complete AI opportunity audit", detail: "Review your product area — identify 2–3 problems where AI unlocks a step-change. PMs: assess feasibility. UX: sketch the experience. Present together.", role: "shared" },
    ]
  },
  {
    from: 3, to: 4, title: "From Practitioner to Product Builder", timeline: "3–6 months",
    actions: [
      { action: "Build AI agent workflows", detail: "Automate 2+ recurring tasks with multi-step AI workflows. PMs: feedback → insight → summary. UX: usability monitoring → issue detection → design recommendation.", role: "shared" },
      { action: "Ship an AI-powered feature together", detail: "PM + UX own the full lifecycle jointly: feasibility → trust design → UX patterns → metrics → build → launch → monitoring. This is the convergence in action.", role: "shared" },
      { action: "Agentic product design training", detail: "Advanced workshop on designing multi-step AI agents for financial workflows: autonomy ramps, audit trails, trust boundaries, and when to require human confirmation.", role: "shared" },
      { action: "Lead and teach", detail: "Lead a workshop or training session. Mentor 2+ peers. UX: define AI-UX standards for the design system. PM: contribute AI feature design patterns to the knowledge base.", role: "shared" },
      { action: "Build in the codebase", detail: "PMs: prototype in Cursor alongside engineers. UX: ship design improvements directly in code with AI assistance. Both: blur the handoff boundary.", role: "shared" },
    ]
  },
  {
    from: 4, to: 5, title: "Redefine How Work Happens", timeline: "6–12 months",
    actions: [
      { action: "Build continuous discovery loops", detail: "Architect an always-on system where AI agents monitor feedback, usage, and market signals. UX: continuous experience quality monitoring across all touchpoints.", role: "shared" },
      { action: "Dissolve the discovery/delivery boundary", detail: "Insights → prototypes → production → data → insights in one continuous flow. No handoffs between PM and UX. No phases. One team, one loop.", role: "shared" },
      { action: "Design autonomous AI systems", detail: "Ship features where AI acts autonomously within guardrails. Define trust boundaries for financial workflows. UX: design the autonomy ramp and transparency model.", role: "shared" },
      { action: "Define the playbook for others", detail: "Codify approaches into frameworks. PM: AI product playbook. UX: AI experience design guidelines. Together: the Product Builder operating model for e-conomic and Visma.", role: "shared" },
    ]
  },
];

// ─── LEARNING RESOURCES ──────────────────────────────────────────────────────

const LEARNING = [
  { name: "Marily Nika — AI PM Bootcamp (Maven)", stages: [2,3], roles: ["pm"], type: "Course" },
  { name: "Product School — AIPC Certification", stages: [2,3], roles: ["pm"], type: "Certification" },
  { name: "Interaction Design Foundation — AI & UX Design", stages: [2,3], roles: ["ux"], type: "Course" },
  { name: "Nielsen Norman Group — AI UX Guidelines & Training", stages: [2,3,4], roles: ["ux"], type: "Guidelines" },
  { name: "SVPG — Empowered Product Teams & Transformed", stages: [3,4], roles: ["pm","ux"], type: "Framework" },
  { name: "SVPG — Build to Learn vs Build to Earn", stages: [3,4,5], roles: ["pm","ux"], type: "Article" },
  { name: "Lenny Rachitsky — AI-Native PM Newsletter", stages: [3,4], roles: ["pm"], type: "Newsletter" },
  { name: "Andrew Ng — AI for Everyone (Coursera)", stages: [1,2], roles: ["pm","ux"], type: "Course" },
  { name: "DeepLearning.AI — AI Product Management Specialization", stages: [3,4], roles: ["pm"], type: "Course" },
  { name: "Marily Nika — Agent Certification (Maven)", stages: [4,5], roles: ["pm","ux"], type: "Certification" },
  { name: "Vitaly Friedman — Smart Interface Design Patterns", stages: [3,4], roles: ["ux"], type: "Workshop" },
  { name: "Luke Wroblewski — AI Product Design Patterns", stages: [3,4], roles: ["ux"], type: "Research" },
  { name: "Google PAIR — People + AI Guidebook", stages: [3,4], roles: ["ux"], type: "Guidelines" },
  { name: "Microsoft HAX Toolkit — Human-AI Interaction", stages: [3,4,5], roles: ["ux"], type: "Toolkit" },
];

// ─── EXPANDED LEARNING RESOURCES ─────────────────────────────────────────────

const LEARNING_EXPANDED = {
  courses: [
    { name: "Claude Code for Product Managers", url: "https://ccforpms.com/", free: true, stages: [2,3,4], roles: ["pm","ux"], hours: "10–12h", description: "Hands-on free course taught inside Claude Code itself. Learn to process research, write PRDs, analyze data, and build with AI agents. Essential for anyone wanting to prototype with AI." },
    { name: "AI for Everyone — Andrew Ng (Coursera)", url: "https://coursera.org/learn/ai-for-everyone", free: true, stages: [1,2], roles: ["pm","ux"], hours: "6h", description: "Non-technical foundation. What AI can and can't do, how to spot AI opportunities, and how to work with AI teams. Great starting point for skeptics." },
    { name: "AI Product Management Specialization — Duke (Coursera)", url: "https://coursera.org/specializations/ai-product-management-duke", free: true, stages: [2,3], roles: ["pm"], hours: "20h", description: "Free to audit. Covers managing ML product development, data strategy, and AI product lifecycle. No coding required." },
    { name: "IBM AI Product Manager Certificate (Coursera)", url: "https://coursera.org/professional-certificates/ibm-ai-product-manager", free: true, stages: [2,3], roles: ["pm"], hours: "15h", description: "Free to audit. Practical AI product management: scoping AI features, data requirements, responsible AI practices." },
    { name: "GenAI for UX Designers (Coursera)", url: "https://coursera.org/learn/genai-for-ux-designers", free: true, stages: [2,3], roles: ["ux"], hours: "8h", description: "Free to audit. How GenAI applies to UX research, design, and testing workflows. Practical exercises." },
    { name: "AI Powered UI/UX Design Specialization (Coursera)", url: "https://coursera.org/specializations/ai-powered-ui-ux-design", free: true, stages: [2,3,4], roles: ["ux"], hours: "20h", description: "Free to audit. Integrating AI tools into the full UX design process from research through prototyping." },
    { name: "Uxcel — AI for UX (3 courses)", url: "https://uxcel.com", free: true, stages: [2,3], roles: ["ux"], hours: "6h", description: "Free interactive courses: AI Prompts Foundations, Enhancing UX Workflow with AI, Human-Centered AI. Bite-sized, practical." },
    { name: "Google PAIR — People + AI Guidebook", url: "https://pair.withgoogle.com/guidebook/", free: true, stages: [3,4], roles: ["pm","ux"], hours: "4h", description: "Free guidebook with exercises. How to design human-centered AI products: user needs, mental models, errors, feedback, and explainability." },
    { name: "Microsoft HAX Toolkit", url: "https://microsoft.com/en-us/haxtoolkit/", free: true, stages: [3,4], roles: ["ux"], hours: "3h", description: "Free toolkit. 18 research-validated guidelines for human-AI interaction. Includes workbook and playbook for failure scenarios." },
    { name: "Marily Nika — AI PM Bootcamp (Maven)", url: "https://maven.com", free: false, stages: [3,4], roles: ["pm"], hours: "25h", description: "Cohort-based. The gold standard for AI PM training. Building AI products, evaluating models, measuring success." },
    { name: "Marily Nika — Agent Certification (Maven)", url: "https://maven.com", free: false, stages: [4,5], roles: ["pm","ux"], hours: "20h", description: "Advanced cohort-based course on designing and building agentic AI products." },
  ],
  podcasts: [
    { name: "Lenny's Podcast", url: "https://lennyspodcast.com", roles: ["pm","ux"], description: "Top product podcast. Frequent AI episodes with product leaders from OpenAI, Anthropic, and top companies on building AI products." },
    { name: "The Cognitive Revolution", url: "https://cognitiverevolution.ai", roles: ["pm","ux"], description: "Deep dives into AI capabilities and applications. Great for building technical intuition without being too technical." },
    { name: "a16z Podcast", url: "https://a16z.com/podcast", roles: ["pm"], description: "Venture perspective on AI trends, infrastructure, and where the market is headed. Strategic context." },
    { name: "High Resolution", url: "https://highresolution.design", roles: ["ux"], description: "Bobby Ghoshal's podcast on design leadership. Increasing AI + design content. UX-specific perspective." },
    { name: "The Full Stack PM", url: "https://fullstackpm.com", roles: ["pm"], description: "Carl Vellotti's newsletter/community for PM builders. Pairs well with the CC for PMs course." },
    { name: "Nik Suchak's AI Design Podcast", url: "https://nikitisza.substack.com", roles: ["ux"], description: "AI UX design patterns, case studies, and practical guidance for designers working on AI products." },
  ],
  reads: [
    { name: "SVPG — Build to Learn vs Build to Earn", url: "https://svpg.com/build-to-learn-vs-build-to-earn/", roles: ["pm","ux"], description: "Marty Cagan on why the future of product is rapid prototyping with AI, not lengthy specs." },
    { name: "Niki Tisza — AI UX Design Patterns", url: "https://nikitisza.substack.com/p/ai-ux-design-patterns", roles: ["ux"], description: "Comprehensive breakdown of interaction patterns for AI products. Essential reference for designers." },
    { name: "Lenny Rachitsky — How AI Will Impact PM", url: "https://lennysnewsletter.com", roles: ["pm"], description: "How AI changes what PMs do and which skills to double down on." },
    { name: "Anthropic — Building Effective AI Agents", url: "https://docs.anthropic.com", roles: ["pm","ux"], description: "Practical guide from Anthropic on designing and building AI agents. Technical but accessible." },
  ]
};

// ─── INDIVIDUAL GOALS PER STAGE ──────────────────────────────────────────────

const INDIVIDUAL_GOALS = {
  1: {
    title: "Get from Ad Hoc to AI-Enabled in 4–6 weeks",
    goals: [
      { goal: "Use AI for 1 real work task every workday for 30 days (not just casual chatting)", metric: "30-day streak logged with specific work tasks", roles: ["pm","ux"] },
      { goal: "Complete 1 foundation course (AI for Everyone or GenAI for UX Designers)", metric: "Course certificate or completion", roles: ["pm","ux"] },
      { goal: "Share 1 AI win with the team per week", metric: "4+ Slack posts or AI Friday mentions", roles: ["pm","ux"] },
      { goal: "Can articulate 3 things AI is good at and 3 where it fails for e-conomic", metric: "Written in self-assessment", roles: ["pm","ux"] },
    ]
  },
  2: {
    title: "Get to AI-Augmented in 2–3 months",
    goals: [
      { goal: "Build 5 reusable prompt workflows for your top recurring tasks", metric: "5 prompts contributed to shared library", roles: ["pm","ux"] },
      { goal: "Complete Claude Code for PMs course (or equivalent prototyping bootcamp)", metric: "Course completed, prototype built", roles: ["pm","ux"] },
      { goal: "Build 1 working prototype for a real product idea using AI", metric: "Prototype demoed at AI Friday", roles: ["pm","ux"] },
      { goal: "Process a full research batch (10+ inputs) with AI in under 2 hours", metric: "Research output + methodology documented", roles: ["pm","ux"] },
      { goal: "Answer 5 data questions independently using AI (no analyst ticket)", metric: "5 self-served answers logged", roles: ["pm"] },
      { goal: "Build initial AI UX pattern reference for your product area", metric: "Pattern doc with 5+ patterns documented", roles: ["ux"] },
      { goal: "Complete AI opportunity audit for your product area", metric: "2–3 opportunities presented to team", roles: ["pm","ux"] },
    ]
  },
  3: {
    title: "Get to AI-Amplified in 3–6 months",
    goals: [
      { goal: "Automate 2 recurring tasks with multi-step AI workflows", metric: "2 workflows running, time saved documented", roles: ["pm","ux"] },
      { goal: "Ship 1 AI-powered feature through full lifecycle", metric: "Feature live with trust model and monitoring", roles: ["pm","ux"] },
      { goal: "Lead 1 AI workshop or training session for the team", metric: "Session delivered, feedback collected", roles: ["pm","ux"] },
      { goal: "Mentor 2 peers on their AI skill development", metric: "2 mentees moved up at least 1 stage", roles: ["pm","ux"] },
      { goal: "Make 1 direct contribution to the codebase using AI tools", metric: "PR merged or design shipped via code", roles: ["pm","ux"] },
      { goal: "Define AI UX standards for your product area", metric: "Standards documented, adopted by team", roles: ["ux"] },
      { goal: "Complete Google PAIR guidebook exercises with your team", metric: "Workshop run, outcomes documented", roles: ["ux"] },
    ]
  },
  4: {
    title: "Get to AI-Native in 6–12 months",
    goals: [
      { goal: "Build a continuous discovery system with AI agents", metric: "System running, insights flowing without manual triggers", roles: ["pm","ux"] },
      { goal: "Design and ship an agentic feature with autonomous AI actions", metric: "Feature live with trust ramp and audit trail", roles: ["pm","ux"] },
      { goal: "Codify your approach into a reusable framework for others", metric: "Playbook published, adopted by 2+ teams", roles: ["pm","ux"] },
      { goal: "Present at a company-wide or Visma-wide forum", metric: "Talk delivered, shared externally", roles: ["pm","ux"] },
    ]
  }
};

// ─── LEADER PLAYBOOK DATA ────────────────────────────────────────────────────

const LEADER_PLAYBOOK = [
  {
    quarter: "Q2 2026", theme: "Foundation", subtitle: "Apr – Jun",
    color: "#f59e0b",
    target: "Every PM and UXer uses AI daily. No exceptions.",
    actions: [
      { action: "Kickoff session", detail: "Present this fluency model to PM + UX teams together. Align on the Product Builder vision, self-assessment process, and timeline. Make the convergence narrative explicit.", owner: "Amalie + UX Leaders", week: "Week 1" },
      { action: "Self-assessment round 1", detail: "Everyone completes self-assessment individually. Managers review in 1:1s. Input scores into Team Dashboard to see the starting picture.", owner: "All managers", week: "Week 1–2" },
      { action: "Prompt engineering workshops (2 sessions)", detail: "Run separate PM and UX workshops first (role-specific use cases), then a joint session on shared tasks. Hands-on with Claude. Everyone walks out with 3+ working prompts.", owner: "AI Champions", week: "Week 3–4" },
      { action: "Launch AI Friday demos", detail: "Weekly 30-min slot. Rotating presenters from PM AND UX. One person shows what they tried, what worked, what didn't. Low bar to present, high bar to skip.", owner: "Amalie", week: "Week 3, then weekly" },
      { action: "AI product sense 101", detail: "Joint PM + UX half-day workshop: what AI can and can't do, how LLMs work (conceptually), why AI features need different UX. Use e-conomic examples. Include hands-on component.", owner: "AI Champions + Engineering", week: "Week 5–6" },
      { action: "Seed the shared prompt library", detail: "Goal: 15+ tested prompts in Slite by end of Q2. Assign 2–3 prompts per person. Review quality together. Include both PM and UX templates.", owner: "All, curated by AI Champions", week: "Ongoing" },
      { action: "Secure tool access", detail: "Claude Pro/Team licenses for all. Evaluate prototyping tools (Cursor, v0). Ensure everyone has accounts and knows where to start.", owner: "UX Leaders + PM Leadership", week: "Week 1–2" },
    ],
    success: "100% of PM + UX have completed self-assessment. Everyone uses AI daily. Prompt library has 15+ entries. AI Friday running weekly.",
    risks: "People attend but don't change behavior. Mitigate: managers model the behavior first and check in 1:1s. Make the daily habit visible (Slack posts, AI Friday demos)."
  },
  {
    quarter: "Q3 2026", theme: "Acceleration", subtitle: "Jul – Sep",
    color: "#3b82f6",
    target: "Everyone builds prototypes. PM + UX start working together on AI features.",
    actions: [
      { action: "Prototyping bootcamp (2 sessions)", detail: "Joint PM + UX sessions. Everyone builds a working prototype for a real product idea. Use Claude artifacts, Cursor, or v0. Demo results at AI Friday. This is the 'build to learn' moment.", owner: "AI Champions + Engineering", week: "Week 1–3" },
      { action: "AI opportunity audit", detail: "Each PM-UX pair reviews their product area and identifies 2–3 AI opportunities. PM assesses feasibility, UX sketches the experience. Present together. Top 5 opportunities prioritized.", owner: "All PM-UX pairs", week: "Week 4–6" },
      { action: "AI UX pattern workshop", detail: "UX-led session on designing for AI: trust levels, autonomy spectrums, confidence indicators, error states, progressive disclosure. Use Google PAIR guidebook exercises. Produce a shared pattern library.", owner: "UX Leaders", week: "Week 4–5" },
      { action: "Data literacy workshop", detail: "Partner with data/engineering. What data we have, quality levels, how to self-serve. PMs: natural language to SQL. UX: behavioral data, session analysis, UX metrics.", owner: "Data Engineering + Leaders", week: "Week 7–8" },
      { action: "CC for PMs course sprint", detail: "All PMs + interested UXers complete the Claude Code for PMs course (10–12h self-paced) over 3 weeks. Pair up for accountability. Share learnings.", owner: "AI Champions", week: "Week 5–8" },
      { action: "Mid-year self-assessment", detail: "Everyone re-rates themselves. Managers review progress in 1:1s. Update Team Dashboard. Celebrate visible progress. Adjust individual plans.", owner: "All managers", week: "Week 10–12" },
    ],
    success: "Every PM and UXer has built 1+ prototype. AI opportunity audits complete. Top 5 opportunities identified. UX pattern library published. Average team stage: 2.5+.",
    risks: "Prototyping bootcamp feels academic, not connected to real work. Mitigate: every prototype must be for a real product idea in their area, not a toy example."
  },
  {
    quarter: "Q4 2026", theme: "Integration", subtitle: "Oct – Dec",
    color: "#8b5cf6",
    target: "AI is embedded in how teams work and what they build. First AI features ship.",
    actions: [
      { action: "Ship first AI features", detail: "The top opportunities from Q3 move into delivery. PM-UX pairs own the full cycle: feasibility → trust design → UX patterns → metrics → build → launch → monitor. This is the convergence in action.", owner: "Product Teams", week: "Throughout" },
      { action: "Update spec and design templates", detail: "Add AI-native sections to PRD and design templates: feasibility assessment, trust/autonomy design, AI success metrics, risk assessment, monitoring plan, UX pattern reference.", owner: "PM + UX Leaders", week: "Week 1–3" },
      { action: "Responsible AI playbook", detail: "Co-create with legal, compliance, and engineering. Bias assessment framework, hallucination risk tiers, privacy impact for AI features, transparency guidelines. UX owns the design patterns section.", owner: "Leaders + Legal", week: "Week 4–8" },
      { action: "Agentic product design training", detail: "Advanced workshop: designing multi-step AI agents for financial workflows. Trust boundaries, audit trails, autonomy ramps. PM + UX together. Use Microsoft HAX Toolkit.", owner: "External or AI Champions", week: "Week 5–7" },
      { action: "Cross-pollination sessions", detail: "Pair PMs with UXers from different areas for 'AI design reviews.' Fresh eyes on AI opportunities. Break silos. Reinforce the convergence.", owner: "Leaders", week: "Week 8–10" },
      { action: "End-of-year assessment + retro", detail: "Final self-assessment. Team Dashboard review. Retro on the full journey: what worked, what didn't, what's next. Celebrate wins publicly.", owner: "All managers", week: "Week 11–12" },
    ],
    success: "2+ AI features shipped with PM-UX co-ownership. Templates updated. Responsible AI playbook published. Average team stage: 3.0+ (target met). AI Champions at 4+.",
    risks: "Features get delayed and the 'integration' quarter feels like the 'still building foundation' quarter. Mitigate: keep at least one feature small enough to ship in 6 weeks."
  },
  {
    quarter: "Q1 2027", theme: "The New Normal", subtitle: "Jan – Mar",
    color: "#059669",
    target: "AI is how we work. Consolidate gains, formalize the culture, plan year 2.",
    actions: [
      { action: "Integrate AI into hiring and onboarding", detail: "Update PM and UX job descriptions with AI competencies. Add 'AI product sense' interview round. Onboarding includes AI toolkit setup and the foundation course.", owner: "Leaders + Recruiting", week: "Week 1–4" },
      { action: "Formalize the knowledge base", detail: "Consolidate: prompt library, AI feature design patterns, UX pattern library, responsible AI playbook, case studies from shipped features. Single Slite hub.", owner: "AI Champions", week: "Week 2–6" },
      { action: "Integrate AI into performance conversations", detail: "AI fluency stage becomes part of growth conversations. Not punitive — growth-oriented. Use self-assessment as the basis. Set stage targets per role level.", owner: "All managers", week: "Week 4–8" },
      { action: "Draft Year 2 vision", detail: "Based on where the team landed and where AI is heading. What does Stage 4–5 look like at scale? How does the Product Builder role evolve? Present to leadership.", owner: "Amalie + UX Leaders", week: "Week 8–12" },
      { action: "Share externally", detail: "Visma-wide presentation on the journey and framework. Establish e-conomic as the AI-upskilling benchmark within Visma. Consider blog post or talk.", owner: "Amalie + AI Champions", week: "Week 10–12" },
    ],
    success: "AI in hiring, onboarding, and performance. Knowledge base complete and self-serve. Year 2 vision drafted. e-conomic recognized as AI upskilling leader within Visma.",
    risks: "Momentum fades after the 'program' ends. Mitigate: Year 2 vision must shift from program to culture. AI Friday continues. New hires onboard into the system."
  },
];

// ─── ICON HELPER ─────────────────────────────────────────────────────────────

const IconMap = { Eye, Lightbulb, Layers, BarChart3, Brain, Users };

function StreamIcon({ name, size = 18, className }) {
  const Icon = IconMap[name] || Target;
  return <Icon size={size} className={className} />;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role];
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      className="text-xs font-medium px-1.5 py-0.5 rounded-full inline-block whitespace-nowrap">
      {c.label}
    </span>
  );
}

function StageHeader({ stage, isActive }) {
  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{
        background: isActive ? `linear-gradient(135deg, ${stage.color}25, ${stage.color}10)` : `linear-gradient(135deg, ${stage.color}12, ${stage.color}05)`,
        border: `1.5px solid ${isActive ? stage.color : stage.color + "30"}`,
        boxShadow: isActive ? `0 0 0 1px ${stage.color}40` : "none",
      }}>
      <div className="px-3 py-2" style={{ background: `${stage.color}${isActive ? "18" : "08"}` }}>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center text-white shadow-sm"
            style={{ background: stage.color }}>
            {stage.id}
          </span>
          <span className="font-bold text-sm text-gray-900">{stage.name}</span>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="text-xs font-medium" style={{ color: stage.color }}>{stage.tag}</div>
        <div className="text-xs text-gray-400 mt-0.5">{stage.orgStage}</div>
      </div>
    </div>
  );
}

function CompactCell({ stream, stage, roleFilter, isSelected, onSelect }) {
  const data = RUBRIC[stream.id]?.[stage.id];
  if (!data) return <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-400">—</div>;

  const showPM = roleFilter === "all" || roleFilter === "pm";
  const text = roleFilter === "all" ? data.shared : showPM ? data.pm : data.ux;

  const cellTools = (TOOLS[stream.id] || []).filter(t =>
    t.stages.includes(stage.id) && (roleFilter === "all" || t.roles.includes(roleFilter))
  );
  const cellLearning = LEARNING_EXPANDED.courses.filter(c =>
    c.stages.includes(stage.id) && (roleFilter === "all" || c.roles.includes(roleFilter))
  );
  const cellGoals = INDIVIDUAL_GOALS[stage.id]?.goals.filter(g =>
    roleFilter === "all" || g.roles.includes(roleFilter)
  ) || [];

  return (
    <button onClick={onSelect}
      className={`text-left rounded-xl border-2 transition-all w-full h-full group relative ${isSelected ? "shadow-lg -translate-y-0.5" : "hover:shadow-md hover:-translate-y-0.5"}`}
      style={{
        borderColor: isSelected ? stage.color : `${stage.color}20`,
        background: isSelected ? `linear-gradient(to bottom, ${stage.color}10, white)` : "white",
      }}>
      {/* Selected indicator arrow */}
      {isSelected && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-b-2 border-r-2 z-10"
          style={{ background: stage.bg, borderColor: stage.color }} />
      )}
      <div className="p-3">
        <div className="text-xs text-gray-600 leading-relaxed line-clamp-4">{text}</div>
      </div>
      <div className="px-3 pb-2.5 flex items-center justify-between">
        <span className={`text-xs flex items-center gap-1 transition-colors ${isSelected ? "font-medium" : "text-gray-400 group-hover:text-gray-600"}`}
          style={isSelected ? { color: stage.color } : {}}>
          {isSelected ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          {isSelected ? "selected" : "details"}
        </span>
        <span className="flex gap-1.5">
          {cellTools.length > 0 && (
            <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${stage.color}15` }}>
              <Wrench size={9} style={{ color: stage.color }} />
            </span>
          )}
          {cellLearning.length > 0 && (
            <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${stage.color}15` }}>
              <GraduationCap size={9} style={{ color: stage.color }} />
            </span>
          )}
          {cellGoals.length > 0 && (
            <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${stage.color}15` }}>
              <Target size={9} style={{ color: stage.color }} />
            </span>
          )}
        </span>
      </div>
    </button>
  );
}

function DetailPanel({ stream, stage, roleFilter, onClose }) {
  const [activeTab, setActiveTab] = useState("behavior");
  const data = RUBRIC[stream.id]?.[stage.id];
  if (!data) return null;

  const showPM = roleFilter === "all" || roleFilter === "pm";
  const cellTools = (TOOLS[stream.id] || []).filter(t =>
    t.stages.includes(stage.id) && (roleFilter === "all" || t.roles.includes(roleFilter))
  );
  const cellLearning = LEARNING_EXPANDED.courses.filter(c =>
    c.stages.includes(stage.id) && (roleFilter === "all" || c.roles.includes(roleFilter))
  );
  const cellPodcasts = LEARNING_EXPANDED.podcasts.filter(p =>
    roleFilter === "all" || p.roles.includes(roleFilter)
  ).slice(0, 3);
  const cellGoals = INDIVIDUAL_GOALS[stage.id]?.goals.filter(g =>
    roleFilter === "all" || g.roles.includes(roleFilter)
  ) || [];

  const tabDefs = [
    { id: "behavior", label: "Behaviors", icon: Eye },
    { id: "tools", label: `Tools (${cellTools.length})`, icon: Wrench },
    { id: "learning", label: `Learning (${cellLearning.length + cellPodcasts.length})`, icon: GraduationCap },
    { id: "goals", label: `Goals (${cellGoals.length})`, icon: Target },
  ];

  return (
    <div className="col-span-full rounded-2xl overflow-hidden shadow-xl border-2 animate-in"
      style={{ borderColor: stage.color, background: "white" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${stage.color}, ${stage.color}dd)` }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <StreamIcon name={stream.icon} size={20} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base">{stream.name} — Stage {stage.id}: {stage.name}</div>
            <div className="text-white/70 text-sm">{stage.description}</div>
          </div>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b px-2" style={{ borderColor: `${stage.color}15`, background: `${stage.color}04` }}>
        {tabDefs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-3 -mb-px"
              style={{
                borderBottomWidth: 3,
                borderBottomColor: isActive ? stage.color : "transparent",
                color: isActive ? stage.color : "#9ca3af",
              }}>
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6" style={{ background: `${stage.color}02` }}>

        {activeTab === "behavior" && (
          <div className="space-y-4">
            {/* Summary line */}
            <div className="text-sm text-gray-700 leading-relaxed font-medium">
              {roleFilter === "all" ? data.shared : showPM ? data.pm : data.ux}
            </div>

            {/* Role cards - side by side on wide screens */}
            {roleFilter === "all" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl p-4 border" style={{ background: `${ROLE_COLORS.pm.bg}60`, borderColor: `${ROLE_COLORS.pm.border}80` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <RoleBadge role="pm" />
                    <span className="text-sm font-bold text-gray-800">Product Manager</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{data.pm}</p>
                </div>
                <div className="rounded-xl p-4 border" style={{ background: `${ROLE_COLORS.ux.bg}60`, borderColor: `${ROLE_COLORS.ux.border}80` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <RoleBadge role="ux" />
                    <span className="text-sm font-bold text-gray-800">UX Designer</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{data.ux}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-4 border border-gray-100 bg-gray-50">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {showPM ? data.pm : data.ux}
                </p>
              </div>
            )}

            {/* Signal */}
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "#fef3c7", border: "1px solid #fde68a" }}>
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                <Info size={14} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-amber-800 mb-1">You know you're here when...</div>
                <p className="text-sm text-amber-700 leading-relaxed">{data.signal}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tools" && (
          <div>
            {cellTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cellTools.map((tool, i) => (
                  <div key={i} className="rounded-xl p-4 bg-white border border-gray-100 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${stage.color}12` }}>
                      <Wrench size={16} style={{ color: stage.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900">{tool.name}</div>
                      <div className="text-sm text-gray-500 mt-0.5 leading-relaxed">{tool.use}</div>
                      <div className="flex gap-1.5 mt-2">
                        {tool.roles.map(r => <RoleBadge key={r} role={r} />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wrench size={28} className="text-gray-300 mx-auto mb-3" />
                <div className="text-sm text-gray-400">No specific tools mapped to this stage and stream.</div>
                <div className="text-sm text-gray-400 mt-1">Check the Transition Plans for recommendations.</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "learning" && (
          <div className="space-y-4">
            {cellLearning.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Courses & Toolkits</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cellLearning.map((course, i) => (
                    <div key={i} className="rounded-xl p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: course.free ? "#ecfdf5" : "#fffbeb" }}>
                          <GraduationCap size={16} style={{ color: course.free ? "#059669" : "#d97706" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-gray-900">{course.name}</span>
                            {course.free && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">FREE</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{course.description.split('.')[0]}.</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="font-semibold">{course.hours}</span>
                            <span className="flex gap-1">{course.roles.map(r => <RoleBadge key={r} role={r} />)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cellPodcasts.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Podcasts</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {cellPodcasts.map((pod, i) => (
                    <div key={i} className="rounded-xl p-4 bg-white border border-gray-100 shadow-sm flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Headphones size={16} className="text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900">{pod.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{pod.description.split('.')[0]}.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cellLearning.length === 0 && cellPodcasts.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap size={28} className="text-gray-300 mx-auto mb-3" />
                <div className="text-sm text-gray-400">No specific resources for this stage.</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "goals" && (
          <div>
            {cellGoals.length > 0 ? (
              <>
                <div className="text-sm text-gray-600 mb-4">
                  Concrete, measurable goals to move from <strong style={{ color: stage.color }}>Stage {stage.id} ({stage.name})</strong> to <strong>Stage {Math.min(stage.id + 1, 5)}</strong>. Use these in 1:1 conversations.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cellGoals.map((g, j) => (
                    <div key={j} className="rounded-xl p-4 bg-white border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: `${stage.color}15`, border: `2.5px solid ${stage.color}` }}>
                          <span className="text-xs font-black" style={{ color: stage.color }}>{j + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-900 leading-snug">{g.goal}</div>
                          <div className="mt-2">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full inline-block"
                              style={{ background: `${stage.color}10`, color: stage.color }}>
                              Metric: {g.metric}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Target size={28} className="text-gray-300 mx-auto mb-3" />
                <div className="text-sm text-gray-400">You're at the frontier! Focus on the transition plan for Stage 4→5.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SELF-ASSESSMENT ─────────────────────────────────────────────────────────

function AssessmentView({ roleFilter }) {
  const [scores, setScores] = useState({});
  const setScore = (stream, value) => setScores(prev => ({ ...prev, [stream]: value }));

  const filledCount = Object.values(scores).length;
  const avgScore = filledCount > 0
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / filledCount).toFixed(1)
    : "—";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Self-Assessment</h3>
        <p className="text-sm text-gray-500 mb-6">
          Rate yourself on each value stream. Be honest — this is a growth tool, not a performance evaluation.
          {roleFilter !== "all" && <span className="font-medium"> Showing {roleFilter === "pm" ? "PM" : "UX"} perspective.</span>}
        </p>

        <div className="grid gap-4">
          {VALUE_STREAMS.map(stream => {
            const score = scores[stream.id];
            const stage = score ? STAGES.find(s => s.id === score) : null;
            return (
              <div key={stream.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <StreamIcon name={stream.icon} size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{stream.name}</div>
                    <div className="text-xs text-gray-400">{stream.subtitle}</div>
                  </div>
                  {stage && (
                    <div className="ml-auto">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ background: stage.color }}>
                        Stage {stage.id}: {stage.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {STAGES.map(s => (
                    <button key={s.id} onClick={() => setScore(stream.id, s.id)}
                      className="flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-all border-2"
                      style={{
                        background: score === s.id ? s.bg : "white",
                        borderColor: score === s.id ? s.color : "#e5e7eb",
                        color: score === s.id ? s.color : "#6b7280",
                      }}>
                      {s.id}. {s.name}
                    </button>
                  ))}
                </div>
                {score && (
                  <div className="mt-3 bg-amber-50 rounded p-2.5 flex items-start gap-2">
                    <Info size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-amber-700 italic">
                      {RUBRIC[stream.id]?.[score]?.signal}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filledCount > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Average Stage</div>
                <div className="text-3xl font-bold text-gray-900">{avgScore}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500 mb-1">Priority focus area</div>
                <div className="text-sm text-gray-700">
                  {(() => {
                    const lowest = Object.entries(scores).sort(([,a], [,b]) => a - b)[0];
                    if (!lowest) return "Complete your assessment";
                    const stream = VALUE_STREAMS.find(s => s.id === lowest[0]);
                    return `${stream?.name} (currently Stage ${lowest[1]})`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TEAM DASHBOARD ──────────────────────────────────────────────────────────

const INITIAL_TEAM = [
  { id: 1, name: "Example PM", role: "pm", scores: {} },
  { id: 2, name: "Example UXer", role: "ux", scores: {} },
];

function TeamDashboard() {
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("pm");
  const [editingCell, setEditingCell] = useState(null);
  const [nextId, setNextId] = useState(3);

  const addMember = () => {
    if (!newName.trim()) return;
    setTeam(prev => [...prev, { id: nextId, name: newName.trim(), role: newRole, scores: {} }]);
    setNextId(prev => prev + 1);
    setNewName("");
  };

  const removeMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const setMemberScore = (memberId, streamId, score) => {
    setTeam(prev => prev.map(m =>
      m.id === memberId ? { ...m, scores: { ...m.scores, [streamId]: score } } : m
    ));
    setEditingCell(null);
  };

  // Analytics
  const analytics = useMemo(() => {
    const membersWithScores = team.filter(m => Object.keys(m.scores).length > 0);
    if (membersWithScores.length === 0) return null;

    const streamAverages = {};
    const streamGaps = {};
    VALUE_STREAMS.forEach(stream => {
      const scores = membersWithScores
        .map(m => m.scores[stream.id])
        .filter(s => s !== undefined);
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        streamAverages[stream.id] = avg;
        const min = Math.min(...scores);
        const max = Math.max(...scores);
        streamGaps[stream.id] = { min, max, spread: max - min, avg };
      }
    });

    const overallAvg = Object.values(streamAverages).length > 0
      ? Object.values(streamAverages).reduce((a, b) => a + b, 0) / Object.values(streamAverages).length
      : 0;

    const weakestStream = Object.entries(streamAverages).sort(([,a], [,b]) => a - b)[0];
    const strongestStream = Object.entries(streamAverages).sort(([,a], [,b]) => b - a)[0];

    const belowTarget = membersWithScores.filter(m => {
      const avg = Object.values(m.scores).reduce((a, b) => a + b, 0) / Object.values(m.scores).length;
      return avg < 3;
    });

    const stageDistribution = {};
    STAGES.forEach(s => { stageDistribution[s.id] = 0; });
    membersWithScores.forEach(m => {
      const avg = Object.values(m.scores).reduce((a, b) => a + b, 0) / Object.values(m.scores).length;
      const rounded = Math.round(avg);
      if (stageDistribution[rounded] !== undefined) stageDistribution[rounded]++;
    });

    return { streamAverages, streamGaps, overallAvg, weakestStream, strongestStream, belowTarget, stageDistribution, membersWithScores };
  }, [team]);

  const getStageColor = (score) => {
    const stage = STAGES.find(s => s.id === Math.round(score));
    return stage?.color || "#94a3b8";
  };

  return (
    <div className="space-y-6">
      {/* Add member */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Team Dashboard</h3>
        <p className="text-sm text-gray-500 mb-4">
          Add your team members and input their assessment scores to see the team-level picture. Identify gaps, plan interventions, and track progress.
        </p>

        <div className="flex gap-2 items-center">
          <UserPlus size={16} className="text-gray-400" />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMember()}
            placeholder="Team member name"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="pm">PM</option>
            <option value="ux">UX</option>
          </select>
          <button onClick={addMember}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Add
          </button>
        </div>
      </div>

      {/* Team matrix */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500 w-48">Team Member</th>
                {VALUE_STREAMS.map(stream => (
                  <th key={stream.id} className="text-center py-3 px-2 font-medium text-gray-500 min-w-24">
                    <div className="flex flex-col items-center gap-1">
                      <StreamIcon name={stream.icon} size={14} />
                      <span className="text-xs">{stream.name}</span>
                    </div>
                  </th>
                ))}
                <th className="text-center py-3 px-3 font-medium text-gray-500 min-w-16">Avg</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => {
                const memberScores = Object.values(member.scores);
                const memberAvg = memberScores.length > 0
                  ? (memberScores.reduce((a, b) => a + b, 0) / memberScores.length).toFixed(1)
                  : "—";
                return (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{member.name}</span>
                        <RoleBadge role={member.role} />
                      </div>
                    </td>
                    {VALUE_STREAMS.map(stream => {
                      const score = member.scores[stream.id];
                      const isEditing = editingCell?.memberId === member.id && editingCell?.streamId === stream.id;
                      return (
                        <td key={stream.id} className="text-center py-2 px-2">
                          {isEditing ? (
                            <div className="flex gap-0.5 justify-center">
                              {STAGES.map(s => (
                                <button key={s.id}
                                  onClick={() => setMemberScore(member.id, stream.id, s.id)}
                                  className="w-7 h-7 rounded-full text-xs font-bold text-white hover:scale-110 transition-transform"
                                  style={{ background: s.color }}>
                                  {s.id}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingCell({ memberId: member.id, streamId: stream.id })}
                              className="w-8 h-8 rounded-full text-xs font-bold mx-auto flex items-center justify-center transition-all hover:scale-110"
                              style={score ? {
                                background: STAGES.find(s => s.id === score)?.color,
                                color: "white"
                              } : {
                                background: "#f3f4f6",
                                color: "#9ca3af",
                                border: "2px dashed #d1d5db"
                              }}>
                              {score || "?"}
                            </button>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-center py-3 px-3">
                      {memberAvg !== "—" ? (
                        <span className="text-sm font-bold px-2.5 py-1 rounded-full text-white"
                          style={{ background: getStageColor(parseFloat(memberAvg)) }}>
                          {memberAvg}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <button onClick={() => removeMember(member.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-medium text-gray-500 mb-1">Team Average</div>
              <div className="text-2xl font-bold" style={{ color: getStageColor(analytics.overallAvg) }}>
                {analytics.overallAvg.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {STAGES.find(s => s.id === Math.round(analytics.overallAvg))?.name || "—"}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-medium text-gray-500 mb-1">Weakest Stream</div>
              <div className="text-sm font-bold text-gray-900">
                {analytics.weakestStream ? VALUE_STREAMS.find(s => s.id === analytics.weakestStream[0])?.name : "—"}
              </div>
              {analytics.weakestStream && (
                <div className="text-xs mt-1" style={{ color: getStageColor(analytics.weakestStream[1]) }}>
                  Avg: {analytics.weakestStream[1].toFixed(1)}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-medium text-gray-500 mb-1">Strongest Stream</div>
              <div className="text-sm font-bold text-gray-900">
                {analytics.strongestStream ? VALUE_STREAMS.find(s => s.id === analytics.strongestStream[0])?.name : "—"}
              </div>
              {analytics.strongestStream && (
                <div className="text-xs mt-1" style={{ color: getStageColor(analytics.strongestStream[1]) }}>
                  Avg: {analytics.strongestStream[1].toFixed(1)}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-medium text-gray-500 mb-1">Below Target (Stage 3)</div>
              <div className="text-2xl font-bold" style={{ color: analytics.belowTarget.length > 0 ? "#ef4444" : "#059669" }}>
                {analytics.belowTarget.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                of {analytics.membersWithScores.length} assessed
              </div>
            </div>
          </div>

          {/* Stream breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Stream Breakdown</h4>
            <div className="space-y-3">
              {VALUE_STREAMS.map(stream => {
                const gap = analytics.streamGaps[stream.id];
                if (!gap) return (
                  <div key={stream.id} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-28 flex items-center gap-2">
                      <StreamIcon name={stream.icon} size={14} />
                      <span className="text-xs">{stream.name}</span>
                    </div>
                    <span className="text-xs">No data</span>
                  </div>
                );
                return (
                  <div key={stream.id} className="flex items-center gap-3">
                    <div className="w-28 flex items-center gap-2 flex-shrink-0">
                      <StreamIcon name={stream.icon} size={14} />
                      <span className="text-xs font-medium text-gray-700">{stream.name}</span>
                    </div>
                    {/* Visual bar */}
                    <div className="flex-1 relative h-8">
                      <div className="absolute inset-0 bg-gray-100 rounded-full" />
                      {/* Range bar */}
                      <div className="absolute top-1 bottom-1 rounded-full opacity-30"
                        style={{
                          left: `${((gap.min - 1) / 4) * 100}%`,
                          width: `${((gap.max - gap.min) / 4) * 100}%`,
                          background: getStageColor(gap.avg),
                        }} />
                      {/* Average marker */}
                      <div className="absolute top-0 bottom-0 flex items-center"
                        style={{ left: `${((gap.avg - 1) / 4) * 100}%` }}>
                        <div className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm"
                          style={{ background: getStageColor(gap.avg) }}>
                          {gap.avg.toFixed(1)}
                        </div>
                      </div>
                      {/* Stage markers */}
                      {STAGES.map(s => (
                        <div key={s.id} className="absolute top-0 bottom-0 flex items-center"
                          style={{ left: `${((s.id - 1) / 4) * 100}%` }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        </div>
                      ))}
                    </div>
                    <div className="w-24 text-right flex-shrink-0">
                      {gap.spread > 1 && (
                        <span className="text-xs text-amber-600 font-medium">
                          Spread: {gap.spread}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
              {STAGES.map(s => (
                <span key={s.id} className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  {s.id}. {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* Intervention suggestions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Suggested Interventions</h4>
            <div className="space-y-3">
              {analytics.belowTarget.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="text-sm font-medium text-red-800 mb-1">Priority: Below minimum target</div>
                  <div className="text-xs text-red-700">
                    {analytics.belowTarget.map(m => m.name).join(", ")} — below Stage 3 average.
                    Focus on the Stage 2→3 transition actions: build reusable prompt workflows, complete prototyping bootcamp, systematize research synthesis.
                  </div>
                </div>
              )}

              {analytics.weakestStream && analytics.weakestStream[1] < 3 && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="text-sm font-medium text-amber-800 mb-1">
                    Team gap: {VALUE_STREAMS.find(s => s.id === analytics.weakestStream[0])?.name} (avg {analytics.weakestStream[1].toFixed(1)})
                  </div>
                  <div className="text-xs text-amber-700">
                    This is the team's weakest stream. Consider a targeted workshop or learning sprint focused on this area.
                    Check the Transition Plans tab for specific actions.
                  </div>
                </div>
              )}

              {Object.entries(analytics.streamGaps).some(([, g]) => g.spread > 2) && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-1">Large skill spread detected</div>
                  <div className="text-xs text-blue-700">
                    {Object.entries(analytics.streamGaps)
                      .filter(([, g]) => g.spread > 2)
                      .map(([id]) => VALUE_STREAMS.find(s => s.id === id)?.name)
                      .join(", ")} — spread of 3+ stages within the team. Pair advanced members with those early in their journey for peer mentoring.
                  </div>
                </div>
              )}

              {analytics.overallAvg >= 3 && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="text-sm font-medium text-emerald-800 mb-1">Team is at target</div>
                  <div className="text-xs text-emerald-700">
                    Average is at or above Stage 3. Focus on identifying AI Champions (Stage 4+) and pushing the frontier.
                    Consider the Stage 3→4 transition: ship AI features, lead workshops, build in the codebase.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TRANSITION VIEW ─────────────────────────────────────────────────────────

function TransitionView({ roleFilter }) {
  const [expandedTransition, setExpandedTransition] = useState(0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Transition Plans</h3>
        <p className="text-sm text-gray-500">Concrete steps to move from one stage to the next. Each transition requires specific actions, not just time.</p>
      </div>
      {TRANSITIONS.map((t, i) => {
        const fromStage = STAGES.find(s => s.id === t.from);
        const toStage = STAGES.find(s => s.id === t.to);
        const isExpanded = expandedTransition === i;
        const filteredActions = t.actions.filter(a =>
          a.role === "shared" || roleFilter === "all" || a.role === roleFilter
        );
        return (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setExpandedTransition(isExpanded ? -1 : i)}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: fromStage.color }}>
                  {fromStage.id}
                </span>
                <ArrowRight size={14} className="text-gray-400" />
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: toStage.color }}>
                  {toStage.id}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">{t.title}</div>
                <div className="text-xs text-gray-400">{fromStage.name} → {toStage.name} · {t.timeline}</div>
              </div>
              {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
            </button>
            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                {filteredActions.map((a, j) => (
                  <div key={j} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-500">{j + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{a.action}</span>
                        {a.role !== "shared" && <RoleBadge role={a.role} />}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 leading-relaxed">{a.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── TOOLS VIEW ──────────────────────────────────────────────────────────────

function ToolsView({ roleFilter }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Tools & Learning Resources</h3>
        <p className="text-sm text-gray-500">Tools mapped to value streams and maturity stages. Filtered by {roleFilter === "all" ? "all roles" : roleFilter === "pm" ? "PM" : "UX"}.</p>
      </div>

      {VALUE_STREAMS.map(stream => {
        const tools = TOOLS[stream.id]?.filter(t =>
          roleFilter === "all" || t.roles.includes(roleFilter)
        ) || [];
        if (tools.length === 0) return null;
        return (
          <div key={stream.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                <StreamIcon name={stream.icon} size={14} />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">{stream.name}</h4>
              <span className="text-xs text-gray-400">{stream.subtitle}</span>
            </div>
            <div className="space-y-2">
              {tools.map((tool, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{tool.name}</div>
                    <div className="text-xs text-gray-500 truncate">{tool.use}</div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {tool.stages.map(s => {
                      const stage = STAGES.find(st => st.id === s);
                      return (
                        <span key={s} className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                          style={{ background: stage.color }}>
                          {s}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {tool.roles.map(r => <RoleBadge key={r} role={r} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-gray-500" />
          <h4 className="font-semibold text-sm text-gray-900">Learning Resources</h4>
        </div>
        <div className="space-y-2">
          {LEARNING.filter(l => roleFilter === "all" || l.roles.includes(roleFilter)).map((l, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">{l.name}</div>
                <div className="text-xs text-gray-500">{l.type}</div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {l.stages.map(s => {
                  const stage = STAGES.find(st => st.id === s);
                  return (
                    <span key={s} className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ background: stage.color }}>
                      {s}
                    </span>
                  );
                })}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {l.roles.map(r => <RoleBadge key={r} role={r} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── VISION VIEW ─────────────────────────────────────────────────────────────

function VisionView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4" style={{ color: "#1e2a3a" }}>The Product Builder Vision</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The distinction between PM and UX is dissolving. As AI commoditizes execution — writing specs, creating mockups, analyzing data — the value shifts to <strong>judgment</strong>: deciding what to build, for whom, and why. The future role is the <strong>Product Builder</strong>: someone who senses customer needs, shapes solutions, builds prototypes, and optimizes outcomes in a continuous loop.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          This aligns with SVPG's "build to learn" philosophy — using AI to test ideas directly rather than writing long specs and waiting for engineering. At e-conomic, this convergence maps to our organizational AI transformation journey.
        </p>

        <h4 className="font-semibold text-sm text-gray-900 mb-3">Organizational AI Transformation Stages</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              stage: "Stage 1: AI is Scattered", status: "Today",
              color: "#e8a32e", bg: "#fdf6e8",
              items: [
                { label: "Product Strategy", value: "6 bets, no revenue. EVA as assistant." },
                { label: "Upskilling", value: "Messy, experimental. Mindset shift. AI-amplified." },
                { label: "Ops Model", value: "Slow. Roles define scope and constraints." },
                { label: "Building", value: '"Ask to learn." Tech is a barrier.' },
                { label: "Customer", value: "Experimental trust." },
              ]
            },
            {
              stage: "Stage 2: AI is Centralized", status: "Next",
              color: "#3366cc", bg: "#eaf0fa",
              items: [
                { label: "Product Strategy", value: "Mass-market prod w/ AI revenue. EVA as operator." },
                { label: "Upskilling", value: 'Operational, AI-builder. "Anyone can build."' },
                { label: "Ops Model", value: "Slow/fast. Roles centered around building." },
                { label: "Building", value: '"Build to learn." Tech is empowering.' },
                { label: "Customer", value: "Trusted." },
              ]
            },
            {
              stage: "Stage 3: AI is the Platform", status: "Vision",
              color: "#2a7d5f", bg: "#e8f5ef",
              items: [
                { label: "Product Strategy", value: "Agentic w/ new biz model. Skills, artefacts. EVA as front door." },
                { label: "Upskilling", value: "AI-native." },
                { label: "Ops Model", value: "Fast (slow). Roles redefined." },
                { label: "Building", value: "Tech is a given." },
                { label: "Customer", value: "Outsourced." },
              ]
            },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border-2 p-4" style={{ borderColor: s.color, background: s.bg }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: s.color }}>
                  {s.status}
                </span>
              </div>
              <div className="font-semibold text-sm text-gray-900 mb-3">{s.stage}</div>
              <div className="space-y-2">
                {s.items.map((item, j) => (
                  <div key={j}>
                    <div className="text-xs font-medium text-gray-500">{item.label}</div>
                    <div className="text-xs text-gray-700">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h4 className="font-semibold text-sm text-gray-900 mb-3">The Convergence Path</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border" style={{ background: "#eaf0fa", borderColor: "#c0d0e8" }}>
            <div className="text-xs font-bold mb-2" style={{ color: "#3366cc" }}>TODAY</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">PM + UX (separate)</div>
            <div className="text-xs text-gray-600">PM owns strategy, specs, metrics. UX owns research, design, testing. Clear handoffs. Distinct skill sets with some overlap.</div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: "#fdf6e8", borderColor: "#e8d4a0" }}>
            <div className="text-xs font-bold mb-2" style={{ color: "#c08820" }}>TRANSITION</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">PM + UX (collaborating)</div>
            <div className="text-xs text-gray-600">Both roles prototype. Both use AI for research and data. Handoffs shrink. Shared ownership of outcomes. Skills begin to overlap significantly.</div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: "#e8f5ef", borderColor: "#a0d4b8" }}>
            <div className="text-xs font-bold mb-2" style={{ color: "#2a7d5f" }}>VISION</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">Product Builder</div>
            <div className="text-xs text-gray-600">One role that senses, shapes, builds, and optimizes. AI handles execution; the builder provides judgment, taste, and strategic direction.</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-semibold text-sm mb-3" style={{ color: "#1e2a3a" }}>Core Mindset Shifts</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { shift: "AI-first problem framing", from: "Default to traditional approaches", to: "AI is always on the table as a first-class option" },
            { shift: "Probabilistic thinking", from: "Demand deterministic perfection", to: "Comfortable with confidence levels and 'good enough'" },
            { shift: "Judgment over execution", from: "Deep in execution tasks (specs, mockups, docs)", to: "Deciding what to build, for whom, and why" },
            { shift: "Build to learn", from: "Write long specs, wait for engineering/design", to: "Test ideas with quick AI prototypes directly" },
            { shift: "Responsible by default", from: "Ethics as compliance checkbox", to: "Fairness, transparency, and trust as first-order design concerns" },
          ].map((m, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ background: "#f5f6f8" }}>
              <div className="text-sm font-semibold mb-2" style={{ color: "#1e2a3a" }}>{m.shift}</div>
              <div className="flex items-start gap-2 text-xs">
                <span className="line-through flex-1" style={{ color: "#b0655a" }}>{m.from}</span>
                <ArrowRight size={10} className="text-gray-400 flex-shrink-0 mt-1" />
                <span className="font-medium flex-1" style={{ color: "#2a7d5f" }}>{m.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-3">Key References</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div>Marty Cagan / SVPG — <em>Build to Learn vs Build to Earn</em>, <em>A Vision for Product Teams</em>, <em>Transformed</em></div>
          <div>Zapier — <em>AI Fluency Rubric</em> (March 2026)</div>
          <div>Visma — <em>AI-Native Product Development Framework</em> (Sense → Shape → Build → Optimize)</div>
          <div>e-conomic Design Vision — <em>Product Builder convergence model</em></div>
          <div>Google PAIR — <em>People + AI Guidebook</em>, Microsoft — <em>HAX Toolkit</em></div>
          <div>Nielsen Norman Group — <em>AI UX Guidelines</em></div>
          <div>Andrew Ng, Lenny Rachitsky, Dr. Marily Nika — AI PM thought leadership</div>
        </div>
      </div>
    </div>
  );
}

// ─── LEARNING VIEW (EXPANDED) ────────────────────────────────────────────────

function LearningView({ roleFilter }) {
  const [activeTab, setActiveTab] = useState("courses");

  const filteredCourses = LEARNING_EXPANDED.courses.filter(c =>
    roleFilter === "all" || c.roles.includes(roleFilter)
  );
  const filteredPodcasts = LEARNING_EXPANDED.podcasts.filter(p =>
    roleFilter === "all" || p.roles.includes(roleFilter)
  );
  const filteredReads = LEARNING_EXPANDED.reads.filter(r =>
    roleFilter === "all" || r.roles.includes(roleFilter)
  );

  const tabs = [
    { id: "courses", label: "Courses & Toolkits", count: filteredCourses.length },
    { id: "tools", label: "Tools by Stream", count: null },
    { id: "podcasts", label: "Podcasts", count: filteredPodcasts.length },
    { id: "reads", label: "Articles & Guides", count: filteredReads.length },
    { id: "goals", label: "Individual Goals", count: null },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Learning Resources & Individual Goals</h3>
        <p className="text-sm text-gray-500 mb-4">
          Curated courses (many free), podcasts, articles, and concrete goals mapped to each stage.
          {roleFilter !== "all" && <span className="font-medium"> Filtered for {roleFilter === "pm" ? "PM" : "UX"}.</span>}
        </p>
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === t.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {t.label} {t.count !== null && <span className="opacity-60">({t.count})</span>}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "courses" && (
        <div className="space-y-3">
          {/* Free section */}
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">Free Courses & Toolkits</span>
            </div>
            <p className="text-xs text-emerald-700">These require no budget approval — anyone can start today.</p>
          </div>
          {filteredCourses.filter(c => c.free).map((course, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{course.name}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">FREE</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{course.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{course.hours}</span>
                    <span>Stages: {course.stages.map(s => STAGES.find(st => st.id === s)?.name).join(", ")}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    {course.stages.map(s => (
                      <span key={s} className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                        style={{ background: STAGES.find(st => st.id === s)?.color }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {course.roles.map(r => <RoleBadge key={r} role={r} />)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Paid section */}
          {filteredCourses.some(c => !c.free) && (
            <>
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mt-4 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap size={16} className="text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Paid Courses (budget required)</span>
                </div>
                <p className="text-xs text-amber-700">Premium cohort-based courses for PMs and UXers pushing to Stage 4–5.</p>
              </div>
              {filteredCourses.filter(c => !c.free).map((course, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{course.name}</span>
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">PAID</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2">{course.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{course.hours}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex gap-1">
                        {course.stages.map(s => (
                          <span key={s} className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                            style={{ background: STAGES.find(st => st.id === s)?.color }}>
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {course.roles.map(r => <RoleBadge key={r} role={r} />)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === "tools" && (
        <div className="space-y-4">
          {VALUE_STREAMS.map(stream => {
            const tools = (TOOLS[stream.id] || []).filter(t =>
              roleFilter === "all" || t.roles.includes(roleFilter)
            );
            if (tools.length === 0) return null;
            return (
              <div key={stream.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <StreamIcon name={stream.icon} size={14} />
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900">{stream.name}</h4>
                  <span className="text-xs text-gray-400">{stream.subtitle}</span>
                </div>
                <div className="space-y-2">
                  {tools.map((tool, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800">{tool.name}</div>
                        <div className="text-xs text-gray-500 truncate">{tool.use}</div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {tool.stages.map(s => {
                          const stg = STAGES.find(st => st.id === s);
                          return (
                            <span key={s} className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                              style={{ background: stg.color }}>{s}</span>
                          );
                        })}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {tool.roles.map(r => <RoleBadge key={r} role={r} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "podcasts" && (
        <div className="space-y-3">
          {filteredPodcasts.map((pod, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
              <Headphones size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">{pod.name}</span>
                  {pod.roles.map(r => <RoleBadge key={r} role={r} />)}
                </div>
                <p className="text-xs text-gray-600">{pod.description}</p>
              </div>
            </div>
          ))}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <div className="text-sm font-medium text-blue-800 mb-1">Listening recommendation</div>
            <div className="text-xs text-blue-700">
              Start with 1 episode per week during commute or lunch. For AI Friday prep, listen to a relevant episode the day before and share one takeaway. This builds the habit without adding pressure.
            </div>
          </div>
        </div>
      )}

      {activeTab === "reads" && (
        <div className="space-y-3">
          {filteredReads.map((read, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
              <BookOpen size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">{read.name}</span>
                  {read.roles.map(r => <RoleBadge key={r} role={r} />)}
                </div>
                <p className="text-xs text-gray-600">{read.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "goals" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">
              These are concrete, measurable goals for individuals at each stage. Use them in 1:1s to set quarterly targets. Each goal has a clear metric so progress isn't subjective.
            </p>
          </div>
          {Object.entries(INDIVIDUAL_GOALS).map(([stageId, data]) => {
            const stage = STAGES.find(s => s.id === parseInt(stageId));
            const filteredGoals = data.goals.filter(g =>
              roleFilter === "all" || g.roles.includes(roleFilter)
            );
            return (
              <div key={stageId} className="bg-white rounded-xl border-2 overflow-hidden"
                style={{ borderColor: stage.color }}>
                <div className="px-4 py-3 flex items-center gap-3"
                  style={{ background: stage.bg }}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: stage.color }}>
                    Stage {stage.id}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{data.title}</div>
                    <div className="text-xs text-gray-500">Goals for someone currently at Stage {stage.id} ({stage.name})</div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {filteredGoals.map((g, j) => (
                    <div key={j} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ borderColor: stage.color }}>
                        <CheckCircle2 size={12} style={{ color: stage.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{g.goal}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span className="font-medium">Measured by:</span> {g.metric}
                          {g.roles.length === 1 && <RoleBadge role={g.roles[0]} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── LEADER PLAYBOOK VIEW ────────────────────────────────────────────────────

function LeaderPlaybookView() {
  const [expandedQ, setExpandedQ] = useState(0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Leader Execution Plan</h3>
        <p className="text-sm text-gray-500 mb-2">
          A quarter-by-quarter plan for you and your fellow UX leaders to execute. Each quarter has a theme, specific actions with owners, success criteria, and risk mitigations.
        </p>
        <div className="flex gap-3 mt-4">
          {LEADER_PLAYBOOK.map((q, i) => (
            <button key={i} onClick={() => setExpandedQ(i)}
              className={`flex-1 p-3 rounded-lg border-2 text-left transition-all ${
                expandedQ === i ? "shadow-md" : "hover:shadow-sm"
              }`}
              style={{
                borderColor: expandedQ === i ? q.color : "#e5e7eb",
                background: expandedQ === i ? STAGES.find(s => s.color === q.color)?.bg || "#f9fafb" : "white"
              }}>
              <div className="text-xs font-bold" style={{ color: q.color }}>{q.quarter}</div>
              <div className="text-sm font-semibold text-gray-900">{q.theme}</div>
              <div className="text-xs text-gray-400">{q.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {LEADER_PLAYBOOK.map((q, i) => {
        if (expandedQ !== i) return null;
        return (
          <div key={i} className="space-y-4">
            {/* Target */}
            <div className="rounded-xl border-2 p-4"
              style={{ borderColor: q.color, background: STAGES.find(s => s.color === q.color)?.bg }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: q.color }}>
                {q.quarter} Target
              </div>
              <div className="text-sm font-semibold text-gray-900">{q.target}</div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Actions</span>
              </div>
              <div className="p-4 space-y-3">
                {q.actions.map((a, j) => (
                  <div key={j} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold"
                      style={{ background: q.color }}>
                      {j + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{a.action}</div>
                      <div className="text-xs text-gray-600 mt-1 leading-relaxed">{a.detail}</div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Users size={10} /> {a.owner}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar size={10} /> {a.week}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success + Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">Success Looks Like</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">{q.success}</p>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Risks & Mitigations</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">{q.risks}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function ProductBuilderFluencyModel() {
  const [activeView, setActiveView] = useState("matrix");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expandedCell, setExpandedCell] = useState(null);

  const toggleCell = useCallback((streamId, stageId) => {
    setExpandedCell(prev =>
      prev?.stream === streamId && prev?.stage === stageId ? null : { stream: streamId, stage: stageId }
    );
  }, []);

  const VIEWS = [
    { id: "vision", label: "Vision", icon: Target },
    { id: "matrix", label: "Fluency Matrix", icon: Layers },
    { id: "assessment", label: "Self-Assessment", icon: CheckCircle2 },
    { id: "team", label: "Team Dashboard", icon: PieChart },
    { id: "transitions", label: "Transition Plans", icon: ArrowRight },
    { id: "learning", label: "All Resources", icon: GraduationCap },
    { id: "playbook", label: "Leader Playbook", icon: ClipboardList },
  ];

  const ROLES = [
    { id: "all", label: "All Roles" },
    { id: "pm", label: "PM Lens" },
    { id: "ux", label: "UX Lens" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f5f6f8" }}>
      {/* Header — e-conomic dark navy */}
      <div className="sticky top-0 z-20 shadow-md" style={{ background: "#1e2a3a" }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#e8a32e" }}>
                  <Zap size={16} className="text-white" />
                </div>
                <h1 className="text-xl font-black text-white">Product Builder AI Fluency Model</h1>
              </div>
              <p className="text-sm mt-0.5 ml-10" style={{ color: "#8899aa" }}>e-conomic · PM + UX → Product Builder convergence · April 2026</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "rgba(255,255,255,0.08)" }}>
                {ROLES.map(r => (
                  <button key={r.id} onClick={() => setRoleFilter(r.id)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{
                      background: roleFilter === r.id ? "#e8a32e" : "transparent",
                      color: roleFilter === r.id ? "#1e2a3a" : "#8899aa",
                    }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="flex gap-1 mt-3 -mb-px overflow-x-auto">
            {VIEWS.map(v => {
              const Icon = v.icon;
              const isActive = activeView === v.id;
              return (
                <button key={v.id} onClick={() => setActiveView(v.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-all whitespace-nowrap"
                  style={{
                    borderBottomColor: isActive ? "#e8a32e" : "transparent",
                    color: isActive ? "#ffffff" : "#6b7f94",
                    background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  }}>
                  <Icon size={14} />
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeView === "vision" && <VisionView />}

        {activeView === "matrix" && (
          <div className="space-y-4">
            {/* Stage headers */}
            <div className="grid gap-2" style={{ gridTemplateColumns: "180px repeat(5, 1fr)" }}>
              <div className="p-3">
                <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8494a7" }}>Value Stream</div>
              </div>
              {STAGES.map(s => (
                <StageHeader key={s.id} stage={s} isActive={expandedCell?.stage === s.id} />
              ))}
            </div>

            {/* Matrix rows */}
            {VALUE_STREAMS.map(stream => {
              const activeStage = expandedCell?.stream === stream.id
                ? STAGES.find(s => s.id === expandedCell.stage)
                : null;
              return (
                <div key={stream.id} className="space-y-2">
                  <div className="grid gap-2" style={{ gridTemplateColumns: "180px repeat(5, 1fr)" }}>
                    <div className="p-3 flex flex-col justify-center rounded-xl bg-white border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "#1e2a3a" }}>
                          <StreamIcon name={stream.icon} size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: "#1e2a3a" }}>{stream.name}</div>
                          <div className="text-xs text-gray-400 leading-tight">{stream.subtitle}</div>
                        </div>
                      </div>
                    </div>
                    {STAGES.map(stage => (
                      <CompactCell key={stage.id}
                        stream={stream} stage={stage} roleFilter={roleFilter}
                        isSelected={expandedCell?.stream === stream.id && expandedCell?.stage === stage.id}
                        onSelect={() => toggleCell(stream.id, stage.id)} />
                    ))}
                  </div>
                  {activeStage && (
                    <DetailPanel
                      stream={stream} stage={activeStage} roleFilter={roleFilter}
                      onClose={() => setExpandedCell(null)} />
                  )}
                </div>
              );
            })}

            {/* Legend */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="font-medium" style={{ color: "#1e2a3a" }}>Stages:</span>
                {STAGES.map(s => (
                  <span key={s.id} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    {s.id}. {s.name}
                  </span>
                ))}
                <span className="ml-4 font-medium">Click any cell to see behaviors, tools, learning resources, and goals</span>
              </div>
            </div>
          </div>
        )}

        {activeView === "assessment" && <AssessmentView roleFilter={roleFilter} />}
        {activeView === "team" && <TeamDashboard />}
        {activeView === "transitions" && <TransitionView roleFilter={roleFilter} />}
        {activeView === "learning" && <LearningView roleFilter={roleFilter} />}
        {activeView === "playbook" && <LeaderPlaybookView />}
      </div>

      {/* Footer */}
      <div className="py-8 text-center" style={{ background: "#1e2a3a" }}>
        <p className="text-xs" style={{ color: "#6b7f94" }}>
          e-conomic Product Builder AI Fluency Model · Inspired by Zapier AI Fluency Rubric, SVPG, Visma AI-Native Framework · April 2026
        </p>
      </div>
    </div>
  );
}