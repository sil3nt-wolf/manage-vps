import { useParams } from "wouter";
import { useGetServerStats, getGetServerStatsQueryKey, useGetServer, getGetServerQueryKey } from "@workspace/api-client-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, HardDrive, MemoryStick, Activity, Clock, Info } from "lucide-react";
import { useMemo } from "react";

export default function ServerHome() {
  const { id } = useParams<{ id: string }>();
  const serverId = parseInt(id);

  const { data: server } = useGetServer(serverId, {
    query: { enabled: !!serverId, queryKey: getGetServerQueryKey(serverId) }
  });

  const { data: stats, isLoading, isError } = useGetServerStats(serverId, {
    query: {
      enabled: !!serverId,
      queryKey: getGetServerStatsQueryKey(serverId),
      refetchInterval: 10000
    }
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const mainDisk = useMemo(() => {
    if (!stats?.disk) return null;
    return stats.disk.find(d => d.mountedOn === '/') || stats.disk[0];
  }, [stats]);

  if (isLoading && !stats) {
    return (
      <div className="p-6 flex-1 overflow-y-auto" style={{ background: "#000" }}>
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 flex-1 flex flex-col items-center justify-center text-center" style={{ background: "#000" }}>
        <Activity className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-mono font-bold" style={{ color: "#e5e7eb" }}>Node Unreachable</h2>
        <p className="font-mono mt-2" style={{ color: "#6b7280" }}>
          Could not fetch telemetry for {server?.name}. Check connection.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "CPU Usage",
      icon: Cpu,
      value: `${stats?.cpu.usage.toFixed(1)}%`,
      progress: stats?.cpu.usage,
      sub: `${stats?.cpu.cores} Cores · ${stats?.cpu.model}`,
      testId: "stat-cpu-usage",
    },
    {
      label: "Memory",
      icon: MemoryStick,
      value: `${stats?.memory.usagePercent.toFixed(1)}%`,
      progress: stats?.memory.usagePercent,
      sub: `${formatBytes(stats?.memory.used || 0)} / ${formatBytes(stats?.memory.total || 0)}`,
      testId: "stat-mem-usage",
    },
    {
      label: "Root Disk",
      icon: HardDrive,
      value: mainDisk?.usePercent || '0%',
      progress: parseFloat(mainDisk?.usePercent || '0'),
      sub: `${mainDisk?.used || '0B'} / ${mainDisk?.size || '0B'}`,
      testId: "stat-disk-usage",
    },
  ];

  return (
    <div className="p-6 flex-1 overflow-y-auto" style={{ background: "#000" }}>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-black tracking-widest"
          style={{ fontFamily: "'Orbitron', monospace", color: "#00ff00" }}
        >
          TELEMETRY_{(server?.name || id || '').toUpperCase()}
        </h1>
        <div className="flex flex-wrap gap-4 items-center mt-2 font-mono text-xs" style={{ color: "#6b7280" }}>
          <span className="flex items-center gap-1"><Info className="w-3 h-3" /> {stats?.os}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {stats?.uptime}</span>
          <span>Kernel: {stats?.kernel}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map(({ label, icon: Icon, value, progress, sub, testId }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,255,0,0.15)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#6b7280" }}>
                {label}
              </span>
              <Icon className="w-4 h-4" style={{ color: "#00ff00" }} />
            </div>
            <div className="text-3xl font-mono font-bold mb-4" style={{ color: "#e5e7eb" }} data-testid={testId}>
              {value}
            </div>
            <Progress value={progress} className="h-1.5 mb-2" />
            <div className="text-xs font-mono" style={{ color: "#6b7280" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Load average */}
        <div
          className="rounded-xl p-5"
          style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,255,0,0.15)" }}
        >
          <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>
            Load Average
          </div>
          <div className="flex gap-8 items-end" data-testid="stat-load-avg">
            {stats?.loadAverage.map((load, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl font-mono font-bold" style={{ color: "#e5e7eb" }}>{load.toFixed(2)}</span>
                <span className="text-xs font-mono mt-1" style={{ color: "#6b7280" }}>
                  {i === 0 ? '1m' : i === 1 ? '5m' : '15m'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System info */}
        <div
          className="rounded-xl p-5"
          style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,255,0,0.15)" }}
        >
          <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>
            System Information
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <div className="mb-1" style={{ color: "#6b7280" }}>Hostname</div>
              <div style={{ color: "#e5e7eb" }} data-testid="stat-hostname">{stats?.hostname}</div>
            </div>
            <div>
              <div className="mb-1" style={{ color: "#6b7280" }}>Status</div>
              <div className="font-bold" style={{ color: "#00ff00" }}>{server?.status?.toUpperCase()}</div>
            </div>
            <div className="col-span-2 mt-2">
              <div className="mb-2" style={{ color: "#6b7280" }}>All Mounts</div>
              <div className="space-y-1">
                {stats?.disk.map((d, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs pb-1"
                    style={{ borderBottom: "1px solid rgba(0,255,0,0.08)" }}
                  >
                    <span className="w-16 truncate" style={{ color: "#6b7280" }}>{d.mountedOn}</span>
                    <span className="w-16 text-right" style={{ color: "#9ca3af" }}>{d.usePercent}</span>
                    <span className="w-24 text-right" style={{ color: "#9ca3af" }}>{d.used} / {d.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
