import './App.css';
import React, { useCallback, useEffect } from 'react';
import theme from './theme';
import {
  BoxIcon,
  Button,
  Card,
  DatabaseIcon,
  Dialog,
  ExportIcon,
  FileCard,
  FileUploader,
  Heading,
  Icon,
  ImportIcon,
  Paragraph,
  PersonIcon,
  ProjectsIcon,
  RocketSlantIcon,
  Strong,
  TagIcon,
  TextInput,
  ThemeProvider,
  FileRejection,
  majorScale
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
import { setItem } from './state/item';

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
    dispatch(setItem({ item: null }));
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

interface ExportManagerRef {
  open: () => void;
}

const ExportManager = React.forwardRef<ProjectManagerRef>((props, ref) => {
  const [isShown, setIsShown] = React.useState(false);
  const project = useSelector(selectCurrentProject);

  const api = useAPI();

  // External trigger to open the dialog.
  const open = () => setIsShown(true);
  React.useImperativeHandle(ref, () => ({
    open
  }));

  const onExportData = useCallback(() => {
    console.log('!');
    if (!project) return;
    api
      .exportProject(project.id)
      .then((response) => {
        if (!response) return;

        const url = window.URL.createObjectURL(response.blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error during export:', error);
      });

    setIsShown(false);
  }, [project, api]);

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Export Data"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Export"
        onConfirm={onExportData}
        hasCancel={false}
      >
        <Paragraph>
          Exporting data will generate a Pickle file containing all the data in the project. This can be used to import
          at a later time, or import into another project.
        </Paragraph>
      </Dialog>
    </>
  );
});

interface ImportManagerRef {
  open: () => void;
}

const ImportManager = React.forwardRef<ImportManagerRef>((props, ref) => {
  const [isShown, setIsShown] = React.useState(false);
  const project = useSelector(selectCurrentProject);
  const [files, setFiles] = React.useState<File[]>([]);
  const [fileRejections, setFileRejections] = React.useState<FileRejection[]>([]);

  const handleChange = React.useCallback((files: File[]) => setFiles([files[0]]), []);
  const handleRejected = React.useCallback(
    (fileRejections: FileRejection[]) => setFileRejections([fileRejections[0]]),
    []
  );
  const handleRemove = React.useCallback(() => {
    setFiles([]);
    setFileRejections([]);
  }, []);

  const api = useAPI();

  // External trigger to open the dialog.
  const open = () => setIsShown(true);
  React.useImperativeHandle(ref, () => ({
    open
  }));

  const onImportData = useCallback(() => {
    if (files.length !== 1) return;
    const file = files[0];
    if (!project) return;
    api
      .importProject(project.id, file)
      .then(() => {
        setIsShown(false);
      })
      .catch((error) => {
        console.error('Error during import:', error);
      });
  }, [files, project, api]);

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Import Data"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Import"
        onConfirm={onImportData}
        hasCancel={false}
      >
        <Paragraph marginBottom={majorScale(4)}>
          Importing an existing <strong>.quanda </strong> file to add all items to this project. This will not overwrite
          any existing items. Items that already exist (matched by the ID) will be skipped.
        </Paragraph>
        <Pane maxWidth={654}>
          <FileUploader
            label="Upload File"
            description="You can upload 1 file. File can be up to 50 MB."
            maxSizeInBytes={50 * 1024 ** 2}
            maxFiles={1}
            onChange={handleChange}
            onRejected={handleRejected}
            renderFile={(file) => {
              const { name, size, type } = file;
              const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file);
              const { message } = fileRejection || {};
              return (
                <FileCard
                  key={name}
                  isInvalid={fileRejection != null}
                  name={name}
                  onRemove={handleRemove}
                  sizeInBytes={size}
                  type={type}
                  validationMessage={message}
                />
              );
            }}
            values={files}
          />
        </Pane>
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

  useEffect(() => {
    if (!project) return;
    api.listTags({ project: project.id }).then((tags) => {
      if (tags) dispatch(setTags(tags));
    });
  }, [project]);

  const onCreateTag = useCallback(() => {
    if (!newTag) return;
    if (!project) return;
    setColour(getRandomTagColour());
    api
      .createTag({
        tag: {
          name: newTag.toLowerCase(),
          description: 'not used',
          colour: colour,
          project: project.id
        },
        project: project.id
      })
      .then((tag) => {
        setNewTag('');
        if (!tag) return;
        dispatch(setTags([...tags, tag]));
      });
  }, [newTag, colour, project]);

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
            project={project}
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
            onClick: () => logout()
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
