import React, { useEffect, useState } from "react";
import { getRestaurantList, updateRestaurants } from "../Services/allApi"; // Update the import to include updateRestaurants

function ViewRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // To store filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingRestaurant, setEditingRestaurant] = useState(null); // State to store the restaurant being edited
  const [restaurantData, setRestaurantData] = useState({
    id: "",
    restaurantName: "",
    description: "",
    restaurantId: "",
    location: "",
    colorTheme:"",
  }); // State to store the input values for editing
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Fetch the list of restaurants when the component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      const username = "admin"; // Update based on your auth setup
      const password = "admin123"; // Update based on your auth setup
      const reqHeaders = {
        Authorization: "Basic " + btoa(username + ":" + password),
      };

      try {
        const response = await getRestaurantList(reqHeaders);
        if (response?.status === 200) {
          setRestaurants(response?.data || []);
          setFilteredRestaurants(response?.data || []); // Initialize filteredRestaurants
          setLoading(false);
        } else {
          setError("Failed to fetch restaurants");
        }
      } catch (err) {
        setError("An error occurred while fetching restaurants");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle opening the edit modal/form
  const handleEditClick = (restaurant) => {
    setEditingRestaurant(restaurant.restaurantId);
    setRestaurantData({
      id: restaurant.id,
      restaurantName: restaurant.restaurantName,
      description: restaurant.description,
      restaurantId: restaurant.restaurantId,
      location: restaurant.location,
      colorTheme: restaurant.colorTheme,
    });
  };

  // Handle the update form submission
  const handleUpdate = async () => {
    const username = "admin"; // Update based on your auth setup
    const password = "admin123"; // Update based on your auth setup
    const reqHeaders = {
      Authorization: "Basic " + btoa(username + ":" + password),
    };

    try {
      // Wrap restaurantData in an array for the request body
      const requestBody = [restaurantData];

      const response = await updateRestaurants(requestBody, reqHeaders); // Call API to update the restaurant
      if (response?.status === 204) {
        // Update the restaurant list after successful update
        const updatedRestaurants = restaurants.map((restaurant) =>
          restaurant.restaurantId === editingRestaurant
            ? { ...restaurant, ...restaurantData }
            : restaurant
        );
        setRestaurants(updatedRestaurants);
        setFilteredRestaurants(updatedRestaurants); // Ensure filtered list stays updated
        setEditingRestaurant(null);
      } else {
        setError("Failed to update restaurant");
      }
    } catch (err) {
      setError("An error occurred while updating restaurant");
    }
  };

  // Filter restaurants based on the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredRestaurants(restaurants); // If search is empty, show all restaurants
    } else {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.restaurantName.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.restaurantId.toString().includes(query) ||
        restaurant.colorTheme.toString().includes(query)
      );
      setFilteredRestaurants(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurants</h2>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by any keyword..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700 sm:px-4">
              Restaurant Name
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700 sm:px-4">
              Description
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700 sm:px-4">
              Location
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700 sm:px-4">
              Restaurant ID
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700 sm:px-4">
              Actions
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700 sm:px-4">
              Theme Color
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.map((restaurant) => (
            <tr key={restaurant.restaurantId}>
              <td className="px-4 py-2 text-sm text-gray-800">{restaurant.restaurantName}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{restaurant.description}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{restaurant.location}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{restaurant.restaurantId}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{restaurant.colorTheme}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                <button
                  onClick={() => handleEditClick(restaurant)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Restaurant Modal/Popup */}
      {editingRestaurant && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit Restaurant</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
              <input
                type="text"
                value={restaurantData.restaurantName}
                onChange={(e) =>
                  setRestaurantData({ ...restaurantData, restaurantName: e.target.value })
                }
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={restaurantData.description}
                onChange={(e) =>
                  setRestaurantData({ ...restaurantData, description: e.target.value })
                }
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={restaurantData.location}
                onChange={(e) =>
                  setRestaurantData({ ...restaurantData, location: e.target.value })
                }
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Theme color</label>
              <input
                type="text"
                value={restaurantData.colorTheme}
                onChange={(e) =>
                  setRestaurantData({ ...restaurantData, colorTheme: e.target.value })
                }
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditingRestaurant(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewRestaurants;
