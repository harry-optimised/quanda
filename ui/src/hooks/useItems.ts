import { useState, useEffect } from 'react';

export type Item = {
  id: number;
  primary: string;
  secondary: string;
  confidence: number;
  tags: number[];
  evidence: number[];
  frozen: boolean;
  urgency: string;
  system: number;
};

export type ItemAPIResponse = Item;

type UseItemsProps = {
  items: Item[] | null;
  isLoading: boolean;
  error: Error | null;
};

const useItems = (id: number): UseItemsProps => {
  const [items, setItems] = useState<Item[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/items/${id}/`);
        const data = (await response.json()) as ItemAPIResponse;
        setItems([data]);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { items, isLoading, error };
};

export default useItems;
