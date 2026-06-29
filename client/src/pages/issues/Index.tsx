import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Issue } from "@/lib/api";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FolderOpen,
  RefreshCw,
  User,
  UserCheck,
} from "lucide-react";

export default function IssuesList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadIssues = async () => {
    try {
      const data = await api.getIssues();
      // Sort issues by occurrence count desc
      setIssues(data.sort((a, b) => b.count - a.count));
    } catch (err) {
      console.error("Failed to load issues:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleResolve = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId ? { ...iss, status: "Resolved" } : iss
      )
    );
  };

  const handleAssign = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId ? { ...iss, assigned_to: "Angelo Arcillas" } : iss
      )
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadIssues();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categorized Issues</h2>
          <p className="text-muted-foreground text-sm">
            Automatic grouping of similar logs to identify root cause incidents.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="button button-outline flex items-center gap-2 cursor-pointer"
          disabled={refreshing}
          type="button"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <div
              key={issue.id}
              className={`card overflow-hidden border-l-4 transition-all hover:translate-x-1 ${
                issue.status === "Resolved"
                  ? "border-l-emerald-500 opacity-75"
                  : issue.level === "ERROR" || issue.level === "CRITICAL"
                  ? "border-l-rose-500"
                  : "border-l-amber-500"
              }`}
            >
              <div className="card-header flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                <div className="flex flex-col gap-2 max-w-[80%]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`badge ${
                        issue.level === "ERROR" || issue.level === "CRITICAL"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}
                    >
                      {issue.level}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {issue.service} • {issue.environment}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-muted rounded border text-muted-foreground">
                      {issue.id}
                    </span>
                  </div>

                  <h3 className="font-mono text-sm md:text-base font-bold truncate mt-1">
                    {issue.message}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold">
                      <FolderOpen className="h-3.5 w-3.5" />
                      <span>{issue.count} events</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Last seen: {new Date(issue.last_seen).toLocaleString()}</span>
                    </span>
                    {issue.assigned_to !== "Unassigned" ? (
                      <span className="flex items-center gap-1 text-indigo-500 font-medium">
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Assigned to {issue.assigned_to}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        <span>Unassigned</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  {issue.status !== "Resolved" ? (
                    <>
                      {issue.assigned_to === "Unassigned" && (
                        <button
                          onClick={() => handleAssign(issue.id)}
                          className="button button-outline cursor-pointer text-xs py-1 px-3"
                          type="button"
                        >
                          Assign Me
                        </button>
                      )}
                      <button
                        onClick={() => handleResolve(issue.id)}
                        className="button bg-indigo-500 hover:bg-indigo-600 border-none text-white cursor-pointer text-xs py-1 px-3 flex items-center gap-1"
                        type="button"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Resolve</span>
                      </button>
                    </>
                  ) : (
                    <span className="badge badge-success flex items-center gap-1 px-2.5 py-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center flex flex-col items-center justify-center gap-3">
            <AlertTriangle className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-semibold text-lg">No Issues Grouped</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Issues will automatically group events based on level, service, environment, and error signature. Try ingesting some mock logs!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
