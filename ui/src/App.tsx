import './App.css';
import React, { useEffect } from 'react';
import theme from './theme';
import {
  Button,
  DatabaseIcon,
  ExportIcon,
  Heading,
  Icon,
  ImportIcon,
  LogOutIcon,
  PersonIcon,
  ProjectsIcon,
  RocketSlantIcon,
  TagIcon,
  ThemeProvider
} from 'evergreen-ui';

//TODO: Do some of that sweet sweet bundle splitting.
import { Pane } from 'evergreen-ui';
import { store, AppDispatch } from './state/store';

import { Provider, useSelector, useDispatch } from 'react-redux';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import ActiveItem from './components/ActiveItem';
import Navigator from './components/Navigator';

import { selectToken, selectUsername, setToken, setUsername } from './state/profile';
import { selectCurrentProject, setCurrentProject } from './state/projects';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';

// Fragments
import ImportManager, { ImportManagerRef } from './fragments/ImportManager';
import ExportManager, { ExportManagerRef } from './fragments/ExportManager';
import ProjectManager, { ProjectManagerRef } from './fragments/ProjectManager';
import TagManager, { TagManagerRef } from './fragments/TagManager/TagManagerRef';

function AuthenticatedApp() {
  const dispatch = useDispatch<AppDispatch>();
  const { getAccessTokenSilently, logout } = useAuth0();
  const token = useSelector(selectToken);
  const username = useSelector(selectUsername);
  const project = useSelector(selectCurrentProject);
  const projectManagerRef = React.useRef<ProjectManagerRef>(null);
  const tagManagerRef = React.useRef<TagManagerRef>(null);
  const exportManagerRef = React.useRef<ExportManagerRef>(null);
  const importManagerRef = React.useRef<ImportManagerRef>(null);

  useEffect(() => {
    getAccessTokenSilently().then((accessToken) => {
      dispatch(setToken(accessToken));
      const _project = localStorage.getItem('activeProject');
      if (_project) dispatch(setCurrentProject(JSON.parse(_project)));
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
            name: 'Data',
            icon: DatabaseIcon,
            onClick: () => null,
            subHeadings: [
              {
                name: 'Import Data',
                icon: ImportIcon,
                onClick: () => importManagerRef.current?.open()
              },
              {
                name: 'Export Data',
                icon: ExportIcon,
                onClick: () => exportManagerRef.current?.open()
              }
            ]
          },
          {
            name: 'Tags',
            icon: TagIcon,
            disabled: !project,
            onClick: () => tagManagerRef.current?.open()
          },
          {
            name: project ? project.name : 'No Project',
            icon: ProjectsIcon,
            onClick: () => projectManagerRef.current?.open()
          },
          {
            name: username ?? 'Unknown',
            icon: PersonIcon,
            onClick: () => null,
            subHeadings: [
              {
                name: 'Logout',
                icon: LogOutIcon,
                onClick: () => logout()
              }
            ]
          }
        ]}
      />

      <ImportManager ref={importManagerRef} />
      <ExportManager ref={exportManagerRef} />
      <ProjectManager ref={projectManagerRef} />
      <TagManager ref={tagManagerRef} />
      {!project && (
        <Pane
          className="App"
          width="100%"
          height="calc(100vh - 48px)"
          display="flex"
          backgroundColor={theme.colors.tint3}
          justifyContent="center"
          alignItems="center"
          userSelect="none"
        >
          <Pane width="50%" height="30%" display="flex" flexDirection="column" justifyContent="space-between">
            <Pane display="flex" flexDirection="column" alignItems="center" justifyContent="center" opacity={0.7}>
              <Icon icon={RocketSlantIcon} color={theme.colors.tint6} size={64} marginBottom={32} />
              <Heading size={800} color={theme.colors.tint6} paddingLeft={16} marginBottom={16}>
                Welcome to Quanda
              </Heading>
              <Heading size={600} color={theme.colors.tint6} paddingLeft={16} marginBottom={16}>
                Open a Project to get started.
              </Heading>
            </Pane>
            <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom={32}>
              <Button
                appearance="primary"
                onClick={() => {
                  projectManagerRef.current?.open();
                }}
              >
                Open Project
              </Button>
            </Pane>
          </Pane>
        </Pane>
      )}

      {project && (
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
      )}
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
