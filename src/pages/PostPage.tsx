import { useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/BlogLayout";
import { getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/formatters";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/" replace />;

  const description = post.content.replace(/[#>*`\-_[\]]/g, "").trim().slice(0, 160);
  const url = `${window.location.origin}/post/${post.slug}`;

  return (
    <BlogLayout>
      <Helmet>
        <title>{post.title} — Reflexiones Minimalistas</title>
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </BlogLayout>
  );
};

export default PostPage;
