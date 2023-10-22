import React from 'react';
import ReactFlow, { Background, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import ItemNode from '../TaskNode';
import LinkNode from '../LinkNode';
import useItems from '../../hooks/useItems';
import { Item, Link } from '../../hooks/useItems';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const nodeTypes = { itemNode: ItemNode, linkNode: LinkNode };

type ItemNode = {
  id: string;
  type: 'itemNode';
  position: { x: number; y: number };
  data: { item: Item };
};

type LinkNode = {
  id: string;
  type: 'linkNode';
  position: { x: number; y: number };
  data: { link: Link };
};

export default function Flow({ primary }: { primary: number }) {
  const { item, error, isLoading } = useItems(primary);
  const { height, width } = useWindowDimensions();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading || !item) {
    return <div>Loading...</div>;
  }

  // Screen center point.
  const centerX = width / 2;
  const centerY = height / 2;

  const itemNode: ItemNode = {
    id: `item-${item.id}`,
    type: 'itemNode',
    position: { x: centerX - 300, y: centerY - 100 },
    data: { item }
  };

  // Create linked nodes and edges
  const linkNodes: LinkNode[] = [];
  const edges: Edge[] = [];

  const relatesToLinks = item.links
    .filter((link) => link.relation_type == 'relates_to')
    .slice(0, 6);

  const verticalPush = [3, 4].includes(relatesToLinks.length) ? 50 : 0;
  const relatesToPositions = [
    { x: centerX - 300 - 800, y: centerY + verticalPush },
    { x: centerX - 300 + 800, y: centerY + verticalPush },
    { x: centerX - 300 - 800, y: centerY - 200 + verticalPush },
    { x: centerX - 300 + 800, y: centerY - 200 + verticalPush },
    { x: centerX - 300 - 800, y: centerY + 200 + verticalPush },
    { x: centerX - 300 + 800, y: centerY + 200 + verticalPush }
  ];

  relatesToLinks.forEach((link, index) => {
    linkNodes.push({
      id: `link-${index}`,
      type: 'linkNode',
      position: relatesToPositions[index],
      data: { link }
    });

    const targetPosition =
      relatesToPositions[index].x < centerX ? 'left' : 'right';
    const sourceHandle =
      targetPosition == 'left' ? `${item.id}-left` : `${item.id}-right`;
    const targetHandle =
      targetPosition == 'left'
        ? `${link.to_item}-right`
        : `${link.to_item}-left`;

    edges.push({
      id: `edge-${index}`,
      source: `item-${item.id}`,
      sourceHandle: sourceHandle,
      target: `link-${index}`,
      targetHandle: targetHandle,
      className: 'normal-edge',
      label: 'relates to'
    });
  });

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={[itemNode, ...linkNodes]}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background color="#999" gap={16} />
      </ReactFlow>
    </div>
  );
}
