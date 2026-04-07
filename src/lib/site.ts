export const SITE_DOMAIN = import.meta.env.VITE_APP_DOMAIN || 'https://adhello.ai';

const normalizedDomain = SITE_DOMAIN.endsWith('/') ? SITE_DOMAIN.slice(0, -1) : SITE_DOMAIN;
export const SITE_ORIGIN = normalizedDomain.startsWith('http') ? normalizedDomain : `https://${normalizedDomain}`;
export const SITE_NAME = 'AdHello.ai';
export const SITE_DEFAULT_IMAGE = `${SITE_ORIGIN}/favicon-512.png`;
