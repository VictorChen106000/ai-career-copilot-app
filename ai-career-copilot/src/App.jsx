import React, { useContext, useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Upload,
  Mail,
  Lock,
  Home,
  User,
  Briefcase,
  Infinity as InfinityIcon,
  FileText,
  Search,
  Bell,
  Plus,
  Sparkles,
  CheckCircle2,
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
  ChevronLeft,
  Star,
  PenLine,
  Filter,
  Clock,
  Palette,
  Wifi,
  Battery,
  Signal,
  Trash2,
  AlertCircle,
  ThumbsDown,
} from "lucide-react";

// --- LOCAL VSCODE IMAGES ---
// Put your actual .jpg/.png files in the `public` folder of your VSCode project.
const PROFILE_IMG_URL = "/profile.jpg";
const LOGO_IMG_URL = "/logo.png";
const LOGIN_BG_IMG_URL = "/login-bg.jpg";

// --- AGENTIC JOB DATA (The Approval Queue) ---
// This exactly matches your 5 Scenarios for the MVP Demo!
const jobs = [
  {
    id: 1,
    title: "React Developer",
    company: "TechFlow",
    location: "Remote",
    salary: "$120K–$140K",
    category: "ready", // Capability 1: Autonomous Drafter (Scenario 1)
    match: 95,
    agentAction: "Application Tailored",
    agentJustification:
      "I matched your React projects to this role and drafted a custom resume emphasizing your frontend skills.",
    skills: ["React", "Frontend", "Tailwind"],
    missing: [],
    why: "Your specialized experience in building complex React dashboards aligns perfectly with TechFlow's internal tooling team.",
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Linear",
    location: "San Francisco, CA",
    salary: "$90K–$120K",
    category: "input_needed", // Capability 2: Collaborator (Scenario 2)
    match: 94,
    agentAction: "Missing Requirement",
    agentJustification:
      "This role requires A/B testing. Do you have any experience with this? Reply with a quick sentence and I will weave it into your tailored draft.",
    skills: ["User Research", "Figma", "Prototyping"],
    missing: ["A/B Testing"],
    why: "Linear's focus on high-fidelity visual craft matches your portfolio, but they specifically want data-driven design validation.",
  },
  {
    id: 3,
    title: "Data Visualization Specialist",
    company: "Vercel",
    location: "New York, NY",
    salary: "$140K-$160K",
    category: "exploration", // Capability 3: Strategist / Pivot (Scenario 4)
    match: 98,
    agentAction: "Strategic Pivot",
    agentJustification:
      "You asked for Frontend, but your Python and D3.js skills make you a unicorn for this Data Viz role paying $20k more. Should I draft an application?",
    skills: ["Python", "D3.js", "Data Viz"],
    missing: [],
    why: "Your hidden strength in mathematical visualization puts you in the top 1% of applicants for this specialized role.",
  },
];

const applications = [
  {
    company: "Linear",
    role: "Junior UX Designer",
    date: "Apr 28",
    resume: "UX Resume v2",
    status: "Applied",
  },
  {
    company: "Stripe",
    role: "Frontend Intern",
    date: "Apr 27",
    resume: "Frontend Resume v1",
    status: "Interviewing",
  },
  {
    company: "Notion",
    role: "Product Design Intern",
    date: "Apr 25",
    resume: "Design Resume v3",
    status: "Saved",
  },
];

const isResumeFile = (file) => {
  const name = file?.name?.toLowerCase?.() || "";
  return (
    name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx")
  );
};

const isPdfResume = (item) => {
  const name = item?.name?.toLowerCase?.() || "";
  return item?.type === "application/pdf" || name.endsWith(".pdf");
};

