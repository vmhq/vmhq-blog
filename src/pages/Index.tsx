import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/BlogLayout";
import { getAllPosts } from "@/lib/posts";
import { formatDate, readingTime } from "@/lib/formatters";

const POSTS_PER_PAGE = 10;

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginated = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const goToPage = (page: number) => {
    setSearchParams(page === 1 ? {} : { page: String(page) });
    window.scrollTo(0, 0);
  };

  return (
    <BlogLayout>
      <Helmet>
        <title>Reflexiones Minimalistas — vmhq</title>
        <meta name="description" content="Blog personal minimalista. Reflexiones sobre diseño, tecnología y escritura." />
      </Helmet>
      <div className="space-y-8">
        {paginated.map((post) => (
          <article key={post.slug}>
            <Link to={`/post/${post.slug}`} className="group block no-underline">
              <h2 className="article-title font-display text-xl font-bold tracking-tight group-hover:text-muted-foreground transition-colors duration-150">
                {post.title}
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>·</span>
                <span>{readingTime(post.content)}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-4 mt-12 text-sm text-muted-foreground">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="underline underline-offset-2 hover:text-foreground disabled:opacity-30 disabled:no-underline disabled:cursor-default bg-transparent border-none cursor-pointer font-body text-sm text-muted-foreground"
          >
            ← Anterior
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="underline underline-offset-2 hover:text-foreground disabled:opacity-30 disabled:no-underline disabled:cursor-default bg-transparent border-none cursor-pointer font-body text-sm text-muted-foreground"
          >
            Siguiente →
          </button>
        </nav>
      )}
    </BlogLayout>
  );
};

export default Index;
