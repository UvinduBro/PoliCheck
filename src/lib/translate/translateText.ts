/**
 * Best-effort machine translation for user-submitted research content (biographies, case
 * descriptions, claim text) via MyMemory's free translation API — no API key required, so
 * it can be called directly from the browser with nothing to deploy or keep secret. This is
 * NOT enterprise-grade translation: quality varies by language pair and sentence, so callers
 * must always present the result as a machine translation with a link back to the original
 * (see TranslatedText) rather than as an equally authoritative source-cited fact.
 */

const CACHE_PREFIX = "politician-watch-translate:";
const memoryCache = new Map<string, string>();
// MyMemory's free tier caps requests around 500 bytes of query text.
const MAX_CHUNK_CHARS = 450;

function cacheKey(text: string, targetLang: string): string {
  return `${targetLang}:${text}`;
}

function chunk(text: string, size: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

async function translateChunk(text: string, targetLang: "si" | "ta"): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translation request failed (${res.status})`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (typeof translated !== "string" || !translated) throw new Error("Translation response was empty");
  return translated;
}

export async function translateText(text: string, targetLang: "si" | "ta"): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const key = cacheKey(trimmed, targetLang);
  const cached = memoryCache.get(key);
  if (cached) return cached;

  try {
    const stored = window.localStorage.getItem(CACHE_PREFIX + key);
    if (stored) {
      memoryCache.set(key, stored);
      return stored;
    }
  } catch {
    // localStorage unavailable (private browsing, quota) — continue without cache.
  }

  const chunks = chunk(trimmed, MAX_CHUNK_CHARS);
  const translatedChunks = await Promise.all(chunks.map((c) => translateChunk(c, targetLang)));
  const result = translatedChunks.join(" ");

  memoryCache.set(key, result);
  try {
    window.localStorage.setItem(CACHE_PREFIX + key, result);
  } catch {
    // Storage full or unavailable — the in-memory cache still works for this session.
  }
  return result;
}
