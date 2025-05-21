import React, { useState, useEffect } from "react";
import { addMenus, getRestaurantList } from "../Services/allApi";
import axios from "axios";

function DashboardSA() {
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    itemName: "",
    itemDescription: "",
    restaurantId: "",
    restaurantName: "",
    price: 0,
    totalQuantity: 0,
    imageUrl: "",
  });
  const [message, setMessage] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await getRestaurantList();
        if (res?.status === 200) {
          setRestaurants(res.data);
        } else {
          setMessage("Failed to fetch restaurants.");
        }
      } catch (error) {
        setMessage("An error occurred while fetching the restaurants.");
      }
    };

    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "restaurantId") {
      const selectedRestaurant = restaurants.find(
        (restaurant) => restaurant.restaurantId === value
      );
      setNewMenuItem({
        ...newMenuItem,
        [name]: value,
        restaurantName: selectedRestaurant ? selectedRestaurant.restaurantName : "",
      });
    } else {
      setNewMenuItem({ ...newMenuItem, [name]: value });
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setMessage("Please select an image before uploading.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "menu-item");
      const response = await axios.post("https://api.cloudinary.com/v1_1/dsybk6rge/image/upload", formData);

      if (response?.data?.secure_url) {
        setNewMenuItem((prevItem) => ({
          ...prevItem,
          imageUrl: response.data.secure_url,
        }));
        setMessage("Image uploaded successfully!");
      } else {
        setMessage("Failed to upload image.");
      }
    } catch (error) {
      setMessage("An error occurred during image upload.");
    }
  };

  const handleAddMenuItem = () => {
    const price = parseFloat(newMenuItem.price);
    const totalQuantity = parseInt(newMenuItem.totalQuantity, 10);

    if (
      !newMenuItem.itemName ||
      !newMenuItem.itemDescription ||
      isNaN(price) ||
      isNaN(totalQuantity) ||
      !newMenuItem.restaurantId ||
      !newMenuItem.imageUrl
    ) {
      setMessage("Please fill all fields correctly before adding.");
      return;
    }

    setMenuItems([
      ...menuItems,
      {
        ...newMenuItem,
        price,
        totalQuantity,
        restaurantName: newMenuItem.restaurantName,
      },
    ]);

    setNewMenuItem({
      itemName: "",
      itemDescription: "",
      restaurantId: "",
      restaurantName: "",
      price: 0,
      totalQuantity: 0,
      imageUrl: "",
    });
    setImageFile(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (menuItems.length === 0) {
      setMessage("Please add at least one menu item.");
      return;
    }

    const username = "admin";
    const password = "admin123";
    const reqHeaders = {
      Authorization: "Basic " + btoa(username + ":" + password),
    };

    try {
      const res = await addMenus(menuItems, reqHeaders);
      if (res?.status === 201) {
        setMessage("Menu items added successfully!");
        setMenuItems([]);
      } else {
        setMessage("Failed to add menu items. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred while adding the menu items.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add New Menu Items</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={newMenuItem.itemName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Description</label>
            <textarea
              name="itemDescription"
              value={newMenuItem.itemDescription}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item description"
              rows="3"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={newMenuItem.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
              <input
                type="number"
                name="totalQuantity"
                value={newMenuItem.totalQuantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter total quantity"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Restaurant</label>
            <select
              name="restaurantId"
              value={newMenuItem.restaurantId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a restaurant
              </option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.restaurantId}>
                  {restaurant.restaurantName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Upload Image
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddMenuItem}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Add to List
            </button>
          </div>
        </form>
        <div className="mt-6">
          <h4 className="text-lg font-semibold">Menu Items to Add:</h4>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-sm">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.itemName} - ₹{item.price}, Quantity: {item.totalQuantity}, Restaurant:{" "}
                {item.restaurantName}, Image: {item.imageUrl ? "Uploaded" : "Not uploaded"}
              </li>
            ))}
          </ul>
        </div>
        {menuItems.length > 0 && (
          <div>
            <button
              onClick={handleSubmit}
              className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
            >
              Submit All Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardSA;
