import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/BlogLayout";

const About = () => {
  return (
    <BlogLayout>
      <Helmet>
        <title>Acerca — vmhq</title>
        <meta name="description" content="Sobre vmhq: un espacio personal para pensar en voz alta sobre diseño, tecnología y escritura." />
      </Helmet>
      <article className="prose">
        <h1 className="article-title font-display text-3xl font-bold tracking-tight">Acerca</h1>
        <p className="mt-6">
          Este es un espacio personal para pensar en voz alta. Escribo sobre diseño, tecnología,
          y las intersecciones entre ambos.
        </p>
        <p>
          Creo en la simplicidad como principio funcional, no estético. En que las mejores
          herramientas son las que desaparecen. Y en que escribir es la forma más honesta de
          pensar.
        </p>
        <p>
          Si quieres seguir las publicaciones, puedes suscribirte al{" "}
          <a href="/rss.xml">feed RSS</a>.
        </p>
      </article>
    </BlogLayout>
  );
};

export default About;
