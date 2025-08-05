import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

// Fast query hook with automatic optimization
export function useFastQuery<T = unknown>(options: UseQueryOptions<T>) {
  const optimizedOptions = useMemo(() => ({
    ...options,
    staleTime: 2 * 60 * 1000, // 2 minutes cache for fast loading
    cacheTime: 5 * 60 * 1000, // 5 minutes memory cache
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 1, // Reduce retry attempts for faster failure
  }), [options.queryKey]);

  return useQuery(optimizedOptions);
}