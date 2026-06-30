import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { routes } from "@/routes/manifest";

import AppLogo from "@/components/AppLogo";
import { Badge } from "@/components/ui/badge";

import {
  Terminal,
  LayoutDashboard,
  Database,
  AlertTriangle,
  Bell,
  FileText,
  Sun,
  Moon,
} from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark"
    );
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
          <div className="sidebar-header flex items-center justify-between">
            <AppLogo />
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
                  <Sun className="h-4 w-4 text-warning" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-muted-foreground" />
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
            <Terminal className="h-5 w-5 text-accent" />
            <h1 className="font-semibold text-[10px] capitalize">
              {location.pathname === routes.dashboard.path
                ? "Overview Dashboard"
                : location.pathname.substring(1)}
            </h1>
          </div>

          <Badge
            variant="outline"
            className="text-[9px] font-mono py-0 px-2 rounded-full border-border text-muted-foreground bg-muted"
          >
            v0.1.0 - PRE-ALPHA
          </Badge>
        </header>

        <main className="app-shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
