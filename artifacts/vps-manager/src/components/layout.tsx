import { Link, useRoute, useLocation } from "wouter";
import { useGetServer, getGetServerQueryKey } from "@workspace/api-client-react";
import { Terminal, Server, Folder, Activity, Plus, Home, HardDrive, Zap } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isServerRoute, params] = useRoute("/servers/:id/*?");
  const serverId = isServerRoute && params?.id ? parseInt(params.id) : null;
  
  const { data: server } = useGetServer(serverId!, {
    query: { 
      enabled: !!serverId,
      queryKey: getGetServerQueryKey(serverId!)
    }
  });

  const navLinks = [
    { href: "/", label: "Dashboard", icon: Home, exact: true },
    { href: "/add-server", label: "Add Server", icon: Plus, exact: true },
  ];

  const serverLinks = serverId ? [
    { href: `/servers/${serverId}`, label: "Overview", icon: HardDrive, exact: true },
    { href: `/servers/${serverId}/files`, label: "Files", icon: Folder, exact: false },
    { href: `/servers/${serverId}/terminal`, label: "Terminal", icon: Terminal, exact: false },
    { href: `/servers/${serverId}/processes`, label: "Processes", icon: Activity, exact: false },
  ] : [];

  return (
    <div className="min-h-screen flex text-foreground selection:bg-primary/20" style={{ background: "#000" }}>
      {/* Neon grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 neon-grid-bg"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,255,0,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Sidebar */}
      <div
        className="w-60 flex-shrink-0 flex flex-col relative z-10"
        style={{
          background: "rgba(0,0,0,0.92)",
          borderRight: "1px solid rgba(0,255,0,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <div
          className="h-14 flex items-center px-4 gap-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,255,0,0.15)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 glow-pulse"
            style={{
              background: "rgba(0,255,0,0.08)",
              border: "1px solid rgba(0,255,0,0.3)",
            }}
          >
            <Zap className="w-4 h-4" style={{ color: "#00ff00" }} />
          </div>
          <div className="min-w-0">
            <div
              className="font-orbitron font-black text-sm tracking-widest leading-none"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              <span style={{ color: "#00ff00" }}>WOLF</span>
              <span style={{ color: "#d1d5db" }}> TECH</span>
            </div>
            <div className="text-[9px] tracking-wider mt-0.5 truncate" style={{ color: "#6b7280" }}>
              VPS MANAGER
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="p-3 flex-1 flex flex-col gap-0.5 overflow-y-auto">
          <div
            className="text-[9px] font-mono uppercase tracking-widest mb-2 mt-1 px-2"
            style={{ color: "rgba(0,255,0,0.5)" }}
          >
            Navigation
          </div>
          {navLinks.map((link) => {
            const isActive = link.exact ? location === link.href : location.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-mono transition-all"
                style={
                  isActive
                    ? {
                        background: "rgba(0,255,0,0.1)",
                        color: "#00ff00",
                        border: "1px solid rgba(0,255,0,0.25)",
                      }
                    : {
                        color: "#9ca3af",
                        border: "1px solid transparent",
                      }
                }
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}

          {serverId && (
            <>
              <div
                className="mt-6 mb-2 text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5 px-2 truncate"
                style={{ color: "rgba(0,255,0,0.5)" }}
              >
                <Server className="w-3 h-3 flex-shrink-0" />
                {server?.name || "Loading..."}
              </div>
              {serverLinks.map((link) => {
                const isActive = link.exact ? location === link.href : location.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-mono transition-all"
                    style={
                      isActive
                        ? {
                            background: "rgba(0,255,0,0.1)",
                            color: "#00ff00",
                            border: "1px solid rgba(0,255,0,0.25)",
                          }
                        : {
                            color: "#9ca3af",
                            border: "1px solid transparent",
                          }
                    }
                    data-testid={`nav-server-${link.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* Sidebar footer */}
        <div
          className="px-3 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(0,255,0,0.1)" }}
        >
          <div className="text-[9px] font-mono text-center" style={{ color: "#4b5563" }}>
            <span style={{ color: "#00ff00" }}>●</span> WOLF TECH &copy; 2026
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {children}
      </main>
    </div>
  );
}
