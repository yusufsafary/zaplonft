import { useActiveSection } from "@/hooks";

const ITEMS = [
  {
    id: "top",
    label: "Home",
    href: "#top",
    icon: (
      <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5v-6.2h-4V21H5a1 1 0 0 1-1-1z" fill="currentColor" />
    ),
  },
  {
    id: "mint",
    label: "Mint",
    href: "#mint",
    icon: <path d="M13.2 2.5 5 13.8h5.4L8.6 21.5 19 10h-5.6z" fill="currentColor" />,
  },
  {
    id: "guide",
    label: "Guide",
    href: "/guide/",
    icon: (
      <path d="M6.5 2H19a1 1 0 0 1 1 1v15.5a1 1 0 0 1-1 1H6.8A2.8 2.8 0 0 0 4 22V5A3 3 0 0 1 6.5 2zm0 2.2A.8.8 0 0 0 6 5v14.3c.3-.1.6-.2.9-.2H18V4H6.5z" fill="currentColor" />
    ),
  },
];

/** Navigasi bawah khusus mobile — jempol-ramah, indikator section aktif. */
export default function MobileNav() {
  const active = useActiveSection(["top", "mint"]);
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-steel/60 bg-ink/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile"
    >
      <div className="grid grid-cols-3">
        {ITEMS.map((it) => (
          <a
            key={it.id}
            href={it.href}
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
