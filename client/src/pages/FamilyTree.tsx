import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ─── Portrait CDN URLs ───────────────────────────────────────────────────────
const CDN = {
  james: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/QewJrsfHzoiLTwNQ.jpg",
  silas: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/zmPQnwbqfbFcGjCt.jpg",
  rebecca: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/coigSvZyjatMgnhK.jpg",
  isabellaSelmes: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/lTKnrulhAjepLubN.jpg",
};

// ─── Member Data ─────────────────────────────────────────────────────────────
interface Member {
  id: string;
  name: string;
  dates: string;
  bio: string;
  img?: string;
  role?: string;
  bioUrl: string;
}

const MEMBERS: Record<string, Member> = {
  james: {
    id: "james",
    name: "James Dinsmore",
    dates: "1790 – 1872",
    role: "Patriarch",
    img: CDN.james,
    bioUrl: "https://www.dinsmorefarm.org/the-family/james-dinsmore/",
    bio: "Born in Windham, New Hampshire, James graduated from Dartmouth College in 1813 and studied law in Natchez, Mississippi. In May 1829 he married Martha Macomb and by 1842 had settled the family on an 800-acre farm in Boone County, Kentucky — the Dinsmore Homestead. He died December 21, 1872.",
  },
  martha: {
    id: "martha",
    name: "Martha Macomb",
    dates: "1797 – 1859",
    role: "Matriarch",
    bioUrl: "https://www.dinsmorefarm.org/the-family/martha-macomb/",
    bio: "Born in Burlington, New Jersey, Martha Macomb married James Dinsmore in May 1829. Together they had three daughters: Isabella (1830), Julia (1833), and Susan (1835). Martha died in 1859 at the Homestead.",
  },
  alexander: {
    id: "alexander",
    name: "Alexander Macomb, Sr.",
    dates: "1748 – 1831",
    role: "Martha's Father",
    bioUrl: "https://www.dinsmorefarm.org/the-family/alexander-macomb/",
    bio: "Alexander Macomb Sr. was Martha Macomb's father. A prominent figure in New Jersey society, he was the father-in-law of James Dinsmore.",
  },
  janet: {
    id: "janet",
    name: "Janet Macomb",
    dates: "",
    role: "Martha's Mother",
    bioUrl: "https://www.dinsmorefarm.org/the-family/janet-macomb/",
    bio: "Janet Macomb was the mother of Martha Macomb Dinsmore and mother-in-law of James Dinsmore.",
  },
  johnJr: {
    id: "johnJr",
    name: "John Dinsmore, Jr.",
    dates: "1766 – 1814",
    role: "James's Father",
    bioUrl: "https://www.dinsmorefarm.org/the-family/john-dinsmore-jr/",
    bio: "John Dinsmore Jr. was the father of James Dinsmore. He was born in Windham, New Hampshire and died in 1814.",
  },
  susannah: {
    id: "susannah",
    name: "Susannah Dinsmore",
    dates: "",
    role: "James's Mother",
    bioUrl: "https://www.dinsmorefarm.org/the-family/susannah-dinsmore/",
    bio: "Susannah Dinsmore was the mother of James Dinsmore.",
  },
  silas: {
    id: "silas",
    name: "Silas Dinsmoor",
    dates: "1766 – 1847",
    role: "James's Uncle",
    img: CDN.silas,
    bioUrl: "https://www.dinsmorefarm.org/the-family/silas-dinsmoor/",
    bio: "One of the more colorful members of the Dinsmore clan, Silas kept the original spelling of the family name. Born September 26, 1766 in Windham, New Hampshire, he wrote James about the beautiful tract of land in Boone County, Kentucky that would become the Homestead.",
  },
  isabella: {
    id: "isabella",
    name: "Isabella Dinsmore",
    dates: "1830 – 1867",
    role: "Eldest Daughter",
    bioUrl: "https://www.dinsmorefarm.org/the-family/isabella-dinsmore/",
    bio: "Isabella Ramsay Dinsmore was the eldest daughter of James and Martha Dinsmore, born in 1830. She married Charles Flandrau in 1859.",
  },
  charles: {
    id: "charles",
    name: "Charles Flandrau",
    dates: "1828 – 1903",
    role: "Isabella's Husband",
    bioUrl: "https://www.dinsmorefarm.org/the-family/charles-flandrau/",
    bio: "Charles Flandrau married Isabella Dinsmore in 1859. He was a prominent Minnesota jurist and author.",
  },
  julia: {
    id: "julia",
    name: "Julia Dinsmore",
    dates: "1833 – 1926",
    role: "Second Daughter",
    bioUrl: "https://www.dinsmorefarm.org/the-family/julia-dinsmore/",
    bio: "Julia Stockton Dinsmore was the second daughter of James and Martha. She never married and inherited the Homestead, preserving it until her death in 1926 at age 93.",
  },
  rebecca: {
    id: "rebecca",
    name: "Rebecca Blair",
    dates: "1839 – 1911",
    role: "Julia's Companion",
    img: CDN.rebecca,
    bioUrl: "https://www.dinsmorefarm.org/the-family/rebecca-blair/",
    bio: "Rebecca Blair McClure was born near Pittsburgh, Pennsylvania. Well-educated and fluent in several languages, she became a close companion to Julia Dinsmore at the Homestead after being widowed young.",
  },
  susan: {
    id: "susan",
    name: "Susan Dinsmore",
    dates: "1835 – 1851",
    role: "Youngest Daughter",
    bioUrl: "https://www.dinsmorefarm.org/the-family/susan-dinsmore/",
    bio: "Susan Bell Dinsmore was the youngest daughter of James and Martha, born in 1835. She died young in 1851.",
  },
  martha_flandrau: {
    id: "martha_flandrau",
    name: "Martha 'Patty' Flandrau",
    dates: "1861 – 1923",
    role: "Isabella's Daughter",
    bioUrl: "https://www.dinsmorefarm.org/the-family/martha-flandrau/",
    bio: "Martha 'Patty' Flandrau was the daughter of Isabella Dinsmore and Charles Flandrau. She married Tilden Selmes in 1883.",
  },
  tilden: {
    id: "tilden",
    name: "Tilden Selmes",
    dates: "1853 – 1895",
    role: "Patty's Husband",
    bioUrl: "https://www.dinsmorefarm.org/the-family/tilden-selmes/",
    bio: "Tilden Selmes married Martha 'Patty' Flandrau in 1883. He died in 1895, leaving Patty a widow with their daughter Isabella.",
  },
  sarah: {
    id: "sarah",
    name: "Sarah 'Sally' Flandrau",
    dates: "1867 – 1947",
    role: "Isabella's Daughter",
    bioUrl: "https://www.dinsmorefarm.org/the-family/sarah-flandrau/",
    bio: "Sarah 'Sally' Flandrau was the daughter of Isabella Dinsmore and Charles Flandrau. She married Frank Cutcheon in 1891.",
  },
  frank: {
    id: "frank",
    name: "Frank Cutcheon",
    dates: "1864 – 1936",
    role: "Sally's Husband",
    bioUrl: "https://www.dinsmorefarm.org/the-family/frank-cutcheon/",
    bio: "Frank Cutcheon married Sarah 'Sally' Flandrau in 1891. He was a New York attorney.",
  },
  isabellaSelmes: {
    id: "isabellaSelmes",
    name: "Isabella Selmes",
    dates: "1886 – 1953",
    role: "Patty's Daughter",
    img: CDN.isabellaSelmes,
    bioUrl: "https://www.dinsmorefarm.org/the-family/isabella-selmes/",
    bio: "Isabella Selmes was born at the Dinsmore farm on March 22, 1886. She attended Miss Chapin's School where she met Eleanor Roosevelt. She was married three times: to Robert Ferguson (1905), John Greenway (1923), and Harry King (1939). A remarkable woman of the American West.",
  },
  robertFerguson: {
    id: "robertFerguson",
    name: "Robert Ferguson",
    dates: "1867 – 1922",
    role: "Isabella's 1st Husband",
    bioUrl: "https://www.dinsmorefarm.org/the-family/robert-ferguson/",
    bio: "Robert Ferguson was Isabella Selmes's first husband, married in 1905. He was a Scottish-born rancher and close friend of Theodore Roosevelt.",
  },
  johnGreenway: {
    id: "johnGreenway",
    name: "John Greenway",
    dates: "1872 – 1926",
    role: "Isabella's 2nd Husband",
    bioUrl: "https://www.dinsmorefarm.org/the-family/john-greenway/",
    bio: "John Greenway was Isabella Selmes's second husband, married in 1923. A decorated military officer and Arizona copper magnate.",
  },
  harryKing: {
    id: "harryKing",
    name: "Harry King",
    dates: "1890 – 1976",
    role: "Isabella's 3rd Husband",
    bioUrl: "https://www.dinsmorefarm.org/the-family/harry-king/",
    bio: "Harry King was Isabella Selmes's third husband, married in 1939.",
  },
  marthaFerguson: {
    id: "marthaFerguson",
    name: "Martha Ferguson",
    dates: "1906 – 1994",
    role: "Isabella's Daughter",
    bioUrl: "https://www.dinsmorefarm.org/the-family/martha-ferguson/",
    bio: "Martha Ferguson was the daughter of Isabella Selmes and Robert Ferguson, born in 1906.",
  },
  bobFerguson: {
    id: "bobFerguson",
    name: "Robert 'Bob' Ferguson",
    dates: "1908 – 1984",
    role: "Isabella's Son",
    bioUrl: "https://www.dinsmorefarm.org/the-family/robert-bob-ferguson/",
    bio: "Robert 'Bob' Ferguson was the son of Isabella Selmes and Robert Ferguson, born in 1908.",
  },
  jackGreenway: {
    id: "jackGreenway",
    name: "Jack S. Greenway",
    dates: "1924 – 1995",
    role: "Isabella's Son",
    bioUrl: "https://www.dinsmorefarm.org/the-family/jack-greenway/",
    bio: "Jack S. Greenway was the son of Isabella Selmes and John Greenway, born in 1924.",
  },
};

