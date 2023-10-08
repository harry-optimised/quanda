import React, { useState } from 'react';
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
  CaretDownIcon,
  majorScale,
  Badge,
  ArrowsHorizontalIcon,
  LinkIcon,
  HighPriorityIcon,
  SnowflakeIcon
} from 'evergreen-ui';
import { Item } from '../../hooks/useItems';

import styles from './TaskNode.module.css';
import ConfidenceBar from '../Confidencebar';

interface ItemNodeProps {
  data: {
    item: Item;
  };
}

export default function ItemNode({ data }: ItemNodeProps) {
  const { item } = data;
  const [managedItem, setManagedItem] = useState<Item>(item);

  console.log(item);

  if (!managedItem) {
    return null;
  }

  const capitalize = (s: string) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <Pane>
      <Pane display="flex" marginBottom={majorScale(1)}>
        {item.tags.map((tag, index) => (
          <Badge
            color={tag.color}
            isInteractive={true}
            marginRight={majorScale(1)}
          >
            {tag.name}
          </Badge>
        ))}
      </Pane>
      <Pane display="flex">
        <Card
          elevation={2}
          maxWidth="300px"
          borderRadius="16px"
          background="#ffffff"
          padding={majorScale(2)}
        >
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Pane>
              <Text>{capitalize(item.system)}</Text>
              <Popover
                position={Position.BOTTOM_LEFT}
                content={
                  <Menu>
                    <Menu.Group>
                      <Menu.Item>Share...</Menu.Item>
                      <Menu.Item>Move...</Menu.Item>
                    </Menu.Group>
                  </Menu>
                }
              >
                <IconButton
                  marginRight={16}
                  icon={CaretDownIcon}
                  appearance="minimal"
                  margin={0}
                />
              </Popover>
            </Pane>
            <Pane width="50%">
              <ConfidenceBar confidence={item.confidence} />
            </Pane>
          </Pane>
          <Pane>
            <Paragraph textAlign="left">{item.header}</Paragraph>
          </Pane>
          <Pane marginTop={majorScale(1)}>
            <Paragraph textAlign="left" size="300" color="muted">
              {item.body}
            </Paragraph>
          </Pane>
        </Card>
        <Pane marginLeft={majorScale(1)} display="flex" flexDirection="column">
          <IconButton icon={LinkIcon} />
          <IconButton icon={HighPriorityIcon} marginTop={majorScale(1)} />
          <IconButton icon={SnowflakeIcon} marginTop={majorScale(1)} />
        </Pane>
      </Pane>
    </Pane>
  );
}
