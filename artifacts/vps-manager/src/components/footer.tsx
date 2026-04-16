import { Link } from "wouter";
import { Github, Send, HeadphonesIcon, Coffee } from "lucide-react";

const LINKS = [
  { href: "https://github.com/Casper-Tech-ke/vps-manager", label: "GitHub", icon: Github },
  { href: "https://t.me/casper_tech_ke", label: "Telegram", icon: Send },
  { href: "https://support.xcasper.space", label: "Support", icon: HeadphonesIcon },
  { href: "https://payments.xcasper.space", label: "Buy Coffee", icon: Coffee },
];

export function Footer() {
  return (
    <footer
      className="flex-shrink-0 py-3 px-4"
      style={{
        borderTop: "1px solid rgba(0,255,0,0.1)",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs font-mono text-center sm:text-left" style={{ color: "#4b5563" }}>
          &copy; 2026{" "}
          <span className="font-semibold" style={{ color: "#9ca3af" }}>WOLF TECH VPS MANAGER</span>
          {" · "}
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              background: "linear-gradient(135deg, #00ff00, rgba(0,255,0,0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            WOLF TECH
          </span>
          {" · "}
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms &amp; Privacy
          </Link>
        </p>

        <div className="flex items-center gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: "#4b5563" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00ff00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