const formatFileSize = (size) => {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatUploadDate = (value) => {
  if (!value) return "just now";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const cleanPdfText = (value) =>
  String(value || "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E]/g, "-")
    .slice(0, 92);

const escapePdfText = (value) =>
  cleanPdfText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const createSimplePdfBlob = (title, lines = []) => {
  const safeLines = [title, "", ...lines].map((line) => escapePdfText(line));
  const contentLines = [
    "BT",
    "/F1 18 Tf",
    "50 750 Td",
    `(${safeLines[0]}) Tj`,
    "/F1 10 Tf",
    "0 -24 Td",
  ];
  safeLines.slice(2, 38).forEach((line) => {
    contentLines.push(`(${line}) Tj`, "0 -15 Td");
  });
  contentLines.push("ET");
  const content = contentLines.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${
    objects.length + 1
  } /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
};

const buildAiGeneratedResume = (answers = []) => {
  const answerText = answers.map((item) => item.answer).join(" ");
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const lines = [
    "Chris Anderson",
    "AI-generated resume draft - created by Syncra AI",
    `Generated: ${today}`,
    "",
    "PROFILE SUMMARY",
    "Entry-level UX and frontend candidate with experience in AI product prototyping,",
    "responsive React interfaces, UI/UX planning, and user-centered design workflows.",
    "",
    "TARGET ROLE",
    answers[0]?.answer ||
      "Junior UX Designer, Frontend Developer, or Product Design Intern",
    "",
    "EDUCATION",
    answers[1]?.answer ||
      "International Business student with software project and UI/UX experience.",
    "",
    "PROJECT EXPERIENCE",
    answers[2]?.answer ||
      "Built an AI Career Copilot prototype with resume upload, chatbot, and job matching flows.",
    "",
    "SKILLS",
    answers[3]?.answer ||
      "React, JavaScript, Tailwind CSS, Figma, UI/UX Design, Prompt Engineering",
    "",
    "ACHIEVEMENTS",
    answers[4]?.answer ||
      "Created and deployed an interactive Vercel prototype for team testing.",
    "",
    "AI NOTES",
    "This draft was generated from guided user answers and optimized for ATS-friendly sections.",
  ];
  const blob = createSimplePdfBlob("AI Generated Resume", lines);
  return {
    id: `ai-resume-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: "AI Generated Resume - Chris Anderson.pdf",
    size: blob.size,
    type: "application/pdf",
    uploadedAt: new Date().toISOString(),
    url: URL.createObjectURL(blob),
    source: "Syncra AI",
    summary: answerText.slice(0, 180),
  };
};

const neoOut = "";
const neoIn = "";
const ViewModeContext = React.createContext("mobile");
const ShellStripContext = React.createContext(false);
const syncraLogoPng = "https://placehold.co/400x400/a0fe08/000100?text=Syncra";

const StepPill = ({ children, accent = false }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-bold ${
      accent
        ? "bg-[#a0fe08] text-[#000100]"
        : "border border-[#d1d3d2] bg-[#ffffff] text-[#000100]"
    }`}
  >
    {children}
  </span>
);

const GlassIcon = ({ children, className = "" }) => (
  <div
    className={`grid h-16 w-16 place-items-center rounded-full bg-[#000100] text-white ${className}`}
  >
    {children}
  </div>
);

const BackButton = ({ onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1 -ml-1 flex shrink-0 items-center justify-center transition active:opacity-60 ${className}`}
    aria-label="Go back"
  >
    <ChevronLeft
      className="h-[28px] w-[28px] text-[#000100]"
      strokeWidth={2.5}
    />
  </button>
);

const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  className = "",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#000100] px-5 py-4 text-sm font-bold text-white transition active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-center gap-2 rounded-xl border border-[#d1d3d2] bg-[#ffffff] px-5 py-4 text-sm font-bold text-[#000100] transition active:bg-[#eaeceb] ${className}`}
  >
    {children}
  </button>
);

const TopNavButton = ({ children, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#000100] px-4 py-2 text-sm font-bold text-white transition active:opacity-80 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "", onClick = null }) => (
  <div
    onClick={onClick}
    className={`rounded-3xl border border-[#d1d3d2] bg-[#ffffff] p-5 ${className}`}
  >
    {children}
  </div>
);

const SoftInput = ({ icon, placeholder, type = "text", value, onChange }) => {
  const Icon = icon;
  return (
    <label className="flex items-center gap-3 rounded-xl border border-[#d1d3d2] bg-[#ffffff] px-4 py-4 text-sm text-[#666666] focus-within:ring-2 focus-within:ring-[#a0fe08]">
      <Icon className="h-5 w-5 shrink-0 text-[#000100]" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-[#000100] outline-none placeholder:text-[#999999]"
      />
    </label>
  );
};

const PhoneShell = ({ children, forceMobile = false, theme = "light" }) => {
  const stripShell = useContext(ShellStripContext);
  const viewMode = useContext(ViewModeContext);
  const showWebView = viewMode === "web" && !forceMobile;
  const isDark = theme === "dark";
  const statusColor = isDark ? "text-white" : "text-[#000100]";

  if (stripShell) return <>{children}</>;

  if (showWebView) {
    return (
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-4 py-14 sm:px-8">
        <div className="relative flex h-[760px] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border border-[#d1d3d2] bg-[#eaeceb]">
          <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center px-2 py-3 sm:px-4 sm:py-6">
      <div className="relative mx-auto h-[720px] w-full max-w-[390px] rounded-[2.7rem] bg-[#000100] p-[10px] ring-1 ring-[#333] sm:h-[760px]">
        <div className="pointer-events-none absolute left-1/2 top-[14px] z-30 h-6 w-32 -translate-x-1/2 rounded-full bg-[#000100]" />
        <div className="pointer-events-none absolute left-[6px] top-28 h-14 w-[3px] rounded-full bg-[#333]" />
        <div className="pointer-events-none absolute right-[6px] top-24 h-20 w-[3px] rounded-full bg-[#333]" />
        <div className="pointer-events-none absolute right-[6px] top-48 h-12 w-[3px] rounded-full bg-[#333]" />
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.2rem] bg-[#eaeceb]">
          {/* Status Bar */}
          <div
            className={`pointer-events-none absolute left-0 right-0 top-0 z-50 flex h-14 items-start justify-between px-7 pt-[14px] text-[13px] font-bold tracking-wide ${statusColor}`}
          >
            <span>17:56</span>
            <div className="mt-0.5 flex items-center gap-1.5">
              <Signal className="h-[14px] w-[14px]" />
              <Wifi className="h-[14px] w-[14px]" />
              <Battery className="h-[15px] w-[15px]" />
            </div>
          </div>

          <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
          <div
            className={`pointer-events-none absolute bottom-2 left-1/2 z-30 h-1.5 w-36 -translate-x-1/2 rounded-full ${
              isDark ? "bg-white/40" : "bg-[#000100]/40"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

const Screen = ({
  children,
  nav,
  floatingNav,
  floatingBottom,
  className = "",
  go = () => {},
  activeTab = "home",
}) => {
  let pbClass = "pb-5";
  if (floatingBottom && floatingNav) pbClass = "pb-[180px]";
  else if (floatingBottom) pbClass = "pb-28";
  else if (floatingNav) pbClass = "pb-28";

  return (
    <div
      className={`flex h-full min-h-0 flex-1 flex-col relative ${className}`}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className={`px-6 pt-8 ${pbClass}`}>{children}</div>
      </div>
      {floatingBottom}
      {nav && (
        <div className="px-6 pb-6 pt-2">
          <BottomNav go={go} activeTab={activeTab} />
        </div>
      )}
    </div>
  );
};

const HomeIcon = ({ active }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    {active ? (
      <path
        d="M10.4 3.4a2.5 2.5 0 0 1 3.2 0l6.1 5c.5.4.8 1 .8 1.6v8.5a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5V10c0-.6.3-1.2.8-1.6l6.1-5Z"
        fill="currentColor"
      />
    ) : (
      <path
        d="M11.1 4.1a1.5 1.5 0 0 1 1.8 0l6.1 5c.3.2.5.6.5 1v8.4a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V10.1c0-.4.2-.8.5-1l6.1-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const BriefcaseIcon = ({ active }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    {active ? (
      <>
        <rect x="3.5" y="8" width="17" height="12" rx="4" fill="currentColor" />
        <path
          d="M8.5 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ) : (
      <>
        <rect
          x="3.5"
          y="8"
          width="17"
          height="12"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8.5 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      </>
    )}
  </svg>
);

const UserIcon = ({ active }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    {active ? (
      <>
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <circle cx="12" cy="9.5" r="3" fill="#a0fe08" />
        <path
          d="M6 18c1.5-2.5 3.5-4 6-4s4.5 1.5 6 4"
          stroke="#a0fe08"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ) : (
      <>
        <circle
          cx="12"
          cy="9.5"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6 18c1.5-2.5 3.5-4 6-4s4.5 1.5 6 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </>
    )}
  </svg>
);

function BottomNav({ go = () => {}, activeTab = "home" }) {
  const items = [
    { id: "home", target: "dashboard", label: "Home", CustomIcon: HomeIcon },
    { id: "jobs", target: "jobs", label: "Jobs", CustomIcon: BriefcaseIcon },
    {
      id: "profile",
      target: "profile",
      label: "Profile",
      CustomIcon: UserIcon,
    },
  ];

  return (
    <div className="flex h-[68px] w-full items-center rounded-[34px] bg-[#1c1c1e] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      {items.map((item) => {
        const active = activeTab === item.id;
        const Icon = item.CustomIcon;
        return (
          <div key={item.id} className="flex flex-1 justify-center relative">
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => go(item.target, null, item.mode)}
              className={`relative flex h-[52px] items-center justify-center rounded-full transition-colors duration-300 ${
                active
                  ? "text-[#000100] px-5"
                  : "text-[#8e8e93] hover:text-white w-[52px]"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-[#a0fe08] shadow-[0_0_12px_rgba(160,254,8,0.4)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center">
                <Icon active={active} />
                <span
                  className={`overflow-hidden whitespace-nowrap text-[13.5px] font-bold tracking-wide transition-all duration-300 ease-out ${
                    active
                      ? "max-w-[80px] opacity-100 ml-2.5"
                      : "max-w-0 opacity-0 ml-0"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          </div>
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
        <p className="text-xs font-medium text-[#666666]">{subtitle}</p>
        <h2 className="text-xl font-bold tracking-tight text-[#000100]">
          {title}
        </h2>
      </div>
    </div>
    {action}
  </div>
);

function OSHome({ go }) {
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotif(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const launchApp = (target) => {
    go("splash", null, null, null, target);
  };

  return (
    <PhoneShell theme="dark">
      <div className="relative flex h-full flex-col bg-gradient-to-br from-[#0f172a] via-[#3b0764] to-[#000000] px-5 pb-4 pt-16">
        <AnimatePresence>
          {showNotif && (
            <motion.button
              initial={{ y: -100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => launchApp("morningBrief")}
              className="absolute left-3 right-3 top-14 z-50 flex flex-col gap-2 rounded-[24px] bg-[#ffffff]/90 p-4 text-left shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-transform active:scale-[0.98]"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-5 w-5 place-items-center rounded-md bg-[#000100]">
                    <Star className="h-3 w-3 text-[#a0fe08]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#000100]/60">
                    Syncra
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#000100]/40">
                  now
                </span>
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#000100]">
                  Agent Update: New Drafts
                </h4>
                <p className="mt-0.5 text-[13.5px] leading-[1.3] text-[#000100]/80">
                  I reviewed 142 new roles overnight and prepared 2 application
                  drafts for TechFlow and Linear. Tap to review.
                </p>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="mt-8 grid grid-cols-4 gap-x-4 gap-y-8">
          <button
            onClick={() => launchApp("landing")}
            className="flex flex-col items-center gap-1.5 transition active:opacity-60"
          >
            <div className="grid h-[62px] w-[62px] place-items-center rounded-[18px] bg-[#000100] shadow-lg">
              <Star className="h-8 w-8 text-[#a0fe08]" />
            </div>
            <span className="text-[11px] font-medium text-white shadow-sm">
              Syncra
            </span>
          </button>

          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 opacity-60"
            >
              <div className="h-[62px] w-[62px] rounded-[18px] bg-white/20" />
              <span className="text-[11px] font-medium text-white">App</span>
            </div>
          ))}
        </div>

        <div className="mt-auto mb-1 flex h-[86px] items-center justify-between rounded-[32px] bg-white/20 px-4 backdrop-blur-2xl">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[60px] w-[60px] rounded-[16px] bg-white/30"
            />
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

function SplashScreen({ go, target = "landing" }) {
  useEffect(() => {
    const timer = setTimeout(() => go(target), 2300);
    return () => clearTimeout(timer);
  }, [go, target]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaeceb] px-6 text-[#000100]">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.86, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-7 grid place-items-center"
        >
          <motion.div
            className="absolute h-64 w-64 rounded-full bg-[#a0fe08]/25 blur-3xl sm:h-80 sm:w-80"
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={LOGO_IMG_URL}
            alt="Syncra AI logo"
            className="relative z-10 h-60 w-60 object-contain drop-shadow-[0_18px_35px_rgba(0,1,0,0.18)] sm:h-72 sm:w-72"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = syncraLogoPng;
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-sm font-bold tracking-[0.28em] text-[#000100]"
        >
          SYNCING YOUR CAREER PATH
        </motion.p>

        <div className="mt-5 h-2 w-52 overflow-hidden rounded-full bg-[#d1d3d2]">
          <motion.div
            className="h-full rounded-full bg-[#a0fe08]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.1, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function LoginLoadingScreen({ go }) {
  useEffect(() => {
    const loginTimer = setTimeout(() => go("login"), 2300);
    return () => clearTimeout(loginTimer);
  }, [go]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#eaeceb] px-8 text-[#000100]">
      <div className="flex w-full flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.86, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-7 grid place-items-center"
        >
          <motion.div
            className="absolute h-56 w-56 rounded-full bg-[#a0fe08]/25 blur-3xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={LOGO_IMG_URL}
            alt="Syncra AI logo"
            className="relative z-10 h-52 w-52 object-contain drop-shadow-[0_18px_35px_rgba(0,1,0,0.18)]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = syncraLogoPng;
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-xs font-bold tracking-[0.24em] text-[#000100]"
        >
          SYNCING YOUR CAREER PATH
        </motion.p>

        <div className="mt-5 h-2 w-52 overflow-hidden rounded-full bg-[#d1d3d2]">
          <motion.div
            className="h-full rounded-full bg-[#a0fe08]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.1, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function Landing({ go }) {
  return (
    <div className="grid min-h-screen gap-10 bg-[#eaeceb] px-6 py-8 text-[#000100] lg:grid-cols-[1.05fr_.95fr] lg:px-16">
      <div className="flex flex-col justify-center">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#d1d3d2] bg-[#ffffff] px-4 py-2 text-sm font-bold text-[#000100]">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-[#000100]">
            <InfinityIcon className="h-3.5 w-3.5 text-white" />
          </div>{" "}
          AI Agentic Resume Assistant
        </div>
        <h1 className="max-w-3xl text-5xl font-black tracking-tight text-[#000100] md:text-7xl">
          Let AI handle your job hunting journey.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#666666]">
          Build an ATS-friendly resume, discover roles that match your goals,
          tailor every application, and approve auto-apply actions before
          anything is submitted.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => go("loginLoading")}
            className="rounded-xl bg-[#000100] px-7 py-4 font-bold text-white transition active:opacity-80"
          >
            Get Started
          </button>
          <button
            onClick={() => go("loginLoading")}
            className="rounded-xl border border-[#d1d3d2] bg-[#ffffff] px-7 py-4 font-bold text-[#000100]"
          >
            I already have an account
          </button>
        </div>
        <div className="mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          {[
            [
              FileText,
              "AI Resume Builder",
              "Turn your story into a polished resume.",
            ],
            [
              Search,
              "Smart Job Matching",
              "Rank roles by fit, goals, and missing skills.",
            ],
            [
              Send,
              "Auto Apply Assistant",
              "Prepare applications after your approval.",
            ],
          ].map(([Icon, title, copy]) => (
            <Card key={title}>
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#000100] text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#000100]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#666666]">{copy}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <PhoneShell forceMobile>
          <Dashboard mini />
        </PhoneShell>
      </div>
    </div>
  );
}

function Login({ go }) {
  const nextAfterLogin = "dashboard";

  return (
    <PhoneShell theme="dark">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#000100]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={LOGIN_BG_IMG_URL}
            alt="Background"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
          {/* Fallback gradient behind the image in case it fails */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black -z-10" />
          {/* Dark fade gradient at the bottom so text is legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000100] via-[#000100]/60 to-transparent" />
        </div>

        {/* Content Container aligned to bottom */}
        <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-12 pt-8">
          <h1 className="mb-8 text-[44px] font-black leading-[1.05] tracking-tight text-white">
            Let <span className="text-[#a0fe08]">AI Agent</span>
            <br />
            Apply
            <br />
            For You.
          </h1>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => go(nextAfterLogin)}
              className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-white py-4 text-[15px] font-bold text-[#000100] shadow-lg transition active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => go(nextAfterLogin)}
              className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-white/10 border border-white/20 backdrop-blur-md py-4 text-[15px] font-bold text-white transition active:scale-[0.98]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.86 3.65-.74 1.54.15 2.76.75 3.46 1.83-2.97 1.76-2.5 5.56.36 6.64-1.04 2.58-2.65 4.58-2.55 4.44zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.43 2.5-2.05 4.49-3.74 4.25z" />
              </svg>
              Continue with Apple
            </button>

            <button
              onClick={() => go(nextAfterLogin)}
              className="mt-3 w-full py-3 text-[14px] font-bold text-white/70 hover:text-white transition"
            >
              Continue as Guest
            </button>
          </div>

          <p className="mt-4 px-4 text-center text-[11px] leading-5 text-white/40">
            By continuing, you accept our{" "}
            <span className="underline font-bold text-white/60">Terms</span>,{" "}
            <span className="underline font-bold text-white/60">
              Privacy Policy
            </span>
            , and chat guidelines.
          </p>
        </div>
      </div>
    </PhoneShell>
  );
}

function SignUp({ go }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    go("dashboard");
  };
  return (
    <PhoneShell>
      <Screen>
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex h-full min-h-[610px] w-full max-w-[430px] flex-col"
        >
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="text-lg font-bold text-[#000100]">
              Create your account
            </h1>
            <p className="mb-8 mt-2 text-sm text-[#666666]">
              Start building your AI-powered career profile
            </p>
            <div className="space-y-3">
              <SoftInput
                icon={User}
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <SoftInput
                icon={Mail}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <SoftInput
                icon={Lock}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <SoftInput
                icon={Lock}
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <PrimaryButton className="mt-7" onClick={handleSubmit}>
              Create account <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <div className="my-6 flex items-center gap-3 text-xs text-[#666666]">
              <span className="h-px flex-1 bg-[#d1d3d2]" /> or sign up with{" "}
              <span className="h-px flex-1 bg-[#d1d3d2]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SecondaryButton onClick={() => go("dashboard")}>
                Google
              </SecondaryButton>
              <SecondaryButton onClick={() => go("dashboard")}>
                Demo Mode
              </SecondaryButton>
            </div>
          </div>
          <p className="pb-2 text-center text-sm text-[#666666]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => go("login")}
              className="font-bold text-[#000100]"
            >
              Sign in
            </button>
          </p>
        </form>
      </Screen>
    </PhoneShell>
  );
}

function MorningBrief({ go, userName }) {
  return (
    <PhoneShell theme="dark">
      <div className="flex h-full flex-col justify-center bg-[#000100] px-8 text-left text-white relative overflow-hidden">
        {/* Background ambient glow pushed to the right side */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-20 h-[400px] w-[400px] rounded-full bg-[#a0fe08]/20 blur-[100px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-start"
        >
          <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight text-white">
            Good morning,
            <br />
            {userName}.
          </h2>

          <div className="mt-12">
            <p className="text-[17px] font-medium text-white/60">
              While you were away, I scanned
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.7,
                type: "spring",
                bounce: 0.4,
              }}
              className="my-1 text-[100px] leading-[1.05] font-black text-[#a0fe08] tracking-tighter"
            >
              142
            </motion.div>

            <p className="text-[17px] font-medium leading-relaxed text-white/60 max-w-[280px]">
              new roles. <span className="text-white">3</span> require your
              input today. I've prepared your tailored resumes.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
          className="absolute bottom-10 right-8 z-10"
        >
          <button
            onClick={() => go("dashboard")}
            className="grid h-16 w-16 place-items-center rounded-full bg-[#a0fe08] text-[#000100] shadow-[0_8px_30px_rgba(160,254,8,0.25)] transition active:scale-90 hover:scale-105"
          >
            <ChevronRight className="h-7 w-7 ml-0.5" strokeWidth={3} />
          </button>
        </motion.div>
      </div>
    </PhoneShell>
  );
}

function ResumeUploadCard({ item, uploading = false, onOpen, onDelete }) {
  const progress = item.progress ?? 100;
  const isError = item.status === "error";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[#d1d3d2] p-4 shadow-sm transition-all ${
        isError ? "bg-red-50 border-red-200" : "bg-[#ffffff]"
      }`}
    >
      {uploading && !isError && (
        <div
          className="absolute bottom-0 left-0 top-0 bg-[#a0fe08]/20 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
            isError ? "bg-red-500 text-white" : "bg-[#000100] text-white"
          }`}
        >
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-[#000100]">
            {item.name}
          </h4>
          <p className="mt-0.5 text-xs text-[#666666]">
            {formatFileSize(item.size)}{" "}
            {isError
              ? "• Error"
              : uploading && progress < 100
              ? `• ${progress}%`
              : ""}
          </p>
        </div>

        {!uploading && !isError && item.url && (
          <button
            type="button"
            onClick={() => onOpen?.(item)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d1d3d2] bg-[#ffffff] text-[#000100] transition active:bg-[#eaeceb]"
          >
            <Search className="h-4 w-4" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eaeceb] text-[#666666] transition hover:bg-red-50 hover:text-red-500"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// --- NEW MVP DEMO LOGIC (The Flashy Sequence) ---
const demoSteps = [
  {
    action: "Task Decoupled into 4 steps. Executing...",
    delay: 1000,
    type: "info",
  },
  {
    action: "Tool Call: JobBoardScraper(role='UX Design', type='Startup')",
    delay: 1800,
    result: "Found: Product Designer at 'Linear'.",
    type: "tool",
  },
  {
    action: "Tool Call: AnalyzeResumeMatch(job='Linear', resume=user_profile)",
    delay: 2000,
    result: "Score: 65% (Missing 'Design Systems').",
    type: "tool",
  },
  {
    action:
      "Agent Decision: Match score too low for cold email. Invoking Tailor Tool first.",
    delay: 2500,
    type: "alert",
  },
  {
    action: "Tool Call: TailorResume(missing_keywords=['Design Systems'])",
    delay: 2200,
    result: "Resume rewritten. New Score: 92%.",
    type: "tool",
  },
  {
    action: "Tool Call: WebScraper(query='Linear recent news')",
    delay: 1800,
    result: "Found: Linear launched a new mobile app.",
    type: "tool",
  },
  {
    action: "Tool Call: DraftColdEmail(context='Mention mobile app launch')",
    delay: 1500,
    result: "Draft complete. Ready for review.",
    type: "tool",
  },
];

function AgentTerminal({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const hasCompleted = useRef(false); // Add this ref to prevent infinite loops

  useEffect(() => {
    if (currentStep >= demoSteps.length) {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        const timer = setTimeout(onComplete, 1200);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, demoSteps[currentStep].delay);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="w-full rounded-2xl bg-[#000100] p-4 font-mono text-[11px] shadow-xl border border-white/10 my-2 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a0fe08] to-transparent opacity-20" />
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 text-white/50 font-bold uppercase tracking-wider text-[9px]">
          Agent Thought Process
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {demoSteps.slice(0, currentStep + 1).map((step, i) => {
          const isLast = i === currentStep && currentStep < demoSteps.length;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`flex items-start gap-2 ${
                  step.type === "alert" ? "text-[#ffbd2e]" : "text-white/80"
                }`}
              >
                <span className="shrink-0">
                  {step.type === "alert" ? "🛑" : "⚙️"}
                </span>
                <span className="leading-relaxed">{step.action}</span>
              </div>
              {step.result && !isLast && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-7 mt-1 text-[#a0fe08] font-bold"
                >
                  ↳ {step.result}
                </motion.div>
              )}
              {isLast && (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="ml-7 mt-1 flex items-center gap-1.5 text-white/40"
                >
                  <div className="h-1 w-1 bg-[#a0fe08] rounded-full animate-ping" />{" "}
                  Processing...
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function AIChatbot({
  go,
  chatMode = "setPreferences",
  fromDashboard = false,
  backTarget = null,
  hideBottomNav = false,
  onStartBackgroundResume = () => {},
  agentResumeNotice = null,
  resumes = [],
  onUploadResume = () => {},
  uploadQueue = [],
}) {
  const [messages, setMessages] = useState([
    {
      from: "ai",
      type: "text",
      text: "Hi, Syncra AI here. What career goals can I help you execute today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [attachedContext, setAttachedContext] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesScrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    const scrollContainer = messagesScrollRef.current;
    if (!scrollContainer) return;
    requestAnimationFrame(() => {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, isTyping]);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    onUploadResume(files);
    setIsAttachModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = (textOverride) => {
    const prompt =
      typeof textOverride === "string" ? textOverride : inputText.trim();
    if (!prompt || isTyping) return;

    setInputText("");
    setMessages((prev) => [
      ...prev,
      { from: "user", type: "text", text: prompt },
    ]);
    setIsTyping(true);

    // Trigger the flashy UI sequence for the demo
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: "ai", type: "terminal" }]);
    }, 600);
  };

  const handleTerminalComplete = React.useCallback(() => {
    setMessages((prev) => {
      // Extra safeguard to prevent duplicate additions
      if (prev.length > 0 && prev[prev.length - 1].type === "cards")
        return prev;

      return [
        ...prev,
        {
          from: "ai",
          type: "text",
          text: "I found a great fit at Linear. Initially, your resume match was a bit low, so I autonomously tailored your past projects to highlight 'Design Systems'. I also researched Linear and found they just launched a mobile app, so I wove that into your cold email to make you stand out. Both are ready for your review.",
        },
        {
          from: "ai",
          type: "cards",
        },
      ];
    });
  }, []);

  const quickReplies = [
    "Find me a UX role at a startup & draft outreach",
    "Improve my resume",
    "Find internships",
  ];

  const renderMessageText = (text) => (
    <>
      {String(text)
        .split("\n")
        .map((line, index, arr) => (
          <React.Fragment key={`${line}-${index}`}>
            {line}
            {index < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
    </>
  );

  return (
    <PhoneShell>
      <div className="flex h-full min-h-0 flex-1 flex-col bg-[#eaeceb] pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="shrink-0 mb-5 flex min-h-[88px] items-center justify-between relative z-10 bg-[#eaeceb] px-6 pt-[52px] pb-3"
        >
          <BackButton
            onClick={() =>
              go(backTarget || (fromDashboard ? "dashboard" : "login"))
            }
          />

          <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 backdrop-blur-md px-4 py-2 shadow-sm">
            {isTyping ? (
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#a0fe08] shadow-[0_0_8px_rgba(160,254,8,0.8)]" />
            ) : (
              <div className="grid h-4 w-4 place-items-center rounded-full bg-[#000100]">
                <Star className="h-2.5 w-2.5 text-[#a0fe08]" />
              </div>
            )}
            <span className="text-xs font-bold text-[#000100]">
              {isTyping ? "Syncra is drafting..." : "Syncra AI 2.5 Pro"}
            </span>
          </div>

          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/40 bg-white/60 text-[#000100] shadow-sm backdrop-blur-md transition active:scale-95">
            <Settings className="h-5 w-5" />
          </button>
        </motion.div>

        <div
          ref={messagesScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-5 py-4"
        >
          <div className="flex flex-col pb-4">
            {messages.map((msg, i) => {
              const isAI = msg.from === "ai";
              const isNextSame = messages[i + 1]?.from === msg.from;
              const isPrevSame = messages[i - 1]?.from === msg.from;

              if (msg.type === "terminal") {
                return (
                  <div key={i} className="w-full mb-6 flex justify-center">
                    <AgentTerminal onComplete={handleTerminalComplete} />
                  </div>
                );
              }

              if (msg.type === "cards") {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 flex w-full justify-start pl-9"
                  >
                    <div className="flex flex-col gap-3 mt-1 w-full max-w-[90%]">
                      {/* Interactive Card 1: Tailored Resume */}
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#d1d3d2] shadow-sm cursor-pointer hover:bg-[#fafafa] transition active:scale-[0.98]">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#000100] text-white">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#000100] truncate">
                            Linear_UX_Resume_v4.pdf
                          </h4>
                          <p className="text-[11px] font-medium text-[#a0fe08] bg-[#000100] px-2 py-0.5 rounded w-fit mt-1">
                            Tailored • 92% Match
                          </p>
                        </div>
                        <button className="h-8 w-8 grid place-items-center rounded-full bg-[#eaeceb] text-[#000100]">
                          <Search className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Interactive Card 2: Cold Email Draft */}
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#d1d3d2] shadow-sm cursor-pointer hover:bg-[#fafafa] transition active:scale-[0.98]">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#000100] text-white">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#000100] truncate">
                            Draft: Linear Outreach
                          </h4>
                          <p className="text-[11px] text-[#666666] mt-0.5">
                            Includes recent news context
                          </p>
                        </div>
                        <button className="h-8 w-8 grid place-items-center rounded-full bg-[#eaeceb] text-[#000100]">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={`${msg.from}-${i}-${msg.text.slice(0, 12)}`}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex w-full ${
                    isAI ? "justify-start" : "justify-end"
                  } ${isNextSame ? "mb-1.5" : "mb-5"}`}
                >
                  {isAI && (
                    <div className="mr-2.5 flex w-7 shrink-0 flex-col justify-end pb-0.5">
                      {!isNextSame && (
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#000100] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                          <Star className="h-3.5 w-3.5 text-[#a0fe08]" />
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-4 py-3 text-[14.5px] leading-[1.55] shadow-sm ${
                      isAI
                        ? `border border-white/60 bg-[#ffffff] text-[#000100] ${
                            isPrevSame && isNextSame
                              ? "rounded-[20px] rounded-l-sm"
                              : isPrevSame
                              ? "rounded-[22px] rounded-tl-sm rounded-bl-[4px]"
                              : isNextSame
                              ? "rounded-[22px] rounded-bl-sm"
                              : "rounded-[22px] rounded-bl-[4px]"
                          }`
                        : `bg-[#000100] text-white ${
                            isPrevSame && isNextSame
                              ? "rounded-[20px] rounded-r-sm"
                              : isPrevSame
                              ? "rounded-[22px] rounded-tr-sm rounded-br-[4px]"
                              : isNextSame
                              ? "rounded-[22px] rounded-br-sm"
                              : "rounded-[22px] rounded-br-[4px]"
                          }`
                    }`}
                  >
                    {renderMessageText(msg.text)}
                  </div>
                </motion.div>
              );
            })}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-5 flex w-full justify-start"
              >
                <div className="mr-2.5 flex w-7 shrink-0 flex-col justify-end pb-0.5">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-[#000100] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                    <Star className="h-3.5 w-3.5 text-[#a0fe08]" />
                  </div>
                </div>

                <div className="flex h-[44px] items-center gap-1.5 rounded-[22px] rounded-bl-[4px] border border-white/60 bg-[#ffffff] px-4 shadow-sm">
                  <motion.span
                    animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-[#000100]"
                  />
                  <motion.span
                    animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-[#000100]"
                  />
                  <motion.span
                    animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-[#000100]"
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="relative z-20 shrink-0 bg-gradient-to-t from-[#eaeceb] via-[#eaeceb] to-transparent px-4 sm:px-6 pb-0 pt-2">
          {uploadQueue.length > 0 && (
            <div className="mb-2 flex flex-col gap-2">
              {uploadQueue.map((item) => (
                <div
                  key={item.id}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d1d3d2] bg-[#ffffff] px-3 py-1.5 text-xs font-bold text-[#000100] shadow-sm"
                >
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#000100] border-t-transparent" />
                  Uploading {item.name}...
                </div>
              ))}
            </div>
          )}

          {attachedContext && (
            <div className="mb-2 px-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#000100] bg-[#ffffff] px-3 py-1.5 text-xs font-bold text-[#000100] shadow-sm">
                <FileText className="h-3.5 w-3.5" />
                <span className="max-w-[150px] truncate">
                  {attachedContext.name}
                </span>
                <button
                  onClick={() => setAttachedContext(null)}
                  className="ml-1 rounded-full p-0.5 transition hover:bg-[#eaeceb]"
                >
                  <Plus className="h-3.5 w-3.5 rotate-45" />
                </button>
              </div>
            </div>
          )}

          {quickReplies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-3 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar"
            >
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isTyping}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#d1d3d2] bg-white/60 px-4 py-2.5 text-xs font-bold text-[#000100] shadow-sm backdrop-blur-md transition active:bg-[#eaeceb] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-2xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-within:border-[#000100] focus-within:ring-1 focus-within:ring-[#000100]">
              <button
                onClick={() => setIsAttachModalOpen(true)}
                disabled={isTyping}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#eaeceb] text-[#000100] transition active:opacity-70 disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="flex flex-1 items-center gap-2 overflow-hidden">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    isTyping
                      ? "Syncra is executing plan..."
                      : "Ask Syncra anything..."
                  }
                  disabled={isTyping}
                  className="w-full min-w-0 bg-transparent px-1 text-sm font-medium text-[#000100] outline-none placeholder:text-[#999999] disabled:cursor-not-allowed"
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !inputText.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#000100] text-white transition active:scale-95 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isAttachModalOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAttachModalOpen(false)}
                  className="absolute inset-0 z-[100] bg-[#000100]/40 backdrop-blur-[2px]"
                />

                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 26, stiffness: 320 }}
                  className="absolute bottom-0 left-0 right-0 z-[101] flex flex-col rounded-t-[2rem] bg-[#eaeceb] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-8"
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-[#d1d3d2] px-6 py-5">
                    <h2 className="text-lg font-bold text-[#000100]">
                      Add Attachment
                    </h2>
                    <button
                      onClick={() => setIsAttachModalOpen(false)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-[#d1d3d2] text-[#000100] transition active:opacity-70"
                    >
                      <Plus className="h-5 w-5 rotate-45" />
                    </button>
                  </div>

                  <div className="p-6 flex flex-col gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-4 rounded-2xl bg-[#ffffff] border border-[#d1d3d2] p-4 transition active:bg-[#fafafa]"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#eaeceb] text-[#000100]">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-sm font-bold text-[#000100]">
                          Upload Resume
                        </h3>
                        <p className="text-xs text-[#666666] mt-0.5">
                          PDF, DOC up to 5MB
                        </p>
                      </div>
                    </button>

                    {resumes.length > 0 && (
                      <button
                        onClick={() => {
                          setAttachedContext(resumes[0]);
                          setIsAttachModalOpen(false);
                        }}
                        className="flex items-center gap-4 rounded-2xl bg-[#ffffff] border border-[#d1d3d2] p-4 transition active:bg-[#fafafa]"
                      >
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#eaeceb] text-[#000100]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="text-sm font-bold text-[#000100]">
                            Use Existing Resume
                          </h3>
                          <p className="text-xs text-[#666666] mt-0.5">
                            {resumes[0].name}
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PhoneShell>
  );
}

function Setup({ go }) {
  const fields = [
    "Desired role",
    "Industry",
    "Job type",
    "Location",
    "Salary",
    "Company culture",
    "Skills to use",
    "Skills to avoid",
  ];
  return (
    <PhoneShell>
      <Screen>
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end justify-between bg-[#eaeceb] px-6 pb-5">
          <BackButton onClick={() => go("landing")} />
        </div>
        <div className="mx-auto mb-6 w-fit">
          <GlassIcon>
            <Star className="h-9 w-9 fill-[#a0fe08] text-[#a0fe08]" />
          </GlassIcon>
        </div>
        <p className="text-xs text-[#666666]">Step 1 of 2</p>
        <h1 className="mt-2 text-xl font-bold text-[#000100]">
          AI Career Setup
        </h1>
        <p className="mt-2 text-sm text-[#666666]">
          Tell Syncra AI what kind of job journey you want.
        </p>
        <div className="mt-6 grid gap-3">
          {fields.map((field) => (
            <div
              key={field}
              className={`rounded-2xl border border-[#d1d3d2] bg-[#ffffff] px-4 py-3 text-sm text-[#666666] ${neoIn} `}
            >
              {field}
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          <PrimaryButton onClick={() => go("dashboard")}>
            Continue <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
          <SecondaryButton onClick={() => go("story")}>
            Let AI help me fill this <Sparkles className="h-4 w-4" />
          </SecondaryButton>
          <TopNavButton onClick={() => go("dashboard")} className="w-full py-3">
            Skip for now <ArrowRight className="h-4 w-4 text-[#a0fe08]" />
          </TopNavButton>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Story({ go, userName }) {
  const quick = [
    "What roles fit me?",
    "Improve my resume",
    "Salary expectations",
    "Find internships",
  ];
  return (
    <PhoneShell>
      <Screen>
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end justify-between bg-[#eaeceb] px-6 pb-5">
          <BackButton onClick={() => go("dashboard")} />
          <TopNavButton onClick={() => go("dashboard")}>
            Skip <ArrowRight className="h-4 w-4 text-[#a0fe08]" />
          </TopNavButton>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-10 w-10 place-items-center rounded-full border border-[#d1d3d2] bg-[#000100] text-lg ${neoOut}`}
            >
              🤖
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#000100]">Syncra AI</h2>
              <p className="text-xs text-[#000100]">Online · Step 1 of 6</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div
            className={`max-w-[82%] rounded-2xl rounded-tl-sm border border-[#d1d3d2] bg-[#ffffff] p-4 text-sm leading-6 text-[#000100] ${neoOut} `}
          >
            Hi {userName}, I&apos;ve reviewed your goal. Tell me what
            you&apos;re looking for and I&apos;ll tailor matches.
          </div>
          <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-[#000100] p-4 text-sm leading-6 text-white ">
            I want an entry-level UX or frontend role where I can use design and
            coding skills.
          </div>
          <div
            className={`max-w-[86%] rounded-2xl rounded-tl-sm border border-[#d1d3d2] bg-[#ffffff] p-4 text-sm leading-6 text-[#000100] ${neoOut} `}
          >
            Great. I&apos;ll ask about your education, projects, skills,
            experience, achievements, and target role.
          </div>
        </div>
        <div className="mt-48 flex gap-2 overflow-x-auto pb-3">
          {quick.map((q) => (
            <button
              key={q}
              className={`shrink-0 rounded-full border border-[#d1d3d2] bg-[#ffffff] px-4 py-2 text-xs font-bold text-[#000100] ${neoOut}`}
            >
              {q}
            </button>
          ))}
        </div>
        <div
          className={`rounded-2xl border border-[#d1d3d2] bg-[#ffffff] p-2 ${neoIn} `}
        >
          <div className="flex items-center gap-2 rounded-xl bg-transparent px-2 py-1 text-sm text-[#666666]">
            <span className="flex-1">Ask anything...</span>
            <button className="grid h-11 w-11 place-items-center rounded-2xl bg-[#000100] text-white ">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => go("builder")}>
            Continue
          </SecondaryButton>
          <SecondaryButton onClick={() => go("dashboard")}>
            Save Later
          </SecondaryButton>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Builder({ go }) {
  const messages = [
    "Reading your background",
    "Writing professional bullet points",
    "Optimizing for ATS",
    "Creating a clean resume preview",
  ];
  return (
    <PhoneShell>
      <Screen>
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end justify-between bg-[#eaeceb] px-6 pb-5">
          <BackButton onClick={() => go("dashboard")} />
        </div>
        <Header
          title="AI Resume Builder"
          subtitle="Syncra AI is working"
          icon={
            <GlassIcon className="h-12 w-12 rounded-2xl">
              <Wand2 className="h-6 w-6 text-white" />
            </GlassIcon>
          }
        />
        <Card>
          <h3 className="font-bold text-[#000100]">
            Generating your ATS-friendly resume
          </h3>
          <div className="mt-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={m}
                className="flex items-center gap-3 text-sm text-[#000100]"
              >
                <CheckCircle2
                  className={`h-5 w-5 ${
                    i < 3 ? "text-[#a0fe08]" : "text-[#a0fe08]"
                  }`}
                />
                {m}
              </div>
            ))}
          </div>
        </Card>
        <Card className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-[#000100]">Resume Preview</h3>
            <StepPill>ATS ready</StepPill>
          </div>
          <div className={`space-y-2 rounded-2xl bg-[#ffffff] p-4 ${neoIn}`}>
            <div className="h-4 w-32 rounded bg-slate-800" />
            <div className="h-2 w-44 rounded bg-slate-300" />
            <div className="mt-4 h-3 w-20 rounded bg-[#d1d3d2]" />
            <div className="h-2 w-full rounded bg-slate-300" />
            <div className="h-2 w-5/6 rounded bg-slate-300" />
            <div className="mt-4 h-3 w-24 rounded bg-[#d1d3d2]" />
            <div className="h-2 w-full rounded bg-slate-300" />
            <div className="h-2 w-4/5 rounded bg-slate-300" />
          </div>
        </Card>
        <div className="mt-5 grid gap-3">
          <PrimaryButton onClick={() => go("analysis")}>
            Analyze Resume <BarChart3 className="h-4 w-4" />
          </PrimaryButton>
          <div className="grid grid-cols-2 gap-3">
            <SecondaryButton>Improve with AI</SecondaryButton>
            <SecondaryButton>Edit Manually</SecondaryButton>
          </div>
          <SecondaryButton onClick={() => go("dashboard")}>
            Save Resume
          </SecondaryButton>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Analysis({ go }) {
  const items = [
    ["ATS Compatibility", 86],
    ["Skills Strength", 78],
    ["Experience Clarity", 74],
    ["Role Relevance", 80],
    ["Formatting", 92],
    ["Missing Keywords", 63],
  ];
  return (
    <PhoneShell>
      <Screen>
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end justify-between bg-[#eaeceb] px-6 pb-5">
          <BackButton onClick={() => go("dashboard")} />
        </div>
        <Header
          title="Resume Analysis"
          subtitle="Score and improvement plan"
          icon={
            <GlassIcon className="h-12 w-12 rounded-2xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </GlassIcon>
          }
        />
        <Card className="text-center">
          <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-[#000100] text-white ">
            <div>
              <div className="text-3xl font-bold">78</div>
              <div className="text-xs">/100</div>
            </div>
          </div>
          <h3 className="mt-4 font-bold text-[#000100]">Good foundation</h3>
          <p className="mt-1 text-sm text-[#666666]">
            AI found 6 improvements before job matching.
          </p>
        </Card>
        <div className="mt-4 space-y-3">
          {items.map(([name, score]) => (
            <Card key={name} className="py-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-[#000100]">{name}</span>
                <span className="text-[#000100]">{score}%</span>
              </div>
              <div
                className={`h-2 overflow-hidden rounded-full bg-[#ffffff] ${neoIn}`}
              >
                <div
                  className="h-full rounded-full bg-[#000100]"
                  style={{ width: `${score}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-5 grid gap-3">
          <PrimaryButton onClick={() => go("skill")}>
            Apply AI Improvements
          </PrimaryButton>
          <SecondaryButton onClick={() => go("skill")}>
            View Missing Skills
          </SecondaryButton>
          <button
            onClick={() => go("dashboard")}
            className="w-full py-2 text-sm text-[#666666]"
          >
            Go to Dashboard
          </button>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Skill({ go }) {
  return (
    <PhoneShell>
      <Screen>
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end justify-between bg-[#eaeceb] px-6 pb-5">
          <BackButton onClick={() => go("analysis")} />
        </div>
        <Header
          title="Skill Market Analysis"
          subtitle="Compare skills with market demand"
          icon={
            <GlassIcon className="h-12 w-12 rounded-2xl">
              <Sparkles className="h-6 w-6 text-white" />
            </GlassIcon>
          }
        />
        <Card>
          <h3 className="font-bold text-[#000100]">
            Should AI scan the current market?
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#666666]">
            I can scan demo job posts, compare common requirements with your
            resume, and create a skill gap report.
          </p>
          <PrimaryButton className="mt-4" onClick={() => {}}>
            Start scan
          </PrimaryButton>
        </Card>
        <div className="mt-4 space-y-3">
          {[
            ["Already strong", ["Figma", "React", "Research"]],
            ["Missing skills", ["TypeScript", "A/B Testing", "SQL"]],
            ["Trending skills", ["AI workflow", "Design system", "Analytics"]],
            [
              "Learning priorities",
              ["TypeScript basics", "Portfolio case study", "Testing"],
            ],
          ].map(([title, chips]) => (
            <Card key={title}>
              <h3 className="mb-3 font-bold text-[#000100]">{title}</h3>
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <StepPill key={c}>{c}</StepPill>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-5">
          <PrimaryButton onClick={() => go("dashboard")}>
            Go to Dashboard
          </PrimaryButton>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function AnalyzingScreen({ go }) {
  const [phase, setPhase] = useState(0);
  const phases = [
    "Hang tight...",
    "Reading resume...",
    "Finding matching companies...",
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 2200);
    const timer2 = setTimeout(() => setPhase(2), 4400);
    const timer3 = setTimeout(() => go("dashboard"), 7000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PhoneShell>
      <Screen noNav>
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-8 grid h-28 w-28 place-items-center mx-auto">
            {/* Heartbeat filled circle */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4, 0.1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-[#a0fe08]"
            />
            {/* Center icon */}
            <div className="relative z-10 grid h-20 w-20 place-items-center rounded-full bg-[#000100] text-[#a0fe08]">
              <InfinityIcon className="h-10 w-10" />
            </div>
          </div>

          <div className="flex h-12 w-full items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2
                key={phase}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-bold text-[#000100]"
              >
                {phases[phase]}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Dashboard({
  go = () => {},
  mini = false,
  noNav = false,
  resumes = [],
  selectedResumeId = null,
  onSelectResume = () => {},
  isChatTransition = false,
  onStartChatTransition = () => {},
  onUploadResume = () => {},
  uploadQueue = [],
  userName = "User",
}) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [actionResolved, setActionResolved] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    onUploadResume(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectedResume =
    resumes.find((resume) => resume.id === selectedResumeId) || null;
  const activeSelectedResumeId = selectedResumeId;
  const agentUpdates = [
    {
      id: 1,
      time: "09:30",
      sub: "AM",
      title: "Prepared 2 new drafts",
      desc: "Based on overnight matches, I prepared applications for TechFlow and Linear.",
      active: true,
    },
    {
      id: 2,
      time: "11:00",
      sub: "AM",
      title: "Application Viewed",
      desc: "Your application for Frontend Engineer was viewed by Innovate AI.",
      active: false,
    },
    {
      id: 3,
      time: "12:20",
      sub: "PM",
      title: "Resume Tailored",
      desc: "Optimized your resume based on recent job market trends.",
      active: false,
    },
  ];

  const floatingAiInput = (
    <motion.div
      initial={false}
      animate={{
        bottom: isChatTransition ? "24px" : "120px",
        left: isChatTransition ? "16px" : "24px",
        right: isChatTransition ? "16px" : "24px",
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute z-50"
    >
      <div className="flex items-center gap-2 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-2xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-within:border-[#000100] focus-within:ring-1 focus-within:ring-[#000100]">
        <button
          onClick={() => {
            if (resumes.length === 0) {
              fileInputRef.current?.click();
              return;
            }
            setIsResumeModalOpen(true);
          }}
          disabled={isChatTransition}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#eaeceb] text-[#000100] transition active:opacity-70 disabled:opacity-50"
          title={resumes.length === 0 ? "Upload Resume" : "Select Resume"}
        >
          <Plus className="h-5 w-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {selectedResume && !isChatTransition && (
            <div
              onClick={() => setIsResumeModalOpen(true)}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-[#d1d3d2] bg-[#fafafa] px-2.5 py-1.5 transition active:bg-[#eaeceb]"
            >
              <FileText className="h-3.5 w-3.5 text-[#000100]" />
              <span className="max-w-[70px] truncate text-xs font-bold text-[#000100]">
                {selectedResume.name.replace(/\.pdf$/i, "")}
              </span>
            </div>
          )}
          <input
            type="text"
            readOnly
            onClick={onStartChatTransition}
            placeholder={
              selectedResume && !isChatTransition
                ? "Set your agent goals..."
                : "Ask Syncra anything..."
            }
            className="w-full min-w-0 cursor-pointer bg-transparent px-1 text-sm font-medium text-[#000100] outline-none placeholder:text-[#999999]"
          />
        </div>

        <button
          onClick={onStartChatTransition}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#000100] text-white transition active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <Screen
      nav={!mini && !noNav}
      floatingNav={noNav}
      floatingBottom={!mini ? floatingAiInput : null}
      go={go}
      activeTab="home"
      className="relative"
    >
      <motion.div
        animate={{
          opacity: isChatTransition ? 0 : 1,
          y: isChatTransition ? -30 : 0,
          filter: isChatTransition ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        {/* Header with profile */}
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[124px] items-end justify-between bg-[#eaeceb] px-6 pb-4 border-b border-[#d1d3d2]/50">
          <div className="flex items-center gap-4 h-[52px]">
            <button
              onClick={() => go("profile")}
              className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-[#000100] shadow-sm transition active:scale-95"
            >
              <img
                src={PROFILE_IMG_URL}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${userName}&background=000100&color=a0fe08`;
                }}
              />
            </button>
            <div className="text-[26px] font-black tracking-tight text-[#000100]">
              {userName}
            </div>
          </div>
        </div>

        {/* Agent Action Required */}
        <AnimatePresence>
          {!actionResolved && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-3xl bg-[#000100] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                <div className="mb-3 flex items-center gap-2 text-[#fbbf24]">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-[#fbbf24]/20">
                    <AlertCircle className="h-3.5 w-3.5 text-[#fbbf24]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#fbbf24]">
                    Action Required
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  Missing Portfolio Link
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                  Notion requires a portfolio link to complete the Product
                  Design Intern application draft.
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/10 p-1.5 focus-within:bg-white/20 transition-colors">
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="Paste Figma or website link..."
                    className="flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    onClick={() => setActionResolved(true)}
                    disabled={!portfolioLink}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-[#a0fe08] text-[#000100] disabled:bg-white/20 disabled:text-white/40 disabled:opacity-100 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Profile Summary */}
        <Card className="mb-6 border-none shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#000100]">
              AI Profile Summary
            </h2>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">
              Target Role
            </p>
            <p className="text-base font-bold text-[#000100]">
              Senior Product Designer
            </p>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">
              Work Preference
            </p>
            <p className="text-base font-bold text-[#000100]">New York, NY</p>
          </div>

          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#999999]">
              Salary Floor
            </p>
            <p className="text-base font-bold text-[#000100]">$150,000</p>
          </div>

          <div className="mb-5 h-px w-full bg-[#eaeceb]" />

          <div className="flex flex-wrap gap-2">
            {["UX Research", "Visual Design", "System Thinking"].map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-[#f4f5f4] px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#666666]"
              >
                {pill.toUpperCase()}
              </span>
            ))}
          </div>
        </Card>

        {/* Recent Updates Line Connected List */}
        <div className="mb-4">
          <h2 className="mb-5 text-lg font-bold text-[#000100]">
            Recent Updates
          </h2>
          <div className="relative">
            {/* Continuous vertical line connecting the dots */}
            <div className="absolute bottom-8 left-[65px] top-3 w-[2px] bg-[#d1d3d2]" />

            <div className="space-y-4">
              {agentUpdates.map((update) => (
                <div key={update.id} className="relative flex gap-4">
                  {/* Left: Time */}
                  <div className="flex w-[42px] shrink-0 flex-col items-end pt-1.5 text-right">
                    <span className="text-[13px] font-black tracking-tight text-[#000100]">
                      {update.time}
                    </span>
                    <span className="text-[10px] font-bold text-[#999999]">
                      {update.sub}
                    </span>
                  </div>

                  {/* Middle: Dot */}
                  <div className="relative z-10 flex w-4 shrink-0 justify-center pt-2.5">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        update.active
                          ? "bg-[#a0fe08] ring-4 ring-[#a0fe08]/30 shadow-[0_0_8px_rgba(160,254,8,0.6)]"
                          : "bg-[#d1d3d2]"
                      }`}
                    />
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 px-2 pt-1.5 pb-2">
                    <h3 className="text-sm font-bold text-[#000100]">
                      {update.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#666666]">
                      {update.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resume Selection Bottom Sheet Modal */}
      <AnimatePresence>
        {isResumeModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResumeModalOpen(false)}
              className="absolute inset-0 z-[100] bg-[#000100]/40 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="absolute bottom-0 left-0 right-0 z-[101] flex max-h-[75%] flex-col rounded-t-[2rem] bg-[#eaeceb] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-[#d1d3d2] px-6 py-5">
                <h2 className="text-lg font-bold text-[#000100]">
                  Select Resume
                </h2>
                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-[#d1d3d2] text-[#000100] transition active:opacity-70"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
                <div className="space-y-3 pb-8">
                  <button
                    onClick={() => {
                      setIsResumeModalOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-[#000100]/30 bg-[#ffffff] p-4 text-left transition-all hover:bg-[#fafafa]"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#eaeceb] text-[#000100]">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-[#000100]">
                        Upload New Resume
                      </h3>
                      <p className="mt-0.5 text-xs text-[#666666]">
                        PDF, DOC up to 5MB
                      </p>
                    </div>
                  </button>

                  {resumes.map((resume) => {
                    const isSelected = activeSelectedResumeId === resume.id;
                    return (
                      <button
                        key={resume.id}
                        onClick={() => {
                          onSelectResume(isSelected ? null : resume.id);
                          setIsResumeModalOpen(false);
                        }}
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-[#000100] bg-[#ffffff] ring-1 ring-[#000100]"
                            : "border-[#d1d3d2] bg-[#ffffff] hover:bg-[#fafafa]"
                        }`}
                      >
                        <div
                          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
                            isSelected
                              ? "bg-[#000100] text-white"
                              : "bg-[#eaeceb] text-[#000100]"
                          }`}
                        >
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-[#000100]">
                            {resume.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-[#666666]">
                            Uploaded {formatUploadDate(resume.uploadedAt)}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#a0fe08]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Screen>
  );
}

function JobsScreen({ go }) {
  // Agentic Approval Queue Grouping
  const readyJobs = jobs.filter((j) => j.category === "ready");
  const inputJobs = jobs.filter((j) => j.category === "input_needed");
  const exploreJobs = jobs.filter((j) => j.category === "exploration");

  return (
    <Screen nav activeTab="jobs" go={go} className="relative bg-[#eaeceb]">
      {/* Fixed Agent Header */}
      <div className="sticky top-0 z-40 -mx-6 -mt-8 mb-6 flex flex-col justify-end bg-[#eaeceb] px-6 pb-4 pt-12 h-[124px] border-b border-[#d1d3d2]/50">
        <h1 className="text-[28px] font-black tracking-tight text-[#000100] leading-none mb-1.5">
          Review Queue
        </h1>
        <p className="text-sm font-medium text-[#666666]">
          I processed 142 roles. Here are 3 that need your attention.
        </p>
      </div>

      <div className="pb-24">
        {/* Tier 1: Ready to Send */}
        {readyJobs.length > 0 && (
          <div className="mb-8">
            {readyJobs.map((job) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                key={job.id}
                className="mb-6 rounded-[24px] bg-[#ffffff] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#d1d3d2]/60 overflow-hidden"
              >
                <div className="p-5 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-6 items-center rounded-full bg-[#a0fe08] px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#000100]">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Ready to
                      Send
                    </div>
                    <span className="text-xs font-bold text-[#666666]">
                      {job.match}% Match
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#000100] text-lg font-bold text-[#a0fe08]">
                      {job.company[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-[#000100]">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 truncate text-[13px] font-medium text-[#666666]">
                        {job.company} • {job.salary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f4f5f4] p-4 mx-5 mb-5 rounded-2xl">
                  <div className="flex gap-2 items-center mb-1.5">
                    <Sparkles className="w-4 h-4 text-[#000100]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#000100]">
                      {job.agentAction}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#666666] leading-[1.6]">
                    {job.agentJustification}
                  </p>
                </div>

                <div className="px-5 pb-5 flex gap-3">
                  <button
                    onClick={() => go("review", job)}
                    className="flex-1 bg-[#000100] text-white rounded-xl py-3.5 text-sm font-bold shadow-md transition active:scale-[0.98]"
                  >
                    Export Tailored Application
                  </button>
                  <button className="px-5 bg-[#eaeceb] text-[#666666] rounded-xl py-3.5 text-sm font-bold transition active:scale-[0.98]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tier 2: Action Required */}
        {inputJobs.length > 0 && (
          <div className="mb-8">
            {inputJobs.map((job) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                key={job.id}
                className="mb-6 rounded-[24px] bg-[#fffbeb] shadow-[0_8px_30px_rgba(251,191,36,0.12)] border border-[#fde68a] overflow-hidden"
              >
                <div className="p-5 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-6 items-center rounded-full bg-[#fbbf24] px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#000100]">
                      <AlertCircle className="mr-1 h-3.5 w-3.5" /> Needs Your
                      Input
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white border border-[#fde68a] text-lg font-bold text-[#d97706]">
                      {job.company[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-[#92400e]">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 truncate text-[13px] font-medium text-[#b45309]">
                        {job.company} • {job.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-4 mx-5 mb-5 rounded-2xl border border-[#fef3c7]">
                  <p className="text-[13px] text-[#92400e] leading-[1.6]">
                    <b className="text-[#b45309]">Missing: A/B Testing.</b>{" "}
                    {job.agentJustification}
                  </p>
                </div>

                <div className="px-5 pb-5 flex gap-3">
                  <button
                    onClick={() => go("aiChatbot", job, "chatOpen")}
                    className="flex-1 bg-[#d97706] text-white rounded-xl py-3.5 text-sm font-bold shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Reply in Chat <Send className="w-4 h-4" />
                  </button>
                  <button className="px-5 bg-white/50 border border-[#fde68a] text-[#b45309] rounded-xl py-3.5 text-sm font-bold transition active:scale-[0.98]">
                    Skip
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tier 3: Strategic Pivot */}
        {exploreJobs.length > 0 && (
          <div className="mb-4">
            {exploreJobs.map((job) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                key={job.id}
                className="mb-6 rounded-[24px] bg-[#faf5ff] shadow-[0_8px_30px_rgba(168,85,247,0.08)] border border-[#e9d5ff] overflow-hidden"
              >
                <div className="p-5 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-6 items-center rounded-full bg-[#a855f7] px-2.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      <Star className="mr-1 h-3.5 w-3.5" /> Strategic Pivot
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white border border-[#e9d5ff] text-lg font-bold text-[#7e22ce]">
                      {job.company[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-[#6b21a8]">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 truncate text-[13px] font-medium text-[#9333ea]">
                        {job.company} • {job.salary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-4 mx-5 mb-5 rounded-2xl border border-[#f3e8ff]">
                  <p className="text-[13px] text-[#7e22ce] leading-[1.6]">
                    {job.agentJustification}
                  </p>
                </div>

                <div className="px-5 pb-5 flex gap-3">
                  <button
                    onClick={() => go("tailor", job)}
                    className="flex-1 bg-[#9333ea] text-white rounded-xl py-3.5 text-sm font-bold shadow-sm transition active:scale-[0.98]"
                  >
                    Generate Draft
                  </button>
                  <button className="px-5 bg-white/50 border border-[#e9d5ff] text-[#9333ea] rounded-xl py-3.5 text-sm font-bold transition active:scale-[0.98]">
                    Ignore
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}

function Detail({ go, selectedJob }) {
  const job = selectedJob || jobs[0];
  return (
    <PhoneShell>
      <Screen>
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end gap-3 bg-[#eaeceb] px-6 pb-5">
          <div className="flex items-center gap-2 mb-1">
            <BackButton onClick={() => go("jobs")} />
          </div>
          <div className="flex flex-col justify-end pb-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#666666] leading-none mb-1.5">
              {job.company}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-[#000100] leading-none">
              {job.title}
            </h2>
          </div>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#000100]">Match analysis</h3>
            <span className="rounded-full bg-[#a0fe08] px-3 py-1 text-xs font-bold text-[#000100]">
              {job.match}%
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#666666]">{job.why}</p>
        </Card>

        <Card className="mt-4">
          <h3 className="font-bold text-[#000100]">Requirement checklist</h3>
          <div className="mt-3 space-y-3">
            {[
              "Resume includes relevant projects",
              "Location and job type match",
              "Strong design/coding keywords",
              ...job.missing.map((m) => `Needs improvement: ${m}`),
            ].map((r, i) => (
              <div
                key={r}
                className="flex items-center gap-2 text-sm text-[#000100]"
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    i < 3 ? "text-[#a0fe08]" : "text-[#a0fe08]"
                  }`}
                />
                {r}
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-4">
          <h3 className="font-bold text-[#000100]">
            Recommended resume changes
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#666666]">
            Add role-specific keywords, strengthen project impact, and rewrite
            one bullet to show measurable results.
          </p>
        </Card>

        <div className="mt-6 space-y-3">
          <PrimaryButton onClick={() => go("submitted", job)}>
            Execute Application
          </PrimaryButton>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Tailor({ go, selectedJob }) {
  const job = selectedJob || jobs[0];
  return (
    <PhoneShell>
      <Screen>
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end justify-between bg-[#eaeceb] px-6 pb-5">
          <div className="flex h-[52px] items-center">
            <BackButton onClick={() => go("detail", job)} />
          </div>
        </div>
        <Header
          title="Tailor Resume"
          subtitle={`${job.company} · ${job.title}`}
          icon={
            <GlassIcon className="h-12 w-12 rounded-2xl">
              <Wand2 className="h-6 w-6 text-white" />
            </GlassIcon>
          }
        />
        <Card>
          <h3 className="font-bold text-[#000100]">Before</h3>
          <p className="mt-2 text-sm leading-6 text-[#666666]">
            Created a student app project using React and Figma.
          </p>
        </Card>
        <Card className="mt-4 bg-[#eaeceb]">
          <h3 className="font-bold text-[#000100]">After</h3>
          <p className="mt-2 text-sm leading-6 text-[#000100]">
            Designed and built a responsive AI career prototype with React,
            Figma workflows, and user-centered job matching features.
          </p>
        </Card>
        <Card className="mt-4">
          <h3 className="font-bold text-[#000100]">Keywords added</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <StepPill>Responsive design</StepPill>
            <StepPill>AI workflow</StepPill>
            <StepPill>Job matching</StepPill>
          </div>
        </Card>
        <div className="mt-6 space-y-3">
          <PrimaryButton onClick={() => go("review", job)}>
            Accept Changes
          </PrimaryButton>
          <SecondaryButton>Edit Changes</SecondaryButton>
          <button
            onClick={() => go("review", job)}
            className="w-full py-2 text-sm text-[#666666]"
          >
            Keep Original Resume
          </button>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Review({ go, selectedJob }) {
  const job = selectedJob || jobs[0];
  return (
    <PhoneShell>
      <Screen>
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end justify-between bg-[#eaeceb] px-6 pb-5">
          <div className="flex h-[52px] items-center">
            <BackButton onClick={() => go("tailor", job)} />
          </div>
        </div>
        <Header
          title="Review Application"
          subtitle="You are always in control"
          icon={
            <GlassIcon className="h-12 w-12 rounded-2xl">
              <ShieldCheck className="h-6 w-6 text-white" />
            </GlassIcon>
          }
        />
        <Card>
          <h3 className="font-bold text-[#000100]">{job.company}</h3>
          <p className="mt-1 text-sm text-[#666666]">
            {job.title} · {job.location}
          </p>
          <div
            className={`mt-4 rounded-2xl bg-[#eaeceb] p-3 text-sm text-[#000100] ${neoIn}`}
          >
            Review carefully before submitting. You are always in control.
          </div>
        </Card>
        <Card className="mt-4">
          <h3 className="font-bold text-[#000100]">Selected resume</h3>
          <p className="mt-2 text-sm text-[#666666]">
            Job-tailored Resume v3 · ATS optimized
          </p>
        </Card>
        <Card className="mt-4">
          <h3 className="font-bold text-[#000100]">Cover letter preview</h3>
          <p className="mt-2 text-sm leading-6 text-[#666666]">
            Dear hiring team, I&apos;m excited to apply because this role
            matches my UX, frontend, and AI product interests...
          </p>
        </Card>
        <Card className="mt-4">
          <h3 className="font-bold text-[#000100]">Autofill information</h3>
          <p className="mt-2 text-sm text-[#666666]">
            Name, email, portfolio link, education, work authorization.
          </p>
        </Card>
        <div className="mt-6 space-y-3">
          <PrimaryButton onClick={() => go("submitted", job)}>
            Approve & Auto Apply
          </PrimaryButton>
          <SecondaryButton>Edit Application</SecondaryButton>
          <button
            onClick={() => go("dashboard")}
            className="w-full py-2 text-sm text-[#666666]"
          >
            Cancel
          </button>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Submitted({ go, selectedJob, onApply = () => {} }) {
  const job = selectedJob || jobs[0];
  useEffect(() => {
    onApply(job.id);
  }, [job.id, onApply]);
  return (
    <PhoneShell>
      <Screen>
        <div className="flex min-h-[610px] flex-col justify-center">
          <Card className="text-center">
            <div
              className={`mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-[#a0fe08] text-[#000100] ${neoOut}`}
            >
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-xl font-bold text-[#000100]">
              Application submitted
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#666666]">
              {job.company} · {job.title}
            </p>
            <div
              className={`mt-4 rounded-2xl bg-[#ffffff] p-4 text-left text-sm text-[#666666] ${neoIn}`}
            >
              <p>
                <b className="text-[#000100]">Resume:</b> Job-tailored Resume v3
              </p>
              <p>
                <b className="text-[#000100]">Submitted:</b> Today
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <PrimaryButton onClick={() => go("dashboard")}>
                Back to Home
              </PrimaryButton>
            </div>
          </Card>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function ResumesScreen({
  go,
  resumes = [],
  uploadQueue = [],
  onUploadResume = () => {},
  onOpenResume = () => {},
  onDeleteResume = () => {},
}) {
  const fileInputRef = useRef(null);
  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    onUploadResume(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  return (
    <PhoneShell>
      <Screen>
        {/* Standardized Header */}
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-5 flex h-[100px] items-end justify-between bg-[#eaeceb] px-6 pb-5">
          <div className="flex h-[52px] items-center gap-2">
            <BackButton onClick={() => go("profile")} />
            <h1 className="text-[26px] font-bold tracking-tight text-[#000100]">
              Resumes
            </h1>
          </div>
          <div className="flex h-[52px] items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#000100] text-white transition hover:bg-[#333]"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            fileInputRef.current?.click()
          }
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`mb-4 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#000100]/30 bg-[#ffffff] text-[#000100] ${neoIn}  transition hover:bg-[#eaeceb]`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Upload className="mb-2 h-7 w-7" />
          <span className="text-sm font-bold">
            Tap to upload or drag & drop
          </span>
          <span className="mt-1 text-xs text-[#666666]">PDF up to 5MB</span>
        </div>

        <div className="space-y-3">
          {uploadQueue.map((item) => (
            <ResumeUploadCard key={item.id} item={item} uploading />
          ))}
          {resumes.map((resume) => (
            <ResumeUploadCard
              key={resume.id}
              item={resume}
              onOpen={() => onOpenResume(resume, "resumes")}
              onDelete={() => onDeleteResume(resume.id)}
            />
          ))}
          {uploadQueue.length === 0 && resumes.length === 0 && (
            <Card className="text-center">
              <div
                className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#000100] text-white ${neoIn}`}
              >
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-[#000100]">No resumes yet</h3>
              <p className="mt-2 text-sm leading-6 text-[#666666]">
                Upload a resume to use it for AI matching, tailoring, and
                applications.
              </p>
            </Card>
          )}
        </div>
      </Screen>
    </PhoneShell>
  );
}

function ResumePreviewScreen({
  go,
  resume,
  backTarget = "resumes",
  onDeleteResume = () => {},
}) {
  const canPreviewPdf = resume?.url && isPdfResume(resume);

  return (
    <PhoneShell>
      <div className="relative flex h-full w-full flex-col bg-[#eaeceb]">
        {/* Floating Standardized Header over PDF */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-50 flex h-[100px] items-end justify-between bg-gradient-to-b from-[#eaeceb]/90 to-transparent px-6 pb-5">
          <div className="flex h-[52px] items-center">
            <BackButton
              onClick={() => go(backTarget)}
              className="pointer-events-auto drop-shadow-md"
            />
          </div>

          <div className="flex h-[52px] items-center">
            {resume?.id && (
              <button
                type="button"
                onClick={() => {
                  onDeleteResume(resume.id);
                  go(backTarget);
                }}
                className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-[#ffffff] text-[#666666] shadow-sm transition hover:bg-red-50 hover:text-red-500"
                aria-label="Delete resume"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Full Screen Content Area */}
        {!resume ? (
          <div className="flex flex-1 items-center justify-center p-6 pt-24">
            <Card className="w-full text-center">
              <div
                className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#000100] text-white ${neoIn}`}
              >
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-[#000100]">No resume selected</h3>
              <p className="mt-2 text-sm leading-6 text-[#666666]">
                Go back to your resume list and choose a file to preview.
              </p>
            </Card>
          </div>
        ) : canPreviewPdf ? (
          <div className="flex-1 bg-white">
            <iframe
              title={resume.name}
              src={`${resume.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="h-full w-full border-0 bg-white pt-14"
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 pt-24">
            <Card className="w-full text-center">
              <div
                className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#000100] text-white ${neoIn}`}
              >
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-[#000100]">
                Preview not available
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#666666]">
                Browser in-app preview works best for PDF files. DOC and DOCX
                files are saved in your list, but they cannot be rendered inside
                the phone screen without a document viewer service.
              </p>
            </Card>
          </div>
        )}

        {/* Floating File Name Pill at Bottom */}
        {canPreviewPdf && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-50 w-full max-w-[80%] -translate-x-1/2 px-4">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/20 bg-[#000100]/80 px-4 py-2 backdrop-blur-md shadow-lg">
              <FileText className="h-3.5 w-3.5 text-[#a0fe08]" />
              <span className="truncate text-xs font-bold text-white">
                {resume.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

function Profile({
  go,
  noNav = false,
  appliedCount,
  savedCount,
  jobsCount,
  resumesCount = 0,
  userName = "User",
}) {
  const accountRows = [{ icon: Settings, label: "Account Settings" }];

  const preferenceRows = [
    { icon: Bell, label: "Notifications" },
    { icon: ShieldCheck, label: "Permissions" },
    { icon: Palette, label: "Appearance" },
  ];

  const resourceRows = [{ icon: HelpCircle, label: "Contact Support" }];

  return (
    <PhoneShell>
      <Screen nav={!noNav} floatingNav={noNav} go={go} activeTab="profile">
        <div className="sticky top-0 z-50 -mx-6 -mt-8 mb-6 flex h-[104px] items-end gap-2 bg-[#eaeceb] px-6 pb-4">
          <div className="flex h-[52px] items-center">
            <h1 className="text-[26px] font-bold tracking-tight text-[#000100]">
              Settings
            </h1>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-[#d1d3d2] bg-[#ffffff]">
          <div className="flex items-center gap-4 p-4">
            <div className="h-[52px] w-[52px] overflow-hidden rounded-full bg-[#eaeceb]">
              <img
                src={PROFILE_IMG_URL}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${userName}&background=000100&color=a0fe08`;
                }}
              />
            </div>
            <div>
              <h2 className="font-bold text-[#000100]">{userName}</h2>
              <p className="text-sm text-[#666666]">UX Designer</p>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-[#666666]" />
          </div>
          <div className="h-px w-full bg-[#d1d3d2]" />
          <button className="flex w-full items-center justify-between p-4 text-sm font-bold text-[#000100] transition-colors hover:bg-[#eaeceb]">
            Edit Profile
            <ChevronRight className="h-4 w-4 text-[#666666]" />
          </button>
        </div>

        <h3 className="mb-2 ml-4 text-xs font-bold uppercase tracking-wider text-[#666666]">
          Career
        </h3>
        <div className="mb-6 overflow-hidden rounded-3xl border border-[#d1d3d2] bg-[#ffffff]">
          {[
            {
              onClick: () => go("resumes"),
              icon: FileText,
              label: "Resumes",
              count: resumesCount,
            },
            {
              onClick: () => go("jobs", null, null, "all"),
              icon: Briefcase,
              label: "Matches",
              count: jobsCount,
            },
            {
              onClick: () => go("jobs", null, null, "saved"),
              icon: Bookmark,
              label: "Saved Roles",
              count: savedCount,
            },
            {
              onClick: () => go("jobs", null, null, "applied"),
              icon: CheckCircle2,
              label: "Applied",
              count: appliedCount,
            },
          ].map((row, i, arr) => (
            <div key={row.label}>
              <button
                onClick={row.onClick}
                className="flex w-full items-center justify-between p-4 transition-colors hover:bg-[#eaeceb]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-[#000100] text-white">
                    <row.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[#000100]">
                    {row.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#666666]">{row.count}</span>
                  <ChevronRight className="h-4 w-4 text-[#666666]" />
                </div>
              </button>
              {i < arr.length - 1 && (
                <div className="ml-14 h-px bg-[#d1d3d2]" />
              )}
            </div>
          ))}
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-[#d1d3d2] bg-[#ffffff]">
          {accountRows.map((row, i) => (
            <div key={row.label}>
              <button className="flex w-full items-center justify-between p-4 transition-colors hover:bg-[#eaeceb]">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-[#000100] text-white">
                    <row.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[#000100]">
                    {row.label}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#666666]" />
              </button>
              {i < accountRows.length - 1 && (
                <div className="ml-14 h-px bg-[#d1d3d2]" />
              )}
            </div>
          ))}
        </div>

        <h3 className="mb-2 ml-4 text-xs font-bold uppercase tracking-wider text-[#666666]">
          Preferences
        </h3>
        <div className="mb-6 overflow-hidden rounded-3xl border border-[#d1d3d2] bg-[#ffffff]">
          {preferenceRows.map((row, i) => (
            <div key={row.label}>
              <button className="flex w-full items-center justify-between p-4 transition-colors hover:bg-[#eaeceb]">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-[#000100] text-white">
                    <row.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[#000100]">
                    {row.label}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#666666]" />
              </button>
              {i < preferenceRows.length - 1 && (
                <div className="ml-14 h-px bg-[#d1d3d2]" />
              )}
            </div>
          ))}
        </div>

        <h3 className="mb-2 ml-4 text-xs font-bold uppercase tracking-wider text-[#666666]">
          Resources
        </h3>
        <div className="mb-6 overflow-hidden rounded-3xl border border-[#d1d3d2] bg-[#ffffff]">
          {resourceRows.map((row, i) => (
            <div key={row.label}>
              <button className="flex w-full items-center justify-between p-4 transition-colors hover:bg-[#eaeceb]">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-[#000100] text-white">
                    <row.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[#000100]">
                    {row.label}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#666666]" />
              </button>
              {i < resourceRows.length - 1 && (
                <div className="ml-14 h-px bg-[#d1d3d2]" />
              )}
            </div>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={() => go("login")}
          whileTap={{
            scale: 0.97,
            y: 6,
            boxShadow:
              "inset 0 8px 18px rgba(127,29,29,0.45), 0 0 10px rgba(239,68,68,0.45)",
          }}
          transition={{
            type: "spring",
            stiffness: 780,
            damping: 18,
            mass: 0.45,
          }}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-3xl border border-[#d1d3d2] bg-[#ffffff] p-4 text-sm font-bold text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_18px_rgba(239,68,68,0.65),0_0_42px_rgba(239,68,68,0.35)] active:translate-y-1 active:border-red-500 active:bg-red-500 active:text-white"
        >
          <LogOut className="h-5 w-5" /> Sign Out
        </motion.button>
      </Screen>
    </PhoneShell>
  );
}

function ViewSwitchIcon({ active, type }) {
  const className = `h-[18px] w-[18px] transition-colors duration-300 ${
    active ? "text-zinc-950" : "text-white/75"
  }`;

  if (type === "web") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="3" y="5" width="18" height="12" rx="2.2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="7" y="3" width="10" height="18" rx="2.4" />
      <path d="M10.5 17h3" />
    </svg>
  );
}

function AgentResumeNotification({ job, onClick }) {
  if (!job?.notification) return null;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: -18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="absolute left-4 right-4 top-16 z-[80] flex items-center gap-3 rounded-3xl border border-[#d1d3d2] bg-[#ffffff] p-4 text-left"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#a0fe08] text-[#000100]">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#000100]">
          Syncra AI finished your resume
        </p>
        <p className="mt-1 truncate text-xs text-[#666666]">
          Tap to view the chatbot update and check your resume list.
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#666666]" />
    </motion.button>
  );
}

function ViewSwitchButton({ viewMode, onToggle }) {
  const isWeb = viewMode === "web";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isWeb ? "Switch to mobile view" : "Switch to website view"}
      title={isWeb ? "Switch to mobile view" : "Switch to website view"}
      className="relative h-9 w-[96px] overflow-hidden rounded-full border border-white/25 bg-zinc-950 p-[3px] shadow-[0_14px_28px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(0,0,0,0.55)]  transition hover:-translate-y-0.5 active:translate-y-0"
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
          <ViewSwitchIcon active={!isWeb} type="mobile" />
        </motion.span>
        <motion.span
          className="grid h-full place-items-center rounded-full"
          animate={{ scale: isWeb ? 1 : 0.86 }}
          transition={{ type: "spring", stiffness: 430, damping: 28 }}
        >
          <ViewSwitchIcon active={isWeb} type="web" />
        </motion.span>
      </div>
    </button>
  );
}

export default function App() {
  const [userName, setUserName] = useState("Daryn");
  const [screen, setScreen] = useState("osHome");
  const [showSplash, setShowSplash] = useState(false);
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [dashboardSelectedResumeId, setDashboardSelectedResumeId] =
    useState(null);
  const [resumePreviewBackTarget, setResumePreviewBackTarget] =
    useState("resumes");
  const [viewMode, setViewMode] = useState("mobile");
  const [chatMode, setChatMode] = useState("setPreferences");
  const [chatBackTarget, setChatBackTarget] = useState("dashboard");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [hasReachedDashboard, setHasReachedDashboard] = useState(false);
  const [dashboardFilter, setDashboardFilter] = useState("all");
  const [resumes, setResumes] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [agentResumeJob, setAgentResumeJob] = useState({
    status: "idle",
    notification: false,
    resumeName: "",
  });
  const [agentResumeNotice, setAgentResumeNotice] = useState(null);
  const [isChatTransition, setIsChatTransition] = useState(false);
  const [splashNext, setSplashNext] = useState("landing");

  const uploadTimers = useRef([]);
  const agentResumeTimer = useRef(null);
  const resumesRef = useRef([]);

  useEffect(() => {
    resumesRef.current = resumes;
  }, [resumes]);

  useEffect(() => {
    return () => {
      uploadTimers.current.forEach((timer) => clearInterval(timer));
      if (agentResumeTimer.current) clearTimeout(agentResumeTimer.current);
      resumesRef.current.forEach(
        (resume) => resume.url && URL.revokeObjectURL(resume.url)
      );
    };
  }, []);

  const handleUploadResume = (files) => {
    Array.from(files || []).forEach((file) => {
      const id = `${file.name}-${
        file.lastModified
      }-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const baseItem = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "uploading",
        uploadedAt: new Date().toISOString(),
      };

      if (!isResumeFile(file) || file.size > 5 * 1024 * 1024) {
        setUploadQueue((prev) => [
          {
            ...baseItem,
            status: "error",
            progress: 0,
            error: "Please upload a PDF, DOC, or DOCX file under 5MB.",
          },
          ...prev,
        ]);
        setTimeout(
          () => setUploadQueue((prev) => prev.filter((item) => item.id !== id)),
          3500
        );
        return;
      }

      setUploadQueue((prev) => [{ ...baseItem, progress: 8 }, ...prev]);

      let progress = 8;
      const timer = setInterval(() => {
        progress = Math.min(100, progress + Math.floor(Math.random() * 16) + 8);
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  progress,
                  status: progress >= 100 ? "done" : "uploading",
                }
              : item
          )
        );

        if (progress >= 100) {
          clearInterval(timer);
          const resume = {
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            url: URL.createObjectURL(file),
          };
          setResumes((prev) => [resume, ...prev]);
          setTimeout(
            () =>
              setUploadQueue((prev) => prev.filter((item) => item.id !== id)),
            800
          );
        }
      }, 260);

      uploadTimers.current.push(timer);
    });
  };

  const handleDeleteResume = (resumeId) => {
    setResumes((prev) => {
      const target = prev.find((resume) => resume.id === resumeId);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((resume) => resume.id !== resumeId);
    });
    setSelectedResume((prev) => (prev?.id === resumeId ? null : prev));
    setDashboardSelectedResumeId((prev) => (prev === resumeId ? null : prev));
  };

  const handleOpenResume = (resume, backTarget = "resumes") => {
    setSelectedResume(resume);
    setResumePreviewBackTarget(backTarget);
    setScreen("resumePreview");
  };

  const handleStartBackgroundResume = (answers) => {
    if (agentResumeTimer.current) clearTimeout(agentResumeTimer.current);
    const resumeName = "AI Generated Resume - Chris Anderson.pdf";
    setAgentResumeJob({ status: "running", notification: false, resumeName });

    agentResumeTimer.current = setTimeout(() => {
      const generatedResume = buildAiGeneratedResume(answers);
      setResumes((prev) => [generatedResume, ...prev]);
      setAgentResumeJob({
        status: "done",
        notification: true,
        resumeName: generatedResume.name,
      });
    }, 8800);
  };

  const handleAgentNotificationClick = () => {
    setAgentResumeJob((prev) => ({ ...prev, notification: false }));
    setAgentResumeNotice(null);
    setScreen("resumes");
  };

  const handleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyJob = (jobId) => {
    setAppliedJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
  };

  const go = (next, job, mode, filterParam, splashTargetStr) => {
    const shouldKeepWindowScroll =
      next === "aiChatbot" && (mode === "chatOpen" || mode === "createResume");
    const savedScrollX =
      shouldKeepWindowScroll && typeof window !== "undefined"
        ? window.scrollX
        : 0;
    const savedScrollY =
      shouldKeepWindowScroll && typeof window !== "undefined"
        ? window.scrollY
        : 0;

    if (job) setSelectedJob(job);
    if (next === "aiChatbot" && screen !== "aiChatbot") {
      setChatBackTarget(screen === "landing" ? "dashboard" : screen);
    }
    if (mode) {
      setChatMode(mode);
      setAgentResumeNotice(null);
    }
    if (filterParam) setDashboardFilter(filterParam);
    if (next === "dashboard") setHasReachedDashboard(true);
    if (splashTargetStr) setSplashNext(splashTargetStr);

    setScreen(next);

    if (shouldKeepWindowScroll && typeof window !== "undefined") {
      requestAnimationFrame(() => {
        window.scrollTo(savedScrollX, savedScrollY);
        setTimeout(() => window.scrollTo(savedScrollX, savedScrollY), 0);
      });
    }
  };

  const component = useMemo(() => {
    switch (screen) {
      case "osHome":
        return <OSHome go={go} />;
      case "splash":
        return <SplashScreen go={go} target={splashNext} />;
      case "landing":
        return <Landing go={go} />;
      case "loginLoading":
        return <LoginLoadingScreen go={go} />;
      case "login":
        return <Login go={go} resumesCount={resumes.length} />;
      case "signup":
        return <SignUp go={go} />;
      case "morningBrief":
        return <MorningBrief go={go} userName={userName} />;
      case "aiChatbot":
        return (
          <AIChatbot
            key={`${chatMode}-${agentResumeNotice?.timestamp || "normal"}`}
            go={go}
            chatMode={chatMode}
            fromDashboard={hasReachedDashboard}
            backTarget={chatBackTarget}
            hideBottomNav={
              chatMode === "createResume" && chatBackTarget === "login"
            }
            onStartBackgroundResume={handleStartBackgroundResume}
            agentResumeNotice={agentResumeNotice}
            resumes={resumes}
            onUploadResume={handleUploadResume}
            uploadQueue={uploadQueue}
          />
        );
      case "setup":
        return <Setup go={go} />;
      case "story":
        return <Story go={go} userName={userName} />;
      case "builder":
        return <Builder go={go} />;
      case "analysis":
        return <Analysis go={go} />;
      case "skill":
        return <Skill go={go} />;
      case "dashboard":
        return (
          <Dashboard
            go={go}
            noNav
            resumes={resumes}
            selectedResumeId={dashboardSelectedResumeId}
            onSelectResume={setDashboardSelectedResumeId}
            isChatTransition={isChatTransition}
            onStartChatTransition={() => {
              setIsChatTransition(true);
              setTimeout(() => {
                go("aiChatbot", null, "chatOpen");
                setIsChatTransition(false); // Reset immediately after navigation finishes
              }, 350);
            }}
            onUploadResume={handleUploadResume}
            uploadQueue={uploadQueue}
            userName={userName}
          />
        );
      case "jobs":
        return <JobsScreen go={go} />;
      case "analyzing":
        return <AnalyzingScreen go={go} />;
      case "jobSetup":
        return <JobSetup go={go} />;
      case "running":
        return <Running go={go} />;
      case "complete":
        return <Complete go={go} />;
      case "results":
        return <Results go={go} />;
      case "detail":
        return <Detail go={go} selectedJob={selectedJob} />;
      case "tailor":
        return <Tailor go={go} selectedJob={selectedJob} />;
      case "review":
        return <Review go={go} selectedJob={selectedJob} />;
      case "submitted":
        return (
          <Submitted
            go={go}
            selectedJob={selectedJob}
            onApply={handleApplyJob}
          />
        );
      case "resumes":
        return (
          <ResumesScreen
            go={go}
            resumes={resumes}
            uploadQueue={uploadQueue}
            onUploadResume={handleUploadResume}
            onOpenResume={handleOpenResume}
            onDeleteResume={handleDeleteResume}
          />
        );
      case "resumePreview":
        return (
          <ResumePreviewScreen
            go={go}
            resume={selectedResume}
            backTarget={resumePreviewBackTarget}
            onDeleteResume={handleDeleteResume}
          />
        );
      case "profile":
        return (
          <Profile
            go={go}
            noNav
            appliedCount={appliedJobs.length}
            savedCount={savedJobs.length}
            jobsCount={jobs.length}
            resumesCount={resumes.length}
            userName={userName}
          />
        );
      default:
        return <Landing go={go} />;
    }
  }, [
    screen,
    selectedJob,
    selectedResume,
    dashboardSelectedResumeId,
    resumePreviewBackTarget,
    chatMode,
    chatBackTarget,
    agentResumeNotice,
    appliedJobs,
    savedJobs,
    hasReachedDashboard,
    dashboardFilter,
    resumes,
    uploadQueue,
    isChatTransition,
    splashNext,
    userName,
  ]);

  const insideAppTransition =
    screen !== "landing" &&
    screen !== "osHome" &&
    screen !== "splash" &&
    screen !== "loginLoading" &&
    screen !== "login" &&
    screen !== "signup" &&
    screen !== "morningBrief";

  const hideFirstTimeCreateResumeNav =
    screen === "aiChatbot" &&
    chatMode === "createResume" &&
    chatBackTarget === "login";

  const tabbedScreens = ["dashboard", "jobs", "profile"];

  const isTabbed =
    tabbedScreens.includes(screen) && !hideFirstTimeCreateResumeNav;

  const activeTab =
    screen === "profile" ? "profile" : screen === "jobs" ? "jobs" : "home";

  return (
    <ViewModeContext.Provider value={viewMode}>
      <main className="min-h-screen bg-[#eaeceb] font-sans">
        <>
          <div className="fixed left-4 top-4 z-40 flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-[#d1d3d2] bg-[#ffffff] px-4 py-2 text-xs font-bold text-[#000100]">
              AI Career Copilot Prototype · {screen}
            </div>

            {screen !== "osHome" && (
              <button
                onClick={() => {
                  setScreen("osHome");
                }}
                className="rounded-full border border-[#d1d3d2] bg-[#ffffff] px-4 py-2 text-xs font-bold text-[#000100] transition hover:bg-[#eaeceb]"
              >
                ← Return to OS
              </button>
            )}

            {screen !== "osHome" && (
              <ViewSwitchButton
                viewMode={viewMode}
                onToggle={() =>
                  setViewMode((mode) => (mode === "mobile" ? "web" : "mobile"))
                }
              />
            )}
          </div>

          {insideAppTransition ? (
            <PhoneShell>
              <ShellStripContext.Provider value={true}>
                <div className="relative flex h-full min-h-0 flex-1 flex-col">
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    <div className="absolute inset-0 h-full min-h-0">
                      {component}
                    </div>
                  </div>
                  <AgentResumeNotification
                    job={agentResumeJob}
                    onClick={handleAgentNotificationClick}
                  />
                  {/* Persistent floating nav bar for tabbed screens */}
                  <AnimatePresence>
                    {isTabbed && !isChatTransition && (
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="absolute bottom-6 left-6 right-6 z-40"
                      >
                        <BottomNav go={go} activeTab={activeTab} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ShellStripContext.Provider>
            </PhoneShell>
          ) : (
            component
          )}
        </>

        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}`}</style>
      </main>
    </ViewModeContext.Provider>
  );
}
