import React from 'react';
import theme from '../../theme';
import { Entry } from '../../types';
import { Card, Strong } from 'evergreen-ui';

interface BrowseableItemProps {
  entry: Entry;
  selected: boolean;
  onSelect: (id: string) => void;
}

function BrowseableItem({ entry, selected, onSelect }: BrowseableItemProps) {
  const [hover, setHover] = React.useState<boolean>(false);

  const backgroundColor = selected ? theme.colors.tint4 : `transparent`;
  const opacity = hover && !selected ? 0.6 : 1;

  return (
    <Card
      key={entry.id}
      display="flex"
      padding={8}
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
      cursor="pointer"
      userSelect="none"
      opacity={opacity}
      onClick={() => onSelect(entry.id)}
      style={{ backgroundColor: backgroundColor, transition: 'opacity 0.1s' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* {entry.tags && entry.tags.length > 0 && (
        <Pane style={{ marginBottom: 4 }}>
          <TagBar tags={entry.tags} onSave={() => null} frozen={true} />
        </Pane>
      )} */}
      <Strong color={theme.colors.tint6} textAlign="left">
        {entry.date}
      </Strong>
      {/* <Text color={theme.colors.tint6} textAlign="left">
        {secondary}
      </Text> */}
    </Card>
  );
}

export default BrowseableItem;
