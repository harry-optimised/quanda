import { Quadtree, quadtree, QuadtreeLeaf } from 'd3-quadtree';

interface Node {
  x: number;
  y: number;
  width: number;
  [key: string]: any; // Additional properties
}

export function collide() {
  let nodes: Node[] = [];

  const force = (alpha: number): void => {
    const tree: Quadtree<Node> = quadtree(
      nodes,
      (d: Node) => d.x,
      (d: Node) => d.y
    );

    for (const node of nodes) {
      const r: number = node.width / 2;
      const nx1: number = node.x - r;
      const nx2: number = node.x + r;
      const ny1: number = node.y - r;
      const ny2: number = node.y + r;

      tree.visit((quad, x1, y1, x2, y2) => {
        if (!quad.length) {
          let currentQuad: QuadtreeLeaf<Node> | undefined = quad;
          do {
            if (currentQuad.data !== node) {
              const r: number = node.width / 2 + currentQuad.data.width / 2;
              let x: number = node.x - currentQuad.data.x;
              let y: number = node.y - currentQuad.data.y;
              let l: number = Math.hypot(x, y);

              if (l < r) {
                l = ((l - r) / l) * alpha;
                node.x -= x *= l;
                node.y -= y *= l;
                currentQuad.data.x += x;
                currentQuad.data.y += y;
              }
            }
          } while ((currentQuad = currentQuad.next));
        }

        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    }
  };

  force.initialize = (newNodes: Node[]): void => {
    nodes = newNodes;
  };

  return force;
}

export default collide;
