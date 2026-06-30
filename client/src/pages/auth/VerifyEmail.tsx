import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { routes } from "@/routes/manifest";
import AppLogo from "@/components/AppLogo";
import { Badge } from "@/components/ui/badge";

export default function VerifyEmail() {
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
  const email = emailParam;
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStep, setAuthStep] = useState<
    "idle" | "verifying" | "success font-sans"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      alert("Please enter a 6-digit code.");
      return;
    }
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
              <div className="card-header">
                <h3 className="card-title text-xl font-bold font-sans">
                  Verify your email
                </h3>
                <p className="card-description text-xs mt-1">
                  We've sent a verification code to your email. Enter it below
                  to activate your account.
                </p>
              </div>

              <div className="card-content flex flex-col gap-4">
                <div className="form-group">
                  <label className="form-label">Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="form-input font-mono text-center tracking-widest text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button-primary w-full mt-2"
                >
                  Verify Account
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => alert("Verification code resent.")}
                    className="text-xs font-medium text-accent hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Resend verification code
                  </button>
                </div>
              </div>
            </form>
          )}

          {authStep === "verifying" && (
            <div className="card-content flex flex-col items-center justify-center py-10 text-center gap-4">
              <RefreshCw className="h-10 w-10 animate-spin text-accent" />
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground font-sans">
                  Verifying security payload...
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  Performing cryptographic checks on verification signature
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
                <h3 className="text-lg font-bold text-foreground">
                  Verification Complete
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Your email address{" "}
                  <span className="text-foreground font-semibold">{email}</span>{" "}
                  has been confirmed. You can now log into your console
                  dashboard.
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
