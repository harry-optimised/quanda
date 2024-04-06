import { Thought, Tag, Entry } from '../types';
import { useSelector } from 'react-redux';
import { selectToken } from '../state/profile';

const API_BASE_URL = 'http://localhost:8000/api'; //process.env.REACT_APP_API_BASE_URL;

type Entity = Thought | Tag | Entry;

type DjangoListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Entity[];
};

type DjangoRetrieveResponse = Entity;
type DjangoCreateResponse = Entity;
type DjangoUpdateResponse = Entity;

const useAPI = () => {
  const token = useSelector(selectToken);

  const callAPI = async (path: string, body?: unknown, method = 'GET'): Promise<Response | null> => {
    if (!token) {
      console.error('No token found');
      return null;
    }

    const url = `${API_BASE_URL}/${path}`;
    const headers = new Headers();
    const isFormData = body instanceof FormData;
    headers.append('Authorization', `Bearer ${token}`);

    if (!isFormData) {
      headers.append('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }

    const response = await fetch(url, {
      method,
      headers: headers,
      body: isFormData ? (body as FormData) : (body as string)
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        console.error(data);
      } catch (e) {
        console.error('No JSON data');
      }
      return null;
    }
    return response;
  };

  // Entries API
  // ###########

  interface CreateEntry {
    entry: Entry;
  }

  const createEntry = async ({ entry }: CreateEntry): Promise<Entry | null> => {
    const response = await callAPI('entries/', entry, 'POST');
    if (!response) return null;
    const data: DjangoCreateResponse = await response.json();
    return data as Entry;
  };

  interface RetrieveEntry {
    id: string;
  }

  const retrieveEntry = async ({ id }: RetrieveEntry): Promise<Entry | null> => {
    const response = await callAPI(`entries/${id}/`);
    if (!response) return null;
    const data: DjangoRetrieveResponse = await response.json();
    return data as Entry;
  };

  interface ListEntries {
    searchTerm?: string;
  }

  const listEntries = async ({ searchTerm }: ListEntries): Promise<Entry[] | null> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    const response = await callAPI(`entries/?${params.toString()}`);
    if (!response) return null;
    const data: DjangoListResponse = await response.json();
    return data.results as Entry[];
  };

  interface UpdateEntry {
    entry: Entry;
  }

  const updateEntry = async ({ entry }: UpdateEntry): Promise<Entry | null> => {
    const response = await callAPI(`entries/${entry.id}/`, entry, 'PATCH');
    if (!response) return null;
    const data: DjangoUpdateResponse = await response.json();
    return data as Entry;
  };

  interface DeleteEntry {
    id: string;
  }

  const deleteEntry = async ({ id }: DeleteEntry): Promise<void | null> => {
    const response = await callAPI(`entries/${id}/`, {}, 'DELETE');
    if (!response) return null;
    return;
  };

  // Thought API
  // ########

  interface CreateThought {
    entryId: string;
    item: Omit<Thought, 'id' | 'entry'>;
  }

  const createThought = async ({ entryId, item }: CreateThought): Promise<Thought | null> => {
    const response = await callAPI(`entries/${entryId}/add-thought/`, item, 'POST');
    if (!response) return null;
    const data: Thought = await response.json();
    return data;
  };

  interface UpdateThought {
    entryId: string;
    thoughtId: string;
    item: Partial<Thought>;
  }

  const updateThought = async ({ entryId, thoughtId, item }: UpdateThought): Promise<Thought | null> => {
    const response = await callAPI(`entries/${entryId}/edit-thought/${thoughtId}/`, item, 'PUT');
    if (!response) return null;
    const data: Thought = await response.json();
    return data;
  };

  interface DeleteThought {
    entryId: string;
    thoughtId: string;
  }

  const deleteThought = async ({ entryId, thoughtId }: DeleteThought): Promise<void | null> => {
    const response = await callAPI(`entries/${entryId}/delete-thought/${thoughtId}/`, {}, 'DELETE');
    if (!response) return null;
    return;
  };

  // Tag API
  // #######

  interface CreateTag {
    tag: Omit<Tag, 'id'>;
  }

  const createTag = async ({ tag }: CreateTag): Promise<Tag | null> => {
    const response = await callAPI('tags/', tag, 'POST');
    if (!response) return null;
    const data: DjangoCreateResponse = await response.json();
    return data as Tag;
  };

  const listTags = async (): Promise<Tag[] | null> => {
    const response = await callAPI('tags/');
    if (!response) return null;
    const data: DjangoListResponse = await response.json();
    return data.results as Tag[];
  };

  interface DeleteTag {
    id: string;
  }

  const deleteTag = async ({ id }: DeleteTag): Promise<void | null> => {
    const response = await callAPI(`tags/${id}/`, {}, 'DELETE');
    if (!response) return null;
    return;
  };

  return {
    createEntry,
    updateEntry,
    retrieveEntry,
    deleteEntry,
    listEntries,
    createThought,
    updateThought,
    deleteThought,
    createTag,
    listTags,
    deleteTag
  };
};

export default useAPI;
