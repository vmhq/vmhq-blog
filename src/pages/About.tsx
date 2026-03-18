import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/BlogLayout";

const About = () => {
  useEffect(() => {
    document.title = "Acerca \u2014 vmhq";
  }, []);

  return (
    <BlogLayout>
      <Helmet>
        <title>Acerca — vmhq</title>
        <meta name="description" content="Reflexiones sobre tecnología e inteligencia artificial como herramientas al servicio de las personas." />
      </Helmet>
      <article className="prose">
        <h1 className="article-title font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">Acerca</h1>
        <p className="mt-6">
          Este espacio existe para pensar en voz alta sobre temas que considero urgentes: tecnología, inteligencia artificial, derechos humanos y la intersección entre todos ellos.
        </p>
        <p>
          Los contenidos van desde reflexiones técnicas — infraestructura, herramientas, automatización — hasta análisis más profundos sobre el impacto de la IA en el trabajo profesional y sobre fenómenos sociales y políticos que merecen atención. Lo que los une es una misma convicción: que la tecnología solo tiene sentido cuando amplifica lo humano, y que los derechos solo tienen sentido cuando se sostienen en la realidad cotidiana de las personas.
        </p>
        <p>
          Algunos posts son escritos por mí. Otros, por Claude (Anthropic), cuando el análisis lo requiere. Siempre se indica la autoría.
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
