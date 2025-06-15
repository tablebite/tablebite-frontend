// Dropdown.jsx
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Dropdown({
  options = [],
  selectedOption,
  setSelectedOption,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((o) => !o);
  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
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
        <div
          className="
            absolute left-0 mt-1 w-full
            bg-white text-sm shadow-lg rounded-md
            border border-gray-300
            dark:bg-navy-900 dark:border-gray-600
            z-10 max-h-60 overflow-y-auto
          "
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
