import React from "react";

type TabType = "Board" | "List" | "Timeline" | "Table";

type ProjectHeaderProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void; // Fix: Enforcing correct type
};

const ProjectHeader = ({ activeTab, setActiveTab }: ProjectHeaderProps) => {
  return (
    <div className="mb-5 flex space-x-4">
      {(["Board", "List", "Timeline", "Table"] as TabType[]).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProjectHeader;
