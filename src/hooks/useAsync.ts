import { useCallback, useEffect, useState } from 'react';

function withAsyncTimeout<T>(promise: Promise<T>, timeoutMs = 25_000): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error('A Husky demorou demais para carregar. Atualize a tela ou confira a conexao com o Supabase.')),
      timeoutMs,
    );
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  }) as Promise<T>;
}

export function useAsync<T>(factory: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await withAsyncTimeout(factory());
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
