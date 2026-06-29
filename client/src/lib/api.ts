const API_BASE_URL = "http://localhost:8000/v1";

export interface Log {
  id: string;
  service: string;
  environment: string;
  level: string;
  log_message: string;
  trace_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Stats {
  total_count: number;
  by_level: Record<string, number>;
  by_service: Record<string, number>;
  by_environment: Record<string, number>;
  error_rate: number;
}

export interface TrendPoint {
  timestamp: string;
  info_count: number;
  warning_count: number;
  error_count: number;
  total_count: number;
}

export interface Issue {
  id: string;
  service: string;
  level: string;
  environment: string;
  message: string;
  count: number;
  first_seen: string;
  last_seen: string;
  status: string;
  assigned_to: string;
}

export interface IssueEvidence {
  log_ids: string[];
  request_ids: string[];
}

export interface AuditIssue {
  id: string;
  title: string;
  category: string;
  severity: string;
  risk_score: number;
  endpoint?: string;
  method?: string;
  scenario: string;
  observed_behavior: string;
  root_cause: string;
  business_impact: string;
  recommendations: string[];
  evidence: IssueEvidence;
  timestamp: string;
}

export interface Alert {
  id: string;
  service: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  timestamp: string;
  status: string;
}

export interface Report {
  id: string;
  title: string;
  period: string;
  total_events: number;
  incidents_count: number;
  avg_mttr: string;
  service_uptime: Record<string, string>;
  summary: string;
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let errorDetail = "API request failed";
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  getLogs: (service?: string, level?: string): Promise<Log[]> => {
    const params = new URLSearchParams();
    if (service) params.append("service", service);
    if (level) params.append("level", level);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchApi<Log[]>(`/logs${queryString}`);
  },

  getLog: (id: string): Promise<Log> => {
    return fetchApi<Log>(`/logs/${id}`);
  },

  createLog: (log: Omit<Log, "id" | "created_at">): Promise<Log> => {
    return fetchApi<Log>("/logs", {
      method: "POST",
      body: JSON.stringify(log),
    });
  },

  deleteLog: (id: string): Promise<{ status: string }> => {
    return fetchApi<{ status: string }>(`/logs/${id}`, {
      method: "DELETE",
    });
  },

  getStats: (): Promise<Stats> => {
    return fetchApi<Stats>("/logs/stats");
  },

  getTrends: (): Promise<TrendPoint[]> => {
    return fetchApi<TrendPoint[]>("/logs/trends");
  },

  getIssues: (): Promise<Issue[]> => {
    return fetchApi<Issue[]>("/logs/issues");
  },

  getAuditIssues: (filters?: { id?: string; severity?: string; category?: string; endpoint?: string }): Promise<AuditIssue[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.id) params.append("id", filters.id);
      if (filters.severity) params.append("severity", filters.severity);
      if (filters.category) params.append("category", filters.category);
      if (filters.endpoint) params.append("endpoint", filters.endpoint);
    }
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchApi<AuditIssue[]>(`/issues${queryString}`);
  },

  exportAuditPdf: async (payload: { filters?: Record<string, any>; date_range?: Record<string, string>; issue_ids?: string[] }): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/audit/export/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to export PDF");
    }
    return response.blob();
  },

  getAlerts: (): Promise<Alert[]> => {
    return fetchApi<Alert[]>("/logs/alerts");
  },

  getReports: (): Promise<Report[]> => {
    return fetchApi<Report[]>("/logs/reports");
  },
};
