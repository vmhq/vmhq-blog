export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

const posts: Post[] = [
  {
    slug: "sobre-la-simplicidad",
    title: "Sobre la simplicidad",
    date: "2026-03-10",
    content: `La simplicidad no es la ausencia de complejidad, sino su resolución. Cuando eliminamos lo innecesario, lo que queda no es menos — es más claro.

## El problema del exceso

Vivimos rodeados de interfaces que compiten por nuestra atención. Cada notificación, cada animación, cada botón de "compartir" es una pequeña interrupción en el flujo del pensamiento.

> "La perfección se alcanza, no cuando no hay nada más que añadir, sino cuando no hay nada más que quitar." — Antoine de Saint-Exupéry

## Una propuesta

¿Qué pasaría si diseñáramos espacios digitales con la misma intención que un arquitecto diseña una sala de lectura? Sin distracciones. Sin ornamento gratuito. Solo la estructura necesaria para sostener el contenido.

El resultado no sería austero — sería **sereno**.

### Principios

1. El contenido es la interfaz
2. El espacio en blanco no está vacío
3. La tipografía es arquitectura
4. El color es luz, no decoración

---

Escribir es pensar. Y pensar requiere silencio. Este blog intenta ser ese silencio.`,
  },
  {
    slug: "notas-sobre-la-escritura",
    title: "Notas sobre la escritura",
    date: "2026-03-05",
    content: `Escribir no es transcribir pensamientos. Es descubrirlos.

Cuando me siento frente a una página en blanco, no sé lo que voy a decir. El acto de formular una frase me obliga a precisar lo que antes era solo una intuición vaga, una sombra de idea.

## El proceso

El primer borrador siempre es malo. Eso está bien. Su función no es ser bueno — es existir. Una vez que existe, puedo mejorarlo. Pero no puedo mejorar lo que no existe.

\`\`\`
primer_borrador → revisión → claridad
\`\`\`

## Herramientas

Uso Markdown porque desaparece. No hay menús, no hay barras de herramientas, no hay distracciones. Solo texto y unas pocas marcas que le dan estructura.

- **Negrita** para énfasis
- *Cursiva* para matices
- \`código\` para lo técnico
- Listas para organizar

Lo demás sobra.

## Una cita

> "No escribo porque tenga algo que decir. Escribo para descubrir qué tengo que decir." — Flannery O'Connor

Cada texto es una excavación. Empiezas en la superficie y, si tienes paciencia, llegas a algo que no sabías que estaba ahí.`,
  },
  {
    slug: "el-valor-del-silencio-digital",
    title: "El valor del silencio digital",
    date: "2026-02-20",
    content: `Hay una diferencia entre estar desconectado y estar en silencio. La desconexión es una ausencia. El silencio es una presencia deliberada.

## Ruido

La web moderna es ruidosa. No en el sentido literal, sino en el cognitivo. Cada página compite por fragmentos de atención con banners, pop-ups, sugerencias algorítmicas y el interminable scroll.

El resultado es una forma peculiar de fatiga: estamos saturados de información pero hambrientos de significado.

## Silencio como diseño

¿Es posible diseñar silencio? Creo que sí. El silencio digital se construye con:

- **Espacio** — márgenes generosos, ritmo vertical
- **Restricción** — menos opciones, menos elementos
- **Intención** — cada píxel tiene una razón de ser

No se trata de minimalismo estético. Se trata de respeto por la atención del lector.

## Una práctica

Antes de añadir cualquier elemento a un diseño, pregúntate: ¿esto ayuda al lector a entender el contenido, o solo me hace sentir que el diseño está "completo"?

Si la respuesta es lo segundo, elimínalo.

---

El mejor diseño es el que no notas. El mejor texto es el que fluye sin obstáculos. El mejor silencio es el que te permite escuchar tus propios pensamientos.`,
  },
];

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function generateRSSFeed(siteUrl: string): string {
  const items = getAllPosts()
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/post/${post.slug}</link>
      <guid>${siteUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.content.slice(0, 200))}...</description>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog</title>
    <link>${siteUrl}</link>
    <description>Un espacio para pensar en voz alta.</description>
    <language>es</language>
${items}
  </channel>
</rss>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
