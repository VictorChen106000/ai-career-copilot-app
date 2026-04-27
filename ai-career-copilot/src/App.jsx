import React, { useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Upload,
  Mail,
  Lock,
  Home,
  User,
  Briefcase,
  Bot,
  FileText,
  Search,
  Bell,
  Plus,
  Sparkles,
  CheckCircle2,
  X,
  Bookmark,
  Send,
  Settings,
  HelpCircle,
  LogOut,
  MapPin,
  ShieldCheck,
  Wand2,
  BarChart3,
  ClipboardList,
  ChevronRight,
  Star,
} from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Junior UX Designer",
    company: "Linear",
    match: 94,
    location: "Remote",
    salary: "$55K–$72K",
    type: "Entry Level",
    why: "Your portfolio, Figma experience, and product thinking match this role strongly.",
    missing: ["Design systems", "A/B testing"],
  },
  {
    id: 2,
    title: "Frontend Engineer Intern",
    company: "Stripe",
    match: 88,
    location: "San Francisco",
    salary: "$32/hr",
    type: "Internship",
    why: "Your React projects and API integration experience fit the core requirements.",
    missing: ["Testing Library", "TypeScript depth"],
  },
  {
    id: 3,
    title: "Product Design Intern",
    company: "Notion",
    match: 82,
    location: "New York",
    salary: "$28/hr",
    type: "Internship",
    why: "Your research, wireframing, and student product experience align well.",
    missing: ["Portfolio case study polish"],
  },
  {
    id: 4,
    title: "Resume AI Analyst",
    company: "Vercel",
    match: 76,
    location: "Remote",
    salary: "$60K–$78K",
    type: "Full Time",
    why: "Your AI tool usage and business background support this hybrid role.",
    missing: ["SQL", "Analytics reporting"],
  },
];

const applications = [
  { company: "Linear", role: "Junior UX Designer", date: "Apr 28", resume: "UX Resume v2", status: "Applied" },
  { company: "Stripe", role: "Frontend Intern", date: "Apr 27", resume: "Frontend Resume v1", status: "Interviewing" },
  { company: "Notion", role: "Product Design Intern", date: "Apr 25", resume: "Design Resume v3", status: "Saved" },
];
const neoOut = "shadow-[12px_12px_28px_rgba(59,130,246,0.16),-12px_-12px_28px_rgba(255,255,255,0.78),inset_1px_1px_0_rgba(255,255,255,0.72)]";
const neoIn = "shadow-[inset_6px_6px_14px_rgba(59,130,246,0.14),inset_-6px_-6px_14px_rgba(255,255,255,0.78)]";
const ViewModeContext = React.createContext("mobile");
const ShellStripContext = React.createContext(false);


const StepPill = ({ children }) => (
  <span className={`rounded-full border border-white/60 bg-white/35 px-3 py-1 text-xs text-slate-600 ${neoOut} backdrop-blur-xl`}>
    {children}
  </span>
);

const GlassIcon = ({ children, className = "" }) => (
  <div className={`grid h-16 w-16 place-items-center rounded-3xl border border-white/60 bg-white/25 ${neoOut} backdrop-blur-2xl ${className}`}>
    {children}
  </div>
);

