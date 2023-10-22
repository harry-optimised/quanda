import React, { useCallback, useMemo, useState } from 'react';
import 'reactflow/dist/style.css';
import { Card, Paragraph, Pane, majorScale, Text } from 'evergreen-ui';
import { Link } from '../../types';

import TagBar from '../TagBar';
import { Handle, Position as ReactFlowPosition } from 'reactflow';
import { useFetchItem } from '../../state/hooks';

interface LinkNodeProps {
  data: { link: Link };
}

export default function LinkNode({ data }: LinkNodeProps) {
  const { link } = data;
  const fetchItem = useFetchItem();

  if (!link) {
    return null;
  }

  const cardColor = useMemo(() => {
    return '#ffffff';
  }, []);

  return (
    <Pane opacity={0.5} onClick={() => fetchItem(link.target)}>
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
          <Text>{link.target}</Text>
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
        id={`${link.target}-right`}
        style={{ opacity: 0, right: -20 }}
      />
      <Handle
        type="target"
        position={ReactFlowPosition.Left}
        id={`${link.target}-left`}
        style={{ opacity: 0, left: -20 }}
      />
    </Pane>
  );
}
