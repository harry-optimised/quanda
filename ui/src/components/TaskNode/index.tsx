import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  toaster,
  LocateIcon
} from 'evergreen-ui';
import { Item, SetLink } from '../../types';

import Confidence from '../Confidencebar';
import FreezeButton from '../freezeButton';
import PriorityButton from '../priorityButton';
import PrimaryField from '../primaryField';
import SecondaryField from '../secondaryField';
import LinkButton from '../linkButton';
import SystemSelect from '../SystemSelect';
import { Handle, Position as ReactFlowPosition } from 'reactflow';

import { useUpdateItem } from '../../state/hooks';
import TagBar from '../TagBar';
import { useReactFlow } from 'reactflow';

interface ItemNodeProps {
  data: {
    item: Item;
    position: { x: number; y: number };
  };
}

export default function ItemNode({ data }: ItemNodeProps) {
  const { item, position } = data;
  const updateItem = useUpdateItem();
  const [managedItem, setManagedItem] = useState<Item>(item);
  const { setCenter } = useReactFlow();

  const project = 1;

  if (!managedItem) {
    return null;
  }

  useEffect(() => {
    setCenter(position.x + 300, position.y + 200, {
      zoom: 1.0,
      duration: 1000
    });
  }, []);

  const focus = useCallback(() => {
    setCenter(position.x + 300, position.y + 200, {
      zoom: 1.0,
      duration: 500
    });
  }, [position, setCenter]);

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
      updateItem(updatedItemWithProject);
    },
    [project]
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

  const onSaveSystemSelect = useCallback(
    (system: number) => {
      onSave({ ...managedItem, system: system });
    },
    [managedItem, onSave]
  );

  const onSaveLink = useCallback(
    (link: SetLink) => {
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
              <SystemSelect onSave={onSaveSystemSelect} system={item.system} />
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
          <IconButton
            marginTop={majorScale(1)}
            icon={LocateIcon}
            onClick={focus}
          />
        </Pane>
      </Pane>

      {/* Anchor points */}
      <Handle
        type="source"
        position={ReactFlowPosition.Left}
        id={`${managedItem.id}-left`}
        style={{ opacity: 0.5, left: -20 }}
      />
      <Handle
        type="source"
        position={ReactFlowPosition.Right}
        id={`${managedItem.id}-right`}
        style={{ opacity: 0.5, right: -20 }}
      />
      <Handle
        type="source"
        position={ReactFlowPosition.Top}
        id={`${managedItem.id}-top`}
        style={{ opacity: 0.5, top: -20 }}
      />
      <Handle
        type="source"
        position={ReactFlowPosition.Bottom}
        id={`${managedItem.id}-bottom`}
        style={{ opacity: 0.5, bottom: -20 }}
      />
    </Pane>
  );
}
