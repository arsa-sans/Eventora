/**
 * Server-side utility: Resolves shortened Google Maps URLs
 * (maps.app.goo.gl/..., goo.gl/maps/...) to their full URLs
 * by following redirects.
 *
 * This is needed because short URLs hide the coordinates,
 * and we can't resolve them client-side due to CORS.
 */
export async function resolveMapUrl(url: string): Promise<string> {
  if (!url) return "";

  const trimmed = url.trim();

  // Only resolve short URLs — full URLs don't need resolving
  const isShortUrl =
    trimmed.includes("maps.app.goo.gl") ||
    trimmed.includes("goo.gl/maps");

  if (!isShortUrl) return trimmed;

  try {
    // Follow redirects to get the final full URL
    const response = await fetch(trimmed, {
      method: "HEAD",
      redirect: "follow",
    });

    // The final URL after redirects contains the full place/coordinates
    const resolvedUrl = response.url;

    if (resolvedUrl && resolvedUrl !== trimmed) {
      console.log(`[MapURL] Resolved: ${trimmed} → ${resolvedUrl}`);
      return resolvedUrl;
    }
  } catch (error) {
    console.error("[MapURL] Failed to resolve short URL:", error);
  }

  // Fallback: return original URL if resolution fails
  return trimmed;
}
