import React, { useCallback, useMemo, useState } from 'react';
import 'reactflow/dist/style.css';
import {
  Card,
  Paragraph,
  Text,
  Pane,
  Popover,
  Menu,
  IconButton,
  Position,
  Button,
  majorScale,
  Badge,
  LinkIcon,
  HighPriorityIcon,
  SnowflakeIcon,
  CaretDownIcon,
  toaster
} from 'evergreen-ui';
import { Item } from '../../hooks/useItems';

import ConfidenceBar from '../Confidencebar';
import FreezeButton from '../freezeButton';
import useSystems, { System } from '../../hooks/useSystems';
import useTags from '../../hooks/useTags';

interface ItemNodeProps {
  data: {
    item: Item;
  };
}

export default function ItemNode({ data }: ItemNodeProps) {
  const { item } = data;
  const [managedItem, setManagedItem] = useState<Item>(item);
  const { systems, error: sysError, isLoading: sysLoading } = useSystems();
  const { tags, error: tagsError, isLoading: tagsLoading } = useTags();

  const project = 1;

  console.log(item);
  if (!managedItem) {
    return null;
  }

  const capitalize = (s: string) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const confidence = useMemo(() => {
    return managedItem.frozen ? 1.0 : managedItem.confidence;
  }, [managedItem]);

  const cardColor = useMemo(() => {
    return managedItem.frozen ? '#e7f4ff' : '#ffffff';
  }, [confidence]);

  // Save Functions
  // ##############

  const onSave = useCallback(
    (updatedItem: Item) => {
      setManagedItem(updatedItem);
      const updatedItemWithProject = { ...updatedItem, project: project };
      fetch(`http://localhost:8000/api/items/${updatedItemWithProject.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItemWithProject)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          toaster.success('Item saved.');
        })
        .catch((error) => {
          toaster.danger(`Error: ${error}.`);
        });
    },
    [project]
  );

  const onChangeSystem = useCallback(
    (systemID: number) => {
      onSave({ ...managedItem, system: systemID });
    },
    [managedItem, onSave]
  );

  const onSaveFrozen = useCallback(
    (frozen: boolean) => {
      onSave({ ...managedItem, frozen: frozen });
    },
    [managedItem, onSave]
  );

  return (
    <Pane>
      <Pane display="flex" marginBottom={majorScale(1)}>
        {managedItem.tags.map((tagID, _) => {
          const tag = tags?.find((tag) => tag.id === tagID);
          if (!tag) {
            return null;
          }
          return (
            <Badge color={tag.colour} marginRight={majorScale(1)} key={tag.id}>
              {tag.name}
            </Badge>
          );
        })}
      </Pane>
      <Pane display="flex">
        <Card
          elevation={2}
          maxWidth="600px"
          borderRadius="16px"
          background={cardColor}
          padding={majorScale(2)}
        >
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Pane>
              <Popover
                position={Position.BOTTOM_LEFT}
                content={({ close }) => (
                  <Menu>
                    <Menu.Group>
                      {systems?.map((system, _) => (
                        <Menu.Item
                          onSelect={() => {
                            close();
                            onChangeSystem(system.id);
                          }}
                        >
                          {capitalize(system.name)}
                        </Menu.Item>
                      ))}
                    </Menu.Group>
                  </Menu>
                )}
              >
                <Button
                  appearance="secondary"
                  size="small"
                  iconAfter={CaretDownIcon}
                  backgroundColor={cardColor}
                  border="1px solid #333333"
                >
                  {capitalize(
                    systems?.find((system) => system.id === managedItem.system)
                      ?.name || 'No System'
                  )}
                </Button>
              </Popover>
            </Pane>
            <Pane width="50%" cursor="pointer">
              <ConfidenceBar confidence={confidence} />
            </Pane>
          </Pane>
          <Pane marginTop={majorScale(1)}>
            <Paragraph textAlign="left">{managedItem.primary}</Paragraph>
          </Pane>
          <Pane marginTop={majorScale(1)}>
            <Paragraph textAlign="left" size="300" color="muted">
              {managedItem.secondary}
            </Paragraph>
          </Pane>
        </Card>
        <Pane marginLeft={majorScale(1)} display="flex" flexDirection="column">
          <IconButton icon={LinkIcon} />
          <IconButton icon={HighPriorityIcon} marginTop={majorScale(1)} />
          <FreezeButton onSave={onSaveFrozen} frozen={managedItem.frozen} />
        </Pane>
      </Pane>
    </Pane>
  );
}