// ─── Tree Structure ───────────────────────────────────────────────────────────
// Organized into generations for visual layout
const GENERATIONS = [
  {
    label: "Generation I — Grandparents",
    rows: [
      {
        couples: [
          { left: "johnJr", right: "susannah", marriage: null },
          { left: "alexander", right: "janet", marriage: null },
        ],
      },
    ],
  },
  {
    label: "Generation II — Patriarch & Matriarch",
    rows: [
      {
        couples: [
          { left: "silas", right: null, marriage: null, note: "Uncle" },
          { left: "james", right: "martha", marriage: "m. 1829" },
        ],
      },
    ],
  },
  {
    label: "Generation III — Children",
    rows: [
      {
        couples: [
          { left: "isabella", right: "charles", marriage: "m. 1859" },
          { left: "julia", right: "rebecca", marriage: null, note: "Companion" },
          { left: "susan", right: null, marriage: null },
        ],
      },
    ],
  },
  {
    label: "Generation IV — Grandchildren",
    rows: [
      {
        couples: [
          { left: "martha_flandrau", right: "tilden", marriage: "m. 1883" },
          { left: "sarah", right: "frank", marriage: "m. 1891" },
        ],
      },
    ],
  },
  {
    label: "Generation V — Great-Grandchildren",
    rows: [
      {
        couples: [
          { left: "isabellaSelmes", right: "robertFerguson", marriage: "m. 1905" },
          { left: "isabellaSelmes", right: "johnGreenway", marriage: "m. 1923", note: "2nd" },
          { left: "isabellaSelmes", right: "harryKing", marriage: "m. 1939", note: "3rd" },
        ],
      },
    ],
  },
  {
    label: "Generation VI — Great-Great-Grandchildren",
    rows: [
      {
        couples: [
          { left: "marthaFerguson", right: null, marriage: null },
          { left: "bobFerguson", right: null, marriage: null },
          { left: "jackGreenway", right: null, marriage: null },
        ],
      },
    ],
  },
];