const PrimaryButton = ({ children, onClick, disabled = false, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-300/30 bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-[10px_10px_22px_rgba(59,130,246,0.35),-8px_-8px_18px_rgba(255,255,255,0.55),inset_1px_1px_0_rgba(255,255,255,0.35)] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_6px_6px_14px_rgba(30,64,175,0.35),inset_-4px_-4px_12px_rgba(255,255,255,0.20)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-white/65 bg-white/35 px-5 py-4 text-sm font-semibold text-slate-700 ${neoOut} backdrop-blur-xl transition hover:bg-white/45  ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-3xl border border-white/60 bg-white/30 p-5 ${neoOut} backdrop-blur-2xl ${className}`}>{children}</div>
);

const SoftInput = ({ icon, placeholder, type = "text", value, onChange }) => {
  const Icon = icon;
  return (
    <label className={`flex items-center gap-3 rounded-2xl border border-white/60 bg-white/25 px-4 py-4 text-sm text-slate-500 ${neoIn} backdrop-blur-xl focus-within:ring-2 focus-within:ring-blue-300/70`}>
      <Icon className="h-5 w-5 shrink-0" />
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" />
    </label>
  );
};

const PhoneShell = ({ children, forceMobile = false }) => {
  const stripShell = useContext(ShellStripContext);
  const viewMode = useContext(ViewModeContext);
  const showWebView = viewMode === "web" && !forceMobile;

  if (stripShell) return <>{children}</>;

  if (showWebView) {
    return (
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-4 py-14 sm:px-8">
        <div className="relative flex h-[760px] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,255,255,.78),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(255,255,255,.48),transparent_30%),linear-gradient(145deg,rgba(255,255,255,.30),rgba(96,165,250,.10))]" />
          <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center px-2 py-3 sm:px-4 sm:py-6">
      <div className="relative mx-auto h-[720px] w-full max-w-[390px] rounded-[2.7rem] bg-slate-900 p-[10px] shadow-[0_20px_60px_rgba(15,23,42,0.35)] ring-1 ring-slate-700/70 sm:h-[760px]">
        <div className="pointer-events-none absolute left-1/2 top-[14px] z-30 h-6 w-32 -translate-x-1/2 rounded-full bg-slate-900 shadow-inner" />
        <div className="pointer-events-none absolute left-[6px] top-28 h-14 w-[3px] rounded-full bg-slate-700/90" />
        <div className="pointer-events-none absolute right-[6px] top-24 h-20 w-[3px] rounded-full bg-slate-700/90" />
        <div className="pointer-events-none absolute right-[6px] top-48 h-12 w-[3px] rounded-full bg-slate-700/90" />
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.2rem] border border-white/60 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,.68),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,.42),transparent_28%),linear-gradient(145deg,rgba(255,255,255,.26),rgba(96,165,250,.08))]" />
          <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1.5 w-36 -translate-x-1/2 rounded-full bg-slate-400/80" />
        </div>
      </div>
    </div>
  );
};

const Screen = ({ children, nav, className = "", go = () => {}, activeTab = "home", onFabClick }) => (
  <div className={`flex h-full min-h-0 flex-1 flex-col ${className}`}>
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
      <div className="px-6 pb-5 pt-8">{children}</div>
    </div>
    {nav && (
      <div className="px-6 pb-6 pt-2">
        <BottomNav go={go} activeTab={activeTab} onFabClick={onFabClick} />
      </div>
    )}
  </div>
);

function BottomNav({ go = () => {}, activeTab = "home", onFabClick }) {
  const items = [
    { icon: Home, label: "Home", key: "home", target: "dashboard" },
    { icon: FileText, label: "Resume", key: "resume", target: "builder" },
    { icon: Plus, label: "", key: "create", target: "builder" },
    { icon: Briefcase, label: "Jobs", key: "jobs", target: "results" },
    { icon: User, label: "Profile", key: "profile", target: "profile" },
  ];
  return (
    <div className={`grid grid-cols-5 items-center rounded-3xl border border-white/70 bg-white/35 p-2 ${neoOut} backdrop-blur-2xl`}>
      {items.map((item, i) => {
        const Icon = item.icon;
        const active = activeTab === item.key;
        if (i === 2) {
          return (
            <button key={item.key} onClick={() => (onFabClick ? onFabClick() : go(item.target))} className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-blue-300/30 bg-blue-600 text-white shadow-[8px_8px_18px_rgba(37,99,235,0.35),-6px_-6px_16px_rgba(255,255,255,0.55)] transition hover:scale-[1.03] active:shadow-[inset_5px_5px_12px_rgba(30,64,175,0.35)]">
              <Icon className="h-5 w-5" />
            </button>
          );
        }
        return (
          <button key={item.key} onClick={() => go(item.target)} className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[10px] transition ${active ? `bg-white/30 text-blue-600 ${neoIn}` : "text-slate-500 hover:bg-white/35"}`}>
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

const Header = ({ title, subtitle, icon, action }) => (
  <div className="mb-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-slate-500">{subtitle}</p>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>
    </div>
    {action}
  </div>
);

function Landing({ go }) {
  return (
    <div className="grid min-h-screen gap-10 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-6 py-8 text-slate-900 lg:grid-cols-[1.05fr_.95fr] lg:px-16">
      <div className="flex flex-col justify-center">
        <div className={`mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/65 bg-white/35 px-4 py-2 text-sm text-blue-700 ${neoOut} backdrop-blur-xl`}>
          <Bot className="h-4 w-4" /> AI Agentic Resume Assistant
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">Let AI handle your job hunting journey.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Build an ATS-friendly resume, discover roles that match your goals, tailor every application, and approve auto-apply actions before anything is submitted.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => go("login")} className="rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-[10px_10px_22px_rgba(59,130,246,0.32),-8px_-8px_18px_rgba(255,255,255,0.6)] transition hover:-translate-y-0.5">Get Started</button>
          <button onClick={() => go("login")} className={`rounded-2xl border border-white/65 bg-white/35 px-7 py-4 font-semibold text-slate-700 ${neoOut} backdrop-blur-xl`}>I already have an account</button>
        </div>
        <div className="mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          {[[FileText, "AI Resume Builder", "Turn your story into a polished resume."], [Search, "Smart Job Matching", "Rank roles by fit, goals, and missing skills."], [Send, "Auto Apply Assistant", "Prepare applications after your approval."]].map(([Icon, title, copy]) => (
            <Card key={title}>
              <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-blue-100/60 text-blue-600 ${neoIn}`}><Icon className="h-5 w-5" /></div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center"><PhoneShell forceMobile><Dashboard mini /></PhoneShell></div>
    </div>
  );
}

function Login({ go }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => { e.preventDefault(); go("dashboard"); };
  return (
    <PhoneShell>
      <Screen>
        <form onSubmit={handleSubmit} className="mx-auto flex h-full min-h-[610px] w-full max-w-[430px] flex-col">
          <div className="flex flex-1 flex-col justify-center">
            <div className="mx-auto mb-8"><GlassIcon><span className="text-4xl">👋</span></GlassIcon></div>
            <h1 className="text-lg font-semibold text-slate-900">Welcome back</h1>
            <p className="mb-8 mt-2 text-sm text-slate-600">Sign in to continue your journey</p>
            <div className="space-y-3">
              <SoftInput icon={Mail} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <SoftInput icon={Lock} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <PrimaryButton className="mt-7" onClick={handleSubmit}>Sign in <ArrowRight className="h-4 w-4" /></PrimaryButton>
            <div className="my-6 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-blue-200" /> or continue with <span className="h-px flex-1 bg-blue-200" /></div>
            <div className="grid grid-cols-2 gap-3"><SecondaryButton onClick={() => go("setup")}>Google</SecondaryButton><SecondaryButton onClick={() => go("dashboard")}>Demo Mode</SecondaryButton></div>
          </div>
          <p className="pb-2 text-center text-sm text-slate-700">Don&apos;t have an account? <button type="button" onClick={() => go("setup")} className="font-semibold text-blue-600">Sign up</button></p>
        </form>
      </Screen>
    </PhoneShell>
  );
}

function Setup({ go }) {
  const fields = ["Desired role", "Industry", "Job type", "Location", "Salary", "Company culture", "Skills to use", "Skills to avoid"];
  return (
    <PhoneShell><Screen>
      <div className="mx-auto mb-6 w-fit"><GlassIcon><Star className="h-9 w-9 fill-yellow-300 text-yellow-400" /></GlassIcon></div>
      <p className="text-xs text-slate-500">Step 1 of 2</p><h1 className="mt-2 text-xl font-semibold text-slate-900">AI Career Setup</h1><p className="mt-2 text-sm text-slate-600">Tell Syncra AI what kind of job journey you want.</p>
      <div className="mt-6 grid gap-3">{fields.map((field) => <div key={field} className={`rounded-2xl border border-white/60 bg-white/25 px-4 py-3 text-sm text-slate-500 ${neoIn} backdrop-blur-xl`}>{field}</div>)}</div>
      <div className="mt-6 space-y-3"><PrimaryButton onClick={() => go("resumeInput")}>Continue <ArrowRight className="h-4 w-4" /></PrimaryButton><SecondaryButton onClick={() => go("story")}>Let AI help me fill this <Sparkles className="h-4 w-4" /></SecondaryButton><button onClick={() => go("resumeInput")} className="w-full py-2 text-sm text-slate-600">Skip for now</button></div>
    </Screen></PhoneShell>
  );
}

function ResumeInput({ go }) {
  return (
    <PhoneShell><Screen>
      <div className="mx-auto mb-8 w-fit"><GlassIcon><Star className="h-9 w-9 fill-yellow-300 text-yellow-400" /></GlassIcon></div>
      <p className="text-xs text-slate-500">Step 2 of 2</p><h1 className="mt-2 text-xl font-semibold text-slate-900">Upload your resume</h1><p className="mt-2 text-sm text-slate-600">Drop your PDF and we&apos;ll match you with the right roles.</p>
      <button onClick={() => go("builder")} className={`mt-8 flex h-40 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/70 bg-white/25 text-slate-800 ${neoIn} backdrop-blur-xl`}><div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-100/60 ${neoOut}`}><Upload className="h-7 w-7" /></div><span className="text-sm font-semibold">Tap to upload PDF</span><span className="mt-1 text-xs text-slate-500">or drag & drop here</span></button>
      <div className="mt-8 space-y-3"><PrimaryButton onClick={() => go("builder")}>Continue <ArrowRight className="h-4 w-4" /></PrimaryButton><SecondaryButton onClick={() => go("story")}>Tell Your Story <Bot className="h-4 w-4" /></SecondaryButton><button onClick={() => go("dashboard")} className="w-full py-2 text-sm text-slate-600">Skip for now</button></div>
    </Screen></PhoneShell>
  );
}

