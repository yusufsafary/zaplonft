import { useActiveSection } from "@/hooks";

const ITEMS = [
  {
    id: "top",
    label: "Home",
    icon: (
      <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5v-6.2h-4V21H5a1 1 0 0 1-1-1z" fill="currentColor" />
    ),
  },
  {
    id: "tiers",
    label: "Rack",
    icon: (
      <g fill="currentColor">
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" opacity="0.55" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" opacity="0.55" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </g>
    ),
  },
  {
    id: "arc",
    label: "Arc",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M12 3.5 21 8.5l-9 5-9-5z" fill="currentColor" stroke="none" />
        <path d="m4.5 12.5 7.5 4.2 7.5-4.2" opacity="0.6" />
        <path d="m4.5 16.5 7.5 4.2 7.5-4.2" opacity="0.35" />
      </g>
    ),
  },
  {
    id: "gate",
    label: "Gate",
    icon: (
      <path d="M12 3 5 5.8v5.4c0 4.5 3 7.7 7 9.3 4-1.6 7-4.8 7-9.3V5.8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    ),
  },
  {
    id: "mint",
    label: "Mint",
    icon: <path d="M13.2 2.5 5 13.8h5.4L8.6 21.5 19 10h-5.6z" fill="currentColor" />,
  },
];

/** Navigasi bawah khusus mobile — jempol-ramah, indikator section aktif. */
export default function MobileNav() {
  const active = useActiveSection(ITEMS.map((i) => i.id));
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-steel/60 bg-ink/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile"
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${active === it.id ? "text-volt" : "text-ash active:text-paper"}`}
          >
            <svg viewBox="0 0 24 24" className="size-[21px]" aria-hidden="true">{it.icon}</svg>
            <span className="label text-[9px] leading-none">{it.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
