import AppLogoIcon from "./AppLogoIcon";

export default function AppLogo() {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex aspect-square size-8 items-center justify-center text-foreground">
          <AppLogoIcon className="size-5" />
        </div>

        <div className="ml-1 grid flex-1 text-left text-sm">
          <span className="mb-0.5 truncate leading-tight font-semibold text-foreground">
            AD. Sentry
          </span>
        </div>
      </div>
    </>
  );
}