function Story({ go }) {
  const quick = ["What roles fit me?", "Improve my resume", "Salary expectations", "Find internships"];
  return (
    <PhoneShell><Screen>
      <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><div className={`grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-purple-100/55 text-lg ${neoOut}`}>🤖</div><div><h2 className="text-sm font-semibold text-slate-900">Syncra AI</h2><p className="text-xs text-blue-700">Online · Step 1 of 6</p></div></div><button onClick={() => go("dashboard")} className="text-sm text-slate-700">Skip <ArrowRight className="inline h-4 w-4" /></button></div>
      <div className="space-y-3"><div className={`max-w-[82%] rounded-2xl rounded-tl-sm border border-white/60 bg-white/45 p-4 text-sm leading-6 text-slate-800 ${neoOut} backdrop-blur-xl`}>Hi Chris, I&apos;ve reviewed your goal. Tell me what you&apos;re looking for and I&apos;ll tailor matches.</div><div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-blue-600 p-4 text-sm leading-6 text-white shadow-[8px_8px_18px_rgba(37,99,235,0.25)]">I want an entry-level UX or frontend role where I can use design and coding skills.</div><div className={`max-w-[86%] rounded-2xl rounded-tl-sm border border-white/60 bg-white/45 p-4 text-sm leading-6 text-slate-800 ${neoOut} backdrop-blur-xl`}>Great. I&apos;ll ask about your education, projects, skills, experience, achievements, and target role.</div></div>
      <div className="mt-48 flex gap-2 overflow-x-auto pb-3">{quick.map((q) => <button key={q} className={`shrink-0 rounded-full border border-white/60 bg-white/45 px-4 py-2 text-xs font-semibold text-slate-700 ${neoOut}`}>{q}</button>)}</div>
      <div className={`rounded-2xl border border-white/60 bg-white/35 p-2 ${neoIn} backdrop-blur-xl`}><div className="flex items-center gap-2 rounded-xl bg-transparent px-2 py-1 text-sm text-slate-400"><span className="flex-1">Ask anything...</span><button className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg"><Send className="h-4 w-4" /></button></div></div>
      <div className="mt-3 grid grid-cols-2 gap-3"><SecondaryButton onClick={() => go("builder")}>Continue</SecondaryButton><SecondaryButton onClick={() => go("dashboard")}>Save Later</SecondaryButton></div>
    </Screen></PhoneShell>
  );
}

