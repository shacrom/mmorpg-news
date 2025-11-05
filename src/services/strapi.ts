// Configuración de Strapi
// En producción (Docker): usa el nombre del contenedor y puerto interno
// En desarrollo local: usa localhost con el puerto mapeado
const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://strapi-zona:1338';

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
export async function getNews(token: any, page = 1, pageSize = 10): Promise<StrapiResponse<StrapiNews[]>> {
  try {
    // const url = `${STRAPI_URL}/news?_limit=${pageSize}&_start=${(page - 1) * pageSize}&_sort=publishedAt:DESC`;
    const url = `${STRAPI_URL}/news`;
    console.log('[Strapi] Fetching news from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[Strapi] Response status:', response.status);

    if (!response.ok) {
      console.error('[Strapi] Error fetching news:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('[Strapi] Error body:', errorText);
      return { data: [], meta: {} };
    }

    const rawData = await response.json();
    console.log('[Strapi] Response data:', JSON.stringify(rawData, null, 2));
    
    // Strapi v3 devuelve un array directo, no { data: [...] }
    // Convertimos al formato esperado
    const data = Array.isArray(rawData) ? rawData : [];
    return { 
      data: data.map((item: any) => ({
        id: item.id,
        attributes: item
      })),
      meta: {} 
    };
  } catch (error) {
    console.error('[Strapi] Error connecting to Strapi:', error);
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
    // Strapi v3 usa rutas sin /api/
    // El Content Type se llama "test"
    const response = await fetch(
      `${STRAPI_URL}/test?slug=${slug}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const rawData = await response.json();
    const data = Array.isArray(rawData) ? rawData : [];
    
    if (data.length === 0) return null;
    
    return {
      id: data[0].id,
      attributes: data[0]
    };
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
    // Strapi v3 usa rutas sin /api/
    // El Content Type se llama "test"
    const response = await fetch(
      `${STRAPI_URL}/test?featured=true&_limit=${limit}&_sort=publishedAt:DESC`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const rawData = await response.json();
    const data = Array.isArray(rawData) ? rawData : [];
    
    return data.map((item: any) => ({
      id: item.id,
      attributes: item
    }));
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
  // En Strapi v3, cover_image puede ser un objeto directo o tener estructura .data
  const coverImage = news.attributes.cover_image?.data?.attributes?.url || 
                     (news.attributes.cover_image as any)?.url;
  
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
