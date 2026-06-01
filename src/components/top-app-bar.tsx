"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIdentity } from "@/lib/identity";

const NAV = [
  { href: "/", label: "HOME" },
  { href: "/inbox", label: "INBOX" },
  { href: "/sent", label: "SENT" },
  { href: "/access", label: "ACCESS" },
];

function IdentityBadge() {
  const [me, setMe, loaded] = useIdentity()
  if (!loaded || !me) return null
  return (
    <button
      onClick={() => { if (confirm('Switch identity?')) setMe(null) }}
      className="ml-4 font-label-caps text-label-caps text-on-surface-variant border border-outline-variant px-2 py-1 hover:bg-surface-container"
      title="Click to switch identity"
    >
      ME: {me.toUpperCase()}
    </button>
  )
}

export function TopAppBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-40 border-b border-outline-variant bg-surface-container-lowest flex items-center px-container-margin h-10">
      <Link href="/" className="flex items-center gap-unit">
        <span
          className="material-symbols-outlined filled text-primary text-lg"
          aria-hidden
        >
          pages
        </span>
        <span className="font-code-md text-code-md tracking-tighter text-primary uppercase">
          BEEPER
        </span>
        <span className="ml-2 font-label-caps text-label-caps text-on-surface-variant">
          v2
        </span>
      </Link>

      <nav className="hidden md:flex ml-auto items-center gap-container-margin h-full">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "font-label-caps text-label-caps text-primary border-b-2 border-primary h-full flex items-center px-2"
                  : "font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container px-2 py-1 h-full flex items-center"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <IdentityBadge />
    </header>
  );
}
