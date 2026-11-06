import 'server-only';
import { connection } from 'next/server';
import { withFilters, type SearchFilters } from '@/lib/utils';

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

async function apiFetch(path: string) {
  await connection();
  return fetch(apiUrl(path), {
    signal: AbortSignal.timeout(requestTimeoutMs),
  });
}

async function readJson<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`);
  }
  return (await response.json()) as T;
}

async function getJson<T>(path: string): Promise<T> {
  return readJson<T>(await apiFetch(path), path);
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

export async function searchCharacters(
  filters: SearchFilters,
): Promise<CharacterSummary[] | null> {
  const path = withFilters('/characters', filters);
  const response = await apiFetch(path);
  if (response.status === 400) {
    return null;
  }
  return readJson<CharacterSummary[]>(response, path);
}
