import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/BlogLayout";

const About = () => {
  return (
    <BlogLayout>
      <Helmet>
        <title>Acerca — vmhq</title>
        <meta name="description" content="Reflexiones sobre tecnología e inteligencia artificial como herramientas al servicio de las personas." />
      </Helmet>
      <article className="prose">
        <h1 className="article-title font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">Acerca</h1>
        <p className="mt-6">
          Este espacio existe para pensar en voz alta sobre un tema que considero urgente: cómo la tecnología y la inteligencia artificial pueden estar al servicio de las personas, y no al revés.
        </p>
        <p>
          Aquí se publican reflexiones sobre el papel que cumplen estas herramientas en el trabajo, en la toma de decisiones y en la vida cotidiana. No desde la fascinación técnica, sino desde la convicción de que la tecnología solo tiene sentido cuando amplifica lo humano.
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
