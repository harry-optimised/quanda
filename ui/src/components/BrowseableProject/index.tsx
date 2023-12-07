import React, { useMemo } from 'react';
import theme from '../../theme';
import { Project } from '../../types';
import { Pane, Card, Text, Strong } from 'evergreen-ui';
import TagBar from '../TagBar';

interface BrowseableProjectProps {
  project: Project;
  selected: boolean;
  onSelect: (project: Project) => void;
}

function BrowseableProject({
  project,
  selected,
  onSelect
}: BrowseableProjectProps) {
  const [hover, setHover] = React.useState<boolean>(false);
  const description = useMemo(() => {
    if (!project.description) return '';
    return project.description.length > 70
      ? project.description.slice(0, 70) + '...'
      : project.description;
  }, [project.description]);

  const backgroundColor = selected ? theme.colors.tint4 : `transparent`;
  const opacity = hover && !selected ? 0.6 : 1;

  return (
    <Card
      key={project.id}
      display="flex"
      padding={8}
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
      cursor="pointer"
      userSelect="none"
      opacity={opacity}
      onClick={() => onSelect(project)}
      style={{ backgroundColor: backgroundColor, transition: 'opacity 0.1s' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Strong color={theme.colors.tint6} textAlign="left">
        {project.name}
      </Strong>
      <Text color={theme.colors.tint6} textAlign="left">
        {description}
      </Text>
    </Card>
  );
}

export default BrowseableProject;
