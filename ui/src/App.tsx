import './App.css';
import React, { useEffect } from 'react';
import theme from './theme';
import { Button, LogOutIcon, PersonIcon, TagIcon, ThemeProvider } from 'evergreen-ui';

//TODO: Do some of that sweet sweet bundle splitting.
import { Pane } from 'evergreen-ui';
import { store, AppDispatch } from './state/store';

import { Provider, useSelector, useDispatch } from 'react-redux';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import ActiveItem from './components/ActiveItem';
import Navigator from './components/Navigator';

import { selectToken, selectUsername, setToken, setUsername } from './state/profile';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';

// Fragments
import TagManager, { TagManagerRef } from './fragments/TagManager/TagManagerRef';

function AuthenticatedApp() {
  const dispatch = useDispatch<AppDispatch>();
  const { getAccessTokenSilently, logout } = useAuth0();
  const token = useSelector(selectToken);
  const username = useSelector(selectUsername);
  const tagManagerRef = React.useRef<TagManagerRef>(null);

  useEffect(() => {
    getAccessTokenSilently().then((accessToken) => {
      dispatch(setToken(accessToken));
      // TODO: If project does not exist, handle it.

      fetch('https://dev-czejtnrwqf2cuw1e.uk.auth0.com/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then((response) => {
        response.json().then((data) => {
          console.log(data);
          dispatch(setUsername(data.email));
        });
      });
    });
  }, []);

  if (!token) return <LoadingScreen />;

  return (
    <>
      <Header
        links={[
          {
            name: 'Tags',
            icon: TagIcon,
            onClick: () => tagManagerRef.current?.open()
          },
          {
            name: 'Account',
            icon: PersonIcon,
            onClick: () => null,
            subHeadings: [
              {
                name: username ?? 'Unknown',
                icon: PersonIcon,
                disabled: true,
                onClick: () => null
              },
              {
                name: 'Logout',
                icon: LogOutIcon,
                onClick: () => logout()
              }
            ]
          }
        ]}
      />

      <TagManager ref={tagManagerRef} />

      <Pane
        className="App"
        width="100%"
        height="calc(100vh - 48px)"
        display="flex"
        backgroundColor={theme.colors.tint3}
      >
        <Pane width="25%" height="100%" display="flex" flexDirection="column" justifyContent="space-between">
          <Navigator />
        </Pane>
        <Pane width="75%" padding={0}>
          <ActiveItem />
        </Pane>
      </Pane>
    </>
  );
}

function LoginScreen() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return null;

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
        <img src="logo512.png" alt="Quanda Logo" width={256} height={256} />
        <h1
          style={{
            fontSize: 72,
            fontFamily: 'Lora',
            color: theme.colors.tint6
          }}
        >
          Quanda
        </h1>
        <Button appearance="primary" onClick={() => loginWithRedirect()} size="large">
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
        scope: 'read:current_user update:current_user_metadata openid email'
      }}
    >
      <ThemeProvider value={theme}>
        <LoginScreen />
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
