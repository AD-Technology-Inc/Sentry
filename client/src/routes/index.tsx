import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./manifest";
import Layout from "@/components/Layout";
import { RefreshCw } from "lucide-react";

// Lazy-load page modules
const Dashboard = lazy(() => import("@/pages/dashboard/Index"));
const LogsExplorer = lazy(() => import("@/pages/logs/Index"));
const IssuesList = lazy(() => import("@/pages/issues/Index"));
const AlertsList = lazy(() => import("@/pages/alerts/Index"));
const ReportsList = lazy(() => import("@/pages/reports/Index"));

const LoadingFallback = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: routes.dashboard.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: routes.logs.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LogsExplorer />
          </Suspense>
        ),
      },
      {
        path: routes.issues.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IssuesList />
          </Suspense>
        ),
      },
      {
        path: routes.alerts.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AlertsList />
          </Suspense>
        ),
      },
      {
        path: routes.reports.path,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ReportsList />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
