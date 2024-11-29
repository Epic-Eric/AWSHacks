import React from "react";

interface TooltipProps {
  x: number;
  y: number;
  content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, content }) => {
  if (!content) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: y - 80,
        left: x + 100,
        pointerEvents: "none",
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "10px",
        zIndex: 1000,
        transform: "translate(-50%, -50%)",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        borderRadius: "4px",
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip;
