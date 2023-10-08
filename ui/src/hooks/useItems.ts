import { useState, useEffect } from 'react';

export type Link = {
  name: string;
  url: string;
};

export type Tag = {
  name: string;
  color: 'blue' | 'green' | 'red';
};

export type Item = {
  id: number;
  header: string;
  body: string;
  confidence: number;
  tags: Tag[];
  links: Link[];
  frozen: boolean;
  priority: boolean;
  edges: number[];
  system: string;
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
            header:
              'Should we have the concept of a system which represents a design/solution?',
            body: `User could tie requirements (or QA/statements) to the system which is an 
            organising element. Like tags but deliberately structured. The user can then compose 
            hierarchies of systems. I feel like if that information is captured, Quanda could do 
            some intelligent work like capture requirement risk. Especially using the 'Implements' 
            relation.`,
            confidence: 80,
            tags: [
              { name: 'hunch', color: 'blue' } as Tag,
              { name: 'mvp', color: 'red' } as Tag
            ],
            links: [
              {
                name: 'Some link',
                url: 'https://www.google.com'
              }
            ],
            frozen: false,
            priority: false,
            edges: [],
            system: 'product'
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
