/* Portfolio copy, project records, and links live in this file. */
window.PORTFOLIO = {
  name: "akatuworthy",
  role: "AI Engineer & Builder",
  pageDescription: "AI systems and thoughtful software by akatuworthy.",
  email: "akatuworthy@gmail.com",
  github: "https://github.com/akatuworthy-eng",
  social: [
    { label: "GitHub", href: "https://github.com/akatuworthy-eng" }
  ],
  navigation: [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Projects", href: "work.html" },
    { label: "Contact", href: "contact.html" }
  ],
  home: {
    kicker: "AI engineer · product builder · independent maker",
    headline: "Software<br>with <em>purpose.</em>",
    subline: "I build intelligent systems that do real work.",
    description: "From practical AI agents to products that preserve what matters, I design and ship software for people and the problems they actually have.",
    cue: "Scroll to explore",
    chapterEyebrow: "Human questions. Useful technology.",
    chapterTitle: "Ideas move<br>when <em>people matter.</em>",
    chapterBody: "I work across product design and engineering to make complex technology feel clear, useful, and ready for real life.",
    selectedEyebrow: "A few things I've been building",
    selectedTitle: "Selected work",
    selectedBody: "A mix of AI products, practical tools, and systems shaped around real needs."
  },
  about: {
    eyebrow: "About / Approach",
    headline: "I build systems that put <em>people first.</em>",
    intro: "I’m akatuworthy — an AI engineer and builder working across intelligent software, product engineering, and the human questions behind both.",
    body: "My work spans agents, retrieval systems, voice and transcription workflows, and practical applications. I care about useful defaults, clear interfaces, and graceful fallbacks: technology should still help when the network, model, or assumptions fail.",
    principles: [
      { title: "Start with the person", description: "Understand the real need before choosing a model, framework, or feature." },
      { title: "Make the fallback useful", description: "AI can add depth, but the core product should keep working without it." },
      { title: "Build for trust", description: "Treat consent, clarity, and the handling of personal knowledge as product fundamentals." },
      { title: "Ship the whole experience", description: "Connect interface, API, data, and deployment into one coherent product." }
    ],
    skills: ["Python", "FastAPI", "React", "PostgreSQL", "SQLite", "OpenAI", "Docker", "TypeScript"]
  },
  work: {
    eyebrow: "Projects / Selected work",
    headline: "Built to solve<br><em>something real.</em>",
    intro: "A growing collection of software projects, from AI-assisted tools to systems that make everyday work easier.",
    filters: ["All", "AI & Agents", "Product", "Tools"]
  },
  contact: {
    eyebrow: "Contact / Start a conversation",
    headline: "Have a good<br><em>problem to solve?</em>",
    intro: "Tell me what you’re building, where it’s stuck, or what you think could be better. I’m open to thoughtful product and engineering collaborations.",
    focus: "AI · Product · Engineering",
    mission: "Building tools that preserve what matters"
  },
  services: [
    "AI agents & workflow automation",
    "LLM products & retrieval systems",
    "Full-stack web applications",
    "Voice, transcription & knowledge pipelines"
  ],
  projects: [
    {
      slug: "ask-an-elder", title: "Ask an Elder", kind: "AI · CULTURE · KNOWLEDGE", category: "AI & Agents", year: "2026",
      short: "An Idoma living-knowledge engine that helps preserve and retrieve oral histories with consent at its core.",
      description: "A knowledge archive for recording oral histories from Idoma elders and making that knowledge searchable for future generations. The product brings together consented audio capture, speech transcription, entity extraction, and graph-based retrieval.",
      role: "Product concept · AI systems · Full stack",
      stack: ["FastAPI", "React", "PostgreSQL", "Whisper", "Graph retrieval"],
      outcome: "A consent-first archive concept that keeps the people and context behind each story visible.",
      steps: [
        { title: "Ask for consent", description: "Record an elder’s permission before capturing or sharing any knowledge." },
        { title: "Capture the story", description: "Collect audio with the original context and speaker attached." },
        { title: "Preserve the words", description: "Transcribe speech and identify useful people, places, and themes." },
        { title: "Retrieve with context", description: "Connect stories in a graph so future searches keep their relationships intact." }
      ],
      repo: "",
      image: "assets/projects/project-one.svg", theme: "violet"
    },
    {
      slug: "smartreply", title: "SmartReply", kind: "AI · CUSTOMER SUPPORT", category: "AI & Agents", year: "2025",
      short: "An intent-aware support assistant that answers common questions and hands off when a person is needed.",
      description: "A customer-support assistant for shipping, refunds, order status, accounts, and more. It starts with a lightweight intent classifier, can use an LLM when configured, and falls back to deterministic replies if that service is unavailable.",
      role: "Backend · AI fallback design · Product",
      stack: ["FastAPI", "React", "OpenAI", "Python"],
      outcome: "A support flow that stays available with or without an API key, with admin health and intent endpoints.",
      steps: [
        { title: "Understand the request", description: "A lightweight classifier recognizes shipping, refunds, accounts, pricing, and other common intents." },
        { title: "Find the right answer", description: "Route the request to a focused response path rather than a generic chatbot reply." },
        { title: "Use AI when available", description: "Optional GPT-powered responses add flexibility without becoming a runtime requirement." },
        { title: "Hand off or fall back", description: "Escalate when a person is needed; keep deterministic replies available if the model fails." }
      ],
      repo: "https://github.com/akatuworthy-eng/SmartReply", live: "https://smart-reply-zeta.vercel.app",
      image: "assets/projects/project-two.svg", theme: "orange"
    },
    {
      slug: "smart-budget-tracker", title: "SmartBudgetTracker", kind: "FINANCE · WEB APP", category: "Product", year: "2025",
      short: "A personal finance tool for transactions, monthly budgets, and clear summaries.",
      description: "A responsive budgeting application for recording income and expenses, grouping transactions by category, setting monthly limits, and reviewing income, spending, and balances over time.",
      role: "Product engineering · Full stack",
      stack: ["FastAPI", "SQLite", "Jinja2", "Vanilla CSS"],
      outcome: "A lightweight personal finance workflow with persistent local data and monthly budget summaries.",
      steps: [
        { title: "Record transactions", description: "Capture income and expenses with a date, category, amount, and note." },
        { title: "Organize spending", description: "Group activity into useful categories and retain it in SQLite." },
        { title: "Set a monthly plan", description: "Choose a budget and compare it with actual spending." },
        { title: "Review the month", description: "See income, expenses, remaining balance, and individual transactions together." }
      ],
      repo: "https://github.com/akatuworthy-eng/SmartBudgetTracker",
      image: "assets/projects/project-three.svg", theme: "blue"
    },
    {
      slug: "ai-travel-companion", title: "AI Travel Companion", kind: "AI · TRAVEL PLANNING", category: "AI & Agents", year: "2025",
      short: "A destination planner that turns a traveler’s interests into a day-by-day itinerary.",
      description: "A travel-planning assistant that builds itineraries from a destination, trip length, and interests. It can call an AI model when configured and uses a deterministic activity bank as a dependable fallback.",
      role: "Product engineering · AI integration",
      stack: ["FastAPI", "Python", "OpenAI", "REST API"],
      outcome: "A planning experience that remains functional without requiring an AI key.",
      steps: [
        { title: "Set the trip", description: "Choose a destination, number of days, and the interests that matter to you." },
        { title: "Match activities", description: "Use those interests to find suitable activities from the built-in activity bank." },
        { title: "Build the itinerary", description: "Arrange suggestions into a clear day-by-day plan." },
        { title: "Add AI when useful", description: "Use an optional model for richer plans while keeping a deterministic path ready." }
      ],
      repo: "https://github.com/akatuworthy-eng/ai-travel-companion",
      image: "assets/projects/project-four.svg", theme: "green"
    },
    {
      slug: "customer-service-chatbot", title: "AI Customer Service Chatbot", kind: "AI · CONVERSATIONAL", category: "AI & Agents", year: "2025",
      short: "A focused chat assistant with optional AI replies and a deterministic fallback for common support intents.",
      description: "A small, deployable customer service chatbot with a simple web interface and a FastAPI chat endpoint. It can generate AI responses or use a built-in intent table when the model is unavailable.",
      role: "Backend · Conversation flow · Interface",
      stack: ["FastAPI", "Python", "OpenAI", "HTML/CSS/JS"],
      outcome: "A low-friction support MVP with no database or account setup required.",
      steps: [
        { title: "Send a message", description: "A customer describes a question in a simple, no-account chat interface." },
        { title: "Match an intent", description: "The backend recognizes common requests such as delivery, refunds, and account help." },
        { title: "Return a response", description: "Use the model when configured, or answer from the deterministic intent table." },
        { title: "Keep support available", description: "A failed model request falls back instead of breaking the conversation." }
      ],
      repo: "https://github.com/akatuworthy-eng/AI-Customer-Service-Chatbot",
      image: "assets/projects/project-five.svg", theme: "violet"
    },
    {
      slug: "techmate", title: "TechMate", kind: "AI · DIGITAL SERVICES", category: "Product", year: "2025",
      short: "An IT-help assistant that analyzes technical issues and suggests next steps or a service tier.",
      description: "A dark, responsive support experience for software setup, device performance, connectivity, security, hardware troubleshooting, and account recovery. A keyword classifier works by default, with optional AI responses.",
      role: "Product engineering · Support workflows",
      stack: ["FastAPI", "Python", "OpenAI", "HTML/CSS/JS"],
      outcome: "A practical help flow with real-time issue analysis and a no-key fallback.",
      steps: [
        { title: "Describe the issue", description: "Explain the device or software problem in everyday language." },
        { title: "Classify the need", description: "Map it to setup, performance, connectivity, security, hardware, or account recovery." },
        { title: "Get practical steps", description: "Return focused troubleshooting guidance through the help endpoint." },
        { title: "Choose the right service", description: "Surface a matching support tier when the issue needs more hands-on help." }
      ],
      repo: "https://github.com/akatuworthy-eng/techmate",
      image: "assets/projects/project-six.svg", theme: "orange"
    },
    {
      slug: "ai-resume-generator", title: "AI Resume Generator", kind: "AI · CAREER TOOLS", category: "Tools", year: "2025",
      short: "A resume improver that cleans and tailors resume text, with optional AI rewriting.",
      description: "A minimal FastAPI tool that normalizes resume sections, removes duplicate lines, and can tailor a heading to a target role. Optional AI rewriting falls back to deterministic cleanup if unavailable.",
      role: "Backend · Text processing · Product",
      stack: ["FastAPI", "Python", "Pydantic", "OpenAI"],
      outcome: "A useful resume-cleanup path that works without an API key.",
      steps: [
        { title: "Paste experience", description: "Start with resume or experience text and optionally provide a target role." },
        { title: "Normalize structure", description: "Standardize section headers and remove repeated lines or excess spacing." },
        { title: "Shape for the role", description: "Add a role-specific heading to make the target clear." },
        { title: "Polish optionally", description: "Use AI rewriting when enabled, with deterministic cleanup as a fallback." }
      ],
      repo: "https://github.com/akatuworthy-eng/AI_Resume_Generator",
      image: "assets/projects/project-seven.svg", theme: "blue"
    },
    {
      slug: "campusflow-next", title: "CampusFlow Next", kind: "CLI · WORKFLOW SYSTEM", category: "Tools", year: "2026",
      short: "A local helpdesk ticket manager with validated workflows, follow-up notes, search, and reporting.",
      description: "A Python CLI for handling campus support tickets, with status transitions, priority rules, assignment, follow-up notes, search, reports, and JSON persistence designed to protect saved data from invalid updates.",
      role: "System design · Python · Reliability",
      stack: ["Python", "JSON", "CLI", "GitHub Actions"],
      outcome: "A tested ticket workflow that stays local and keeps record changes validated.",
      steps: [
        { title: "Create a ticket", description: "Capture an issue with a category, urgency, and affected-user count." },
        { title: "Prioritize the work", description: "Apply explicit rules to determine ticket priority and order." },
        { title: "Track progress", description: "Assign ownership, move through validated statuses, and add follow-up notes." },
        { title: "Save with care", description: "Search, report, and persist records to JSON with validation before replacement." }
      ],
      repo: "https://github.com/akatuworthy-eng/campusflownext",
      image: "assets/projects/project-eight.svg", theme: "green"
    }
  ]
};
