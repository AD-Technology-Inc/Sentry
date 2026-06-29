import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { routes } from "@/routes/manifest";
import {
  Terminal,
  LayoutDashboard,
  Database,
  AlertTriangle,
  Bell,
  FileText,
  Sun,
  Moon,
  Activity,
} from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") || 
      localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="app-shell">
      {/* Sidebar Section */}
      <div className="app-shell-sidebar">
        <aside className="sidebar">
          <div className="sidebar-header">
            <NavLink to={routes.dashboard.path} className="navbar-brand">
              <Activity className="h-5 w-5 text-indigo-500 animate-pulse" />
              <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                AD. Sentry
              </span>
            </NavLink>
          </div>
          
          <div className="sidebar-content">
            <nav>
              <ul className="sidebar-menu">
                <li>
                  <NavLink
                    to={routes.dashboard.path}
                    className={({ isActive }) =>
                      `sidebar-item${isActive ? " active" : ""}`
                    }
                    end
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={routes.logs.path}
                    className={({ isActive }) =>
                      `sidebar-item${isActive ? " active" : ""}`
                    }
                  >
                    <Database className="h-4 w-4" />
                    <span>Explorer</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={routes.issues.path}
                    className={({ isActive }) =>
                      `sidebar-item${isActive ? " active" : ""}`
                    }
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Issues</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={routes.alerts.path}
                    className={({ isActive }) =>
                      `sidebar-item${isActive ? " active" : ""}`
                    }
                  >
                    <Bell className="h-4 w-4" />
                    <span>Alerts</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={routes.reports.path}
                    className={({ isActive }) =>
                      `sidebar-item${isActive ? " active" : ""}`
                    }
                  >
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          <div className="sidebar-footer">
            <button
              onClick={() => setIsDark(!isDark)}
              className="sidebar-item w-full justify-start cursor-pointer border-none bg-transparent text-left"
              type="button"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <div className="app-shell-main">
        <header className="app-shell-header justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-indigo-500" />
            <h1 className="font-semibold text-lg capitalize">
              {location.pathname === "/"
                ? "Overview Dashboard"
                : location.pathname.substring(1)}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono px-2 py-1 bg-muted rounded border text-muted-foreground">
              v1.0.0
            </span>
          </div>
        </header>

        <main className="app-shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
