import apiList from "@/apiList";

function normalizeOrigin(input?: string) {
  const raw = (input || "").trim().replace(/\/+$/, "");
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function deriveUploadsOrigin() {
  const explicit = process.env.NEXT_PUBLIC_UPLOADS_ORIGIN || process.env.UPLOADS_ORIGIN;
  if (explicit?.trim()) return normalizeOrigin(explicit);

  const apiBase = normalizeOrigin(apiList.base);
  return apiBase.replace(/\/api$/i, "");
}

export const UPLOADS_ORIGIN = deriveUploadsOrigin();

export function resolveMediaUrl(src?: string | null, fallback = "") {
  const value = src?.trim();
  if (!value) return fallback;
  if (value.startsWith("data:") || value.startsWith("blob:")) return value;

  const rewritePath = (pathname: string, suffix = "") => {
    if (!pathname.startsWith("/uploads/")) return "";
    return `${UPLOADS_ORIGIN}${pathname}${suffix}`;
  };

  try {
    const parsed = new URL(value);
    const rewritten = rewritePath(parsed.pathname, `${parsed.search}${parsed.hash}`);
    return rewritten || value;
  } catch {
    const normalized = value.startsWith("uploads/") ? `/${value}` : value;
    const rewritten = rewritePath(normalized);
    if (rewritten) return rewritten;

    if (normalized.startsWith("/api/uploads/")) {
      return `${UPLOADS_ORIGIN}${normalized.replace(/^\/api/, "")}`;
    }

    return value;
  }
}
