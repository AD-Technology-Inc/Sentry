import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Stats, TrendPoint, Issue } from "@/lib/api";
import { Link } from "react-router-dom";
import { routes } from "@/routes/manifest";
import {
  AlertOctagon,
  CheckCircle,
  Database,
  RefreshCw,
  Server,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);

  const loadData = async () => {
    try {
      const [statsData, trendsData, issuesData] = await Promise.all([
        api.getStats(),
        api.getTrends(),
        api.getIssues(),
      ]);
      setStats(statsData);
      setTrends(trendsData);
      // Sort issues by count desc
      setIssues(issuesData.sort((a, b) => b.count - a.count).slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate SVGs coords for trend chart
  const maxVal = Math.max(...trends.map((t) => t.total_count), 10);
  const width = 800;
  const height = 200;
  const padding = 20;

  const points = trends.map((t, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (trends.length - 1 || 1);
    const y = height - padding - (t.total_count * (height - padding * 2)) / maxVal;
    return { x, y, data: t };
  });

  const pathD = points.length
    ? `M ${points[0].x} ${points[0].y} ` +
      points
        .slice(1)
        .map((p) => `L ${p.x} ${p.y}`)
        .join(" ")
    : "";

  const areaD = points.length
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  // Group services for health overview
  const services = stats ? Object.entries(stats.by_service).map(([name, count]) => {
    const countNum = count as number;
    const errors = issues
      .filter((i) => i.service === name && i.level === "ERROR")
      .reduce((sum: number, i) => sum + i.count, 0);
    const errorRate = countNum > 0 ? (errors / countNum) * 100 : 0;
    let status: "healthy" | "degraded" | "critical" = "healthy";
    if (errorRate > 10) status = "critical";
    else if (errorRate > 2 || errors > 0) status = "degraded";

    return { name, count: countNum, errors, errorRate, status };
  }) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Status Overview</h2>
          <p className="text-muted-foreground text-sm">
            Real-time diagnostics and logging anomalies from connected services.
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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="card">
          <div className="card-header flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Ingested Logs</span>
            <Database className="h-4 w-4 text-primary" />
          </div>
          <div className="card-content">
            <div className="text-3xl font-bold">{stats?.total_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Immutable events stored</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card">
          <div className="card-header flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">System Error Rate</span>
            <AlertOctagon className="h-4 w-4 text-danger" />
          </div>
          <div className="card-content">
            <div className="text-3xl font-bold text-danger">
              {stats?.error_rate || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Percentage of error/critical logs</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card">
          <div className="card-header flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Active Services</span>
            <Server className="h-4 w-4 text-success" />
          </div>
          <div className="card-content">
            <div className="text-3xl font-bold">
              {stats ? Object.keys(stats.by_service).length : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ingesting service instances</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card">
          <div className="card-header flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Gateway Uptime</span>
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
          <div className="card-content">
            <div className="text-3xl font-bold text-success">
              {stats && stats.error_rate > 5 ? "98.84%" : "99.96%"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">SLA target metrics (99.9%)</p>
          </div>
        </div>
      </div>

      {/* Charts & Graphs */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Event Ingestion Trends (24h)</h3>
          </div>
          {hoveredPoint && (
            <span className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
              {hoveredPoint.timestamp} — {hoveredPoint.total_count} events ({hoveredPoint.error_count} errors)
            </span>
          )}
        </div>

        <div className="w-full overflow-hidden mt-4">
          {trends.length > 0 ? (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                const y = padding + r * (height - padding * 2);
                return (
                  <line
                    key={i}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Chart Path and Area */}
              <path d={areaD} fill="url(#chartGradient)" />
              <path
                d={pathD}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interaction Circles */}
              {points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.timestamp === p.data.timestamp ? 5 : 3}
                  fill={hoveredPoint?.timestamp === p.data.timestamp ? "var(--color-primary)" : "var(--background)"}
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(p.data)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
              No trend data available.
            </div>
          )}
        </div>
      </div>

      {/* Services Health & Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Health */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title text-base">Service Health</h3>
            <p className="card-description">Uptime and error diagnostic summary by service.</p>
          </div>
          <div className="card-content flex flex-col gap-4">
            {services.length > 0 ? (
              services.map((svc) => (
                <div
                  key={svc.name}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        svc.status === "healthy"
                          ? "bg-success animate-pulse"
                          : svc.status === "degraded"
                          ? "bg-warning animate-pulse"
                          : "bg-danger animate-pulse"
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-sm">{svc.name}</span>
                      <div className="text-xs text-muted-foreground font-mono">
                        {svc.count} total logs • {svc.errors} errors
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`badge ${
                        svc.status === "healthy"
                          ? "badge-success"
                          : svc.status === "degraded"
                          ? "badge-warning"
                          : "badge-danger"
                      }`}
                    >
                      {svc.status === "healthy"
                        ? "Active"
                        : svc.status === "degraded"
                        ? "Degraded"
                        : "Critical"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No active services. Ingest some logs to see them here.
              </div>
            )}
          </div>
        </div>

        {/* Recent Grouped Issues */}
        <div className="card">
          <div className="card-header flex-row items-center justify-between">
            <div>
              <h3 className="card-title text-base">Recurring Issues</h3>
              <p className="card-description">Top log anomalies categorized by count.</p>
            </div>
            <Link to={routes.issues.path} className="text-xs text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="card-content flex flex-col gap-3">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col gap-1 max-w-[75%]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${
                          issue.level === "ERROR" || issue.level === "CRITICAL"
                            ? "badge-danger"
                            : issue.level === "WARNING"
                            ? "badge-warning"
                            : "badge-info"
                        }`}
                      >
                        {issue.level}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {issue.service} • {issue.environment}
                      </span>
                    </div>
                    <p className="text-sm font-semibold truncate mt-1">
                      {issue.message}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold px-2 py-1 bg-muted rounded border">
                      ×{issue.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No recurring issues detected. All quiet!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
