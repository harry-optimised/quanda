import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import itemSlice, { fetchItem } from './itemSlice';
import { fetchSystems } from './systemsSlice';
import { fetchTags } from './tagsSlice';
import { Item } from '../types';

export const useFetchItem = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (id: number) => dispatch(fetchItem(id));
};

export const useUpdateItem = () => {
  const dispatch = useDispatch();
  return (item: Item) => dispatch(itemSlice.actions.updateItem(item));
};

export const useCreateItem = () => {
  const dispatch = useDispatch();
  return (item: Omit<Item, 'id'>) =>
    dispatch(itemSlice.actions.createItem(item));
};

export const useFetchSystems = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchSystems());
};

export const useFetchTags = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchTags());
};
