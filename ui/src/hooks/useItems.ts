import { useState, useEffect } from 'react';
import { Item } from '../types';
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
