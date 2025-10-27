// Configuración de Strapi
// En producción (Docker): usa el nombre del contenedor y puerto interno
// En desarrollo local: usa localhost con el puerto mapeado
const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://strapi-zona:1338';

// Interfaz para las noticias de Strapi
export interface StrapiNews {
  id: number;
  attributes: {
    title: string;
    summary: string;
    publishedAt: string;
    source_url: string;
    slug: string;
    content: string;
    category: string;
    tags: string;
    cover_image: {
      data: {
        id: number;
        attributes: {
          url: string;
          name: string;
          alternativeText?: string;
          width: number;
          height: number;
        };
      } | null;
    };
    seo_description: string;
    featured: boolean;
    views: number;
    seo_title: string;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Obtiene todas las noticias publicadas desde Strapi
 * @param page - Número de página (para paginación)
 * @param pageSize - Cantidad de noticias por página
 * @returns Lista de noticias
 */
export async function getNews(page = 1, pageSize = 10): Promise<StrapiResponse<StrapiNews[]>> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/news?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc&populate=cover_image`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Error fetching news from Strapi:', response.status);
      return { data: [], meta: {} };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error connecting to Strapi:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Obtiene una noticia específica por su slug
 * @param slug - El slug de la noticia
 * @returns La noticia o null si no existe
 */
export async function getNewsBySlug(slug: string): Promise<StrapiNews | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/news?filters[slug][$eq]=${slug}&populate=cover_image`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: StrapiResponse<StrapiNews[]> = await response.json();
    return data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return null;
  }
}

/**
 * Obtiene las noticias destacadas
 * @param limit - Cantidad máxima de noticias destacadas
 * @returns Lista de noticias destacadas
 */
export async function getFeaturedNews(limit = 5): Promise<StrapiNews[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/news?filters[featured][$eq]=true&pagination[pageSize]=${limit}&sort=publishedAt:desc&populate=cover_image`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: StrapiResponse<StrapiNews[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return [];
  }
}

/**
 * Formatea la fecha de publicación a formato legible en español
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada (ej: "Hace 2 horas", "Hace 3 días")
 */
export function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}

/**
 * Obtiene la URL completa de una imagen de Strapi
 * @param news - La noticia con la imagen
 * @returns URL completa de la imagen o imagen por defecto
 */
export function getImageUrl(news: StrapiNews): string {
  const coverImage = news.attributes.cover_image?.data?.attributes?.url;
  
  if (!coverImage) {
    // Imagen por defecto si no hay cover_image
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop';
  }
  
  // Si la URL ya es completa (http/https), la devolvemos tal cual
  if (coverImage.startsWith('http')) {
    return coverImage;
  }
  
  // Si es una ruta relativa, la combinamos con la URL de Strapi
  return `${STRAPI_URL}${coverImage}`;
}
