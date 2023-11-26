import React, { useMemo } from 'react';
import 'reactflow/dist/style.css';
import theme from '../../theme';
import { Item, LightItem } from '../../types';
import { Pane, Card, Text, Strong } from 'evergreen-ui';
import TagBar from '../TagBar';

interface BrowseableItemProps {
  item: Item | LightItem;
  selected: boolean;
  onSelect: (id: number) => void;
}

function BrowseableItem({ item, selected, onSelect }: BrowseableItemProps) {
  const [hover, setHover] = React.useState<boolean>(false);
  const secondary = useMemo(() => {
    if (!item.secondary) return '';
    return item.secondary.length > 70
      ? item.secondary.slice(0, 70) + '...'
      : item.secondary;
  }, [item.secondary]);

  const backgroundColor = selected ? theme.colors.tint4 : `transparent`;
  const opacity = hover && !selected ? 0.6 : 1;

  return (
    <Card
      key={item.id}
      display="flex"
      padding={8}
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
      cursor="pointer"
      userSelect="none"
      opacity={opacity}
      onClick={() => onSelect(item.id)}
      style={{ backgroundColor: backgroundColor, transition: 'opacity 0.1s' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {item.tags && item.tags.length > 0 && (
        <Pane style={{ marginBottom: 4 }}>
          <TagBar tags={item.tags} onSave={() => null} frozen={true} />
        </Pane>
      )}
      <Strong color={theme.colors.tint6} textAlign="left">
        {item.primary}
      </Strong>
      <Text color={theme.colors.tint6} textAlign="left">
        {secondary}
      </Text>
    </Card>
  );
}

export default BrowseableItem;
