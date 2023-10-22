import React, { useEffect } from 'react';
import ReactFlow, { Background, Edge, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import ItemNode from '../TaskNode';
import LinkNode from '../LinkNode';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { Item, Link, Position } from '../../types';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useFetchItem } from '../../state/hooks';
import useNodePosition from '../../hooks/useNodePosition';
import PNG from '../SVG';

const nodeTypes = { itemNode: ItemNode, linkNode: LinkNode };

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

export default function Flow() {
  const item = useSelector((state: RootState) => state.item.item);
  const fetchItem = useFetchItem();
  const getPosition = useNodePosition();
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    fetchItem(3);
  }, []);

  const itemPosition = getPosition(item.id);
  const itemNode: ItemNode = {
    id: `item-${item.id}`,
    type: 'itemNode',
    position: itemPosition,
    data: { item, position: itemPosition }
  };

  // Create linked nodes and edges
  const linkNodes: LinkNode[] = [];
  const edges: Edge[] = [];

  item.links.forEach((link: Link, index: number) => {
    const targetPosition = getPosition(link.target.id, link.type);
    const sourceHandle = targetPosition.x > itemPosition.x ? 'right' : 'left';
    const targetHandle = sourceHandle === 'right' ? 'left' : 'right';

    linkNodes.push({
      id: `link-${index}`,
      type: 'linkNode',
      position: targetPosition,
      data: { link }
    });

    edges.push({
      id: `edge-${index}`,
      source: `item-${item.id}`,
      sourceHandle: `${item.id}-${sourceHandle}`,
      target: `link-${index}`,
      targetHandle: `${link.target.id}-${targetHandle}`,
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
    <div style={{ height: '100%', backgroundColor: '#003b49' }}>
      <ReactFlow
        nodes={[itemNode, ...linkNodes]}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background
          id="1"
          gap={10}
          color="#005266"
          variant={BackgroundVariant.Lines}
        />
        <Background
          id="2"
          gap={100}
          offset={1}
          color="#00627A"
          variant={BackgroundVariant.Lines}
        />
      </ReactFlow>
    </div>
  );
}
