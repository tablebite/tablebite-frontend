import React, { useState } from 'react';

const AddMenuForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    accountType: 'Personal',  // Default to 'Personal'
    requestedLimit: '$1,000',
    multiSelect: [],
    message: '',
    privacyPolicy: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiSelectChange = (e) => {
    const { value, selected } = e.target;
    let updatedMultiSelect = [...formData.multiSelect];
    if (selected) {
      updatedMultiSelect.push(value);
    } else {
      updatedMultiSelect = updatedMultiSelect.filter(item => item !== value);
    }
    setFormData({ ...formData, multiSelect: updatedMultiSelect });
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <form>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Account Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Account Type</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="personal"
                name="accountType"
                value="Personal"
                checked={formData.accountType === 'Personal'}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="personal" className="ml-2 text-sm dark:text-gray-200">Personal</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="business"
                name="accountType"
                value="Business"
                checked={formData.accountType === 'Business'}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="business" className="ml-2 text-sm dark:text-gray-200">Business</label>
            </div>
          </div>
        </div>

        {/* Requested Limit */}
        <div className="mb-4">
          <label htmlFor="requestedLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Requested Limit</label>
          <input
            type="text"
            id="requestedLimit"
            name="requestedLimit"
            value={formData.requestedLimit}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Multiselect */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Multiselect</label>
          <select
            name="multiSelect"
            multiple
            value={formData.multiSelect}
            onChange={handleMultiSelectChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
            <option value="Option 4">Option 4</option>
            <option value="Option 5">Option 5</option>
          </select>
        </div>

        {/* Message */}
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Privacy Policy */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="privacyPolicy"
            name="privacyPolicy"
            checked={formData.privacyPolicy}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <label htmlFor="privacyPolicy" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
            I agree to the <a href="#" className="text-indigo-600">privacy policy</a>
          </label>
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenuForm;
