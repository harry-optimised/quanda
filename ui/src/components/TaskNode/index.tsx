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

//import { useUpdateItem } from '../../state/hooks';
import TagBar from '../TagBar';
import { useReactFlow } from 'reactflow';
import { useSelector } from 'react-redux';
import { selectActiveItem } from '../../state/store';

interface ItemNodeProps {
  data: {
    item: Item;
  };
}

export default function ItemNode({ data }: ItemNodeProps) {
  const { item } = data;
  const [managedItem, setManagedItem] = useState<Item>(item);
  const activeItemId = useSelector(selectActiveItem);

  if (!managedItem) {
    return null;
  }

  if (managedItem.id !== activeItemId) {
    return (
      <Pane width="600px" height="400px">
        <Pane display="flex">
          <Card
            elevation={0}
            width="600px"
            borderRadius="4px"
            background={'white'}
            padding={majorScale(2)}
            border="1px solid #DDDDEE"
          >
            <Pane
              display="flex"
              alignItems="start"
              justifyContent="space-between"
            ></Pane>
            <Pane marginTop={majorScale(1)}>
              <Paragraph textAlign="left">{managedItem.primary}</Paragraph>
            </Pane>
            <Pane marginTop={majorScale(1)}>
              <Paragraph textAlign="left">{managedItem.secondary}</Paragraph>
            </Pane>
          </Card>
        </Pane>
      </Pane>
    );
  }

  const project = 1;

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
      //updateItem(updatedItemWithProject);
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
    <Pane width="600px" maxHeight="400px">
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
    </Pane>
  );
}
