import { useState, useEffect } from "react";


export type Item = {
  id: number;
  header: string;  
};

export type ItemAPIResponse = Item[];

type UseItemsProps = {
  items: Item[] | null;
  isLoading: boolean;
  error: Error | null;
};

const useItems = (primary: number): UseItemsProps => {
  const [items, setItems] = useState<Item[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`http://localhost:8000/api/tasks/${primary}/`);
        //const data = (await response.json()) as ItemAPIResponse;
        const data = [
          {
            id: 1,
            header: "Task 1",
          },
          {
            id: 2,
            header: "Task 2",
          },
          {
            id: 3,
            header: "Task 3",
          }
        ];

        setItems(data);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [primary]);

  return { items, isLoading, error };
};

export default useItems;
