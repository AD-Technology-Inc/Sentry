import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Alert } from "@/lib/api";
import {
  Bell,
  BellOff,
  CheckCircle,
  Plus,
  RefreshCw,
  Settings,
  MessageSquare,
  Mail,
  Smartphone,
} from "lucide-react";

interface AlertRule {
  id: string;
  service: string;
  metric: string;
  threshold: number;
  timeWindow: string;
  channels: string[];
  active: boolean;
}

export default function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setRefreshing] = useState(false);

  // Mock Alert Rules
  const [rules, setRules] = useState<AlertRule[]>([
    {
      id: "rul_1",
      service: "payment-api",
      metric: "Error Count",
      threshold: 3,
      timeWindow: "10m",
      channels: ["Slack", "PagerDuty"],
      active: true,
    },
    {
      id: "rul_2",
      service: "auth-service",
      metric: "Error Count",
      threshold: 5,
      timeWindow: "15m",
      channels: ["Slack", "Email"],
      active: true,
    },
    {
      id: "rul_3",
      service: "gateway",
      metric: "Response Time",
      threshold: 1500, // ms
      timeWindow: "5m",
      channels: ["Slack"],
      active: false,
    },
  ]);

  const [newService, setNewService] = useState("api-gateway");
  const [newMetric, setNewMetric] = useState("Error Count");
  const [newThreshold, setNewThreshold] = useState(3);
  const [newWindow, setNewWindow] = useState("5m");
  const [slackChecked, setSlackChecked] = useState(true);
  const [emailChecked, setEmailChecked] = useState(false);

  const loadAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAlerts();
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const channels: string[] = [];
    if (slackChecked) channels.push("Slack");
    if (emailChecked) channels.push("Email");

    const newRule: AlertRule = {
      id: `rul_${Date.now()}`,
      service: newService,
      metric: newMetric,
      threshold: Number(newThreshold),
      timeWindow: newWindow,
      channels,
      active: true,
    };

    setRules((prev) => [...prev, newRule]);
    // Reset defaults
    setNewService("api-gateway");
    setNewThreshold(3);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alt) =>
        alt.id === id ? { ...alt, status: "Resolved" } : alt
      )
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const activeAlerts = alerts.filter((a) => a.status === "Active");
  const resolvedAlerts = alerts.filter((a) => a.status === "Resolved");

  return (
    <div className="split-layout">
      {/* Configure Alert Rules */}
      <aside className="split-layout-aside">
        <div className="card">
          <div className="card-header pb-2">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Settings className="h-4 w-4 text-accent" />
              <span>Define Alert Rule</span>
            </h3>
          </div>
          <div className="card-content">
            <form onSubmit={handleAddRule} className="flex flex-col gap-3">
              <div className="form-group">
                <label className="form-label">Service Target</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. payment-api"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trigger Metric</label>
                <select
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  className="form-select text-xs"
                >
                  <option value="Error Count">Error Count</option>
                  <option value="Downtime Seconds">Downtime Seconds</option>
                  <option value="Anomaly Spike">Anomaly Spike</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="form-group">
                  <label className="form-label">Threshold ({">="})</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                    className="form-input text-xs"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time Window</label>
                  <select
                    value={newWindow}
                    onChange={(e) => setNewWindow(e.target.value)}
                    className="form-select text-xs"
                  >
                    <option value="1m">1 min</option>
                    <option value="5m">5 mins</option>
                    <option value="10m">10 mins</option>
                    <option value="30m">30 mins</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notification Channels</label>
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="form-checkbox-wrapper cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={slackChecked}
                      onChange={(e) => setSlackChecked(e.target.checked)}
                      className="form-checkbox"
                    />
                    <MessageSquare className="h-3.5 w-3.5 text-pink-500" />
                    <span>Slack Hook</span>
                  </label>
                  <label className="form-checkbox-wrapper cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={emailChecked}
                      onChange={(e) => setEmailChecked(e.target.checked)}
                      className="form-checkbox"
                    />
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    <span>Email Digest</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="button w-full cursor-pointer flex items-center justify-center gap-1 mt-1 py-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Create Rule</span>
              </button>
            </form>
          </div>
        </div>

        {/* Existing Rules List */}
        <div className="card">
          <div className="card-header pb-2">
            <h3 className="card-title text-sm">Alert Rules ({rules.length})</h3>
          </div>
          <div className="card-content flex flex-col gap-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-2.5 border rounded-lg bg-card"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs font-mono">{rule.service}</span>
                    <span className="text-[10px] text-muted-foreground">({rule.timeWindow})</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {rule.metric} &gt;= {rule.threshold}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {rule.channels.map((chan) => (
                      <span
                        key={chan}
                        className="text-[9px] px-1 py-0.25 bg-muted border rounded font-semibold text-muted-foreground flex items-center gap-0.5"
                      >
                        {chan === "Slack" ? (
                          <MessageSquare className="h-2 w-2 text-accent" />
                        ) : chan === "Email" ? (
                          <Mail className="h-2 w-2 text-accent" />
                        ) : (
                          <Smartphone className="h-2 w-2 text-accent" />
                        )}
                        {chan}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`button text-xs py-0.5 px-2 cursor-pointer border-none rounded ${
                    rule.active
                      ? "bg-accent/10 text-accent hover:bg-accent/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                  type="button"
                >
                  {rule.active ? "Active" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Active/Resolved Alerts List */}
      <main className="split-layout-main">
        <div className="card flex-grow">
          <div className="card-header flex-row justify-between items-center pb-2">
            <div>
              <h3 className="card-title text-base flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                <span>Active Incidents & Alerts</span>
              </h3>
              <p className="card-description">
                Alerts triggered by matching logger thresholds.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="button button-outline cursor-pointer p-2 flex items-center justify-center"
              title="Refresh Alerts"
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="card-content flex flex-col gap-4">
            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-danger uppercase tracking-wider">
                  Triggered ({activeAlerts.length})
                </h4>
                {activeAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="alert alert-danger flex items-start justify-between p-4"
                  >
                    <div className="alert-content">
                      <div className="flex items-center gap-2">
                        <span className="alert-title text-sm font-bold">
                          {alt.title}: {alt.service}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.25 bg-danger/20 border border-danger/40 rounded font-semibold text-danger">
                          {alt.severity}
                        </span>
                      </div>
                      <p className="alert-description mt-1 text-xs">{alt.description}</p>
                      <span className="text-[10px] text-danger/70 font-mono mt-2 block">
                        Triggered: {new Date(alt.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleResolveAlert(alt.id)}
                      className="button bg-danger/10 hover:bg-danger/20 border-danger/30 text-danger text-xs py-1 px-3 cursor-pointer flex items-center gap-1 ml-4"
                      type="button"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Resolved Alerts */}
            {resolvedAlerts.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-success uppercase tracking-wider">
                  Resolved ({resolvedAlerts.length})
                </h4>
                {resolvedAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="alert alert-success flex items-start justify-between p-4 opacity-80"
                  >
                    <div className="alert-content">
                      <div className="flex items-center gap-2">
                        <span className="alert-title text-sm font-bold text-success">
                          {alt.title}: {alt.service}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.25 bg-success/15 border border-success/30 rounded font-semibold text-success">
                          RESOLVED
                        </span>
                      </div>
                      <p className="alert-description mt-1 text-xs text-success/90">
                        {alt.description}
                      </p>
                      <span className="text-[10px] text-success/70 font-mono mt-2 block">
                        Acknowledge completed.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty Alert State */}
            {activeAlerts.length === 0 && resolvedAlerts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm flex flex-col items-center gap-3">
                <BellOff className="h-12 w-12 text-muted-foreground/40" />
                <h3 className="font-semibold text-base">All Quiet</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  No active incidents or alerts triggered. Alert criteria is monitored in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
