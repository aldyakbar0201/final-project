'use client';

import { useState, useEffect } from 'react';
import { getStores } from '@/lib/api';
import type { Store } from '@/lib/types';

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      try {
        const data = await getStores();
        setStores(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to load stores');
        // Fallback data for demo purposes
        setStores([
          { id: 1, name: 'Main Store' },
          { id: 2, name: 'Branch Store' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  return { stores, isLoading, error };
}
