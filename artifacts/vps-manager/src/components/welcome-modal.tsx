import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coffee, Github, Send, HeartHandshake, ExternalLink, Zap } from "lucide-react";

export function WelcomeModal() {
  const { isAuthenticated, welcomeShown, dismissWelcome } = useAuth();

  const open = isAuthenticated && !welcomeShown;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden"
        style={{
          background: "#000",
          border: "1px solid rgba(0,255,0,0.25)",
          boxShadow: "0 0 60px rgba(0,255,0,0.08)",
        }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Neon top bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: "linear-gradient(90deg, transparent, #00ff00, rgba(0,255,0,0.4), transparent)",
          }}
        />

        <div className="p-6">
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center glow-pulse"
                style={{
                  background: "rgba(0,255,0,0.08)",
                  border: "1px solid rgba(0,255,0,0.3)",
                }}
              >
                <Zap className="w-5 h-5" style={{ color: "#00ff00" }} />
              </div>
              <div>
                <DialogTitle
                  className="text-lg font-black"
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  Welcome to{" "}
                  <span style={{ color: "#00ff00" }}>WOLF</span>
                  <span style={{ color: "#d1d5db" }}> TECH</span>
                </DialogTitle>
                <p className="text-xs font-mono mt-0.5" style={{ color: "#6b7280" }}>
                  VPS MANAGER — Build. Deploy. Dominate.
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Summary blurb */}
          <div
            className="rounded-xl p-4 mb-5 space-y-2 text-sm font-mono leading-relaxed"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(0,255,0,0.12)",
              color: "#9ca3af",
            }}
          >
            <p>
              By continuing you confirm that you are using this software
              <strong className="text-foreground"> on systems you own or are authorised to manage</strong>,
              and that you have read and agree to the Terms of Service and Privacy Policy.
            </p>
            <p className="text-xs" style={{ color: "#6b7280" }}>
              WOLF TECH VPS MANAGER operates entirely on your own infrastructure.
              No telemetry or usage data is ever collected or transmitted.
            </p>
            <Link
              href="/terms"
              onClick={dismissWelcome}
              className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: "rgba(0,255,0,0.7)" }}
            >
              Read full Terms, Privacy &amp; Disclaimer <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Community links */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <a
              href="https://payments.xcasper.space"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-mono transition-all"
              style={{
                background: "rgba(0,255,0,0.1)",
                color: "#00ff00",
                border: "1px solid rgba(0,255,0,0.25)",
              }}
            >
              <Coffee className="w-3.5 h-3.5" /> Buy Me a Coffee
            </a>
            <a
              href="https://github.com/Casper-Tech-ke"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-mono transition-colors"
              style={{ color: "#9ca3af", border: "1px solid rgba(0,255,0,0.12)" }}
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <a
              href="https://t.me/casper_tech_ke"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-mono transition-colors"
              style={{ color: "#9ca3af", border: "1px solid rgba(0,255,0,0.12)" }}
            >
              <Send className="w-3.5 h-3.5" /> Telegram
            </a>
          </div>

          <Button
            onClick={dismissWelcome}
            className="w-full font-mono text-sm tracking-widest h-10 transition-all"
            style={{
              background: "rgba(0,255,0,0.1)",
              color: "#00ff00",
              border: "1px solid rgba(0,255,0,0.35)",
              boxShadow: "0 0 20px rgba(0,255,0,0.1)",
              fontFamily: "'Orbitron', monospace",
              fontWeight: 700,
            }}
          >
            <HeartHandshake className="w-4 h-4 mr-2" />
            I AGREE — LET'S GO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
