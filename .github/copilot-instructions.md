# Copilot Instructions para Astro 5.x

##  Objetivo
Ayúdame a:
- Seguir **buenas prácticas** recomendadas para Astro.
- Implementar **funcionalidades recientes** disponibles en la versión 5.x.

##  Contexto del proyecto
- Usamos Astro 5.x (última versión: 5.13.0).
- Enfocado en **performance**, **DX** (experiencia desarrollador) y generación híbrida (SSG/SSR/islas).
- Empleamos integraciones típicas: Tailwind CSS, MDX, componentes React.

##  Buenas prácticas generales
- Minimizar JS enviado al cliente: usar `client:idle`, `client:media`, o `client:visible` solo donde sea necesario.
- Favorecer SSG y render estático siempre que sea posible.
- Usar las utilidades de optimización de assets (como `@astrojs/image`) y configurar correctamente `compressHTML: true`.
- Seguir convenciones de rutas y organización (e.g. `/src/pages`, `/src/components`).
- Escribir componentes limpios y reutilizables, aprovechar slots y props.
- Aprovechar la validación tipada (`.astro` con TypeScript) y chequear props.

##  Uso de nuevas funcionalidades en 5.x
Ayúdame a:
- Aprovechar mejoras introducidas en Astro 5.x respecto a performance y DX.
- Integrar correctamente versiones recientes de integraciones como `@astrojs/image`, `@astrojs/mdx`, `@astrojs/tailwind`, etc.

##  Cómo sugerirme qué código producir
Cuando sugieras código:
- Prefiero comentarios claros en español.
- Apunta a ejemplos breves pero completos: páginas estáticas, componentes con carga condicional, configuración optimizada.
- Si algo apunta a configuración `astro.config.mjs`, menciona por qué se hace.
- Cuando uses Tailwind, muéstralo en componentes `.astro` o ejemplos concretos.

##  Plantilla de interacciones
- Cuando quiera construir una nueva página que solo tenga JS cuando sea visible: “Crea una página `About.astro` con un componente `<Mapa>` que cargue solo en `client:visible`.”
- Si pregunto por un componente interactivo sencillo: “Quiero un componente de toggle que use `client:idle`, y que venga con comentarios explicando cuándo usar ese flag.”

# Estrictitud en respuestas
Si hay algo que no sabes con certeza, **no asumas una verdad que no es cierta**.  
Prefiero que seas más estricto en tus respuestas:  

# Reglas específicas para la web de noticias
- El contenido, títulos y metadatos deben estar en español y orientados a la comunidad hispanohablante.
- Priorizar el rendimiento y la accesibilidad: imágenes optimizadas (`@astrojs/image`), textos alternativos descriptivos y estructura semántica.
- Usar Tailwind CSS para la maquetación y estilos, evitando estilos globales que puedan interferir.
- Organizar las noticias en `/src/content/blog/` usando Markdown, MDX o mediante integración con Strapi como CMS.
- Si se usa Strapi, consumir la API REST para obtener las noticias y mostrarlas en componentes Astro, priorizando SSG cuando sea posible.
- Crear componentes reutilizables para tarjetas de noticia, listados y navegación.
- Implementar una página principal que muestre las últimas noticias y permita filtrar por categorías relevantes del juego.
- Favorecer el renderizado estático (SSG) para todas las páginas públicas, y SSR solo si es necesario por contenido dinámico.
- Añadir soporte para RSS y Open Graph para facilitar la difusión de las noticias.
- Mantener una estructura clara: `/src/pages` para páginas, `/src/components` para componentes, `/src/content` para contenido.
- Documentar en los comentarios de los componentes cualquier decisión relevante para el proyecto.
- Toma referencias de páginas web como ign.com, eurogamer.es, zonammorpg.com, 3djuegos.com para el estilo y estructura de las noticias.
