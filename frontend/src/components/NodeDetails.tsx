import React from "react";
import { Node } from "../App";
import './NodeDetails.css'

interface NodeDetailsProps {
  node: Node;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({ node }) => {
  return (
    <div className="node-details">
      <h2>{node.name}</h2>
      <p>Similarity: {node.similarity}</p>
      <p>{node.info}</p>
    </div>
  );
};

export default NodeDetails;
