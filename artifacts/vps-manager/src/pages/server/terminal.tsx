import { useParams } from "wouter";
import { useExecCommand, ExecResult } from "@workspace/api-client-react";
import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type HistoryEntry = {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  command?: string;
  exitCode?: number;
};

export default function ServerTerminal() {
  const { id } = useParams<{ id: string }>();
  const serverId = parseInt(id);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const execMutation = useExecCommand({
    mutation: {
      onSuccess: (data) => {
        setHistory(prev => [
          ...prev,
          { id: crypto.randomUUID(), type: 'output', content: data.stdout, command: data.command, exitCode: data.exitCode },
          ...(data.stderr ? [{ id: crypto.randomUUID(), type: 'error' as const, content: data.stderr, command: data.command, exitCode: data.exitCode }] : [])
        ]);
      },
      onError: (err) => {
        setHistory(prev => [
          ...prev,
          { id: crypto.randomUUID(), type: 'error', content: err.error || "Connection failed" }
        ]);
      }
    }
  });

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    setHistory(prev => [...prev, { id: crypto.randomUUID(), type: 'command', content: command }]);
    execMutation.mutate({ id: serverId, data: { command } });
    setCommand("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#000" }}>
      {/* Title bar */}
      <div
        className="h-12 flex items-center px-4 flex-shrink-0 gap-2"
        style={{ background: "rgba(0,0,0,0.9)", borderBottom: "1px solid rgba(0,255,0,0.15)" }}
      >
        <TerminalIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#00ff00" }} />
        <span className="font-mono text-sm font-bold" style={{ color: "#d1d5db" }}>
          tty1 — Remote Shell
        </span>
        {execMutation.isPending && (
          <span className="ml-4 font-mono text-xs wolf-blink" style={{ color: "#00ff00" }}>
            executing...
          </span>
        )}
      </div>

      {/* Output area */}
      <div
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
        ref={scrollRef}
        data-testid="terminal-output"
        style={{ background: "#000" }}
      >
        <div className="mb-4 text-xs" style={{ color: "rgba(0,255,0,0.5)" }}>
          ▸ Connected to node. Type a command to execute statelessly.<br />
          ▸ Note: `cd` commands won't persist across executions.
        </div>

        {history.map((entry) => (
          <div key={entry.id} className="mb-2 break-all">
            {entry.type === 'command' && (
              <div className="flex">
                <span className="mr-2 font-bold" style={{ color: "#00ff00" }}>root@node:~#</span>
                <span style={{ color: "#e5e7eb" }}>{entry.content}</span>
              </div>
            )}
            {entry.type === 'output' && entry.content && (
              <div
                className="whitespace-pre-wrap pl-3 mt-1 mb-2 border-l-2"
                style={{ color: "#9ca3af", borderColor: "rgba(0,255,0,0.25)" }}
              >
                {entry.content}
                {entry.exitCode !== undefined && entry.exitCode !== 0 && (
                  <div className="text-destructive text-xs mt-1">[Exit {entry.exitCode}]</div>
                )}
              </div>
            )}
            {entry.type === 'error' && entry.content && (
              <div
                className="whitespace-pre-wrap pl-3 mt-1 mb-2 border-l-2 border-destructive/50 text-destructive"
              >
                {entry.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div
        className="p-4 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(0,255,0,0.15)", background: "rgba(0,0,0,0.8)" }}
      >
        <form onSubmit={handleExecute} className="flex items-center">
          <span className="font-mono mr-2 font-bold text-sm" style={{ color: "#00ff00" }}>root@node:~#</span>
          <Input
            className="flex-1 bg-transparent border-none outline-none ring-0 shadow-none focus-visible:ring-0 rounded-none font-mono text-sm px-0 h-auto"
            style={{ color: "#e5e7eb" }}
            autoFocus
            value={command}
            onChange={e => setCommand(e.target.value)}
            disabled={execMutation.isPending}
            placeholder="ls -la /var/log"
            data-testid="input-command"
          />
        </form>
      </div>
    </div>
  );
}
