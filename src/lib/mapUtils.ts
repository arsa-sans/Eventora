/**
 * Converts any Google Maps URL into an embeddable iframe URL
 * that shows a RED PIN at the exact location.
 *
 * The key format that shows a pin:
 *   https://maps.google.com/maps?q=LAT,LNG&z=17&output=embed
 *
 * Supported input formats:
 * - Place URL: google.com/maps/place/Place+Name/@-6.123,106.456,17z/...
 * - Coordinate URL: google.com/maps/@-6.123,106.456,15z
 * - Query URL: google.com/maps?q=-6.123,106.456
 * - Embed URL: google.com/maps/embed?pb=... (returned as-is)
 * - Search URL: google.com/maps/search/Place+Name
 * - Short URL: maps.app.goo.gl/... (should be resolved server-side first)
 */
export function toEmbedMapUrl(url: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  // 1. Already an embed URL → use as-is
  if (trimmed.includes("/maps/embed") || trimmed.includes("output=embed")) {
    return trimmed;
  }

  // 2. Extract coordinates — the @lat,lng pattern is the most reliable
  const coordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    // Use q=lat,lng to get a RED PIN at exact coordinates
    return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  }

  // 3. Check for coordinates in ?q= parameter
  try {
    const urlObj = new URL(trimmed);
    const q = urlObj.searchParams.get("q");
    if (q) {
      // Check if q contains coordinates like "-6.123,106.456"
      const qCoordMatch = q.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
      if (qCoordMatch) {
        return `https://maps.google.com/maps?q=${qCoordMatch[1]},${qCoordMatch[2]}&z=17&output=embed`;
      }
      // Otherwise use the query as a place search
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=17&output=embed`;
    }
  } catch {
    // Not a valid URL
  }

  // 4. Extract from /maps/search/Place+Name
  const searchMatch = trimmed.match(/\/maps\/search\/([^/?]+)/);
  if (searchMatch) {
    const searchTerm = decodeURIComponent(searchMatch[1].replace(/\+/g, " "));
    return `https://maps.google.com/maps?q=${encodeURIComponent(searchTerm)}&z=17&output=embed`;
  }

  // 5. Extract from /maps/place/Place+Name (without coordinates)
  const placeMatch = trimmed.match(/\/maps\/place\/([^/@?]+)/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&z=17&output=embed`;
  }

  // 6. Short URL fallback - these SHOULD have been resolved server-side already
  //    but if not, we try to use the URL as-is in an embed query
  if (
    trimmed.includes("maps.app.goo.gl") ||
    trimmed.includes("goo.gl/maps")
  ) {
    // Can't extract coords from short URL client-side, use as search query
    return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&z=17&output=embed`;
  }

  // 7. Any other google maps URL
  if (trimmed.includes("google.com/maps")) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&z=17&output=embed`;
  }

  // 8. Non-Google URL → return as-is
  return trimmed;
}
