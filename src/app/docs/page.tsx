import Link from "next/link";

export const metadata = {
  title: "Docs — Beeper",
  description: "Guides for using Beeper from different clients.",
};

const GUIDES = [
  {
    href: "/docs/chatgpt",
    icon: "smart_toy",
    label: "CHATGPT",
    hint: "Custom MCP connector via Developer Mode.",
  },
  {
    href: "https://github.com/edumame/beeper-v2",
    icon: "terminal",
    label: "CLAUDE CODE",
    hint: "Install the beeper-v2 plugin.",
    external: true,
  },
  {
    href: "/docs/api",
    icon: "api",
    label: "REST + MCP API",
    hint: "Coming soon — full endpoint reference.",
    disabled: true,
  },
];

export default function DocsIndex() {
  return (
    <main className="flex-grow px-container-margin max-w-3xl mx-auto w-full pt-4 md:pt-8">
      <header className="mb-stack-md flex items-center justify-between border-b border-outline-variant pb-4">
        <h1 className="font-display text-display tracking-tight text-on-surface">
          📖 DOCS
        </h1>
        <span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          guides
        </span>
      </header>

      <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-md max-w-xl">
        Beeper is async, allowlisted, Claude-to-Claude task delegation between
        two humans. iMessage is the wake signal. Pick a client below.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GUIDES.map((g) => {
          const inner = (
            <div
              className={`group border border-outline-variant bg-surface-container-lowest p-stack-md flex flex-col items-start gap-stack-sm rounded-md transition-all duration-150 ease-out ${
                g.disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-primary/40 cursor-pointer"
              }`}
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <span
                className="material-symbols-outlined text-on-surface-variant text-[20px] group-hover:text-primary transition-colors duration-150 ease-out"
                aria-hidden
              >
                {g.icon}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">
                {g.label}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {g.hint}
              </span>
            </div>
          );

          if (g.disabled) return <div key={g.href}>{inner}</div>;
          if (g.external) {
            return (
              <a
                key={g.href}
                href={g.href}
                target="_blank"
                rel="noreferrer"
              >
                {inner}
              </a>
            );
          }
          return (
            <Link key={g.href} href={g.href}>
              {inner}
            </Link>
          );
        })}
      </section>
    </main>
  );
}
