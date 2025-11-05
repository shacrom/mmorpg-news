const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_USER = import.meta.env.STRAPI_USER;
const STRAPI_PASS = import.meta.env.STRAPI_PASS;
const COOKIE_NAME = 'strapi_jwt';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

async function getStrapiToken(): Promise<string | null> {
  try {
    console.log(STRAPI_USER, STRAPI_PASS);
    const response = await fetch(`${STRAPI_URL}/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: STRAPI_USER,
        password: STRAPI_PASS
      })
    });
    
    if (!response.ok) {
      console.error('Error en autenticación con Strapi:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.jwt;
  } catch (error) {
    console.error('Error obteniendo token de Strapi:', error);
    return null;
  }
}

export async function onRequest(context: any, next: any) {
  const { cookies } = context;
  
  // Verificar si ya tenemos un token válido en la cookie
  let token = cookies.get(COOKIE_NAME)?.value;
  
  // Si no hay token, obtener uno nuevo de Strapi
  if (!token) {
    console.log('Token no encontrado, obteniendo nuevo token de Strapi...');
    token = await getStrapiToken();
    
    if (token) {
      // Guardar el token en una cookie segura
      cookies.set(COOKIE_NAME, token, {
        path: '/',
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      console.log('Token guardado en cookie con éxito');
    } else {
      console.error('No se pudo obtener token de Strapi');
    }
  }
  
  // Continuar con la siguiente función middleware o la página
  return next();
}