import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY
} from 'd3-force';
import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Edge,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useStore,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import ItemNode from '../TaskNode';
import LinkNode from '../LinkNode';
import { RootState } from '../../state/store';
import { Item, Link, Position } from '../../types';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useRefreshItems } from '../../state/hooks';
import useNodePosition from '../../hooks/useNodePosition';
import PNG from '../SVG';
import { useSelector } from 'react-redux';
import { selectAllItems } from '../../state/store';
import { useLayoutedElements } from '../../hooks/useLayoutedElements';
import { ReactFlowProvider } from 'reactflow';
import collide from './collide';

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

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-1000))
  .force('x', forceX().x(0).strength(0.05))
  .force('y', forceY().y(0).strength(0.05))
  .force('collide', collide())
  .alphaTarget(0.5)
  .stop();

function LayoutFlow() {
  const allItems = useSelector(selectAllItems);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, , onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    const nodes = allItems.map((item: Item) => {
      return {
        id: `item-${item.id}`,
        type: 'itemNode',
        position: item.position,
        data: { item }
      };
    });
    setNodes(nodes);
  }, [allItems, setNodes]);

  const initialised = useStore((store) =>
    Array.from(store.nodeInternals.values()).every(
      (node) => node.width && node.height
    )
  );

  const simulationNodes = nodes.map((node) => ({
    ...node,
    x: node.position.x,
    y: node.position.y,
    width: 600,
    height: 400
  }));

  simulation.nodes(simulationNodes).force(
    'link',
    forceLink(edges)
      .id((d: any) => d.id)
      .strength(0.05)
      .distance(100)
  );

  //console.log(simulationNodes[0].width);

  const tick = () => {
    simulation.tick();
    console.log('TICK');
    setNodes(
      simulationNodes.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y }
      }))
    );
  };

  console.log('Render!');
  //window.requestAnimationFrame(tick);

  return (
    <div style={{ height: '100%', backgroundColor: '#003b49' }}>
      <ReactFlow
        nodes={nodes}
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

export default function Flow() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
