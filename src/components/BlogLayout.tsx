import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getInitialTheme, applyTheme } from "@/lib/theme";

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const next = e.matches ? "dark" : "light";
        setTheme(next);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="pt-16 pb-12 px-6">
        <div className="max-w-prose mx-auto">
          <Link to="/" className="no-underline">
            <h1 className="site-title font-display text-2xl font-bold tracking-tight">
              vmhq
            </h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6">
        <div className="max-w-prose mx-auto">{children}</div>
      </main>

      <footer className="py-12 px-6 mt-16">
        <div className="max-w-prose mx-auto flex items-center gap-6 text-sm text-muted-foreground">
          <span>© vmhq {new Date().getFullYear()}</span>
          <Link to="/about" className="underline underline-offset-2 hover:text-foreground">
            Acerca
          </Link>
          <a href="/rss.xml" className="underline underline-offset-2 hover:text-foreground">
            RSS
          </a>
          <a href="https://github.com/vmhq" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
            GitHub
          </a>
          <button
            onClick={toggleTheme}
            className="underline underline-offset-2 hover:text-foreground text-muted-foreground bg-transparent border-none cursor-pointer text-sm font-body"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
