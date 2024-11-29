import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { Node, Edge } from "../App";
import NodeDetails from "./NodeDetails";
import Tooltip from "./Tooltip";

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (node: Node) => void;
}

const GraphVisualization: React.FC<GraphProps> = ({ nodes, edges, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // State to track the current node (using numerical ID)
  const [currentNodeId, setCurrentNodeId] = useState<number>(0); // '0' is the user node ID

  useEffect(() => {
    if (containerRef.current && !networkRef.current) {
      const network = new Network(containerRef.current, {}, {});
      networkRef.current = network;

      network.on("click", (params) => {
        if (params.nodes.length > 0) {
          const clickedNodeId = params.nodes[0] as number;
          const clickedNode = nodes.find((node) => node.id === clickedNodeId);
          if (clickedNode) {
            setCurrentNodeId(clickedNodeId);
            setHoveredNode(null);
            // Check if the clicked node is the user node
            if (clickedNodeId !== 0) { // Assuming '0' is the user node ID
              onNodeClick(clickedNode);
            } else {
              network.focus(clickedNodeId, { animation: true });
              
            }
          }
        }
      });

      network.on("hoverNode", (params) => {
        const hoveredNodeId = params.node as number;
        const hoveredNode = nodes.find((node) => node.id === hoveredNodeId);
        setHoveredNode(hoveredNode || null);
        setMousePosition({ x: params.pointer.DOM.x, y: params.pointer.DOM.y });
      });

      network.on("blurNode", () => {
        setHoveredNode(null);
      });

      return () => {
        network.destroy();
        networkRef.current = null;
      };
    }
  }, [nodes, onNodeClick]);

  useEffect(() => {
    if (networkRef.current) {
      // Filter edges connected to the current node
      const connectedEdges = edges.filter(
        (edge) => edge.source === currentNodeId || edge.target === currentNodeId
      );

      // Collect all connected node IDs
      const connectedNodeIds = new Set<number>();
      connectedNodeIds.add(currentNodeId);
      connectedEdges.forEach((edge) => {
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
      });

      // Filter nodes that are connected
      const displayedNodes = nodes.filter((node) => connectedNodeIds.has(node.id));

      const graphData = {
        nodes: new DataSet(
          displayedNodes.map((node) => ({
            id: node.id,
            label: node.name,
            value: node.similarity * 10,
          }))
        ),
        edges: new DataSet(
          connectedEdges.map((edge, index) => ({
            id: `${edge.source}-${edge.target}-${index}`, // Unique edge IDs
            from: edge.source,
            to: edge.target,
          }))
        ),
      };

      const options = {
        nodes: {
          shape: "dot",
          scaling: {
            min: 10,
            max: 30,
          },
          font: {
            size: 16,
          },
        },
        edges: {
          color: { color: "#848484" },
          width: 2,
        },
        interaction: {
          hover: true,
          dragNodes: false,
          zoomView: false,
          dragView: false,
        },
        physics: {
          enabled: false,
        },
      };

      networkRef.current.setData(graphData);
      networkRef.current.setOptions(options);

      // Center the graph on the current node
      networkRef.current.focus(currentNodeId, { animation: true });
    }
  }, [nodes, edges, currentNodeId]);

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <div ref={containerRef} style={{ height: "100%", border: "1px solid #ddd" }} />
      {hoveredNode && (
        <Tooltip
          x={mousePosition.x}
          y={mousePosition.y}
          content={<NodeDetails node={hoveredNode} />}
        />
      )}
    </div>
  );
};

export default GraphVisualization;
