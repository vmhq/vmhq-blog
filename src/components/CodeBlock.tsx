import { useRef, useState } from "react";

export const PreBlock = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = preRef.current?.innerText ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="relative group">
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copiar código"
        className="absolute top-2 right-2 px-2 py-1 text-xs font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
};
