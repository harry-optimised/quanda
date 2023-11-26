import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import navigatorState, { refreshItems } from './navigator';
import { fetchSystems } from './systemsSlice';
import { fetchTags } from './tagsSlice';
import { Item } from '../types';

// export const useUpdateItem = () => {
//   const dispatch = useDispatch();
//   return (item: Item) =>
//     dispatch(itemSlice.actions.updateItem({ id: item.id, changes: item }));
// };

export const useFetchSystems = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchSystems());
};

export const useFetchTags = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchTags());
};
