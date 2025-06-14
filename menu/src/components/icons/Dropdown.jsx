import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function Dropdown({ categories, setSelectedFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select category');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setSelectedFilter(option); // Update the selected filter
    setIsOpen(false);
  };

  return (
    <div className="relative ml-4">
      {/* Dropdown button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-64 h-12 px-4 bg-lightPrimary text-sm font-medium text-navy-700 outline-none dark:bg-navy-900 dark:text-white dark:outline-none rounded-md"
      >
        <span>{selectedOption}</span>
        <FiChevronDown className="text-gray-400 dark:text-white" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white text-sm shadow-lg rounded-md border border-gray-300 dark:bg-navy-900 dark:border-gray-600 z-10">
          {/* Set max-height and scrollable */}
          <div className="max-h-60 overflow-y-auto">
            <div
              onClick={() => handleOptionClick("All")}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
            >
              All
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleOptionClick(category.name)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
