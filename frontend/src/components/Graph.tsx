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
            onNodeClick(clickedNode);

            // Smoothly focus on the clicked node
            network.focus(clickedNodeId, {
              scale: 1.0,
              animation: {
                duration: 500,
                easingFunction: "easeInOutQuad",
              },
            });

            // Update the visibility of nodes and edges
            updateGraphVisibility(clickedNodeId);
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

      // Initial graph setup
      initializeGraph();
    }
  }, [nodes, edges, onNodeClick]);

  const initializeGraph = () => {
    if (networkRef.current) {
      const graphData = {
        nodes: new DataSet(nodes.map((node) => ({
          id: node.id,
          label: node.name,
          value: node.similarity * 10,
          hidden: true, // Initially hide all nodes
        }))),
        edges: new DataSet(edges.map((edge, index) => ({
          id: `${edge.source}-${edge.target}-${index}`,
          from: edge.source,
          to: edge.target,
          hidden: true, // Initially hide all edges
        }))),
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
          enabled: true,
        },
      };

      networkRef.current.setData(graphData);
      networkRef.current.setOptions(options);

      // Reveal the initial node and its neighbors
      updateGraphVisibility(currentNodeId);
    }
  };

  const updateGraphVisibility = (nodeId: number) => {
    if (networkRef.current) {
      const connectedEdges = edges.filter(
        (edge) => edge.source === nodeId || edge.target === nodeId
      );

      const connectedNodeIds = new Set<number>();
      connectedNodeIds.add(nodeId);
      connectedEdges.forEach((edge) => {
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
      });

      const nodesToUpdate = nodes.map((node) => ({
        id: node.id,
        hidden: !connectedNodeIds.has(node.id),
      }));

      const edgesToUpdate = edges.map((edge, index) => ({
        id: `${edge.source}-${edge.target}-${index}`,
        hidden: !(connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target)),
      }));

      networkRef.current.body.data.nodes.update(nodesToUpdate);
      networkRef.current.body.data.edges.update(edgesToUpdate);
    }
  };

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
