import React from "react";
import { Handle, Position } from "reactflow";

export default function LanguageNode({ data, isConnectable }) {
  const { language, code, setCode, isOutput, onReset } = data;

  return (
    <div
      className={`bg-white shadow-md rounded-xl border border-gray-300 w-64 p-3 ${
        data.darkMode ? "bg-gray-800 text-white" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-semibold text-blue-600">{language}</div>
        <button
          onClick={onReset}
          className="text-xs text-red-500 hover:underline"
          title="Reset node"
        >
          Reset
        </button>
      </div>

      <textarea
        className={`w-full text-xs p-2 border rounded-md resize-none h-40 focus:outline-none ${
          isOutput ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
        } ${data.darkMode ? "bg-gray-700 text-white" : ""}`}
        value={code}
        placeholder={isOutput ? "Converted code..." : "Paste your code here..."}
        onChange={(e) => !isOutput && setCode(e.target.value)}
        disabled={isOutput}
      />

      {/* Input & Output Handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
    </div>
  );
}
