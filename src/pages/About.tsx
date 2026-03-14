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
        <title>Acerca \u2014 vmhq</title>
        <meta name="description" content="Reflexiones sobre tecnolog\u00eda e inteligencia artificial como herramientas al servicio de las personas." />
      </Helmet>
      <article className="prose">
        <h1 className="article-title font-display text-3xl font-bold tracking-tight">Acerca</h1>
        <p className="mt-6">
          Este espacio existe para pensar en voz alta sobre un tema que considero urgente: c\u00f3mo la tecnolog\u00eda y la inteligencia artificial pueden estar al servicio de las personas, y no al rev\u00e9s.
        </p>
        <p>
          Aqu\u00ed se publican reflexiones sobre el papel que cumplen estas herramientas en el trabajo, en la toma de decisiones y en la vida cotidiana. No desde la fascinaci\u00f3n t\u00e9cnica, sino desde la convicci\u00f3n de que la tecnolog\u00eda solo tiene sentido cuando amplifica lo humano.
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
