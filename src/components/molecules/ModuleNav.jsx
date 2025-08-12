import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const modules = [
  { id: "qa", label: "Q&A", icon: "MessageSquare" },
  { id: "businesses", label: "Businesses", icon: "Building2" },
  { id: "events", label: "Events", icon: "Calendar" },
  { id: "jobs", label: "Jobs", icon: "Briefcase" },
  { id: "realestate", label: "Real Estate", icon: "Home" },
  { id: "cars", label: "Cars", icon: "Car" }
];

const ModuleNav = ({ activeModule, onModuleChange }) => {
  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-1 pb-2">
      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => onModuleChange(module.id)}
          className={`
            flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${activeModule === module.id 
              ? "bg-primary-500 text-white shadow-sm" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }
          `}
        >
          <ApperIcon name={module.icon} className="h-4 w-4" />
          <span className="whitespace-nowrap">{module.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModuleNav;