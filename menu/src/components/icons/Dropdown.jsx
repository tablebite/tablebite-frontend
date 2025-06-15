// Dropdown.jsx
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Dropdown({ categories, setSelectedFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  const toggleDropdown = () => setIsOpen((o) => !o);
  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
    setSelectedFilter(opt);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className="
          w-full h-12 px-4 flex items-center justify-between
          bg-lightPrimary text-sm font-medium text-navy-700
          rounded-md outline-none
          dark:bg-navy-900 dark:text-white
        "
      >
        <span>{selectedOption}</span>
        <FiChevronDown className="text-gray-400 dark:text-white" />
      </button>

      {isOpen && (
        <div className="
          absolute left-0 mt-1 w-full
          bg-white text-sm shadow-lg rounded-md
          border border-gray-300
          dark:bg-navy-900 dark:border-gray-600
          z-10 max-h-60 overflow-y-auto
        ">
          <div
            onClick={() => handleOptionClick("All")}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
          >
            All
          </div>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleOptionClick(cat.name)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
            >
              {cat.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
