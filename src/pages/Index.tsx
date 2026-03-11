import { Link } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { getAllPosts } from "@/lib/posts";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
};

const Index = () => {
  const posts = getAllPosts();

  return (
    <BlogLayout>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link to={`/post/${post.slug}`} className="group block no-underline">
              <h2 className="article-title font-display text-xl font-bold tracking-tight group-hover:text-muted-foreground transition-colors duration-150">
                {post.title}
              </h2>
              <time className="text-sm text-muted-foreground mt-1 block">
                {formatDate(post.date)}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </BlogLayout>
  );
};

export default Index;
