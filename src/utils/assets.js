/**
 * Resolves static asset URLs relative to the configured Vite base URL.
 * Works seamlessly in both local development and GitHub Pages subpaths.
 */
export function resolveAssetUrl(path) {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
