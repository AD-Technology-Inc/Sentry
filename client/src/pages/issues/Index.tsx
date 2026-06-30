import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AuditIssue } from "@/lib/api";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileDown,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Terminal,
  X,
  Layers,
  Activity,
  Cpu
} from "lucide-react";

export default function IssuesList() {
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Filters State
  const [searchId, setSearchId] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [endpointFilter, setEndpointFilter] = useState("");

  const loadIssues = async () => {
    try {
      const filters = {
        id: searchId || undefined,
        severity: severityFilter || undefined,
        category: categoryFilter || undefined,
        endpoint: endpointFilter || undefined,
      };
      const data = await api.getAuditIssues(filters);
      
      // Sort issues by risk score desc
      const sorted = data.sort((a, b) => b.risk_score - a.risk_score);
      setIssues(sorted);
      
      // Auto-select the first issue if none is selected
      if (sorted.length > 0 && !selectedIssue) {
        setSelectedIssue(sorted[0]);
      } else if (selectedIssue) {
        // Keep selection active if it still exists in the list
        const updated = sorted.find((i) => i.id === selectedIssue.id);
        if (updated) setSelectedIssue(updated);
      }
    } catch (err) {
      console.error("Failed to load audit issues:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [searchId, severityFilter, categoryFilter, endpointFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadIssues();
  };

  const resetFilters = () => {
    setSearchId("");
    setSeverityFilter("");
    setCategoryFilter("");
    setEndpointFilter("");
  };

  const handleExportPdf = async (scope: "all" | "single") => {
    try {
      setExporting(true);
      const payload: { filters?: Record<string, any>; issue_ids?: string[] } = {};
      
      if (scope === "single" && selectedIssue) {
        payload.issue_ids = [selectedIssue.id];
      } else {
        payload.filters = {
          id: searchId || undefined,
          severity: severityFilter || undefined,
          category: categoryFilter || undefined,
          endpoint: endpointFilter || undefined,
        };
      }

      const blob = await api.exportAuditPdf(payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = scope === "single" && selectedIssue 
        ? `audit_report_${selectedIssue.id}.pdf`
        : `reliability_audit_report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export PDF:", err);
      alert("Error generating PDF report. Please verify backend service connectivity.");
    } finally {
      setExporting(false);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRI":
        return "badge-danger text-danger bg-danger/10 border-danger/25";
      case "MED":
        return "badge-warning text-warning bg-warning/10 border-warning/25";
      case "LOW":
        return "badge-success text-success bg-success/10 border-success/25";
      default:
        return "badge-accent text-accent bg-accent/10 border-accent/25";
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "DI":
        return "Data Integrity";
      case "CON":
        return "Concurrency";
      case "FH":
        return "Failure Handling";
      case "OBS":
        return "Observability";
      case "SEC":
        return "Security";
      default:
        return "General Reliability";
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-1">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-accent" />
            Reliability Audit Explorer
          </h2>
          <p className="text-muted-foreground text-sm">
            Dynamically analyze raw log payloads grouped into system issues, compute threat metrics, and download audit reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportPdf("all")}
            disabled={exporting || issues.length === 0}
            className="button button-primary flex items-center gap-2 cursor-pointer"
            type="button"
          >
            {exporting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            <span>Export Filtered PDF</span>
          </button>
          <button
            onClick={handleRefresh}
            className="button button-outline flex items-center gap-2 cursor-pointer"
            disabled={refreshing}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Audit Scorecard Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 flex flex-col gap-1 bg-background/50 border border-border">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Reliability Rating</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {issues.length > 0
                ? (100 - (issues.reduce((acc, i) => acc + i.risk_score, 0) / issues.length) * 10).toFixed(1)
                : "100"}
              <span className="text-sm font-normal text-muted-foreground">/100</span>
            </span>
          </div>
        </div>
        <div className="card p-4 flex flex-col gap-1 bg-background/50 border border-border">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Critical Threats</span>
          <span className="text-2xl font-bold text-danger font-mono">
            {issues.filter((i) => i.severity === "CRI").length}
          </span>
        </div>
        <div className="card p-4 flex flex-col gap-1 bg-background/50 border border-border">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Medium Risks</span>
          <span className="text-2xl font-bold text-warning font-mono">
            {issues.filter((i) => i.severity === "MED").length}
          </span>
        </div>
        <div className="card p-4 flex flex-col gap-1 bg-background/50 border border-border">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Low Observability</span>
          <span className="text-2xl font-bold text-success font-mono">
            {issues.filter((i) => i.severity === "LOW").length}
          </span>
        </div>
      </div>

      {/* Explorer Filtering Row */}
      <div className="card p-4 flex flex-col gap-4 bg-background border border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          <span>Search & Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search ID */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Issue ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded bg-background border border-border text-foreground focus:outline-none focus:border-accent font-mono"
            />
          </div>

          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border text-foreground focus:outline-none focus:border-accent"
          >
            <option value="">All Severities</option>
            <option value="CRI">Critical (CRI)</option>
            <option value="MED">Medium (MED)</option>
            <option value="LOW">Low (LOW)</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border text-foreground focus:outline-none focus:border-accent"
          >
            <option value="">All Categories</option>
            <option value="DI">Data Integrity (DI)</option>
            <option value="CON">Concurrency (CON)</option>
            <option value="FH">Failure Handling (FH)</option>
            <option value="OBS">Observability (OBS)</option>
            <option value="SEC">Security (SEC)</option>
          </select>

          {/* Endpoint */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by Endpoint..."
              value={endpointFilter}
              onChange={(e) => setEndpointFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border text-foreground focus:outline-none focus:border-accent"
            />
            {endpointFilter && (
              <button
                type="button"
                onClick={() => setEndpointFilter("")}
                className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {(searchId || severityFilter || categoryFilter || endpointFilter) && (
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="button button-outline text-xs py-1 px-3"
              type="button"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Left List Explorer, Right Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Issues List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Issues List ({issues.length} instances)
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center card bg-background border border-border">
              <RefreshCw className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : issues.length > 0 ? (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-1">
              {issues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`card text-left transition-all p-4 border border-border cursor-pointer flex flex-col gap-2 ${
                    selectedIssue?.id === issue.id
                      ? "ring-1 ring-accent bg-accent/5 border-accent/45"
                      : "hover:border-accent/45"
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`badge text-[10px] px-1.5 py-0.5 border font-semibold ${getSeverityBadgeClass(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                        {issue.id}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-foreground">
                      Risk: {issue.risk_score.toFixed(1)}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-foreground leading-tight">
                    {issue.title}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{getCategoryLabel(issue.category)}</span>
                    <span className="font-mono text-[10px] truncate max-w-[150px]">{issue.endpoint}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center flex flex-col items-center justify-center gap-3 bg-background border border-border">
              <AlertTriangle className="h-10 w-10 text-muted-foreground/40" />
              <h3 className="font-semibold text-lg">No matching issues</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                No reliability issues found matching the specified parameters. Reset filters to view all issues.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Issue Detail View (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedIssue ? (
            <div className="card bg-background border border-border p-6 flex flex-col gap-6">
              {/* Header Title Block */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge text-xs px-2 py-0.5 font-bold border ${getSeverityBadgeClass(selectedIssue.severity)}`}>
                      {selectedIssue.severity}
                    </span>
                    <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground border">
                      {selectedIssue.id}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold font-mono">
                      Category: {getCategoryLabel(selectedIssue.category)} ({selectedIssue.category})
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-1">
                    {selectedIssue.title}
                  </h3>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1">
                  <div className="text-xs text-muted-foreground font-semibold uppercase">Risk Score</div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-foreground font-mono">
                      {selectedIssue.risk_score.toFixed(2)}
                    </span>
                  </div>
                  {/* Risk Bar visualization */}
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${
                        selectedIssue.risk_score >= 8
                          ? "bg-danger"
                          : selectedIssue.risk_score >= 5
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                      style={{ width: `${selectedIssue.risk_score * 10}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Endpoint Context Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Incident Endpoint</span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    <span className="text-accent mr-1.5">{selectedIssue.method}</span>
                    {selectedIssue.endpoint || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Latest Incident Occurrence</span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {new Date(selectedIssue.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Operational Scenario Analysis */}
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-accent" />
                    Operational Scenario
                  </h4>
                  <p className="text-sm text-foreground font-medium">{selectedIssue.scenario}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-accent" />
                    Observed System Behavior
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedIssue.observed_behavior}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-accent" />
                    Root Cause Diagnosis
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedIssue.root_cause}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Business & Financial Impact
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedIssue.business_impact}</p>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-success" />
                  Recommended Remediations
                </h4>
                <ul className="space-y-2">
                  {selectedIssue.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="h-5 w-5 rounded-full bg-success/15 text-success flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-normal">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supporting Telemetry Hash Evidence */}
              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-accent" />
                  Audit Trace Evidence (Log Hashes & Spans)
                </h4>
                <div className="bg-muted p-4 rounded border border-border font-mono text-[11px] text-muted-foreground flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">Linked Log Event IDs ({selectedIssue.evidence.log_ids.length})</span>
                    {selectedIssue.evidence.log_ids.length > 0 
                      ? selectedIssue.evidence.log_ids.join(", ") 
                      : "No explicit logs logged under trace signature."}
                  </div>
                  <div className="mt-1">
                    <span className="font-semibold text-foreground block mb-0.5">Request Correlation Trace IDs ({selectedIssue.evidence.request_ids.length})</span>
                    {selectedIssue.evidence.request_ids.length > 0 
                      ? selectedIssue.evidence.request_ids.join(", ") 
                      : "Trace context was omitted or not available."}
                  </div>
                </div>
              </div>

              {/* Action Button Strip */}
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  onClick={() => handleExportPdf("single")}
                  disabled={exporting}
                  className="button button-outline flex items-center gap-2 cursor-pointer"
                  type="button"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Download Report (PDF)</span>
                </button>
                <button
                  className="button button-primary flex items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    alert(`rem-dispatching repair ticket for ${selectedIssue.id} to engineering team.`);
                  }}
                  type="button"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Assign Ticket</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="card bg-background border border-border p-12 text-center flex flex-col items-center justify-center gap-4 h-[500px]">
              <ShieldAlert className="h-12 w-12 text-muted-foreground/30 animate-pulse" />
              <h3 className="font-semibold text-lg text-foreground">No Issue Selected</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Select a reliability anomaly from the explorer column on the left to read full diagnostic intelligence, business impacts, and code remedies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
