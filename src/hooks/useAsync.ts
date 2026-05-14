import { useCallback, useEffect, useState } from 'react';

export function useAsync<T>(factory: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await factory();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ops! A Husky tropeçou em algum ingrediente.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute().catch(() => undefined);
  }, [execute]);

  return { data, loading, error, reload: execute, setData };
}
