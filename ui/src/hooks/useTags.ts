import { useState, useEffect } from 'react';

export type TagColour =
  | 'teal'
  | 'blue'
  | 'purple'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'neutral';

export type Tag = {
  id: number;
  name: string;
  description: string;
  colour: TagColour;
};

export type TagAPIResponse = Tag[];

type UseTagsResponse = {
  tags: Tag[] | null;
  isLoading: boolean;
  error: Error | null;
};

const useTags = (): UseTagsResponse => {
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tags/`);
        const data = (await response.json()) as TagAPIResponse;
        setTags(data);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { tags, isLoading, error };
};

export default useTags;
