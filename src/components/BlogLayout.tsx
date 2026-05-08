import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { getInitialTheme, applyTheme, getResolvedTheme, type Theme } from "@/lib/theme";

interface BlogLayoutProps {
  children: React.ReactNode;
}

const SunIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

const SystemIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);
  const resolvedTheme = getResolvedTheme(theme);
  const location = useLocation();

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const cycleTheme = () => {
    setTheme((current) => {
      if (current === "system") return "light";
      if (current === "light") return "dark";
      return "system";
    });
  };

  const themeLabel = theme === "system" ? "Sistema" : resolvedTheme === "dark" ? "Oscuro" : "Claro";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-border focus:rounded"
      >
        Ir al contenido principal
      </a>

      <header className="pt-10 pb-12 px-6">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <Link to="/" className="no-underline" aria-current={location.pathname === "/" ? "page" : undefined}>
            <h1 className="site-title font-display text-2xl font-bold tracking-tight">
              vmhq
            </h1>
          </Link>

          <button
            onClick={cycleTheme}
            aria-label={`Cambiar tema. Actual: ${themeLabel}`}
            title={`Tema: ${themeLabel}`}
            className="inline-flex items-center justify-center rounded-full border border-border p-2 min-h-[44px] min-w-[44px] text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
          >
            {theme === "system" ? <SystemIcon /> : resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      <main id="main-content" className="flex-1 px-6">
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>

      <footer className="py-12 px-6 mt-16">
        <div className="max-w-3xl mx-auto flex items-center gap-6 text-sm text-muted-foreground">
          <span>© vmhq {new Date().getFullYear()}</span>
          <Link to="/about" className="underline underline-offset-2 hover:text-foreground" aria-current={location.pathname === "/about" ? "page" : undefined}>
            Acerca
          </Link>
          <a href="/rss.xml" type="application/rss+xml" className="underline underline-offset-2 hover:text-foreground">
            RSS
          </a>
          <a href="https://github.com/vmhq" target="_blank" rel="noopener noreferrer" aria-label="GitHub (se abre en nueva pestaña)" className="underline underline-offset-2 hover:text-foreground">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
