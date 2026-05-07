const RAW_BASE_URL = import.meta.env.BASE_URL || "/";

export const APP_BASE_PATH = RAW_BASE_URL === "/" ? "" : RAW_BASE_URL.replace(/\/$/, "");

export function withBasePath(path: string) {
  if (!path) return RAW_BASE_URL;
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${RAW_BASE_URL}${normalizedPath}`;
}
