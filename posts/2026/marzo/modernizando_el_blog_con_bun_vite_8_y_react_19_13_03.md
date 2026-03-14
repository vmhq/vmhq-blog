---
title: Modernizando el blog con Bun, Vite 8 y React 19
slug: modernizando-el-blog-con-bun-vite-8-y-react-19
date: 2026-03-13
time: 23:23:20
---
Hay una diferencia entre mantener un proyecto funcionando y mantenerlo vivo. Lo primero basta para que no se caiga. Lo segundo exige revisar herramientas, dependencias y decisiones que alguna vez fueron razonables, pero que con el tiempo empiezan a quedarse atrás.

Este blog pasó por esa segunda etapa: una modernización deliberada, cuidada y sin romper lo esencial.

## Qué se actualizó

La migración incluyó casi todo el stack principal:

- **Bun** como package manager y runtime principal
- **React 19**
- **Vite 8**
- **Vitest 4**
- **Tailwind CSS 4**
- Integración de **Vercel Analytics**
- Integración de **Vercel Speed Insights**

Además, se corrigieron piezas del proyecto que habían quedado desfasadas con cambios previos, como tests antiguos y documentación que ya no reflejaba el estado real del repositorio.

## Por qué usar Bun

Bun no cambia lo que el blog hace, pero sí mejora la experiencia de mantenerlo.

Las ventajas más claras fueron:

- instalación de dependencias más rápida
- lockfile más simple
- comandos consistentes en desarrollo, test y build
- mejor alineación con el deploy en Vercel

En un blog pequeño, la diferencia de rendimiento no redefine el proyecto. Pero sí reduce fricción. Y menos fricción significa menos excusas para posponer mantenimiento.

## Cómo se hizo sin romper nada

La clave no fue actualizar todo de golpe por impulso. Fue hacerlo por fases.

### Fase 1: dependencias seguras

Primero se actualizaron paquetes de bajo riesgo:

- `react-markdown`
- `react-helmet-async`
- `typescript`
- `@vitejs/plugin-react-swc`

El objetivo era limpiar la base antes de tocar piezas más sensibles.

### Fase 2: React 19

Después se migró React y React DOM a la versión 19.

En este proyecto el cambio fue limpio, porque el uso de React es simple: renderizado directo, sin SSR, sin patrones extraños y sin dependencias especialmente frágiles.

### Fase 3: Vite 8 y Vitest 4

Luego se actualizaron el bundler y el test runner.

Aquí apareció el tipo de problema que suele romper CI sin romper necesariamente la app: **tests viejos** que seguían esperando funciones que ya no existían desde una refactorización previa.

No era un error del nuevo stack. Era deuda técnica vieja revelándose.

Eso también es una mejora: cuando modernizas herramientas, dejan de esconderse cosas desactualizadas.

### Fase 4: limpieza del plugin de React

Vite 8 recomendó dejar atrás `@vitejs/plugin-react-swc` para este caso concreto. Se cambió por `@vitejs/plugin-react` para alinear el proyecto con el camino más limpio y soportado por el ecosistema actual.

### Fase 5: Tailwind CSS 4

Esta fue la parte más delicada.

No porque el blog tuviera estilos complejos, sino porque Tailwind 4 cambió varias piezas del flujo de configuración. La migración incluyó:

- actualizar `tailwindcss`
- mover PostCSS a `@tailwindcss/postcss`
- eliminar `autoprefixer`
- adaptar la entrada CSS al nuevo formato
- conservar la configuración del tema en modo compatible para no romper los tokens de color ni el modo oscuro

La decisión importante fue no reescribir todo por purismo. Primero había que dejarlo estable.

## Beneficios concretos

Después de la migración, el proyecto quedó con varias mejoras reales:

### 1. Stack moderno y coherente

El blog ya no depende de versiones antiguas en piezas clave del frontend. Eso facilita mantenimiento futuro y reduce la probabilidad de arrastrar configuraciones obsoletas.

### 2. Menos deuda invisible

Actualizar no solo trae features. También obliga a enfrentar tests viejos, documentación desalineada y configuraciones heredadas. Todo eso se corrigió en el proceso.

### 3. Deploy más limpio en Vercel

El proyecto quedó configurado explícitamente para desplegar con Bun:

- `bun install`
- `bun run build`
- salida en `dist`
- rewrite SPA a `index.html`

Eso reduce ambigüedad entre entorno local y producción.

### 4. Observabilidad básica integrada

Con Vercel Analytics y Speed Insights, el blog ahora puede mostrar:

- páginas vistas
- visitantes
- fuentes de tráfico
- métricas reales de rendimiento

No hace al blog mejor por sí mismo, pero sí vuelve más fácil entender cómo se comporta una vez publicado.

### 5. Documentación más honesta

Se actualizaron `README.md`, `AGENTS.md` y `CLAUDE.md` para reflejar el stack actual. Eso importa más de lo que parece: un proyecto con docs falsas siempre envejece peor.

## Lo que no cambió

No hubo una obsesión por cambiar el resultado visible solo porque sí.

El blog sigue siendo lo que quería ser:

- sobrio
- legible
- minimalista
- centrado en el texto

La modernización fue de infraestructura, no de personalidad.

---

Actualizar un proyecto pequeño puede parecer innecesario. Pero a veces esos proyectos merecen lo mismo que uno grande: herramientas actuales, menos fricción y una base sana para seguir creciendo.

En este caso, no se trató de perseguir la novedad. Se trató de dejar el blog en un estado donde mantenerlo sea simple otra vez.