// ─── Portrait Component ───────────────────────────────────────────────────────
function Portrait({
  member,
  size = "md",
  onClick,
}: {
  member: Member;
  size?: "sm" | "md" | "lg";
  onClick: (m: Member) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const sizeMap = { sm: "w-16 h-16", md: "w-20 h-20", lg: "w-28 h-28" };
  const textSize = { sm: "text-xs", md: "text-xs", lg: "text-sm" };

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer group"
      onClick={() => onClick(member)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        {/* Glow ring on hover */}
        <motion.div
          className={`absolute inset-0 rounded-full ${sizeMap[size]}`}
          animate={{
            boxShadow: hovered
              ? "0 0 0 3px #c9a84c, 0 0 20px rgba(201,168,76,0.5)"
              : "0 0 0 2px rgba(201,168,76,0.3)",
          }}
          transition={{ duration: 0.2 }}
          style={{ borderRadius: "50%" }}
        />
        {/* Portrait circle */}
        <div
          className={`${sizeMap[size]} rounded-full overflow-hidden border-2 border-[#c9a84c]/40 relative`}
          style={{
            background: "linear-gradient(135deg, #2d1f0e 0%, #4a3728 100%)",
          }}
        >
          {member.img ? (
            <img
              src={member.img}
              alt={member.name}
              className="w-full h-full object-cover object-top"
              style={{ filter: hovered ? "brightness(1.1) contrast(1.05)" : "brightness(0.95)" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-40">
                <circle cx="50" cy="35" r="20" fill="#c9a84c" />
                <ellipse cx="50" cy="80" rx="30" ry="22" fill="#c9a84c" />
              </svg>
            </div>
          )}
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-[#c9a84c]/20 rounded-full"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
      {/* Name & dates */}
      <div className="mt-2 text-center max-w-[90px]">
        <p
          className={`${textSize[size]} font-semibold text-[#1a2f4e] leading-tight`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {member.name}
        </p>
        {member.dates && (
          <p className="text-[10px] text-[#6b5744] mt-0.5" style={{ fontFamily: "'EB Garamond', serif" }}>
            {member.dates}
          </p>
        )}
        {member.role && (
          <p className="text-[9px] text-[#c9a84c] uppercase tracking-wide mt-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
            {member.role}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Connector Lines ──────────────────────────────────────────────────────────
function MarriageConnector({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 px-2 self-start mt-7">
      <div className="h-px w-4 bg-[#c9a84c]/50" />
      <span className="text-[10px] text-[#c9a84c] italic whitespace-nowrap" style={{ fontFamily: "'EB Garamond', serif" }}>
        {label}
      </span>
      <div className="h-px w-4 bg-[#c9a84c]/50" />
    </div>
  );
}

// ─── Bio Modal ────────────────────────────────────────────────────────────────
function BioModal({ member, onClose }: { member: Member; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {/* Card */}
      <motion.div
        className="relative z-10 bg-[#fdf6e3] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          border: "1px solid rgba(201,168,76,0.4)",
          boxShadow: "0 25px 60px rgba(26,47,78,0.3), inset 0 0 0 1px rgba(201,168,76,0.2)",
        }}
      >
        {/* Header */}
        <div
          className="relative p-6 pb-4"
          style={{
            background: "linear-gradient(135deg, #1a2f4e 0%, #2d4a1e 100%)",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            {/* Portrait */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#c9a84c]/60 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2d1f0e 0%, #4a3728 100%)" }}>
              {member.img ? (
                <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-40">
                    <circle cx="50" cy="35" r="20" fill="#c9a84c" />
                    <ellipse cx="50" cy="80" rx="30" ry="22" fill="#c9a84c" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                {member.role || "Family Member"}
              </p>
              <h2 className="text-white text-xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {member.name}
              </h2>
              {member.dates && (
                <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "'EB Garamond', serif" }}>
                  {member.dates}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="p-6">
          <p className="text-[#4a3728] leading-relaxed" style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}>
            {member.bio}
          </p>
          <a
            href={member.bioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[#1a2f4e] hover:text-[#c9a84c] transition-colors"
            style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.05em" }}
          >
            Read Full Biography →
          </a>
        </div>
        {/* Decorative border */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #c9a84c, #e8d5a3, #c9a84c)" }} />
      </motion.div>
    </motion.div>
  );
}

// ─── Generation Row ───────────────────────────────────────────────────────────
function GenerationRow({
  gen,
  onSelect,
}: {
  gen: (typeof GENERATIONS)[0];
  onSelect: (m: Member) => void;
}) {
  // Deduplicate members shown in a row (isabellaSelmes appears 3x in gen V)
  const shownIds = new Set<string>();

  return (
    <div className="mb-2">
      {/* Generation label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-[#c9a84c]/20" />
        <span
          className="text-xs uppercase tracking-widest text-[#c9a84c]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {gen.label}
        </span>
        <div className="h-px flex-1 bg-[#c9a84c]/20" />
      </div>

      {gen.rows.map((row, ri) => (
        <div key={ri} className="flex flex-wrap justify-center gap-6 md:gap-10">
          {row.couples.map((couple, ci) => {
            const leftMember = MEMBERS[couple.left];
            const rightMember = couple.right ? MEMBERS[couple.right] : null;
            const showLeft = !shownIds.has(couple.left);
            const showRight = couple.right && !shownIds.has(couple.right);
            if (showLeft) shownIds.add(couple.left);
            if (showRight && couple.right) shownIds.add(couple.right);

            return (
              <div key={ci} className="flex items-start gap-2">
                {showLeft && leftMember && (
                  <Portrait member={leftMember} onClick={onSelect} />
                )}
                {couple.marriage && rightMember && (
                  <MarriageConnector label={couple.marriage} />
                )}
                {couple.note && !couple.marriage && rightMember && (
                  <div className="flex items-center self-start mt-7 px-1">
                    <span className="text-[9px] text-[#6b5744] italic" style={{ fontFamily: "'EB Garamond', serif" }}>
                      {couple.note}
                    </span>
                  </div>
                )}
                {showRight && rightMember && (
                  <Portrait member={rightMember} onClick={onSelect} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FamilyTree() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(45,74,30,0.08) 0%, transparent 50%),
          linear-gradient(160deg, #fdf6e3 0%, #f5ead0 30%, #ede0c4 60%, #f0e8d0 100%)
        `,
      }}
    >
      {/* Parchment texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Hero Header */}
      <div
        className="relative py-20 px-6 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a2f4e 0%, #0f1e30 50%, #2d4a1e 100%)",
        }}
      >
        {/* Decorative vine pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M0,150 Q300,50 600,150 Q900,250 1200,150" stroke="#c9a84c" strokeWidth="2" fill="none" />
            <path d="M0,100 Q300,200 600,100 Q900,0 1200,100" stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M0,200 Q300,100 600,200 Q900,300 1200,200" stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>

        <div className="relative z-10">
          <p
            className="text-[#c9a84c] text-xs uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            ✦ The Dinsmore Family ✦
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Family Tree
          </h1>
          <p
            className="text-white/60 max-w-2xl mx-auto text-lg"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Explore the immediate Dinsmore family members — those who lived on or visited the farm,
            or who had close ties to those who lived there. Click on any portrait to learn more.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-white/40 text-sm">
            <span>Est. 1842</span>
            <span>·</span>
            <span>Burlington, Kentucky</span>
            <span>·</span>
            <span>6 Generations</span>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        {/* Intro */}
        <div className="text-center mb-12">
          <p
            className="text-[#4a3728] text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            The Dinsmore Homestead has been home to six generations of one remarkable family.
            Hover over any portrait to highlight a family member, then click to read their biography.
          </p>
        </div>

        {/* Vertical connector line */}
        <div className="relative">
          {/* Central spine */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.15) 10%, rgba(201,168,76,0.15) 90%, transparent)" }}
          />

          {/* Generations */}
          <div className="space-y-16">
            {GENERATIONS.map((gen, gi) => (
              <GenerationRow key={gi} gen={gen} onSelect={setSelected} />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div
          className="mt-16 p-6 rounded-2xl border border-[#c9a84c]/20 text-center"
          style={{ background: "rgba(201,168,76,0.05)" }}
        >
          <p className="text-xs uppercase tracking-widest text-[#c9a84c] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
            Legend
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#4a3728]" style={{ fontFamily: "'EB Garamond', serif" }}>
            <span className="flex items-center gap-2">
              <span className="w-8 h-px bg-[#c9a84c]" /> Marriage connection
            </span>
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full border-2 border-[#c9a84c]/40 bg-[#4a3728]/10" /> Portrait (click for bio)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full border-2 border-[#c9a84c] bg-[#4a3728]/10" style={{ boxShadow: "0 0 8px rgba(201,168,76,0.4)" }} /> Hover highlight
            </span>
          </div>
        </div>

        {/* Link to extended PDF */}
        <div className="text-center">
          <a
            href="https://www.dinsmorefarm.org/the-family/the-tree/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#c9a84c]/40 text-[#1a2f4e] hover:bg-[#c9a84c]/10 transition-colors text-sm"
            style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}
          >
            View Extended Family Tree PDF →
          </a>
        </div>
      </div>

      {/* Bio Modal */}
      <AnimatePresence>
        {selected && (
          <BioModal member={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
