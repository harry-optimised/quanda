import './App.css';
import React, { useEffect } from 'react';
import 'reactflow/dist/style.css';
import theme from './theme';
import { ThemeProvider } from 'evergreen-ui';

import { Pane } from 'evergreen-ui';
import { store, AppDispatch, selectItem } from './state/store';
import { refreshItems, selectAllItems } from './state/navigator';
import { Provider, useSelector, useDispatch } from 'react-redux';

import { useFetchTags } from './state/hooks';

import { setItem } from './state/item';

import ActiveItem from './components/ActiveItem';
import Navigator from './components/Navigator';

function ReduxApp() {
  const fetchTags = useFetchTags();
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectAllItems);
  const activeItem = useSelector(selectItem);

  useEffect(() => {
    dispatch(refreshItems(false));
    fetchTags();
  }, []);

  useEffect(() => {
    if (!activeItem && items.length > 0) {
      dispatch(setItem(items[0]));
    }
  }, [items, activeItem]);

  return (
    <ThemeProvider value={theme}>
      <Pane
        className="App"
        width="100%"
        height="100vh"
        display="flex"
        backgroundColor={theme.colors.tint3}
      >
        <Pane
          width="25%"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Navigator />
        </Pane>
        <Pane width="75%" height="100%" padding={0}>
          <ActiveItem />
        </Pane>
      </Pane>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ReduxApp />
    </Provider>
  );
}

export default App;
