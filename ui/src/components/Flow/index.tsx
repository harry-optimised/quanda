import React, { useEffect } from 'react';
import ReactFlow, { Background, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import ItemNode from '../TaskNode';
import LinkNode from '../LinkNode';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { Item, Link } from '../../types';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useFetchItem } from '../../state/hooks';
import PNG from '../SVG';

const nodeTypes = { itemNode: ItemNode, linkNode: LinkNode };

type Position = {
  x: number;
  y: number;
};

type ItemNode = {
  id: string;
  type: 'itemNode';
  position: { x: number; y: number };
  data: { item: Item; position: Position };
};

type LinkNode = {
  id: string;
  type: 'linkNode';
  position: { x: number; y: number };
  data: { link: Link };
};

const positions: Record<number, Position> = {};

const getPosition = (id: number, width: number, height: number): Position => {
  const centerX = width / 2;
  const centerY = height / 2;

  if (positions[id]) {
    return positions[id];
  }

  // If positions has no entries yet, put in center of screen
  if (Object.keys(positions).length === 0) {
    positions[id] = { x: centerX, y: centerY };
  } else {
    // Randomise position.
    const x = Math.random() * width;
    const y = Math.random() * height;
    positions[id] = { x, y };
  }

  return positions[id];
};

export default function Flow() {
  const item = useSelector((state: RootState) => state.item.item);
  const fetchItem = useFetchItem();
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    fetchItem(3);
  }, []);

  const position = getPosition(item.id, width, height);
  const itemNode: ItemNode = {
    id: `item-${item.id}`,
    type: 'itemNode',
    position: position,
    data: { item, position }
  };

  // Create linked nodes and edges
  const linkNodes: LinkNode[] = [];
  const edges: Edge[] = [];

  item.links.forEach((link: Link, index: number) => {
    linkNodes.push({
      id: `link-${index}`,
      type: 'linkNode',
      position: getPosition(link.target, width, height),
      data: { link }
    });

    edges.push({
      id: `edge-${index}`,
      source: `item-${item.id}`,
      sourceHandle: `${item.id}-right`,
      target: `link-${index}`,
      targetHandle: `${link.target}-left`,
      className: 'normal-edge',
      label: 'relates to'
    });
  });

  if (item.id === -1) {
    return (
      <div style={{ height: '100%' }}>
        <PNG x={width / 2} y={height - 350} file="get_started" opacity={0.5} />
        <ReactFlow>
          <Background color="#999" gap={16} />
        </ReactFlow>
      </div>
    );
  }

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
