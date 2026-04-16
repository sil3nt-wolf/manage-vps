import { useListServers, getListServersQueryKey, useDeleteServer, useTestServerConnection } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Server, Activity, Terminal, Folder, Trash2, Power, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: servers, isLoading } = useListServers({
    query: { queryKey: getListServersQueryKey() }
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useDeleteServer({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListServersQueryKey() });
        toast({ title: "Server removed", variant: "default" });
      },
      onError: () => {
        toast({ title: "Failed to remove server", variant: "destructive" });
      }
    }
  });

  const testConnectionMutation = useTestServerConnection({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListServersQueryKey() });
        if (data.success) {
          toast({ title: "Connection successful", description: data.message });
        } else {
          toast({ title: "Connection failed", description: data.message, variant: "destructive" });
        }
      },
      onError: () => {
        toast({ title: "Connection test error", variant: "destructive" });
      }
    }
  });

  const totalServers = servers?.length || 0;
  const connectedServers = servers?.filter(s => s.status === 'connected').length || 0;
  const errorServers = servers?.filter(s => s.status === 'error').length || 0;

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: "#000" }}>
      {/* Page header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-2xl font-black tracking-widest"
            style={{ fontFamily: "'Orbitron', monospace", color: "#00ff00" }}
          >
            SYSTEM DASHBOARD
          </h1>
          <p className="font-mono text-sm mt-1" style={{ color: "#6b7280" }}>
            Overview of all registered virtual private servers
          </p>
        </div>
        <Button
          asChild
          className="font-mono text-xs tracking-widest"
          style={{
            background: "rgba(0,255,0,0.1)",
            color: "#00ff00",
            border: "1px solid rgba(0,255,0,0.3)",
            fontFamily: "'Orbitron', monospace",
          }}
          data-testid="button-add-server"
        >
          <Link href="/add-server">
            <Server className="w-4 h-4 mr-2" /> ADD SERVER
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Systems", value: totalServers, icon: Server, color: "#9ca3af" },
          { label: "Connected", value: connectedServers, icon: CheckCircle2, color: "#00ff00" },
          { label: "Errors", value: errorServers, icon: AlertCircle, color: "#ef4444" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,0,0.15)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#6b7280" }}>
                {label}
              </span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-3xl font-black font-mono" style={{ color }}>
              {isLoading ? <Skeleton className="h-8 w-16" /> : value}
            </div>
          </div>
        ))}
      </div>

      {/* Server list */}
      <div className="space-y-3">
        <h2
          className="text-xs font-black uppercase tracking-widest mb-4"
          style={{ fontFamily: "'Orbitron', monospace", color: "rgba(0,255,0,0.6)" }}
        >
          Node List
        </h2>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        )}

        {!isLoading && servers?.length === 0 && (
          <div
            className="text-center py-16 rounded-xl"
            style={{ border: "1px dashed rgba(0,255,0,0.2)", background: "rgba(0,0,0,0.3)" }}
          >
            <Server className="w-12 h-12 mx-auto mb-4" style={{ color: "rgba(0,255,0,0.3)" }} />
            <h3 className="text-lg font-mono mb-2" style={{ color: "#d1d5db" }}>No servers configured</h3>
            <p className="font-mono text-sm mb-6" style={{ color: "#6b7280" }}>
              Add your first Linux VPS to start managing it.
            </p>
            <Button
              asChild
              className="font-mono text-xs tracking-widest"
              style={{
                background: "rgba(0,255,0,0.1)",
                color: "#00ff00",
                border: "1px solid rgba(0,255,0,0.3)",
              }}
            >
              <Link href="/add-server">REGISTER NODE</Link>
            </Button>
          </div>
        )}

        {servers?.map((server) => (
          <div
            key={server.id}
            className="rounded-xl p-5 flex items-center gap-4 group transition-all"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(0,255,0,0.12)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,255,0,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,255,0,0.12)")}
          >
            {/* Status dot */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background:
                  server.status === 'connected' ? '#00ff00' :
                  server.status === 'error' ? '#ef4444' : '#6b7280',
                boxShadow:
                  server.status === 'connected' ? '0 0 8px rgba(0,255,0,0.6)' :
                  server.status === 'error' ? '0 0 8px rgba(239,68,68,0.6)' : 'none',
              }}
            />

            {/* Server info */}
            <div className="flex-1 min-w-0">
              <Link href={`/servers/${server.id}`} data-testid={`link-server-${server.id}`}>
                <div className="font-mono font-bold text-base" style={{ color: "#e5e7eb" }}>
                  {server.name}
                </div>
                <div className="font-mono text-xs mt-0.5" style={{ color: "#6b7280" }}>
                  {server.username}@{server.host}:{server.port}
                  {server.notes && <span className="ml-2 truncate"> · {server.notes}</span>}
                </div>
              </Link>
            </div>

            {/* Status badge */}
            <div className="flex-shrink-0">
              <span
                className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded"
                style={{
                  color: server.status === 'connected' ? '#00ff00' : server.status === 'error' ? '#ef4444' : '#6b7280',
                  background: server.status === 'connected' ? 'rgba(0,255,0,0.08)' : server.status === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(107,114,128,0.1)',
                  border: `1px solid ${server.status === 'connected' ? 'rgba(0,255,0,0.2)' : server.status === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(107,114,128,0.2)'}`,
                }}
                data-testid={`badge-status-${server.id}`}
              >
                {server.status}
              </span>
            </div>

            {/* Auth type */}
            <div className="hidden lg:block flex-shrink-0">
              <span className="font-mono text-xs" style={{ color: "#4b5563" }}>
                auth: {server.authType}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost" size="icon" asChild
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                title="Stats"
              >
                <Link href={`/servers/${server.id}`} data-testid={`btn-stats-${server.id}`}>
                  <Activity className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="ghost" size="icon" asChild
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                title="Files"
              >
                <Link href={`/servers/${server.id}/files`} data-testid={`btn-files-${server.id}`}>
                  <Folder className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="ghost" size="icon" asChild
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                title="Terminal"
              >
                <Link href={`/servers/${server.id}/terminal`} data-testid={`btn-term-${server.id}`}>
                  <Terminal className="w-4 h-4" />
                </Link>
              </Button>
              <div className="w-px h-5 mx-1" style={{ background: "rgba(0,255,0,0.12)" }} />
              <Button
                variant="ghost" size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => testConnectionMutation.mutate({ id: server.id })}
                disabled={testConnectionMutation.isPending}
                title="Test Connection"
                data-testid={`btn-connect-${server.id}`}
              >
                <Power className={`w-4 h-4 ${testConnectionMutation.isPending ? 'animate-pulse text-primary' : ''}`} />
              </Button>
              <Button
                variant="ghost" size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (confirm(`Remove ${server.name}?`)) {
                    deleteMutation.mutate({ id: server.id });
                  }
                }}
                title="Remove Server"
                data-testid={`btn-delete-${server.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
