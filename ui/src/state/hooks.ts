import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { fetchSystems } from './systemsSlice';
import { fetchTags } from './tagsSlice';

export const useFetchSystems = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchSystems());
};

export const useFetchTags = () => {
  const dispatch = useDispatch<AppDispatch>();
  return () => dispatch(fetchTags());
};
