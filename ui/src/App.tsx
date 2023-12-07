import './App.css';
import React, { useCallback, useEffect } from 'react';
import theme from './theme';
import {
  Button,
  Card,
  Dialog,
  Icon,
  Paragraph,
  PersonIcon,
  ProjectsIcon,
  RocketSlantIcon,
  Strong,
  TagIcon,
  TextInput,
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
import useAPI from './hooks/useAPI';
import { selectCurrentProject, setCurrentProject } from './state/projects';
import { Project } from './types';
import BrowseableProject from './components/BrowseableProject';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import BrowseableTag from './components/BrowseableTag';
import { hsvToRgb } from './colourConversionAlgorithms';
import { selectTags, setTags } from './state/tagsSlice';
interface ProjectManagerRef {
  open: () => void;
}

const ProjectManager = React.forwardRef<ProjectManagerRef>((props, ref) => {
  const [isShown, setIsShown] = React.useState(false);

  const api = useAPI();
  const dispatch = useDispatch<AppDispatch>();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>();

  // External trigger to open the dialog.
  const open = () => setIsShown(true);
  React.useImperativeHandle(ref, () => ({
    open
  }));

  useEffect(() => {
    api.listProjects().then((projects) => {
      if (projects) setProjects(projects);
    });
  }, []);

  const onOpenProject = useCallback(() => {
    if (!selectedProject) return;
    dispatch(setCurrentProject(selectedProject));
    localStorage.setItem('activeProject', JSON.stringify(selectedProject));
    setIsShown(false);
  }, [selectedProject]);

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Projects"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Open"
        isConfirmDisabled={!selectedProject}
        onConfirm={onOpenProject}
        hasCancel={false}
      >
        {projects.map((project) => (
          <BrowseableProject
            key={project.id}
            project={project}
            selected={selectedProject?.id === project.id}
            onSelect={() => setSelectedProject(project)}
          />
        ))}
      </Dialog>
    </>
  );
});

interface TagManagerRef {
  open: () => void;
}

const getRandomTagColour = () => {
  const hue = Math.random() * 360;
  const saturation = 0.5;
  const value = 0.8;
  const [r, g, b] = hsvToRgb(hue, saturation, value);
  return `rgb(${r},${g},${b})`;
};

const TagManager = React.forwardRef<TagManagerRef>((props, ref) => {
  const [isShown, setIsShown] = React.useState(false);
  const [newTag, setNewTag] = React.useState<string>('');
  const [colour, setColour] = React.useState<string>(getRandomTagColour());
  const project = useSelector(selectCurrentProject);
  const tags = useSelector(selectTags);

  const api = useAPI();
  const dispatch = useDispatch<AppDispatch>();

  // External trigger to open the dialog.
  const open = () => setIsShown(true);
  React.useImperativeHandle(ref, () => ({
    open
  }));

  const onCreateTag = useCallback(() => {
    if (!newTag) return;
    if (!project) return;
    setColour(getRandomTagColour());
    api
      .createTag({
        name: newTag,
        description: 'not used',
        colour: colour,
        project: project.id
      })
      .then((tag) => {
        setNewTag('');
        if (!tag) return;
        dispatch(setTags([...tags, tag]));
      });
  }, [newTag, colour]);

  const newColour = useCallback(() => {
    setColour(getRandomTagColour());
  }, [colour]);

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Tag Manager"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Finished"
        hasCancel={false}
      >
        {tags.map((tag) => (
          <BrowseableTag
            key={tag.id}
            tag={tag}
            selected={false}
            onSelect={() => {
              console.log(tag.name);
            }}
          />
        ))}
        <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" marginTop={16}>
          <TextInput
            placeholder="New Tag"
            value={newTag}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
          />
          <Card
            backgroundColor={colour}
            onClick={() => newColour()}
            marginLeft={16}
            userSelect="none"
            width={64}
            height={32}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize={14}
          >
            <Strong color="white">Colour</Strong>
          </Card>
          <Button appearance="primary" onClick={() => onCreateTag()} marginLeft={16} disabled={newTag === ''}>
            Create Tag
          </Button>
        </Pane>
      </Dialog>
    </>
  );
});

function AuthenticatedApp() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, getAccessTokenSilently } = useAuth0();
  const token = useSelector(selectToken);
  const username = useSelector(selectUsername);
  const project = useSelector(selectCurrentProject);
  const projectManagerRef = React.useRef<ProjectManagerRef>(null);
  const tagManagerRef = React.useRef<TagManagerRef>(null);
  const api = useAPI();

  useEffect(() => {
    getAccessTokenSilently().then((accessToken) => {
      dispatch(setToken(accessToken));
      const _project = localStorage.getItem('activeProject');
      if (_project) dispatch(setCurrentProject(JSON.parse(_project)));

      api.listTags().then((tags) => {
        if (tags) dispatch(setTags(tags));
      });

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
        disabled={!project}
        links={[
          {
            name: 'Tags',
            icon: TagIcon,
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
            onClick: () => console.log('Profile')
          }
        ]}
      />
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
            <Pane display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Icon icon={RocketSlantIcon} color={theme.colors.tint6} size={64} marginBottom={32} />
              <Strong color={theme.colors.tint6} marginBottom={16}>
                Welcome to Quanda
              </Strong>
              <Paragraph color={theme.colors.tint6} marginLeft={16}>
                Open a Project to get started.
              </Paragraph>
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
