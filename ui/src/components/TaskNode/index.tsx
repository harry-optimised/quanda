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
  TagInput,
  CaretDownIcon,
  toaster
} from 'evergreen-ui';
import { Item, Link } from '../../hooks/useItems';

import Confidence from '../Confidencebar';
import FreezeButton from '../freezeButton';
import PriorityButton from '../priorityButton';
import PrimaryField from '../primaryField';
import SecondaryField from '../secondaryField';
import LinkButton from '../linkButton';
import { Handle, Position as ReactFlowPosition } from 'reactflow';

import useSystems, { System } from '../../hooks/useSystems';
import useTags from '../../hooks/useTags';
import TagBar from '../TagBar';

interface ItemNodeProps {
  data: {
    item: Item;
  };
}

export default function ItemNode({ data }: ItemNodeProps) {
  const { item } = data;
  const [managedItem, setManagedItem] = useState<Item>(item);
  const { systems, error: sysError, isLoading: sysLoading } = useSystems();

  const project = 1;

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
      const UpdateItemWithLinks = {
        ...updatedItemWithProject,
        set_links: updatedItemWithProject.links
      };
      fetch(`http://localhost:8000/api/items/${UpdateItemWithLinks.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(UpdateItemWithLinks)
      })
        .then((response) => response.json())
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

  const onSavePriority = useCallback(
    (priority: boolean) => {
      onSave({ ...managedItem, priority: priority });
    },
    [managedItem, onSave]
  );

  const onSaveTags = useCallback(
    (tags: number[]) => {
      onSave({ ...managedItem, tags: tags });
    },
    [managedItem, onSave]
  );

  const onSaveConfidence = useCallback(
    (confidence: number) => {
      onSave({ ...managedItem, confidence: confidence });
    },
    [managedItem, onSave]
  );

  const onSavePrimary = useCallback(
    (primary: string) => {
      onSave({ ...managedItem, primary: primary });
    },
    [managedItem, onSave]
  );

  const onSaveSecondary = useCallback(
    (secondary: string) => {
      onSave({ ...managedItem, secondary: secondary });
    },
    [managedItem, onSave]
  );

  const onSaveLink = useCallback(
    (link: Link) => {
      fetch(`http://localhost:8000/api/items/${managedItem.id}/add_link/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(link)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log({ ...managedItem, links: [...managedItem.links, data] });
          onSave({ ...managedItem, links: [...managedItem.links, data] });
        })
        .catch((error) => {
          toaster.danger(`Error: ${error}.`);
        });
    },
    [managedItem, onSave]
  );

  return (
    <Pane>
      <Pane display="flex" marginBottom={majorScale(1)}>
        <TagBar tags={managedItem.tags} onSave={onSaveTags} />
      </Pane>
      <Pane display="flex">
        <Card
          elevation={0}
          width="600px"
          borderRadius="4px"
          background={cardColor}
          padding={majorScale(2)}
          border="1px solid #DDDDEE"
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
                          key={system.id}
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
              <Confidence confidence={confidence} onSave={onSaveConfidence} />
            </Pane>
          </Pane>
          <Pane marginTop={majorScale(1)}>
            <PrimaryField
              primary={managedItem.primary}
              onSave={onSavePrimary}
            />
          </Pane>
          <Pane marginTop={majorScale(1)}>
            <SecondaryField
              secondary={managedItem.secondary}
              onSave={onSaveSecondary}
            />
          </Pane>
        </Card>
        <Pane marginLeft={majorScale(1)} display="flex" flexDirection="column">
          <LinkButton onSave={onSaveLink} />
          <PriorityButton
            onSave={onSavePriority}
            priority={managedItem.priority}
          />
          <FreezeButton onSave={onSaveFrozen} frozen={managedItem.frozen} />
        </Pane>
      </Pane>
      <Handle
        type="source"
        position={ReactFlowPosition.Left}
        id={`${managedItem.id}-left`}
        style={{ opacity: 0, left: -20 }}
      />
      <Handle
        type="source"
        position={ReactFlowPosition.Right}
        id={`${managedItem.id}-right`}
        style={{ opacity: 0, right: -20 }}
      />
    </Pane>
  );
}
