import { useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogLayout from "@/components/BlogLayout";
import { getPostBySlug } from "@/lib/posts";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
};

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/" replace />;

  return (
    <BlogLayout>
      <article>
        <header className="mb-12">
          <h1 className="article-title font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
          <time className="text-sm text-muted-foreground mt-3 block">
            {formatDate(post.date)}
          </time>
        </header>
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </BlogLayout>
  );
};

export default PostPage;
