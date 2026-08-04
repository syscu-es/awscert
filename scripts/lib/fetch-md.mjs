const BASE = 'https://docs.aws.amazon.com/aws-certification/latest';

export async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (kb-scraper)' } });
  if (!res.ok) {
    throw new Error(`GET ${url} -> ${res.status}`);
  }
  return res.text();
}

export function resolveUrl(base, relative) {
  return new URL(relative, base).toString();
}

export { BASE };
