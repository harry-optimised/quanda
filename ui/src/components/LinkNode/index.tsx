import React, { useMemo, useState } from 'react';
import 'reactflow/dist/style.css';
import {
  Card,
  Paragraph,
  Pane,
  majorScale,
  LocateIcon,
  IconButton
} from 'evergreen-ui';
import { Link } from '../../types';
import LinkButton from '../linkButton';
import PriorityButton from '../priorityButton';
import FreezeButton from '../freezeButton';

import TagBar from '../TagBar';
import SystemSelect from '../SystemSelect';
import Confidence from '../Confidencebar';
import { Handle, Position as ReactFlowPosition } from 'reactflow';
import { useRefreshItems } from '../../state/hooks';

interface LinkNodeProps {
  data: { link: Link };
}

export default function LinkNode({ data }: LinkNodeProps) {
  const { link } = data;
  const [bgColor, setBgColor] = useState('rgba(0, 59, 73, 0.6)');
  const fetchItem = useRefreshItems();

  if (!link) {
    return null;
  }

  const cardColor = useMemo(() => {
    return '#ffffff';
  }, []);

  return (
    <Pane>
      <Pane display="flex" marginBottom={majorScale(1)}>
        <TagBar
          tags={link.target.tags || []}
          onSave={() => null}
          frozen={true}
        />
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
              <SystemSelect onSave={() => null} system={link.target.system} />
            </Pane>
            <Pane width="50%" cursor="pointer">
              <Confidence
                confidence={link.target.confidence}
                onSave={() => null}
              />
            </Pane>
          </Pane>
          <Pane>
            <Paragraph cursor="pointer" textAlign="left">
              {link.target.primary}
            </Paragraph>
          </Pane>
          <Pane>
            <Paragraph cursor="pointer" textAlign="left">
              {link.target.secondary}
            </Paragraph>
          </Pane>
        </Card>
        <Pane
          marginLeft={majorScale(1)}
          display="flex"
          flexDirection="column"
          transition="opacity 1.0s ease-in-out"
        >
          <LinkButton onSave={() => null} />
          <PriorityButton onSave={() => null} priority={link.target.priority} />
          <FreezeButton onSave={() => null} frozen={link.target.frozen} />
          <IconButton
            marginTop={majorScale(1)}
            icon={LocateIcon}
            onClick={focus}
          />
        </Pane>
      </Pane>

      {/* Overlay */}

      <Pane
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        backgroundColor={bgColor}
        transition="background-color 0.2s ease-in-out"
        onMouseEnter={() => setBgColor('rgba(0, 59, 73, 0.0)')}
        onMouseLeave={() => setBgColor('rgba(0, 59, 73, 0.6)')}
        cursor="pointer"
      ></Pane>

      {/* Four anchor points. */}
      <Handle
        type="target"
        position={ReactFlowPosition.Right}
        id={`${link.target.id}-right`}
        style={{ opacity: 0.5, right: -20 }}
      />
      <Handle
        type="target"
        position={ReactFlowPosition.Left}
        id={`${link.target.id}-left`}
        style={{ opacity: 0.5, left: -20 }}
      />
      <Handle
        type="target"
        position={ReactFlowPosition.Top}
        id={`${link.target.id}-top`}
        style={{ opacity: 0.5, top: -20 }}
      />
      <Handle
        type="target"
        position={ReactFlowPosition.Bottom}
        id={`${link.target.id}-bottom`}
        style={{ opacity: 0.5, bottom: -20 }}
      />
    </Pane>
  );
}
