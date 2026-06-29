export const routes = {
  dashboard: {
    name: "dashboard",
    path: "/",
  },
  logs: {
    name: "logs.index",
    path: "/logs",
  },
  issues: {
    name: "issues.index",
    path: "/issues",
  },
  alerts: {
    name: "alerts.index",
    path: "/alerts",
  },
  reports: {
    name: "reports.index",
    path: "/reports",
  },
} as const;

export type RouteName = keyof typeof routes;