function Builder({ go }) {
  const messages = ["Reading your background", "Writing professional bullet points", "Optimizing for ATS", "Creating a clean resume preview"];
  return (
    <PhoneShell><Screen>
      <Header title="AI Resume Builder" subtitle="Syncra AI is working" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><Wand2 className="h-6 w-6 text-blue-600" /></GlassIcon>} />
      <Card><h3 className="font-semibold text-slate-900">Generating your ATS-friendly resume</h3><div className="mt-4 space-y-3">{messages.map((m, i) => <div key={m} className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle2 className={`h-5 w-5 ${i < 3 ? "text-emerald-500" : "text-blue-500"}`} />{m}</div>)}</div></Card>
      <Card className="mt-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold text-slate-900">Resume Preview</h3><StepPill>ATS ready</StepPill></div><div className={`space-y-2 rounded-2xl bg-white/30 p-4 ${neoIn}`}><div className="h-4 w-32 rounded bg-slate-800" /><div className="h-2 w-44 rounded bg-slate-300" /><div className="mt-4 h-3 w-20 rounded bg-blue-200" /><div className="h-2 w-full rounded bg-slate-300" /><div className="h-2 w-5/6 rounded bg-slate-300" /><div className="mt-4 h-3 w-24 rounded bg-blue-200" /><div className="h-2 w-full rounded bg-slate-300" /><div className="h-2 w-4/5 rounded bg-slate-300" /></div></Card>
      <div className="mt-5 grid gap-3"><PrimaryButton onClick={() => go("analysis")}>Analyze Resume <BarChart3 className="h-4 w-4" /></PrimaryButton><div className="grid grid-cols-2 gap-3"><SecondaryButton>Improve with AI</SecondaryButton><SecondaryButton>Edit Manually</SecondaryButton></div><SecondaryButton onClick={() => go("dashboard")}>Save Resume</SecondaryButton></div>
    </Screen></PhoneShell>
  );
}

function Analysis({ go }) {
  const items = [["ATS Compatibility", 86], ["Skills Strength", 78], ["Experience Clarity", 74], ["Role Relevance", 80], ["Formatting", 92], ["Missing Keywords", 63]];
  return (
    <PhoneShell><Screen>
      <Header title="Resume Analysis" subtitle="Score and improvement plan" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><BarChart3 className="h-6 w-6 text-blue-600" /></GlassIcon>} />
      <Card className="text-center"><div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[10px_10px_24px_rgba(37,99,235,0.30),-8px_-8px_20px_rgba(255,255,255,0.55)]"><div><div className="text-3xl font-bold">78</div><div className="text-xs">/100</div></div></div><h3 className="mt-4 font-semibold text-slate-900">Good foundation</h3><p className="mt-1 text-sm text-slate-600">AI found 6 improvements before job matching.</p></Card>
      <div className="mt-4 space-y-3">{items.map(([name, score]) => <Card key={name} className="py-4"><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-700">{name}</span><span className="text-blue-700">{score}%</span></div><div className={`h-2 overflow-hidden rounded-full bg-white/35 ${neoIn}`}><div className="h-full rounded-full bg-blue-500" style={{ width: `${score}%` }} /></div></Card>)}</div>
      <div className="mt-5 grid gap-3"><PrimaryButton onClick={() => go("skill")}>Apply AI Improvements</PrimaryButton><SecondaryButton onClick={() => go("skill")}>View Missing Skills</SecondaryButton><button onClick={() => go("dashboard")} className="w-full py-2 text-sm text-slate-600">Go to Dashboard</button></div>
    </Screen></PhoneShell>
  );
}

function Skill({ go }) {
  return (
    <PhoneShell><Screen>
      <Header title="Skill Market Analysis" subtitle="Compare skills with market demand" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><Sparkles className="h-6 w-6 text-blue-600" /></GlassIcon>} />
      <Card><h3 className="font-semibold text-slate-900">Should AI scan the current market?</h3><p className="mt-2 text-sm leading-6 text-slate-600">I can scan demo job posts, compare common requirements with your resume, and create a skill gap report.</p><PrimaryButton className="mt-4" onClick={() => {}}>Start scan</PrimaryButton></Card>
      <div className="mt-4 space-y-3">{[["Already strong", ["Figma", "React", "Research"]], ["Missing skills", ["TypeScript", "A/B Testing", "SQL"]], ["Trending skills", ["AI workflow", "Design system", "Analytics"]], ["Learning priorities", ["TypeScript basics", "Portfolio case study", "Testing"]]].map(([title, chips]) => <Card key={title}><h3 className="mb-3 font-semibold text-slate-900">{title}</h3><div className="flex flex-wrap gap-2">{chips.map((c) => <StepPill key={c}>{c}</StepPill>)}</div></Card>)}</div>
      <div className="mt-5"><PrimaryButton onClick={() => go("dashboard")}>Go to Dashboard</PrimaryButton></div>
    </Screen></PhoneShell>
  );
}

