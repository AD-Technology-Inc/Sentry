import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { routes } from "@/routes/manifest";
import AppLogo from "@/components/AppLogo";

export default function Signup() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStep, setAuthStep] = useState<"idle" | "creating" | "sending" | "success font-sans">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setAuthStep("creating");
    setTimeout(() => {
      setAuthStep("sending");
      setTimeout(() => {
        setAuthStep("success font-sans");
        setIsSubmitting(false);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <Link to={routes.welcome.path} className="flex justify-center items-center mb-6 group">
          <AppLogo />
        </Link>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="card bg-card border-border shadow-2xl backdrop-blur">
          {authStep === "idle" && (
            <form onSubmit={handleSubmit}>
              <div className="card-header">
                <h3 className="card-title text-xl font-bold font-sans">Create an account</h3>
                <p className="card-description text-xs mt-1">
                  Start monitoring your distributed systems with AD. Publish.
                </p>
              </div>

              <div className="card-content flex flex-col gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

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
                  <label className="form-label">Password</label>
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
                  Create Account
                </button>

                <div className="mt-6 border-t border-border pt-5 text-center">
                  <span className="text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to={routes.login.path}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign In
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          )}

          {(authStep === "creating" || authStep === "sending") && (
            <div className="card-content flex flex-col items-center justify-center py-10 text-center gap-4">
              <RefreshCw className="h-10 w-10 animate-spin text-primary" />
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">
                  {authStep === "creating" && "Provisioning user workspace..."}
                  {authStep === "sending" && "Sending 6-digit confirmation pin..."}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {authStep === "creating" && "Syncing credential signatures"}
                  {authStep === "sending" && `Forwarding trace verification to ${email}`}
                </p>
              </div>
            </div>
          )}

          {authStep === "success font-sans" && (
            <div className="card-content text-center py-6 space-y-6">
              <div className="h-12 w-12 bg-muted border border-border rounded-full flex items-center justify-center mx-auto text-foreground">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">Verification Email Sent</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  We've sent a 6-digit confirmation pin to <span className="text-foreground font-semibold">{email}</span>. Please enter the code on the verification page to activate your workspace.
                </p>
              </div>
              <Link
                to={`${routes.verifyEmail.path}?email=${encodeURIComponent(email)}`}
                className="button button-primary w-full inline-flex justify-center"
              >
                Go to Verification
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
