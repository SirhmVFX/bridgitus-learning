/** Shared marketing copy derived from Bridgitus product docs + platform features. */

export const BRAND = {
  name: "Bridgitus",
  tagline: "Measurable learning. Real mastery.",
  phone: "+61433600592",
  email: "info@bridgitus.com",
  abn: "16146552112",
} as const;

export const PASSPORT_ELEMENTS = [
  {
    title: "Current achievement level",
    body: "Curriculum-aligned snapshot of where your child stands right now — subject by subject.",
  },
  {
    title: "Specific knowledge gaps",
    body: "Not vague “needs improvement.” Exact skills like “long division with remainders.”",
  },
  {
    title: "Outcomes mastered",
    body: "A running, verified checklist of everything they’ve genuinely learned.",
  },
  {
    title: "Recommended next steps",
    body: "Lessons and activities matched to gaps — no time wasted on skills already mastered.",
  },
  {
    title: "Weekly learning goals",
    body: "Small, achievable targets that build momentum and confidence week by week.",
  },
  {
    title: "Progress over time",
    body: "Visual growth history — evidence of improvement, not a single test score.",
  },
  {
    title: "Parent report",
    body: "Plain-language updates with tutor comments, readable in under two minutes.",
  },
] as const;

export const PLATFORM_FEATURES = [
  {
    slug: "assessments",
    title: "Assessments & diagnostics",
    body: "Diagnostic, assessment, test, and exam modes with skill-by-skill scoring and adaptive difficulty.",
    href: "/assessments",
  },
  {
    slug: "assignments",
    title: "Assignments",
    body: "Structured coursework with due dates, submissions, feedback, and retake pathways.",
    href: "/features#assignments",
  },
  {
    slug: "naplan",
    title: "NAPLAN preparation",
    body: "Targeted practice papers, timed drills, and analytics aligned to NAPLAN domains.",
    href: "/naplan",
  },
  {
    slug: "selective",
    title: "Selective Entry prep",
    body: "Practice for selective school pathways with scored papers and progress tracking.",
    href: "/selective-entry",
  },
  {
    slug: "ai-practice",
    title: "AI-guided practice",
    body: "Hints that prompt thinking — never answer keys. Scaffolded practice that builds real understanding.",
    href: "/ai-practice",
  },
  {
    slug: "analytics",
    title: "Learning analytics",
    body: "Dashboards for students, tutors, and parents showing mastery, gaps, and growth.",
    href: "/features#analytics",
  },
  {
    slug: "materials",
    title: "Learning materials",
    body: "Curriculum resources, videos, worksheets, and guided lessons linked to passport gaps.",
    href: "/features#materials",
  },
  {
    slug: "sessions",
    title: "Online live sessions",
    body: "Scheduled tutoring sessions with clear agendas driven by passport priorities.",
    href: "/online-tutoring",
  },
  {
    slug: "passport",
    title: "Smart Learning Passport",
    body: "A living report card that updates as mastery grows — Bridgitus’s flagship learning product.",
    href: "/smart-learning-passport",
  },
  {
    slug: "parents",
    title: "Parent messaging",
    body: "Direct updates and scheduled messages so families stay informed without chasing reports.",
    href: "/for-parents",
  },
  {
    slug: "community",
    title: "Community & support",
    body: "A supportive learning community with clear codes of conduct and student pathways.",
    href: "/community",
  },
  {
    slug: "portal",
    title: "Student portal",
    body: "One secure hub for assessments, assignments, practice, sessions, and progress.",
    href: "/portal/login",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Diagnose",
    body: "Complete an online diagnostic in Maths, English, and Science — typically under 40 minutes per subject.",
  },
  {
    step: "02",
    title: "Map gaps",
    body: "Adaptive testing and skill-by-skill scoring flag exact gaps and mastered outcomes.",
  },
  {
    step: "03",
    title: "Passport",
    body: "Results compile into a personal Smart Learning Passport — levels, gaps, goals, and next steps.",
  },
  {
    step: "04",
    title: "Learn & retest",
    body: "Guided lessons and practice close gaps. Each skill is retested after instruction — mastery, not memorisation.",
  },
] as const;

export const SUBJECTS = [
  {
    slug: "mathematics",
    title: "Mathematics",
    body: "Number, algebra, measurement, geometry, and problem-solving — mapped to curriculum outcomes.",
  },
  {
    slug: "english",
    title: "English",
    body: "Comprehension, grammar, writing craft, and persuasive techniques with scaffolded practice.",
  },
  {
    slug: "science",
    title: "Science",
    body: "Inquiry skills, concepts, and experiments that build above-level confidence where it matters.",
  },
] as const;

export const CLASSES = [
  { href: "/classes/#regular", label: "Regular Tutoring" },
  { href: "/classes/#special-math", label: "Special Math Class" },
  { href: "/classes/#special-science", label: "Special Science Class" },
  { href: "/classes/#english", label: "Special English Class" },
  { href: "/classes/#hsc", label: "HSC Class" },
  { href: "/classes/#vce", label: "VCE Class" },
  { href: "/classes/#scholarship", label: "Scholarship Preparatory" },
  { href: "/classes/#college", label: "College Preparatory" },
] as const;

export const SEO_PAGES = [
  { href: "/smart-learning-passport", label: "Smart Learning Passport" },
  { href: "/features", label: "All Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/online-tutoring", label: "Online Tutoring" },
  { href: "/assessments", label: "Assessments" },
  { href: "/ai-practice", label: "AI Practice" },
  { href: "/naplan", label: "NAPLAN Prep" },
  { href: "/selective-entry", label: "Selective Entry" },
  { href: "/for-parents", label: "For Parents" },
  { href: "/guides", label: "Parent Guides" },
  { href: "/subjects/mathematics", label: "Mathematics" },
  { href: "/subjects/english", label: "English" },
  { href: "/subjects/science", label: "Science" },
] as const;

export const HOME_FAQS = [
  {
    q: "What is the Bridgitus Smart Learning Passport?",
    a: "It’s a living learning profile built from diagnostic data in Maths, English, and Science. It shows achievement level, specific gaps, mastered outcomes, recommended next steps, weekly goals, progress over time, and a plain-language parent report.",
  },
  {
    q: "How is this different from regular tutoring?",
    a: "Tutoring hours alone don’t prove results. Bridgitus pairs expert teaching with measurable evidence — every flagged skill is taught, practised, and retested until genuine mastery is confirmed.",
  },
  {
    q: "Does AI just give my child the answers?",
    a: "No. Our hard rule: AI prescribes the next learning step and scaffolded hints — never completed answers to graded work. Tutors remain the final layer of judgement.",
  },
  {
    q: "Can we get the Passport without live tutoring?",
    a: "Yes. The Passport is available standalone (termly re-diagnostic + updated passport) or included free with Premium Tutoring Plans.",
  },
  {
    q: "What year levels do you support?",
    a: "Primary through early-secondary foundations in Maths, English, and Science, plus specialised pathways including NAPLAN, Selective Entry, HSC, and VCE classes.",
  },
] as const;
