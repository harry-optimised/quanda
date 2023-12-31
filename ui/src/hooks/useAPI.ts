import { DjangoBlobResponse, Item, Project, SetLink, Tag } from '../types';
import { useSelector } from 'react-redux';
import { selectToken } from '../state/profile';
import { type } from 'os';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

type Entity = Item | Project | Tag;

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

  const callAPI = async (path: string, project: number, body?: unknown, method = 'GET'): Promise<Response | null> => {
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

    const requiresProject = !path.includes('project');
    if (requiresProject) {
      headers.append('Quanda-Project', `${project}`);
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

  // Item API
  // ########

  interface CreateItem {
    item: Omit<Item, 'id'>;
    project: number;
  }

  const createItem = async ({ item, project }: CreateItem): Promise<Item | null> => {
    const response = await callAPI('items/', project, item, 'POST');
    if (!response) return null;
    const data: DjangoCreateResponse = await response.json();
    return data as Item;
  };

  interface RetrieveItem {
    id: number;
    project: number;
  }

  const retrieveItem = async ({ id, project }: RetrieveItem): Promise<Item | null> => {
    const response = await callAPI(`items/${id}/`, project);
    if (!response) return null;
    const data: DjangoRetrieveResponse = await response.json();
    return data as Item;
  };

  interface ListItems {
    searchTerm?: string;
    project: number;
  }

  const listItems = async ({ searchTerm, project }: ListItems): Promise<Item[] | null> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    const response = await callAPI(`items/?${params.toString()}`, project);
    if (!response) return null;
    const data: DjangoListResponse = await response.json();
    return data.results as Item[];
  };

  interface UpdateItem {
    item: Item;
    project: number;
  }

  const updateItem = async ({ item, project }: UpdateItem): Promise<Item | null> => {
    const response = await callAPI(`items/${item.id}/`, project, item, 'PATCH');
    if (!response) return null;
    const data: DjangoUpdateResponse = await response.json();
    return data as Item;
  };

  interface AddLink {
    item: Item;
    link: SetLink;
    project: number;
  }

  const addLink = async ({ item, link, project }: AddLink): Promise<Item | null> => {
    const response = await callAPI(`items/${item.id}/add_link/`, project, link, 'POST');
    if (!response) return null;
    const data: DjangoUpdateResponse = await response.json();
    return data as Item;
  };

  interface RemoveLink {
    item: Item;
    link: SetLink;
    project: number;
  }

  const removeLink = async ({ item, link, project }: RemoveLink): Promise<Item | null> => {
    const response = await callAPI(`items/${item.id}/remove_link/`, project, link, 'POST');
    if (!response) return null;
    const data: DjangoUpdateResponse = await response.json();
    return data as Item;
  };

  interface DeleteItem {
    id: number;
    project: number;
  }

  const deleteItem = async ({ id, project }: DeleteItem): Promise<void | null> => {
    const response = await callAPI(`items/${id}/`, project, {}, 'DELETE');
    if (!response) return null;
    return;
  };

  // Tag API
  // #######

  interface CreateTag {
    tag: Omit<Tag, 'id'>;
    project: number;
  }

  const createTag = async ({ tag, project }: CreateTag): Promise<Tag | null> => {
    const response = await callAPI('tags/', project, tag, 'POST');
    if (!response) return null;
    const data: DjangoCreateResponse = await response.json();
    return data as Tag;
  };

  interface ListTags {
    project: number;
  }

  const listTags = async ({ project }: ListTags): Promise<Tag[] | null> => {
    const response = await callAPI('tags/', project);
    if (!response) return null;
    const data: DjangoListResponse = await response.json();
    return data.results as Tag[];
  };

  interface DeleteTag {
    id: number;
    project: number;
  }

  const deleteTag = async ({ id, project }: DeleteTag): Promise<void | null> => {
    const response = await callAPI(`tags/${id}/`, project, {}, 'DELETE');
    if (!response) return null;
    return;
  };

  // Project API
  // ###########

  const listProjects = async (): Promise<Project[] | null> => {
    const response = await callAPI('projects/', -1);
    if (!response) return null;
    const data: DjangoListResponse = await response.json();
    return data.results as Project[];
  };

  const exportProject = async (project: number): Promise<DjangoBlobResponse | null> => {
    const response = await callAPI(`projects/${project}/export/`, project);
    if (!response) return null;

    const contentDisposition = response.headers.get('Content-Disposition');
    console.log(contentDisposition);
    const filename = contentDisposition?.split('filename=')[1].replace(/"/g, '') || 'exported_data.pkl';
    return {
      blob: await response.blob(),
      name: filename
    };
  };

  const importProject = async (project: number, file: File): Promise<Project | null> => {
    const formData = new FormData();
    formData.append('file', file);
    await callAPI(`projects/${project}/ingest/`, project, formData, 'POST');
    return null;
  };

  return {
    createItem,
    updateItem,
    addLink,
    removeLink,
    retrieveItem,
    deleteItem,
    listProjects,
    exportProject,
    importProject,
    listItems,
    createTag,
    listTags,
    deleteTag
  };
};

export default useAPI;
