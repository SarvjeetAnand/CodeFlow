import React from "react";

const languages = ["Python", "JavaScript", "C++", "Java", "Go", "Ruby", "PHP"];

export default function Sidebar({ onAddNode }) {
  return (
    <aside className="w-48 bg-gray-100 p-3 border-r border-gray-300 overflow-y-auto">
      <h3 className="font-semibold mb-2 text-center">Languages</h3>
      <ul>
        {languages.map((lang) => (
          <li
            key={lang}
            className="mb-2 p-2 bg-white rounded shadow cursor-pointer hover:bg-blue-100"
            onClick={() => onAddNode(lang)}
          >
            {lang}
          </li>
        ))}
      </ul>
    </aside>
  );
}
