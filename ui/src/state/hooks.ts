import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import itemSlice, { fetchItem } from './itemSlice';
import { Item } from '../types';

export const useFetchItem = () => {
  console.log('??/');
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
