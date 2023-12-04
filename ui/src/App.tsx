import './App.css';
import React, { useEffect } from 'react';
import theme from './theme';
import {
  Button,
  Dialog,
  Icon,
  PersonIcon,
  ProjectsIcon,
  RocketSlantIcon,
  Strong,
  TagIcon,
  ThemeProvider
} from 'evergreen-ui';

//TODO: Do some of that sweet sweet bundle splitting.
import { Pane } from 'evergreen-ui';
import { store, AppDispatch, selectItem } from './state/store';
import { refreshItems, selectAllItems } from './state/navigator';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import { useFetchTags } from './state/hooks';

import { setItem } from './state/item';

import ActiveItem from './components/ActiveItem';
import Navigator from './components/Navigator';

import { setToken } from './state/profile';

function ProjectManager() {
  const [isShown, setIsShown] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isShown) return;
    getAccessTokenSilently()
      .then((accessToken) => {
        //TODO: Abstract all API calls behind some sort of API service.
        fetch('https://api.quanda.ai/api/projects/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
          .then((response) => response.json())
          .then((data) => console.log(data));
      })
      .catch((err) => console.error(err));
  }, [isShown]);

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Projects"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Custom Label"
      >
        Dialog content
      </Dialog>

      <Pane
        display="flex"
        flexDirection="row"
        alignItems="center"
        height="100%"
        paddingLeft={16}
        paddingRight={16}
        style={{ cursor: 'pointer', transition: 'background-color 0.1s' }}
        backgroundColor={hover ? theme.colors.tint5 : 'transparent'}
        onClick={() => setIsShown(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Icon
          icon={ProjectsIcon}
          color={theme.colors.background}
          size={16}
          marginRight={8}
        />
        <Strong color={theme.colors.background}>CareCrow</Strong>
      </Pane>
    </>
  );
}

function AuthenticatedApp() {
  const fetchTags = useFetchTags();
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectAllItems);
  const activeItem = useSelector(selectItem);
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then((accessToken) => {
      dispatch(setToken(accessToken));
      dispatch(refreshItems(false));
      fetchTags();
    });
  }, []);

  useEffect(() => {
    if (!activeItem && items.length > 0) {
      dispatch(setItem({ item: items[0], updateBackend: false }));
    }
  }, [items, activeItem]);

  return (
    <>
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
          <Pane marginLeft={32}>
            <ProjectManager />
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
            <Strong color={theme.colors.background}>{user?.email}</Strong>
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
    </>
  );
}

function ReduxApp() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Pane
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        backgroundColor={theme.colors.tint3}
      >
        <h1
          style={{
            fontSize: 72,
            fontFamily: 'Lora',
            color: theme.colors.tint6
          }}
        >
          Quanda
        </h1>
        <Button appearance="primary" onClick={() => loginWithRedirect()}>
          Login
        </Button>
      </Pane>
    );
  }

  return (
    <Provider store={store}>
      <AuthenticatedApp />
    </Provider>
  );
}

function App() {
  return (
    <Auth0Provider
      domain="dev-czejtnrwqf2cuw1e.uk.auth0.com"
      clientId="FrKaByHTyqxjP4AFIKqzeAw2dvzQdlJp"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'api.quanda.ai',
        scope: 'read:current_user update:current_user_metadata'
      }}
    >
      <ThemeProvider value={theme}>
        <ReduxApp />
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
