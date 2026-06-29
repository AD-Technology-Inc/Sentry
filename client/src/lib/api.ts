const API_BASE_URL = "http://localhost:8000/v1/logs";

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
  const url = path ? `${API_BASE_URL}${path}` : API_BASE_URL;
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
    return fetchApi<Log[]>(queryString);
  },

  getLog: (id: string): Promise<Log> => {
    return fetchApi<Log>(`/${id}`);
  },

  createLog: (log: Omit<Log, "id" | "created_at">): Promise<Log> => {
    return fetchApi<Log>("", {
      method: "POST",
      body: JSON.stringify(log),
    });
  },

  deleteLog: (id: string): Promise<{ status: string }> => {
    return fetchApi<{ status: string }>(`/${id}`, {
      method: "DELETE",
    });
  },

  getStats: (): Promise<Stats> => {
    return fetchApi<Stats>("/stats");
  },

  getTrends: (): Promise<TrendPoint[]> => {
    return fetchApi<TrendPoint[]>("/trends");
  },

  getIssues: (): Promise<Issue[]> => {
    return fetchApi<Issue[]>("/issues");
  },

  getAlerts: (): Promise<Alert[]> => {
    return fetchApi<Alert[]>("/alerts");
  },

  getReports: (): Promise<Report[]> => {
    return fetchApi<Report[]>("/reports");
  },
};
