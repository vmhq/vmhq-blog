import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/BlogLayout";
import { PreBlock } from "@/components/CodeBlock";
import { getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatters";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const adjacent = slug ? getAdjacentPosts(slug) : { prev: null, next: null };
  const [showBackToTop, setShowBackToTop] = useState(false);

  const pageTitle = post ? `${post.title} \u2014 vmhq` : "vmhq";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nearEnd = docHeight > 0 && scrollTop / docHeight > 0.45;
      setShowBackToTop(nearEnd);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) return <Navigate to="/" replace />;

  const description = post.content
    .replace(/!\[.*?\]\(.*?\)/g, "")          // imágenes
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")    // links → solo texto
    .replace(/`{1,3}[^`]*`{1,3}/g, "")        // código inline y bloques
    .replace(/^#{1,6}\s+/gm, "")              // headings
    .replace(/[*_~>|]/g, "")                  // énfasis, blockquotes, tablas
    .replace(/&[a-z]+;/gi, " ")               // entidades HTML
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const url = `${window.location.origin}/post/${post.slug}`;

  return (
    <BlogLayout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
      </Helmet>
      <article>
        <header className="mb-12">
          <h1 className="article-title font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
          <time dateTime={post.date} className="text-sm text-muted-foreground mt-3 block">
            {formatDate(post.date)}
          </time>
        </header>
        <div className="prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{ pre: PreBlock }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {(adjacent.prev || adjacent.next) && (
        <nav aria-label="Navegación entre posts" className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-4 text-sm">
          <div>
            {adjacent.next && (
              <Link
                to={`/post/${adjacent.next.slug}`}
                className="group flex flex-col gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-xs uppercase tracking-wide">← Más antiguo</span>
                <span className="font-medium line-clamp-2 group-hover:underline underline-offset-2">
                  {adjacent.next.title}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {adjacent.prev && (
              <Link
                to={`/post/${adjacent.prev.slug}`}
                className="group flex flex-col gap-1 text-muted-foreground hover:text-foreground transition-colors items-end"
              >
                <span className="text-xs uppercase tracking-wide">Más reciente →</span>
                <span className="font-medium line-clamp-2 group-hover:underline underline-offset-2">
                  {adjacent.prev.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
        title="Volver arriba"
        className={`fixed bottom-6 right-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all hover:text-foreground hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${showBackToTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </BlogLayout>
  );
};

export default PostPage;
