import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { routes } from "@/routes/manifest";
import AppLogo from "@/components/AppLogo";
import { Badge } from "@/components/ui/badge";

export default function ForgotPassword() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStep, setAuthStep] = useState<
    "idle" | "verifying" | "success font-sans"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthStep("verifying");
    setTimeout(() => {
      setAuthStep("success font-sans");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
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
              <div className="card-header space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                  Recover Password
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your email address and we will forward a temporary link
                  to reset your password.
                </p>
              </div>

              <div className="card-content space-y-4">
                <div className="form-group space-y-1.5">
                  <label
                    htmlFor="email"
                    className="form-label text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button-primary w-full py-2.5 text-sm font-semibold rounded-md shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Send Recovery Link
                </button>

                <div className="text-center pt-2">
                  <Link
                    to={routes.login.path}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    Return to sign in
                  </Link>
                </div>
              </div>
            </form>
          )}

          {authStep === "verifying" && (
            <div className="card-content py-12 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-10 w-10 animate-spin text-accent" />
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-foreground font-sans">
                  Dispatching Email Link
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Signing validation hashes for security link
                </p>
              </div>
            </div>
          )}

          {authStep === "success font-sans" && (
            <div className="card-content text-center py-6 space-y-6">
              <div className="h-12 w-12 bg-muted border border-border rounded-full flex items-center justify-center mx-auto text-foreground">
                ✉
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground font-sans">
                  Recovery Link Forwarded
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  A reset link has been dispatched to{" "}
                  <span className="text-foreground font-semibold">{email}</span>
                  . Click on the link inside the message to define a new
                  password.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  to={`${routes.resetPassword.path}?email=${encodeURIComponent(email)}`}
                  className="button button-primary w-full inline-flex justify-center"
                >
                  Proceed to Reset Password Page
                </Link>
                <Link
                  to={routes.login.path}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