function Dashboard({ go = () => {}, mini = false, onFabClick }) {
  return (
    <Screen nav={!mini} go={go} activeTab="home" onFabClick={onFabClick}>
      <Header title="Good morning, Chris" subtitle="Your AI agent is ready" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><span className="text-2xl">🪙</span></GlassIcon>} action={<button className={`grid h-12 w-12 place-items-center rounded-2xl border border-white/60 bg-white/35 text-slate-700 ${neoOut}`}><Bell className="h-5 w-5" /></button>} />
      <div className={`mb-5 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/25 px-4 py-4 text-sm text-slate-400 ${neoIn} backdrop-blur-xl`}><Search className="h-5 w-5" /> Search roles, companies...</div>
      <Card className="mb-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">Analyzing resume</h3><p className="mt-1 text-sm text-slate-600">5 strong job matches are ready.</p></div><StepPill>78/100</StepPill></div><div className="mt-4 grid grid-cols-3 gap-3 text-center">{[["47", "Matches"], ["12", "Applied"], ["8", "Saved"]].map(([n, l]) => <div key={l} className={`rounded-2xl bg-white/25 p-3 ${neoIn}`}><p className="font-semibold">{n}</p><p className="text-[11px] text-slate-500">{l}</p></div>)}</div></Card>
      <Card className="mb-5"><div className="flex items-start gap-3"><div className={`grid h-11 w-11 place-items-center rounded-2xl bg-blue-100/60 text-blue-600 ${neoIn}`}><Bot className="h-5 w-5" /></div><div><h3 className="font-semibold text-slate-900">AI recommendation</h3><p className="mt-1 text-sm leading-6 text-slate-600">Start a focused job search for junior UX and frontend roles using your improved resume.</p></div></div></Card>
      <div className="grid grid-cols-2 gap-3">{[["Build Resume", FileText, "builder"], ["Analyze Resume", BarChart3, "analysis"], ["Find Jobs", Search, "jobSetup"], ["Skill Gap", Sparkles, "skill"], ["Tracker", ClipboardList, "tracker"], ["Profile Vault", User, "profile"]].map(([label, Icon, target]) => <button key={label} onClick={() => go(target)} className={`min-h-[108px] rounded-3xl border border-white/60 bg-white/30 p-4 text-left ${neoOut} backdrop-blur-xl transition hover:bg-white/40`}><Icon className="mb-4 h-5 w-5 text-blue-600" /><span className="text-sm font-semibold text-slate-800">{label}</span></button>)}</div>
      {!mini && <div className="mt-5"><PrimaryButton onClick={() => go("jobSetup")}>Start AI Job Search <ArrowRight className="h-4 w-4" /></PrimaryButton></div>}
    </Screen>
  );
}

function JobSetup({ go }) {
  return (
    <PhoneShell><Screen><Header title="AI Job Search Setup" subtitle="Choose resume and search sources" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><Search className="h-6 w-6 text-blue-600" /></GlassIcon>} />
      <Card><h3 className="font-semibold text-slate-900">Search preferences</h3><div className="mt-4 space-y-3 text-sm text-slate-700"><div className="flex justify-between"><span>Role</span><b>UX / Frontend</b></div><div className="flex justify-between"><span>Location</span><b>Remote or Taiwan</b></div><div className="flex justify-between"><span>Resume</span><b>ATS Resume v2</b></div></div></Card>
      <Card className="mt-4"><h3 className="font-semibold text-slate-900">Sources</h3><div className="mt-3 grid gap-2">{["LinkedIn", "Indeed", "Company career pages", "Internship platforms"].map((s) => <div key={s} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-blue-600" />{s}</div>)}</div></Card>
      <div className="mt-6 space-y-3"><PrimaryButton onClick={() => go("running")}>Start AI Job Search</PrimaryButton><SecondaryButton>Edit Preferences</SecondaryButton><SecondaryButton onClick={() => go("builder")}>Edit Resume First</SecondaryButton></div>
    </Screen></PhoneShell>
  );
}

function Running({ go }) {
  const steps = ["Searching platforms", "Checking requirements", "Comparing with resume", "Filtering by preferences", "Ranking best matches"];
  return (
    <PhoneShell><Screen><Header title="AI Agent Running" subtitle="Background job search" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><Bot className="h-6 w-6 text-blue-600" /></GlassIcon>} />
      <Card className="text-center"><div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-blue-600 text-white shadow-[10px_10px_24px_rgba(37,99,235,0.30),-8px_-8px_20px_rgba(255,255,255,0.55)]"><Sparkles className="h-10 w-10" /></div><h3 className="font-semibold text-slate-900">Searching jobs in the background</h3><p className="mt-2 text-sm leading-6 text-slate-600">You can close the app. I&apos;ll notify you when the search is complete.</p></Card>
      <div className="mt-4 space-y-3">{steps.map((s, i) => <Card key={s} className="flex items-center gap-3 py-4"><CheckCircle2 className={`h-5 w-5 ${i < 3 ? "text-emerald-500" : "text-blue-500"}`} /><span className="text-sm font-medium text-slate-700">{s}</span></Card>)}</div>
      <div className="mt-6 space-y-3"><PrimaryButton onClick={() => go("complete")}>Notify Me When Done</PrimaryButton><SecondaryButton onClick={() => go("results")}>View Live Progress</SecondaryButton><button onClick={() => go("dashboard")} className="w-full py-2 text-sm text-slate-600">Cancel Search</button></div>
    </Screen></PhoneShell>
  );
}

function Complete({ go }) {
  return <PhoneShell><Screen><div className="flex min-h-[610px] flex-col justify-center"><Card className="text-center"><div className={`mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-blue-100/60 text-blue-600 ${neoOut}`}><Bell className="h-9 w-9" /></div><h1 className="text-xl font-semibold text-slate-900">Your job search is complete.</h1><p className="mt-3 text-sm leading-6 text-slate-600">32 jobs found. 8 are strong matches. Tap to review your best opportunities.</p><PrimaryButton className="mt-6" onClick={() => go("results")}>Review best opportunities</PrimaryButton></Card></div></Screen></PhoneShell>;
}

