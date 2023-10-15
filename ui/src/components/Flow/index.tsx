import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import ItemNode from '../TaskNode';
import useItems from '../../hooks/useItems';
import { Item } from '../../hooks/useItems';

const nodeTypes = { itemNode: ItemNode };

type ItemNode = {
  id: string;
  type: 'itemNode';
  position: { x: number; y: number };
  data: { item: Item };
};

export default function Flow({ primary }: { primary: number }) {
  const { items, error, isLoading } = useItems(primary);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading || !items) {
    return <div>Loading...</div>;
  }

  // Create nodes from items.
  const nodes: ItemNode[] = items.map((item): ItemNode => {
    return {
      id: `item-${item.id}`,
      type: 'itemNode',
      position: { x: 0, y: 0 },
      data: { item }
    };
  });

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
      >
        <Background color="#999" gap={16} />
      </ReactFlow>
    </div>
  );
}
