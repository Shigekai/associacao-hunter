import 'server-only';
import { connection } from 'next/server';

const requestTimeoutMs = 60_000;

export type Arc = {
  id: number;
  name: string;
  startChapter: number;
  endChapter: number | null;
};

export type NenCategory = {
  id: number;
  name: string;
};

export type Affiliation = {
  id: number;
  name: string;
  type: string;
};

export type CharacterSummary = {
  id: number;
  firstName: string;
  lastName: string | null;
  birthDate: string | null;
  sex: string | null;
  birthplace: string | null;
  nenCategory: string | null;
  affiliations: string[];
  hatsus: string[];
  isLicensedHunter: boolean;
};

function apiUrl(path: string) {
  const baseUrl = process.env.API_URL?.replace(/\/+$/, '');
  if (!baseUrl) {
    throw new Error('Missing environment variable: API_URL');
  }
  return `${baseUrl}${path}`;
}

export async function isApiReady() {
  await connection();
  const url = apiUrl('/health');
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function getJson<T>(path: string): Promise<T> {
  await connection();
  const response = await fetch(apiUrl(path), {
    signal: AbortSignal.timeout(requestTimeoutMs),
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`);
  }
  return (await response.json()) as T;
}

export function getArcs() {
  return getJson<Arc[]>('/arcs');
}

export function getNenCategories() {
  return getJson<NenCategory[]>('/nen-categories');
}

export function getAffiliations() {
  return getJson<Affiliation[]>('/affiliations');
}

export function searchCharacters(name: string) {
  return getJson<CharacterSummary[]>(
    `/characters?${new URLSearchParams({ name })}`,
  );
}
