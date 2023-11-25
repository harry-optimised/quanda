import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY
} from 'd3-force';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';

import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useStore
} from 'reactflow';

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-1000))
  .force('x', forceX().x(0).strength(0.05))
  .force('y', forceY().y(0).strength(0.05))
  .alphaTarget(0.05)
  .stop();

type LayoutedElementsReturnType = [
  boolean,
  (
    | {
        toggle: () => void;
        isRunning: () => boolean;
      }
    | Record<string, never>
  )
];

export const useLayoutedElements = (): LayoutedElementsReturnType => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const initialised = useStore((store) =>
    Array.from(store.nodeInternals.values()).every(
      (node) => node.width && node.height
    )
  );

  return useMemo(() => {
    const nodes = getNodes().map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y
    }));
    const edges = getEdges().map((edge) => edge);
    let running = false;

    console.log(running);

    // If React Flow hasn't initialised our nodes with a width and height yet, or
    // if there are no nodes in the flow, then we can't run the simulation!
    if (!initialised || nodes.length === 0) return [false, {}];

    simulation.nodes(nodes).force(
      'link',
      forceLink(edges)
        .id((d: any) => d.id)
        .strength(0.05)
        .distance(100)
    );

    // The tick function is called every animation frame while the simulation is
    // running and progresses the simulation one step forward each time.
    const tick = () => {
      simulation.tick();
      setNodes(
        nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } }))
      );

      window.requestAnimationFrame(() => {
        // Give React and React Flow a chance to update and render the new node
        // positions before we fit the viewport to the new layout.
        fitView();

        // If the simulation hasn't be stopped, schedule another tick.
        if (running) tick();
      });
    };

    const toggle = () => {
      running = !running;
      running && window.requestAnimationFrame(tick);
    };

    const isRunning = () => running;

    return [true, { toggle, isRunning }];
  }, [initialised]);
};
