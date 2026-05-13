import * as React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/BlogLayout";

const NotFound = () => {
  React.useEffect(() => {
    document.title = "P\u00e1gina no encontrada \u2014 vmhq";
  }, []);

  return (
    <BlogLayout>
      <Helmet>
        <title>Página no encontrada — vmhq</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">404</p>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-4">Página no encontrada</h1>
        <p className="text-muted-foreground mb-8">El contenido que buscas no existe o fue movido.</p>
        <Link to="/" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
          Volver al inicio
        </Link>
      </div>
    </BlogLayout>
  );
};

export default NotFound;
