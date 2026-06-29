import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Report } from "@/lib/api";
import {
  Calendar,
  FileText,
  RefreshCw,
} from "lucide-react";

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = async () => {
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reliability & SLA Reports</h2>
          <p className="text-muted-foreground text-sm">
            Auditable system reliability, incident summaries, and service level agreements (SLA) status.
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="card p-6 gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{report.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Period: {report.period}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-muted rounded border text-muted-foreground">
                {report.id}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="p-3 bg-muted/30 border rounded-lg text-center">
                <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                  Total Events
                </span>
                <span className="text-lg font-bold mt-1 block">
                  {report.total_events}
                </span>
              </div>
              <div className="p-3 bg-muted/30 border rounded-lg text-center">
                <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                  Incidents
                </span>
                <span
                  className={`text-lg font-bold mt-1 block ${
                    report.incidents_count > 0 ? "text-danger" : "text-success"
                  }`}
                >
                  {report.incidents_count}
                </span>
              </div>
              <div className="p-3 bg-muted/30 border rounded-lg text-center">
                <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                  Avg MTTR
                </span>
                <span className="text-lg font-bold mt-1 block font-mono">
                  {report.avg_mttr}
                </span>
              </div>
            </div>

            {/* Service Uptime Table */}
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
                Service SLA Uptime
              </span>
              <div className="table-container">
                <table className="table table-compact">
                  <thead>
                    <tr>
                      <th>Service Node</th>
                      <th className="text-right">SLA Target</th>
                      <th className="text-right">Current Uptime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(report.service_uptime).map(([node, uptime]) => {
                      const uptimeStr = uptime as string;
                      return (
                        <tr key={node}>
                          <td className="font-semibold">{node}</td>
                          <td className="text-right font-mono text-muted-foreground">99.90%</td>
                          <td
                            className={`text-right font-bold font-mono ${
                              parseFloat(uptimeStr) >= 99.9
                                ? "text-success"
                                : parseFloat(uptimeStr) >= 99.0
                                ? "text-warning"
                                : "text-danger"
                            }`}
                          >
                            {uptimeStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Comments */}
            <div className="p-3 bg-card border rounded-lg text-xs italic text-muted-foreground leading-relaxed">
              <strong>Executive Summary:</strong> {report.summary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
