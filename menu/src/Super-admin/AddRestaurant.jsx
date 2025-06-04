import React, { useState } from "react";
import { addRestaurants } from "../Services/allApi";

const AddRestaurant = () => {
  const [newRestaurant, setNewRestaurant] = useState({
    restaurantName: "",
    description: "",
    location: "",
    colorTheme:"",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant({ ...newRestaurant, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset any existing messages

    // Validate fields
    if (!newRestaurant.restaurantName || !newRestaurant.description || !newRestaurant.location || !newRestaurant.colorTheme) {
      setMessage("Please fill all fields correctly before adding the restaurant.");
      return;
    }

    // try {
    //   const res = await addRestaurants([newRestaurant]); // Sending an array with one restaurant object
    //   if (res?.status === 201) {
    //     setMessage("Restaurant added successfully!");
    //     setNewRestaurant({ restaurantName: "", description: "", location: "", colorTheme: "" });
    //   } else {
    //     setMessage("Failed to add the restaurant. Please try again.");
    //   }
    // } catch (error) {
    //   setMessage("An error occurred while adding the restaurant.");
    // }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4">Add New Restaurant</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display message */}
        {message && (
          <div
            className={`p-3 rounded ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Restaurant Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            value={newRestaurant.restaurantName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F39C12]"
            placeholder="Enter restaurant name"
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={newRestaurant.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F39C12]"
            placeholder="Enter restaurant description"
            rows="3"
          />
        </div>

        {/* Location Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={newRestaurant.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F39C12]"
            placeholder="Enter restaurant location"
          />
        </div>

         {/* Color theme Field */}
         <div>
          <label className="block text-sm font-medium text-gray-700">Color theme</label>
          <input
            type="text"
            name="colorTheme"
            value={newRestaurant.colorTheme}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F39C12]"
            placeholder="Enter color theme"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-[#F39C12] text-white rounded-lg hover:bg-[#e67e22] focus:outline-none"
          >
            Add Restaurant
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
