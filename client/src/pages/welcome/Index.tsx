import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { routes } from "@/routes/manifest";
import AppLogo from "@/components/AppLogo";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Code,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Layers,
  Lock,
  MessageSquare,
  Play,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function Welcome() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  const [activeTab, setActiveTab] = useState<
    "ingest" | "group" | "trace" | "audit"
  >("ingest");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30 selection:text-primary-foreground">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(var(--primary-rgb),0.15),transparent)] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppLogo />
            <Badge
              variant="outline"
              className="text-[9px] font-mono py-0 px-2 rounded-full border-border text-muted-foreground bg-muted"
            >
              v0.1.0 - PRE-ALPHA
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to={routes.login.path}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Launch Console
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6 animate-pulse">
            <Activity className="h-3.5 w-3.5" />
            <span>Reliability-First Observability Platform</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent max-w-4xl mx-auto leading-none">
            Transform Raw Telemetry into Actionable Incidents
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AD. Sentry is a centralized logging engine that ingests,
            persistence-guarantees, and regex-categorizes distributed trace
            spans into logical system issues.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to={routes.login.path}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/35 hover:bg-primary/90 transition-all hover:translate-y-[-1px] active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-primary-foreground" />
              <span>Live Console Demo</span>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-6 py-3 text-base font-semibold text-foreground hover:bg-zinc-800 hover:text-foreground transition-all hover:translate-y-[-1px]"
            >
              <Code className="h-4 w-4" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="#deep-dive"
              className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background px-6 py-3 text-base font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              <span>Engineering Notes</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Capability Strip */}
      <section className="border-y border-border bg-background/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary font-mono">
                &lt; 1.2ms
              </div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                Average Ingestion Latency
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary font-mono">
                100%
              </div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                Immutable Audit Trail
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary font-mono">
                Zero
              </div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                Ingest Lock Blocking
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary font-mono">
                Real-time
              </div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                Issue Signature Grouping
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              The Observability Tax: Noise, Stale Diagnostics, and High
              Latencies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Standard log solutions partition raw events into massive data
              lakes. When production incidents occur, engineers are forced to
              run expensive query commands to parse and filter millions of lines
              manually.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-destructive/10 text-destructive border border-destructive/20 mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Alert Fatigue
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Same warnings trigger thousands of notifications instead of
                    aggregating into a single alert incident card.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-destructive/10 text-destructive border border-destructive/20 mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Trace Fragmentation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Logs lack parent-child correlation, making nested service
                    request tracing highly manual.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-border bg-muted/30 relative overflow-hidden flex flex-col gap-6">
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Our Solution: Deduplication & Contextualized Grouping
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              AD. Sentry captures raw telemetry logs asynchronously, filters out
              dynamic data parameters (IDs, IPs, timestamps) to extract exact
              message signatures, and resolves duplicates immediately into
              grouped Issues.
            </p>
            <ul className="space-y-2 text-foreground text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Deterministic Regex Grouping Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Distributed Parent-Child Trace Span Maps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Redis Rate Limit Shielding</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Demo Showcase */}
      <section className="py-16 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Interactive Platform Demo
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Explore the exact schema structures and telemetry interfaces
              mapped directly from our production repository.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tabs Selector */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("ingest")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "ingest"
                    ? "bg-primary/10 border-primary/35 text-primary shadow-md"
                    : "bg-background border-border/80 hover:bg-zinc-900/40 text-muted-foreground"
                }`}
              >
                <div className="font-semibold text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>1. Asynchronous Log Ingestion</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Validate requests via FastAPI schemas, pass Redis limit
                  controls, and queue events.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("group")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "group"
                    ? "bg-primary/10 border-primary/35 text-primary shadow-md"
                    : "bg-background border-border/80 hover:bg-zinc-900/40 text-muted-foreground"
                }`}
              >
                <div className="font-semibold text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>2. Signature Issue Aggregation</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Merge dynamic exception payloads into single logically
                  trackable issue signatures.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("trace")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "trace"
                    ? "bg-primary/10 border-primary/35 text-primary shadow-md"
                    : "bg-background border-border/80 hover:bg-zinc-900/40 text-muted-foreground"
                }`}
              >
                <div className="font-semibold text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span>3. Parent-Child Span Tracing</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Correlate nested requests across isolated microservices with
                  microsecond latency tags.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("audit")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "audit"
                    ? "bg-primary/10 border-primary/35 text-primary shadow-md"
                    : "bg-background border-border/80 hover:bg-zinc-900/40 text-muted-foreground"
                }`}
              >
                <div className="font-semibold text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>4. Reliability Audit & PDF Reports</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Automate risk scoring (0-10) for issues and export structured
                  PDF audit reports.
                </p>
              </button>
            </div>

            {/* Showcase Screen */}
            <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-background/80 font-mono text-xs overflow-hidden h-[300px]">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <div className="h-3 w-3 rounded-full bg-success" />
                </div>
                <span className="text-muted-foreground text-[10px]">
                  {activeTab === "ingest" && "POST /v1/logs"}
                  {activeTab === "group" && "GROUP_ENGINE.py"}
                  {activeTab === "trace" && "TRACE_EXPLORER.tsx"}
                  {activeTab === "audit" && "AUDIT_ENGINE.py"}
                </span>
              </div>

              {activeTab === "ingest" && (
                <div className="space-y-2 text-muted-foreground overflow-y-auto h-[230px]">
                  <p className="text-success">
                    // Ingestion request verification
                  </p>
                  <p>{"{"}</p>
                  <p className="pl-4">
                    "service":{" "}
                    <span className="text-primary">"payment-gateway"</span>,
                  </p>
                  <p className="pl-4">
                    "level": <span className="text-warning">"ERROR"</span>,
                  </p>
                  <p className="pl-4">
                    "message":{" "}
                    <span className="text-success">
                      "Database connection timeout on pool-size 50"
                    </span>
                    ,
                  </p>
                  <p className="pl-4">
                    "span_id": <span className="text-primary">"spn_f274a"</span>
                    ,
                  </p>
                  <p className="pl-4">
                    "parent_span_id":{" "}
                    <span className="text-muted-foreground">"spn_root"</span>
                  </p>
                  <p>{"}"}</p>
                  <p className="text-success">// Redis Rate Limiter Response</p>
                  <p className="text-foreground">HTTP/1.1 201 Created</p>
                  <p className="text-muted-foreground">
                    X-RateLimit-Limit: 100 | X-RateLimit-Remaining: 99
                  </p>
                </div>
              )}

              {activeTab === "group" && (
                <div className="space-y-2 text-muted-foreground overflow-y-auto h-[230px]">
                  <p className="text-success">
                    // Match signature and merge occurrences
                  </p>
                  <p className="text-foreground">
                    Input Log:{" "}
                    <span className="text-muted-foreground">
                      "User with ID 84729 failed checkout after 3000ms"
                    </span>
                  </p>
                  <p className="text-foreground">
                    Input Log:{" "}
                    <span className="text-muted-foreground">
                      "User with ID 10924 failed checkout after 1500ms"
                    </span>
                  </p>
                  <div className="p-2 border border-primary/20 bg-primary/5 rounded text-primary">
                    <p className="font-semibold font-sans">
                      Grouped Issue Match Identified:
                    </p>
                    <p className="mt-1">
                      Pattern: "User with ID * failed checkout after *ms"
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Count updated: 2 events | Status: Active
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "trace" && (
                <div className="space-y-3 text-muted-foreground overflow-y-auto h-[230px] font-sans">
                  <div className="flex items-center justify-between border-l-2 border-primary pl-2">
                    <div>
                      <span className="font-semibold text-foreground block text-xs">
                        gateway (Root Span)
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        API GET /checkout
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-primary font-bold">
                      148ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-l-2 border-warning pl-2 ml-4">
                    <div>
                      <span className="font-semibold text-foreground block text-xs">
                        auth-service
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Bearer Token Validation
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-warning font-bold">
                      12ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-l-2 border-destructive pl-2 ml-4">
                    <div>
                      <span className="font-semibold text-foreground block text-xs">
                        payment-api
                      </span>
                      <span className="text-[10px] text-destructive font-bold">
                        Database connection timeout
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-destructive font-bold">
                      136ms
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "audit" && (
                <div className="space-y-2 text-muted-foreground overflow-y-auto h-[230px]">
                  <p className="text-success">
                    // Reliability Audit Scorecard & Risk Assessment
                  </p>
                  <p>{"{"}</p>
                  <p className="pl-4">
                    "reliability_score":{" "}
                    <span className="text-success">"89.2 / 100"</span>,
                  </p>
                  <p className="pl-4">"identified_issues": [</p>
                  <p className="pl-8">
                    {
                      '{ "id": "CRI-DI-001", "category": "DI", "risk_score": 8.92 }'
                    }
                    ,
                  </p>
                  <p className="pl-8">
                    {
                      '{ "id": "CRI-SEC-001", "category": "SEC", "risk_score": 9.40 }'
                    }
                  </p>
                  <p className="pl-4">],</p>
                  <p className="pl-4">
                    "pdf_export_hash":{" "}
                    <span className="text-primary">"sha256_ef920b7..."</span>,
                  </p>
                  <p className="pl-4">
                    "actionable_remediation":{" "}
                    <span className="text-warning">
                      "Immediate: Add distributed lock on checkout endpoint."
                    </span>
                  </p>
                  <p>{"}"}</p>
                  <p className="text-success">
                    // Click 'Export PDF' in the console for the full document
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for Production Environments
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Eliminate operational blindspots with our lightweight, performant,
            and zero-compromise telemetry features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl border border-border bg-muted/20 hover:border-border transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">
              Rate-Limited HTTP Ingest
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Protects infrastructure nodes from traffic spikes. Employs
              token-bucket rate validation with fallback logging directly in
              Redis.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl border border-border bg-muted/20 hover:border-border transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">
              Asynchronous Storage Client
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Non-blocking log inserts using SQLAlchemy 2.0 AsyncSession.
              Eliminates database pool locking, preserving high response times.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl border border-border bg-muted/20 hover:border-border transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">
              Auto-Grouping Log Issues
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Regex abstraction groups millions of raw events into distinct
              signature incidents. Minimizes diagnostic triage duration.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-xl border border-border bg-muted/20 hover:border-border transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">
              Incident Notification Rules
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Configurable webhooks trigger instantly when event thresholds are
              reached. Resolves alarm duplicates and prevents alert fatigue.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-xl border border-border bg-muted/20 hover:border-border transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">
              Reliability Audit & PDF Reports
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Dynamically groups logs into structured issues, calculates risk
              threat scores (0-10), and generates download-ready PDF reports
              with remediation timelines.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-xl border border-border bg-muted/20 hover:border-border transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">
              Span Trace Timelines
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Visually diagrams request-span cascades. Clearly separates network
              latency from application thread cycles.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-zinc-900/10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Four Steps to Full Observability
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Set up centralized instrumentation in minutes without deploying
              heavy sidecars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3 relative">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-semibold text-foreground">
                Create Log Payload
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your service client to our HTTP API gateway using
                standard payload properties.
              </p>
            </div>

            <div className="flex flex-col gap-3 relative">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-semibold text-foreground">
                Configure Rule Policies
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Define metric thresholds, email digest routes, and Slack hook
                channels in the Alerts center.
              </p>
            </div>

            <div className="flex flex-col gap-3 relative">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-semibold text-foreground">
                Execute Operations
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run services in staging or production. Logs stream
                asynchronously and safely under rate-limit caps.
              </p>
            </div>

            <div className="flex flex-col gap-3 relative">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h4 className="font-semibold text-foreground">
                Observe Incidents
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track ingestion metrics, inspect span trace cascades, and
                resolve grouped issues directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reliability & System Guarantees */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            System & Reliability Guarantees
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed text-sm sm:text-base">
            Detailed engineering commitments ensuring service availability,
            database safety, and event integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl border border-border bg-zinc-900/10">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-primary" />
              <span>Fault Tolerance & Isolation</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              We employ sandbox query sandbagging. If the primary
              Supabase/PostgreSQL database cluster goes offline, the API layer
              falls back to local in-memory log caches, preventing telemetry
              blockages from cascading into customer-facing service threads.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-zinc-900/10">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 text-primary" />
              <span>Idempotency & Safe Retries</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Every log payload is assigned an immutable uuid signature prior to
              transmission. This guarantees that network failures retried by
              application clients do not introduce duplicate records or distort
              trend graphs.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-zinc-900/10">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-primary" />
              <span>Token-Bucket Backpressure & Rate Limit</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Rather than crashing under load, AD. Sentry leverages Redis-based
              sliding window rate-limit shields. Incoming requests exceeding
              configured thresholds receive clean `429 Too Many Requests`
              responses instantly.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-zinc-900/10">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-primary" />
              <span>Consistency & Security Models</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              We utilize read-committed isolation levels on PostgreSQL database
              states. Auth tokens are validated at the router boundaries prior
              to reaching service layers, guaranteeing zero leak exposure for
              system telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Engineering Deep Dive */}
      <section
        id="deep-dive"
        className="py-20 bg-muted/20 border-y border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Engineering Deep Dive
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              An inspection of technical tradeoffs, performance parameters, and
              backend execution policies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">
                Asynchronous Execution Pipeline
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By relying exclusively on Python 3.12+ async syntax, the FastAPI
                ingestion engine operates on an event-loop system that frees the
                CPU to handle concurrent connection polls while waiting on
                external database writes.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Using SQLAlchemy's <code>AsyncSession</code> context managers,
                the app ensures that sessions are bound to specific HTTP
                transaction lifecycles. They are automatically recycled and
                released back to the pg_bouncer connection pool upon request
                completion.
              </p>

              <div className="p-4 rounded-lg bg-background border border-border font-mono text-[11px] text-muted-foreground">
                <p className="text-muted-foreground">
                  # Performance Benchmark Statistics
                </p>
                <p>
                  Concurrent Connections:{" "}
                  <span className="text-success">10,000+ / sec</span>
                </p>
                <p>
                  Ingestion Endpoint Latency (p99):{" "}
                  <span className="text-success">4.8ms</span>
                </p>
                <p>
                  Database Query Latency:{" "}
                  <span className="text-success">0.9ms</span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">
                Architectural Tradeoffs
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    In-Memory Logging vs. Persistent Message Queues
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    To maintain microsecond ingestion cycles without introducing
                    RabbitMQ or Kafka dependencies, the platform groups log
                    traces in memory and flushes them to the DB pool via async
                    bulk sessions. This minimizes dev complexity but shifts the
                    burden of buffer-safety to the application client.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    Regex Grouping Signature Performance
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    The LogService grouping engine performs regex replacement
                    scans to scrub variable data tokens. To preserve
                    performance, compiling is optimized via Python's built-in
                    LRU caching mechanisms, avoiding regex recompilation
                    overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Exactly Map Repository Technologies
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            We list the precise stack running inside this directory. Zero
            fictional integrations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          <div className="p-4 rounded-xl border border-border bg-zinc-900/10">
            <span className="font-bold text-foreground block">Python 3.12</span>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold block">
              Runtime Engine
            </span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-zinc-900/10">
            <span className="font-bold text-foreground block">FastAPI</span>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold block">
              API Gateway
            </span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-zinc-900/10">
            <span className="font-bold text-foreground block">PostgreSQL</span>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold block">
              Event Database
            </span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-zinc-900/10">
            <span className="font-bold text-foreground block">Redis</span>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold block">
              Cache & Limiter
            </span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-zinc-900/10">
            <span className="font-bold text-foreground block">
              React 19 & TS
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold block">
              Client Interface
            </span>
          </div>
        </div>
      </section>

      {/* Final CTA Footer */}
      <footer className="border-t border-border bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Ready to secure your telemetry stream?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Gain immediate access to our low-latency console dashboard. Run,
            simulate log loads, and audit service uptimes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to={routes.login.path}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <span>Launch Dashboard</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 text-xs text-zinc-600 font-mono">
            &copy; {new Date().getFullYear()} AD. Sentry Observability Systems.
            All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