function JobCard({ job, go }) {
  return (
    <Card className="mb-3"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-100/60 text-sm font-semibold text-blue-700 ${neoIn}`}>{job.company[0]}</div><div><h3 className="font-semibold text-slate-900">{job.company}</h3><p className="text-sm text-slate-700">{job.title}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" /> {job.location}</p></div></div><span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-600">{job.match}% match</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{job.why}</p><div className="mt-3 flex flex-wrap gap-2"><StepPill>{job.type}</StepPill><StepPill>{job.salary}</StepPill><StepPill>Missing: {job.missing[0]}</StepPill></div><div className="mt-4 grid grid-cols-3 gap-2"><button onClick={() => go("detail", job)} className="rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white shadow-[6px_6px_14px_rgba(37,99,235,0.25)]">Details</button><button className={`rounded-xl bg-white/30 py-2 text-xs font-semibold text-slate-700 ${neoOut}`}>Save</button><button onClick={() => go("tailor", job)} className={`rounded-xl bg-white/30 py-2 text-xs font-semibold text-slate-700 ${neoOut}`}>Apply</button></div></Card>
  );
}

function Results({ go }) {
  return <PhoneShell><Screen nav go={go} activeTab="jobs"><Header title="Job Results" subtitle="32 jobs found" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><Briefcase className="h-6 w-6 text-blue-600" /></GlassIcon>} /><div className="mb-4 grid grid-cols-3 gap-2 text-center">{[["8", "Strong"], ["15", "Medium"], ["9", "Low"]].map(([n, l]) => <Card key={l} className="p-3"><p className="font-semibold text-slate-900">{n}</p><p className="text-[11px] text-slate-500">{l}</p></Card>)}</div><div className="mb-4 flex gap-2 overflow-x-auto pb-2">{["Best Match", "Remote", "Internship", "Entry Level", "High Salary", "Saved"].map((f) => <button key={f} className={`shrink-0 rounded-full border border-white/60 bg-white/35 px-4 py-2 text-xs font-semibold text-slate-700 ${neoOut}`}>{f}</button>)}</div>{jobs.map((job) => <JobCard key={job.id} job={job} go={go} />)}</Screen></PhoneShell>;
}

function Detail({ go, selectedJob }) {
  const job = selectedJob || jobs[0];
  return <PhoneShell><Screen><Header title={job.title} subtitle={job.company} icon={<GlassIcon className="h-12 w-12 rounded-2xl"><Briefcase className="h-6 w-6 text-blue-600" /></GlassIcon>} /><Card><div className="flex items-center justify-between"><h3 className="font-semibold text-slate-900">Match analysis</h3><span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-600">{job.match}%</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{job.why}</p></Card><Card className="mt-4"><h3 className="font-semibold text-slate-900">Requirement checklist</h3><div className="mt-3 space-y-3">{["Resume includes relevant projects", "Location and job type match", "Strong design/coding keywords", ...job.missing.map((m) => `Needs improvement: ${m}`)].map((r, i) => <div key={r} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className={`h-4 w-4 ${i < 3 ? "text-emerald-500" : "text-amber-500"}`} />{r}</div>)}</div></Card><Card className="mt-4"><h3 className="font-semibold text-slate-900">Recommended resume changes</h3><p className="mt-2 text-sm leading-6 text-slate-600">Add role-specific keywords, strengthen project impact, and rewrite one bullet to show measurable results.</p></Card><div className="mt-6 space-y-3"><PrimaryButton onClick={() => go("tailor", job)}>Tailor Resume for This Job</PrimaryButton><SecondaryButton onClick={() => go("review", job)}>Apply with Current Resume</SecondaryButton><SecondaryButton>Save Job</SecondaryButton><button onClick={() => go("results")} className="w-full py-2 text-sm text-slate-600">Back to Results</button></div></Screen></PhoneShell>;
}

function Tailor({ go, selectedJob }) {
  const job = selectedJob || jobs[0];
  return <PhoneShell><Screen><Header title="Tailor Resume" subtitle={`${job.company} · ${job.title}`} icon={<GlassIcon className="h-12 w-12 rounded-2xl"><Wand2 className="h-6 w-6 text-blue-600" /></GlassIcon>} /><Card><h3 className="font-semibold text-slate-900">Before</h3><p className="mt-2 text-sm leading-6 text-slate-600">Created a student app project using React and Figma.</p></Card><Card className="mt-4 bg-blue-50/40"><h3 className="font-semibold text-slate-900">After</h3><p className="mt-2 text-sm leading-6 text-slate-700">Designed and built a responsive AI career prototype with React, Figma workflows, and user-centered job matching features.</p></Card><Card className="mt-4"><h3 className="font-semibold text-slate-900">Keywords added</h3><div className="mt-3 flex flex-wrap gap-2"><StepPill>Responsive design</StepPill><StepPill>AI workflow</StepPill><StepPill>Job matching</StepPill></div></Card><div className="mt-6 space-y-3"><PrimaryButton onClick={() => go("review", job)}>Accept Changes</PrimaryButton><SecondaryButton>Edit Changes</SecondaryButton><button onClick={() => go("review", job)} className="w-full py-2 text-sm text-slate-600">Keep Original Resume</button></div></Screen></PhoneShell>;
}

function Review({ go, selectedJob }) {
  const job = selectedJob || jobs[0];
  return <PhoneShell><Screen><Header title="Review Application" subtitle="You are always in control" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><ShieldCheck className="h-6 w-6 text-blue-600" /></GlassIcon>} /><Card><h3 className="font-semibold text-slate-900">{job.company}</h3><p className="mt-1 text-sm text-slate-600">{job.title} · {job.location}</p><div className={`mt-4 rounded-2xl bg-blue-50/45 p-3 text-sm text-blue-800 ${neoIn}`}>Review carefully before submitting. You are always in control.</div></Card><Card className="mt-4"><h3 className="font-semibold text-slate-900">Selected resume</h3><p className="mt-2 text-sm text-slate-600">Job-tailored Resume v3 · ATS optimized</p></Card><Card className="mt-4"><h3 className="font-semibold text-slate-900">Cover letter preview</h3><p className="mt-2 text-sm leading-6 text-slate-600">Dear hiring team, I&apos;m excited to apply because this role matches my UX, frontend, and AI product interests...</p></Card><Card className="mt-4"><h3 className="font-semibold text-slate-900">Autofill information</h3><p className="mt-2 text-sm text-slate-600">Name, email, portfolio link, education, work authorization.</p></Card><div className="mt-6 space-y-3"><PrimaryButton onClick={() => go("submitted", job)}>Approve & Auto Apply</PrimaryButton><SecondaryButton>Edit Application</SecondaryButton><button onClick={() => go("results")} className="w-full py-2 text-sm text-slate-600">Cancel</button></div></Screen></PhoneShell>;
}

function Submitted({ go, selectedJob }) {
  const job = selectedJob || jobs[0];
  return <PhoneShell><Screen><div className="flex min-h-[610px] flex-col justify-center"><Card className="text-center"><div className={`mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-emerald-100/70 text-emerald-600 ${neoOut}`}><CheckCircle2 className="h-12 w-12" /></div><h1 className="text-xl font-semibold text-slate-900">Application submitted</h1><p className="mt-3 text-sm leading-6 text-slate-600">{job.company} · {job.title}</p><div className={`mt-4 rounded-2xl bg-white/30 p-4 text-left text-sm text-slate-600 ${neoIn}`}><p><b className="text-slate-800">Resume:</b> Job-tailored Resume v3</p><p><b className="text-slate-800">Submitted:</b> Today, 3:48 AM</p></div><div className="mt-6 space-y-3"><PrimaryButton onClick={() => go("tracker")}>Track Application</PrimaryButton><SecondaryButton onClick={() => go("results")}>Apply to Next Job</SecondaryButton><SecondaryButton onClick={() => go("dashboard")}>Back to Dashboard</SecondaryButton></div></Card></div></Screen></PhoneShell>;
}

function Tracker({ go }) {
  const statuses = ["Saved", "Applied", "Interviewing", "Rejected", "Offer"];
  return <PhoneShell><Screen nav go={go} activeTab="jobs"><Header title="Application Tracker" subtitle="Track every opportunity" icon={<GlassIcon className="h-12 w-12 rounded-2xl"><ClipboardList className="h-6 w-6 text-blue-600" /></GlassIcon>} /><div className="mb-4 flex gap-2 overflow-x-auto pb-2">{statuses.map((s) => <button key={s} className={`shrink-0 rounded-full border border-white/60 bg-white/35 px-4 py-2 text-xs font-semibold text-slate-700 ${neoOut}`}>{s}</button>)}</div><div className="space-y-3">{applications.map((a) => <Card key={a.company}><div className="flex items-start justify-between"><div><h3 className="font-semibold text-slate-900">{a.company}</h3><p className="text-sm text-slate-600">{a.role}</p></div><StepPill>{a.status}</StepPill></div><p className="mt-3 text-xs text-slate-500">Applied {a.date} · {a.resume}</p><div className="mt-4 grid grid-cols-3 gap-2"><button className={`rounded-xl bg-white/30 py-2 text-xs font-semibold ${neoOut}`}>Update</button><button className="rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white shadow-[6px_6px_14px_rgba(37,99,235,0.25)]">Interview</button><button className={`rounded-xl bg-white/30 py-2 text-xs font-semibold ${neoOut}`}>Resume</button></div></Card>)}</div></Screen></PhoneShell>;
}

function Profile({ go }) {
  const rows = [[FileText, "My resumes", "2"], [Bookmark, "Saved roles", "12"], [Bell, "Notifications", "On"], [Settings, "Settings", ""], [HelpCircle, "Help & support", ""]];
  return <PhoneShell><Screen nav go={go} activeTab="profile"><h1 className="mb-6 text-xl font-semibold text-slate-900">Profile</h1><Card className="mb-5 text-center"><div className="mx-auto mb-4"><GlassIcon><span className="text-4xl">🪙</span></GlassIcon></div><h2 className="font-semibold text-slate-900">Chris Anderson</h2><p className="text-sm text-slate-500">chris@syncra.app</p><div className="mt-5 grid grid-cols-3 gap-3">{[["47", "Matches"], ["12", "Applied"], ["8", "Saved"]].map(([n, l]) => <div key={l} className={`rounded-2xl bg-white/25 p-3 ${neoIn}`}><p className="font-semibold">{n}</p><p className="text-[11px] text-slate-500">{l}</p></div>)}</div></Card><div className="space-y-3">{rows.map(([Icon, label, value]) => <button key={label} className={`flex w-full items-center gap-4 rounded-3xl border border-white/60 bg-white/30 p-4 text-left ${neoOut} backdrop-blur-xl`}><div className={`grid h-11 w-11 place-items-center rounded-2xl bg-blue-100/60 text-slate-700 ${neoIn}`}><Icon className="h-5 w-5" /></div><span className="flex-1 text-sm font-semibold text-slate-800">{label}</span><span className="text-xs text-slate-500">{value}</span><ChevronRight className="h-4 w-4 text-slate-400" /></button>)}<button className={`flex w-full items-center justify-center gap-2 rounded-3xl border border-white/60 bg-white/30 p-4 text-sm font-semibold text-slate-700 ${neoOut}`}><LogOut className="h-4 w-4" /> Log out</button></div></Screen></PhoneShell>;
}

function QuickStartModal({ close, go }) {
  const opts = [[Wand2, "Answer a few questions, get a tailored resume.", "story"], [FileText, "Pick a clean, ATS-friendly layout.", "builder"], [Upload, "Import a PDF and refine it here.", "resumeInput"]];
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/45 p-3 backdrop-blur-sm">
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`w-full rounded-[2rem] border border-white/70 bg-white/55 p-6 ${neoOut} backdrop-blur-2xl`}>
        <div className="mb-5 flex items-center justify-between"><p className="text-sm text-slate-600">How would you like to start?</p><button onClick={close} className={`grid h-10 w-10 place-items-center rounded-full bg-blue-50/60 text-slate-400 ${neoOut}`}><X className="h-5 w-5" /></button></div>
        <div className="space-y-3">{opts.map(([Icon, text, target]) => <button key={text} onClick={() => { close(); go(target); }} className={`flex w-full items-center gap-4 rounded-2xl border border-white/70 bg-white/35 p-4 text-left ${neoOut}`}><div className={`grid h-12 w-12 place-items-center rounded-2xl bg-blue-100/70 text-blue-500 ${neoIn}`}><Icon className="h-5 w-5" /></div><span className="text-sm text-slate-600">{text}</span></button>)}</div>
      </motion.div>
    </div>
  );
}

function ViewSwitchButton({ viewMode, onToggle }) {
  const isWeb = viewMode === "web";

  const MobileIcon = ({ active }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[18px] w-[18px] transition-colors duration-300 ${active ? "text-zinc-950" : "text-white/75"}`}
    >
      <rect x="7" y="3" width="10" height="18" rx="2.4" />
      <path d="M10.5 17h3" />
    </svg>
  );

  const WebIcon = ({ active }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[18px] w-[18px] transition-colors duration-300 ${active ? "text-zinc-950" : "text-white/75"}`}
    >
      <rect x="3" y="5" width="18" height="12" rx="2.2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isWeb ? "Switch to mobile view" : "Switch to website view"}
      title={isWeb ? "Switch to mobile view" : "Switch to website view"}
      className="relative h-9 w-[96px] overflow-hidden rounded-full border border-white/25 bg-zinc-950 p-[3px] shadow-[0_14px_28px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(0,0,0,0.55)] backdrop-blur-xl transition hover:-translate-y-0.5 active:translate-y-0"
    >
      <motion.span
        className="absolute left-[3px] top-[3px] z-0 h-[30px] w-[45px] rounded-full bg-white shadow-[0_7px_16px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(0,0,0,0.06)]"
        animate={{ x: isWeb ? 45 : 0 }}
        transition={{
          type: "spring",
          stiffness: 430,
          damping: 30,
          mass: 0.7,
        }}
      />

      <div className="relative z-10 grid h-full grid-cols-2 items-center">
        <motion.span
          className="grid h-full place-items-center rounded-full"
          animate={{ scale: isWeb ? 0.86 : 1 }}
          transition={{ type: "spring", stiffness: 430, damping: 28 }}
        >
          <MobileIcon active={!isWeb} />
        </motion.span>
        <motion.span
          className="grid h-full place-items-center rounded-full"
          animate={{ scale: isWeb ? 1 : 0.86 }}
          transition={{ type: "spring", stiffness: 430, damping: 28 }}
        >
          <WebIcon active={isWeb} />
        </motion.span>
      </div>
    </button>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [modal, setModal] = useState(false);
  const [viewMode, setViewMode] = useState("mobile");

  const go = (next, job) => {
    if (job) setSelectedJob(job);
    if (next === "builder") setModal(false);
    setScreen(next);
  };

  const component = useMemo(() => {
    switch (screen) {
      case "landing": return <Landing go={go} />;
      case "login": return <Login go={go} />;
      case "setup": return <Setup go={go} />;
      case "resumeInput": return <ResumeInput go={go} />;
      case "story": return <Story go={go} />;
      case "builder": return <Builder go={go} />;
      case "analysis": return <Analysis go={go} />;
      case "skill": return <Skill go={go} />;
      case "dashboard": return <PhoneShell><div className="relative h-full min-h-0 overflow-hidden"><Dashboard go={(next) => next === "builder" ? setModal(true) : go(next)} onFabClick={() => setModal(true)} />{modal && <QuickStartModal close={() => setModal(false)} go={go} />}</div></PhoneShell>;
      case "jobSetup": return <JobSetup go={go} />;
      case "running": return <Running go={go} />;
      case "complete": return <Complete go={go} />;
      case "results": return <Results go={go} />;
      case "detail": return <Detail go={go} selectedJob={selectedJob} />;
      case "tailor": return <Tailor go={go} selectedJob={selectedJob} />;
      case "review": return <Review go={go} selectedJob={selectedJob} />;
      case "submitted": return <Submitted go={go} selectedJob={selectedJob} />;
      case "tracker": return <Tracker go={go} />;
      case "profile": return <Profile go={go} />;
      default: return <Landing go={go} />;
    }
  }, [screen, selectedJob, modal, viewMode]);

  const insideAppTransition = screen !== "landing";

  return (
    <ViewModeContext.Provider value={viewMode}>
      <main className="min-h-screen bg-slate-950/95 font-sans">
        <div className="fixed left-4 top-4 z-40 flex flex-wrap items-center gap-2">
          <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow">
            AI Career Copilot Prototype · {screen}
          </div>

          {screen !== "landing" && (
            <button
              onClick={() => {
                setModal(false);
                setScreen("landing");
              }}
              className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-blue-700 shadow transition hover:-translate-y-0.5 hover:bg-white"
            >
              ← Get Started Screen
            </button>
          )}

          {screen !== "landing" && (
            <ViewSwitchButton
              viewMode={viewMode}
              onToggle={() => setViewMode((mode) => (mode === "mobile" ? "web" : "mobile"))}
            />
          )}
        </div>

        {insideAppTransition ? (
          <PhoneShell>
            <ShellStripContext.Provider value={true}>
              <div className="relative h-full min-h-0 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={screen}
                    className="absolute inset-0 h-full min-h-0"
                    initial={{ opacity: 0, x: 22, scale: 0.985, filter: "blur(7px)" }}
                    animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -18, scale: 0.985, filter: "blur(7px)" }}
                    transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {component}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ShellStripContext.Provider>
          </PhoneShell>
        ) : (
          component
        )}

        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}`}</style>
      </main>
    </ViewModeContext.Provider>
  );
}
