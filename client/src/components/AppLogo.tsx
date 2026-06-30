import { Link } from "react-router-dom";
import { routes } from "@/routes/manifest";

export default function AppLogo() {
  return (
    <Link to={routes.home.path} className="text-lg font-bold tracking-tighter text-foreground hover:text-foreground">
      AD<span className="text-accent">.</span>
    </Link>
  );
}
