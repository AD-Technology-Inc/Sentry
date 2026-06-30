import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { routes } from "@/routes/manifest";
import AppLogo from "@/components/AppLogo";
import { Badge } from "@/components/ui/badge";

export default function ResetPassword() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStep, setAuthStep] = useState<
    "idle" | "updating" | "success font-sans"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setAuthStep("updating");
    setTimeout(() => {
      setAuthStep("success font-sans");
      setIsSubmitting(false);
    }, 1500);
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
          {authStep === "idle" && (
            <form onSubmit={handleSubmit}>
              <div className="card-header">
                <h3 className="card-title text-xl font-bold font-sans">
                  Reset password
                </h3>
                <p className="card-description text-xs mt-1">
                  Define a new secure password for{" "}
                  <span className="text-foreground font-semibold">
                    {emailParam}
                  </span>
                  .
                </p>
              </div>

              <div className="card-content flex flex-col gap-4">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button-primary w-full mt-2"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}

          {authStep === "updating" && (
            <div className="card-content flex flex-col items-center justify-center py-10 text-center gap-4">
              <RefreshCw className="h-10 w-10 animate-spin text-accent" />
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">
                  Updating security profiles...
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  Hashing new credential payload values
                </p>
              </div>
            </div>
          )}

          {authStep === "success font-sans" && (
            <div className="card-content text-center py-6 space-y-6">
              <div className="h-12 w-12 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto text-success">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground font-sans">
                  Password Updated
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Your security credentials have been refreshed. You can now use
                  your new password to sign into the system console.
                </p>
              </div>
              <Link
                to={routes.login.path}
                className="button button-primary w-full inline-flex justify-center"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
