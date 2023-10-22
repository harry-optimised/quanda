import { useState, useEffect } from 'react';

export type Link = {
  relation_type: string;
  to_item: number;
  primary?: string;
  secondary?: string;
  tags?: number[];
};

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
  links: Link[];
};

export type ItemAPIDetailResponse = Item;

type UseItemsProps = {
  item: Item | null;
  isLoading: boolean;
  error: Error | null;
};

const URL = 'http://localhost:8000/api/items';

const useItems = (id: number): UseItemsProps => {
  const [item, setItems] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/${id}/`);
        const data = (await response.json()) as ItemAPIDetailResponse;
        setItems(data);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { item, isLoading, error };
};

export default useItems;
