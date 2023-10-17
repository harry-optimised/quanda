import { useState, useEffect } from 'react';

export type Item = {
  id: number;
  primary: string;
  secondary: string;
  confidence: number;
  tags: number[];
  evidence: number[];
  frozen: boolean;
  priority: boolean;
  system: number;
};

export type ItemAPIDetailResponse = Item;
export type ItemAPIListResponse = Item[];

type UseItemsProps = {
  items: Item[];
  isLoading: boolean;
  error: Error | null;
};

const URL = 'http://localhost:8000/api/items';

const useItems = (id?: number): UseItemsProps => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await fetch(`${URL}/${id}/`);
          const data = (await response.json()) as ItemAPIDetailResponse;
          setItems([data]);
          setIsLoading(false);
        } else {
          const response = await fetch(`${URL}/`);
          const data = (await response.json()) as ItemAPIListResponse;
          setItems(data);
          setIsLoading(false);
        }
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
