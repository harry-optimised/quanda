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

import useSystems, { System } from '../../hooks/useSystems';
import useTags from '../../hooks/useTags';
import TagBar from '../TagBar';
import { Handle, Position as ReactFlowPosition } from 'reactflow';

interface LinkNodeProps {
  data: { link: Link };
}

export default function LinkNode({ data }: LinkNodeProps) {
  const { link } = data;

  if (!link) {
    return null;
  }

  const cardColor = useMemo(() => {
    return '#ffffff';
  }, []);

  return (
    <Pane>
      <Pane display="flex" marginBottom={majorScale(1)}>
        <TagBar tags={link.tags || []} onSave={() => null} frozen={true} />
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
          <Pane>
            <Paragraph cursor="pointer" textAlign="left">
              {link.primary}
            </Paragraph>
          </Pane>
          <Pane>
            <Paragraph cursor="pointer" textAlign="left">
              {link.secondary}
            </Paragraph>
          </Pane>
        </Card>
      </Pane>
      <Handle
        type="target"
        position={ReactFlowPosition.Right}
        id={`${link.to_item}-right`}
        style={{ opacity: 0, right: -20 }}
      />
      <Handle
        type="target"
        position={ReactFlowPosition.Left}
        id={`${link.to_item}-left`}
        style={{ opacity: 0, left: -20 }}
      />
    </Pane>
  );
}
