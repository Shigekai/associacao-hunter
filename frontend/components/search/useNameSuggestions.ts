import { useEffect, useState } from 'react';
import type { NameSuggestions } from '@/app/api/hunters/suggestions/route';

const debounceMs = 300;

export type SuggestionsResult = NameSuggestions & { query: string };

export function useNameSuggestions(term: string, enabled: boolean) {
  const [result, setResult] = useState<SuggestionsResult | null>(null);
  const query = term.trim();

  useEffect(() => {
    if (!enabled || !query) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/hunters/suggestions?${new URLSearchParams({ name: query })}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Name suggestions failed: ${response.status}`);
        }
        const suggestions = (await response.json()) as NameSuggestions;
        if (!controller.signal.aborted) {
          setResult({ query, ...suggestions });
        }
      } catch {
        if (!controller.signal.aborted) {
          setResult(null);
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled]);

  return { result, clear: () => setResult(null) };
}
