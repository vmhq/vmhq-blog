import * as React from "react";

export const PreBlock = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) => {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = () => {
    const text = preRef.current?.innerText ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
    }).catch(() => {});
  };

  return (
    <div className="relative group">
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label={copied ? "Código copiado" : "Copiar código"}
        className="absolute top-2 right-2 px-2 py-1 text-xs font-mono rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      >
        <span aria-live="polite">{copied ? "Copiado" : "Copiar"}</span>
      </button>
    </div>
  );
};
