import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Filter');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
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
          <div
            onClick={() => handleOptionClick('Category')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
          >
            Category
          </div>
          <div
            onClick={() => handleOptionClick('Type')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
          >
            Type
          </div>
          <div
            onClick={() => handleOptionClick('Price')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700"
          >
            Price
          </div>
        </div>
      )}
    </div>
  );
}
