import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Home, FolderOpen, Terminal, Code2,
  Github, Send, HeadphonesIcon, LogOut, Menu, X, Settings, Zap,
} from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/files", label: "Files", icon: FolderOpen },
  { href: "/terminal", label: "Terminal", icon: Terminal },
  { href: "/dev", label: "Dev", icon: Code2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

const SOCIAL_LINKS = [
  { href: "https://github.com/Casper-Tech-ke", label: "GitHub", icon: Github },
  { href: "https://t.me/casper_tech_ke", label: "Telegram", icon: Send },
  { href: "https://support.xcasper.space", label: "Support", icon: HeadphonesIcon },
];

export function Navbar() {
  const { logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-4"
        style={{
          background: "rgba(0,0,0,0.95)",
          borderBottom: "1px solid rgba(0,255,0,0.18)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center glow-pulse"
            style={{
              background: "rgba(0,255,0,0.08)",
              border: "1px solid rgba(0,255,0,0.3)",
            }}
          >
            <Zap className="w-4 h-4" style={{ color: "#00ff00" }} />
          </div>
          <span className="hidden sm:flex flex-col leading-none">
            <span
              className="font-black text-sm tracking-widest"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              <span style={{ color: "#00ff00" }}>WOLF</span>
              <span style={{ color: "#d1d5db" }}> TECH</span>
            </span>
            <span className="text-[9px] tracking-wider mt-0.5" style={{ color: "#6b7280" }}>
              VPS MANAGER
            </span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono transition-all"
              style={
                isActive(href)
                  ? {
                      color: "#00ff00",
                      background: "rgba(0,255,0,0.08)",
                      border: "1px solid rgba(0,255,0,0.2)",
                    }
                  : {
                      color: "#9ca3af",
                      border: "1px solid transparent",
                    }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex-1 md:hidden" />

        {/* Social + Avatar + Logout */}
        <div className="hidden md:flex items-center gap-1">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              className="p-2 rounded-lg transition-all"
              style={{ color: "#6b7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00ff00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
          <div className="w-px h-5 mx-1" style={{ background: "rgba(0,255,0,0.15)" }} />
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black select-none mr-1"
            style={{
              background: "rgba(0,255,0,0.1)",
              border: "1px solid rgba(0,255,0,0.3)",
              color: "#00ff00",
              fontFamily: "'Orbitron', monospace",
            }}
            title="Authenticated"
          >
            W
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="h-8 gap-1.5 text-xs font-mono"
            style={{ color: "#6b7280" }}
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "#6b7280" }}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 pt-14 flex flex-col"
          style={{ background: "rgba(0,0,0,0.97)", backdropFilter: "blur(20px)" }}
          onClick={() => setMobileOpen(false)}
        >
          <div className="p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono transition-all"
                style={
                  isActive(href)
                    ? { color: "#00ff00", background: "rgba(0,255,0,0.08)", border: "1px solid rgba(0,255,0,0.2)" }
                    : { color: "#9ca3af", border: "1px solid transparent" }
                }
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            <div className="h-px my-3" style={{ background: "rgba(0,255,0,0.12)" }} />
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-mono transition-colors"
                  style={{ color: "#6b7280", border: "1px solid rgba(0,255,0,0.15)" }}
                >
                  <Icon className="w-4 h-4" /> {label}
                </a>
              ))}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-mono transition-all w-full mt-2 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-14 flex-shrink-0" />
    </>
  );
}
