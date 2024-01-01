import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAPI } from '../../hooks';
import { setCurrentProject } from '../../state/projects';
import { setItem } from '../../state/item';
import { Dialog } from 'evergreen-ui';
import { AppDispatch } from '../../state/store';
import BrowseableProject from '../../components/BrowseableProject';
import { Project } from '../../types';

export interface ProjectManagerRef {
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

export default ProjectManager;
