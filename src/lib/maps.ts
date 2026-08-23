/**
 * Converte um link do Google Maps (compartilhado, curto ou completo) em uma URL
 * incorporável de panorama 360° (Street View), sem necessidade de API key.
 *
 * Aceita:
 * - URLs já incorporáveis (`output=svembed`, `/maps/embed`) — retornadas como estão
 * - Links de compartilhamento (`maps.app.goo.gl/...`) — usa as coordenadas cadastradas
 * - URLs completas com `@lat,lng` ou `!3dlat!4dlng` — extrai as coordenadas
 */
export function panoramaEmbedUrl(
  rawUrl?: string | null,
  latitude?: string | null,
  longitude?: string | null,
): string | null {
  const url = (rawUrl ?? "").trim();

  if (url && (url.includes("output=svembed") || url.includes("/maps/embed"))) {
    return url;
  }

  const coords = extractCoords(url) ?? fallbackCoords(latitude, longitude);
  if (!coords) return null;

  return `https://www.google.com/maps?q=&layer=c&cbll=${coords}&cbp=12,0,0,0,0&hl=pt-BR&output=svembed`;
}

/** Link para abrir o panorama em tela cheia no Google Maps. */
export function panoramaExternalUrl(
  rawUrl?: string | null,
  latitude?: string | null,
  longitude?: string | null,
): string | null {
  const url = (rawUrl ?? "").trim();
  if (url && !url.includes("output=svembed") && !url.includes("/maps/embed")) return url;

  const coords = extractCoords(url) ?? fallbackCoords(latitude, longitude);
  if (!coords) return url || null;
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coords}`;
}

function extractCoords(url: string): string | null {
  if (!url) return null;
  const cbll = url.match(/cbll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (cbll) return `${cbll[1]},${cbll[2]}`;
  const bang = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (bang) return `${bang[1]},${bang[2]}`;
  const at = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (at) return `${at[1]},${at[2]}`;
  return null;
}

function fallbackCoords(latitude?: string | null, longitude?: string | null): string | null {
  const lat = (latitude ?? "").trim();
  const lng = (longitude ?? "").trim();
  if (!lat || !lng) return null;
  return `${lat},${lng}`;
}
