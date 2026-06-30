import { Link } from "react-router-dom";
import { routes } from "@/routes/manifest";

export default function AppLogo() {
  return (
    <Link
      to={routes.home.path}
      className="flex items-center gap-0.5 hover:opacity-90 transition-opacity"
    >
      <span className="text-lg font-bold tracking-tighter">
        AD<span className="text-accent">.</span>
      </span>
      <span className="text-lg font-bold tracking-tighter text-accent">
        Sentry
      </span>
    </Link>
  );
}
