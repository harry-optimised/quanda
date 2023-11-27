import './App.css';
import React, { useEffect } from 'react';
import 'reactflow/dist/style.css';
import theme from './theme';
import {
  ApplicationIcon,
  BoxIcon,
  GridViewIcon,
  Icon,
  MenuIcon,
  PersonIcon,
  ProjectsIcon,
  RocketSlantIcon,
  Strong,
  TagIcon,
  ThemeProvider
} from 'evergreen-ui';

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
      dispatch(setItem({ item: items[0], updateBackend: false }));
    }
  }, [items, activeItem]);

  return (
    <ThemeProvider value={theme}>
      <Pane
        width="100%"
        height={48}
        backgroundColor={theme.colors.tint6}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Pane display="flex" flexDirection="row" paddingLeft={16}></Pane>
        <Pane
          display="flex"
          flexDirection="row"
          backgroundColor={theme.colors.tint6}
          height={48}
          paddingRight={16}
        >
          <Pane
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft={32}
          >
            <Icon
              icon={TagIcon}
              color={theme.colors.background}
              size={16}
              marginRight={8}
            />
            <Strong color={theme.colors.background}>Tags</Strong>
          </Pane>
          <Pane
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft={32}
          >
            <Icon
              icon={RocketSlantIcon}
              color={theme.colors.background}
              size={16}
              marginRight={8}
            />
            <Strong color={theme.colors.background}>AI Settings</Strong>
          </Pane>
          <Pane
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft={32}
          >
            <Icon
              icon={ProjectsIcon}
              color={theme.colors.background}
              size={16}
              marginRight={8}
            />
            <Strong color={theme.colors.background}>CareCrow</Strong>
          </Pane>
          <Pane
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginLeft={32}
          >
            <Icon
              icon={PersonIcon}
              color={theme.colors.background}
              size={16}
              marginRight={8}
            />
            <Strong color={theme.colors.background}>Henry Turner</Strong>
          </Pane>
        </Pane>
      </Pane>
      <Pane
        className="App"
        width="100%"
        height="calc(100vh - 48px)"
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
        <Pane width="75%" padding={0}>
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
