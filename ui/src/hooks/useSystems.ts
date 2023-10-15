import { useState, useEffect } from 'react';

export type System = {
  id: number;
  name: string;
  description: string;
};

export type SystemAPIResponse = System[];

type UseSystemsResponse = {
  systems: System[] | null;
  isLoading: boolean;
  error: Error | null;
};

const useSystems = (): UseSystemsResponse => {
  const [systems, setSystems] = useState<System[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/systems/`);
        const data = (await response.json()) as SystemAPIResponse;
        setSystems(data);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { systems, isLoading, error };
};

export default useSystems;
