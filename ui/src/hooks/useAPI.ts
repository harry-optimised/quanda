import { Item, Project, SetLink, Tag } from '../types';
import { useSelector } from 'react-redux';
import { selectCurrentProject } from '../state/projects';
import { selectToken } from '../state/profile';

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
  const project = useSelector(selectCurrentProject);
  const token = useSelector(selectToken);

  const callAPI = async (
    path: string,
    body?: unknown,
    overrideProject?: number,
    method = 'GET'
  ): Promise<Response | null> => {
    const requiresProject = !path.includes('project');

    if (!token) {
      console.error('No token found');
      return null;
    }

    const url = `${API_BASE_URL}/${path}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);

    if (requiresProject) {
      if (overrideProject) headers.append('Quanda-Project', `${overrideProject}`);
      else {
        if (!project) {
          console.error('No project found');
          return null;
        }
        headers.append('Quanda-Project', `${project.id}`);
      }
    }

    const response = await fetch(url, {
      method,
      headers: headers,
      body: JSON.stringify(body)
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

  const createItem = async (item: Omit<Item, 'id'>): Promise<Item | null> => {
    const response = await callAPI('items/', item, undefined, 'POST');
    if (!response) return null;
    const data: DjangoCreateResponse = await response.json();
    return data as Item;
  };

  const retrieveItem = async (id: number): Promise<Item | null> => {
    const response = await callAPI(`items/${id}/`);
    if (!response) return null;
    const data: DjangoRetrieveResponse = await response.json();
    return data as Item;
  };

  const listItems = async ({
    searchTerm,
    projectID
  }: {
    searchTerm?: string;
    projectID?: number;
  }): Promise<Item[] | null> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    const response = await callAPI(`items/?${params.toString()}`, undefined, projectID);
    if (!response) return null;
    const data: DjangoListResponse = await response.json();
    return data.results as Item[];
  };

  const updateItem = async (item: Item): Promise<Item | null> => {
    const response = await callAPI(`items/${item.id}/`, item, undefined, 'PATCH');
    if (!response) return null;
    const data: DjangoUpdateResponse = await response.json();
    return data as Item;
  };

  const addLink = async (item: Item, link: SetLink): Promise<Item | null> => {
    const response = await callAPI(`items/${item.id}/add_link/`, link, undefined, 'POST');
    if (!response) return null;
    const data: DjangoUpdateResponse = await response.json();
    return data as Item;
  };

  const removeLink = async (item: Item, link: SetLink): Promise<Item | null> => {
    const response = await callAPI(`items/${item.id}/remove_link/`, link, undefined, 'POST');
    if (!response) return null;
    const data: DjangoUpdateResponse = await response.json();
    return data as Item;
  };

  const deleteItem = async (id: number): Promise<void | null> => {
    const response = await callAPI(`items/${id}/`, {}, undefined, 'DELETE');
    if (!response) return null;
    return;
  };

  // Tag API
  // #######

  const createTag = async (tag: Omit<Tag, 'id'>): Promise<Tag | null> => {
    const response = await callAPI('tags/', tag, undefined, 'POST');
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

  const deleteTag = async (id: number): Promise<void | null> => {
    const response = await callAPI(`tags/${id}/`, {}, undefined, 'DELETE');
    if (!response) return null;
    return;
  };

  // Project API
  // ###########

  const listProjects = async (): Promise<Project[] | null> => {
    const response = await callAPI('projects/');
    if (!response) return null;
    const data: DjangoListResponse = await response.json();
    return data.results as Project[];
  };

  return {
    createItem,
    updateItem,
    addLink,
    removeLink,
    retrieveItem,
    deleteItem,
    listProjects,
    listItems,
    createTag,
    listTags,
    deleteTag
  };
};

export default useAPI;
