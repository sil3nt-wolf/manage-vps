import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Loader2, Eye, EyeOff, ChevronDown, ChevronUp, Zap } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError(null);
    const result = await login(key.trim());
    setLoading(false);
    if (!result.ok) setError(result.error ?? "Authentication failed");
  }

  return (
    <div
      className="h-full overflow-y-auto flex flex-col items-center justify-center px-4"
      style={{ background: "#000" }}
    >
      {/* Neon grid background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Radial top glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(0,255,0,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm wolf-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 glow-pulse"
            style={{
              background: "rgba(0,255,0,0.06)",
              border: "1px solid rgba(0,255,0,0.3)",
            }}
          >
            <Zap className="w-8 h-8" style={{ color: "#00ff00" }} />
          </div>

          <h1
            className="text-2xl font-black tracking-tight mb-1"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            <span style={{ color: "#00ff00" }}>WOLF</span>{" "}
            <span style={{ color: "#d1d5db" }}>TECH</span>
          </h1>
          <p
            className="text-xs tracking-widest font-mono mb-1"
            style={{ color: "rgba(0,255,0,0.6)" }}
          >
            VPS MANAGER
          </p>
          <p className="text-sm font-mono" style={{ color: "#6b7280" }}>
            Enter your API key to continue
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(0,255,0,0.2)",
            boxShadow: "0 0 50px rgba(0,255,0,0.08), 0 0 1px rgba(0,255,0,0.3)",
            backdropFilter: "blur(16px)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "rgba(0,255,0,0.7)" }}
              >
                API Key
              </label>
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#6b7280" }}
                />
                <Input
                  type={showKey ? "text" : "password"}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="sk-••••••••••••••••"
                  autoFocus
                  autoComplete="current-password"
                  className="pl-9 pr-10 font-mono text-sm"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    borderColor: error ? "rgba(239,68,68,.6)" : "rgba(0,255,0,0.2)",
                    color: "#e5e7eb",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#6b7280" }}
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1 font-mono">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !key.trim()}
              className="w-full h-10 font-mono text-sm tracking-widest font-bold transition-all"
              style={{
                background: loading || !key.trim()
                  ? "rgba(0,255,0,0.1)"
                  : "rgba(0,255,0,0.12)",
                color: loading || !key.trim() ? "rgba(0,255,0,0.4)" : "#00ff00",
                border: `1px solid ${loading || !key.trim() ? "rgba(0,255,0,0.15)" : "rgba(0,255,0,0.4)"}`,
                boxShadow: loading || !key.trim() ? "none" : "0 0 15px rgba(0,255,0,0.15)",
                fontFamily: "'Orbitron', monospace",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "AUTHENTICATE"
              )}
            </Button>
          </form>
        </div>

        {/* .env setup hint */}
        <div className="mt-5 w-full max-w-sm">
          <button
            onClick={() => setShowSetup((s) => !s)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono transition-colors"
            style={{
              background: "rgba(0,255,0,0.04)",
              border: "1px solid rgba(0,255,0,0.15)",
              color: "#6b7280",
            }}
          >
            <span className="flex items-center gap-2">
              <span style={{ color: "#00ff00" }}>$</span>
              Deploying? Configure your keys via{" "}
              <code className="font-mono" style={{ color: "rgba(0,255,0,0.7)" }}>
                .env
              </code>
            </span>
            {showSetup ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showSetup && (
            <div
              className="mt-2 rounded-xl p-4 text-xs font-mono"
              style={{
                background: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(0,255,0,0.15)",
              }}
            >
              <p className="mb-2" style={{ color: "#6b7280" }}>
                Create a{" "}
                <span style={{ color: "#00ff00" }}>.env</span> file in your project root:
              </p>
              <pre className="leading-6 whitespace-pre-wrap" style={{ color: "rgba(0,255,0,0.8)" }}>
                {`# Required — your API access key\nAPI_KEY=your-secret-key-here\n\n# Required — session encryption\nSESSION_SECRET=any-random-string`}
              </pre>
              <p className="mt-3 text-[11px]" style={{ color: "#6b7280" }}>
                The{" "}
                <span style={{ color: "#00ff00" }}>API_KEY</span> value is what you enter above to sign in.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs font-mono mt-6" style={{ color: "#4b5563" }}>
          <span style={{ color: "#00ff00" }}>▸</span> WOLF TECH VPS MANAGER — Build. Deploy. Dominate.
        </p>
      </div>
    </div>
  );
}
