import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { routes } from "@/routes/manifest";
import AppLogo from "@/components/AppLogo";
import { Badge } from "@/components/ui/badge";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStep, setAuthStep] = useState<
    "idle" | "connecting" | "verifying" | "redirecting"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthStep("connecting");
    setTimeout(() => {
      setAuthStep("verifying");
      setTimeout(() => {
        setAuthStep("redirecting");
        setTimeout(() => {
          localStorage.setItem(
            "ad_sentry_user",
            JSON.stringify({ email, name: "Angelo Arcillas" }),
          );
          navigate(routes.dashboard.path);
        }, 800);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(85,255,255,0.05),transparent_50%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative flex justify-center items-center mb-6 gap-2">
        <AppLogo />

        <Badge
          variant="outline"
          className="text-[9px] font-mono py-0 px-2 rounded-full border-border text-muted-foreground bg-muted"
        >
          v0.1.0 - PRE-ALPHA
        </Badge>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="card bg-card border-border shadow-2xl backdrop-blur">
          {authStep === "idle" ? (
            <form onSubmit={handleSubmit}>
              <div className="card-header">
                <h3 className="card-title text-xl font-bold font-sans">
                  Sign in to console
                </h3>
                <p className="card-description text-xs mt-1">
                  Access your centralized telemetry logs and system metrics.
                </p>
              </div>

              <div className="card-content flex flex-col gap-4">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label mb-0">Password</label>
                    <Link
                      to={routes.forgotPassword.path}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button-primary w-full mt-2"
                >
                  Sign In
                </button>

                <div className="mt-6 border-t border-border pt-5 text-center">
                  <span className="text-xs text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to={routes.signup.path}
                      className="font-medium text-accent hover:underline"
                    >
                      Create a free account
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          ) : (
            <div className="card-content flex flex-col items-center justify-center py-10 text-center gap-4 animate-pulse">
              <RefreshCw className="h-10 w-10 animate-spin text-accent" />
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">
                  {authStep === "connecting" &&
                    "Initializing secure connection..."}
                  {authStep === "verifying" &&
                    "Verifying secure credentials..."}
                  {authStep === "redirecting" &&
                    "Redirecting to primary dashboard..."}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {authStep === "connecting" &&
                    "Establishing SSL connection over port 443"}
                  {authStep === "verifying" && "Checking session tokens"}
                  {authStep === "redirecting" && "Mounting workspace metrics"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
