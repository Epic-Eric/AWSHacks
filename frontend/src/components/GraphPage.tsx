import React, { useState } from "react";
import Graph from "./Graph";
import NodeDetails from "./NodeDetails";
// import "./GraphPage.css";

export interface Node {
    id: number;
    name: string;
    similarity: number;
    info: string;
  }
  
  export interface Edge {
    source: number;
    target: number;
  }


const GraphPage: React.FC = () => {
  // Define your nodes and edges here or fetch them as needed
  const [nodes] = useState<Node[]>([
    { id: 0, name: "User", similarity: 1.0, info: "User node" },
    { id: 1, name: "Node A", similarity: 0.9, info: "Details about Node A" },
    { id: 2, name: "Node B", similarity: 0.7, info: "Details about Node B" },
    { id: 3, name: "Node C", similarity: 0.5, info: "Details about Node C" },
    { id: 4, name: "Node D", similarity: 0.3, info: "Details about Node D" },
  ]);

  const [edges] = useState<Edge[]>([
    { source: 0, target: 1 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
  ]);

  const [selectedNode, setSelectedNode] = useState<Node | null>(nodes[0]);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div className="GraphPage">
      <h1>Similarity Graph</h1>
      <Graph nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
      {selectedNode && <NodeDetails node={selectedNode} />}
    </div>
  );
};

export default GraphPage;
