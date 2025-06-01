import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { getMenuList, updateMenuItem } from "../Services/allApi";
import { Icon } from '@iconify/react/dist/iconify.js'; // Ensure Icon is imported

function ViewMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    restaurantId: "",
    category: "",
    foodType: "",
  });
  const [restaurants, setRestaurants] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [updatedMenus, setUpdatedMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      const username = "admin";
      const password = "admin123";
      const reqHeaders = {
        Authorization: "Basic " + btoa(username + ":" + password),
      };

      // try {
      //   const response = await getMenuList(reqHeaders);
      //   if (response?.status === 200) {
      //     const data = response?.data || [];
      //     setMenus(data);

      //     const uniqueRestaurants = [...new Set(data.map((menu) => menu.restaurantId))];
      //     setRestaurants(uniqueRestaurants);

      //     const uniqueCategories = [...new Set(data.map((menu) => menu.category))];
      //     setCategories(uniqueCategories);

      //     const uniqueFoodTypes = [...new Set(data.map((menu) => menu.foodType))];
      //     setFoodTypes(uniqueFoodTypes);

      //     setFilters((prevFilters) => ({
      //       ...prevFilters,
      //       category: uniqueCategories[0] || "",
      //       foodType: uniqueFoodTypes[0] || "",
      //     }));
      //   } else {
      //     setError("Failed to fetch menus.");
      //   }
      // } catch (err) {
      //   setError("An error occurred while fetching menus.");
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchMenus();
  }, []);

  const filteredMenus = useMemo(() => {
    let filtered = [...menus];

    // Apply filters
    if (filters.restaurantId) {
      filtered = filtered.filter((menu) => menu.restaurantId === filters.restaurantId);
    }
    if (filters.category) {
      filtered = filtered.filter((menu) => menu.category === filters.category);
    }
    if (filters.foodType) {
      filtered = filtered.filter((menu) => menu.foodType === filters.foodType);
    }

    // Apply search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((menu) => {
        return (
          menu.itemName?.toLowerCase().includes(lowerCaseSearchTerm) ||
          menu.itemDescription?.toLowerCase().includes(lowerCaseSearchTerm) ||
          menu.category?.toLowerCase().includes(lowerCaseSearchTerm) ||
          menu.foodType?.toLowerCase().includes(lowerCaseSearchTerm) ||
          menu.restaurantName?.toLowerCase().includes(lowerCaseSearchTerm) ||
          menu.restaurantId?.toString().toLowerCase().includes(lowerCaseSearchTerm) ||
          menu.price?.toString().toLowerCase().includes(lowerCaseSearchTerm) ||
          menu.totalQuantity?.toString().toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
    }

    return filtered;
  }, [filters, menus, searchTerm]);

  const formatSelectOption = (value) => {
    return { label: value, value };
  };

  const handleFilterChange = (name) => (selectedOption) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleEditClick = (menu) => {
    setEditingMenu(menu);
    setUpdatedMenus([{
      id: menu.id,
      itemName: menu.itemName,
      itemDescription: menu.itemDescription,
      price: menu.price,
      totalQuantity: menu.totalQuantity,
      category: menu.category,
      foodType: menu.foodType,
      restaurantId: menu.restaurantId,
      imageUrl: menu.imageUrl
    }]);
  };

  const handleInputChange = (e, menuId) => {
    const { name, value } = e.target;
    setUpdatedMenus((prev) =>
      prev.map((menu) =>
        menu.id === menuId ? { ...menu, [name]: value } : menu
      )
    );
  };

  const handleUpdateMenus = async () => {
    // try {
    //   const response = await updateMenuItem(updatedMenus);
    //   if (response?.status === 204) {
    //     // Update the menu items in the state
    //     setMenus((prevMenus) =>
    //       prevMenus.map((menu) => {
    //         const updatedMenu = updatedMenus.find((uMenu) => uMenu.id === menu.id);
    //         return updatedMenu ? { ...menu, ...updatedMenu } : menu;
    //       })
    //     );
    //     setEditingMenu(null);
    //     setUpdatedMenus([]);
    //   } else {
    //     setError("Failed to update the menus.");
    //   }
    // } catch (err) {
    //   setError("An error occurred while updating the menus.");
    // }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Menus</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Restaurant Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700">Restaurant ID</label>
            <Select
              name="restaurantId"
              value={
                filters.restaurantId
                  ? formatSelectOption(filters.restaurantId)
                  : null
              }
              onChange={handleFilterChange("restaurantId")}
              options={restaurants.map((r) => ({ label: r, value: r }))}
              placeholder="Select Restaurant"
              isClearable
            />
          </div>

          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select
              name="category"
              value={
                filters.category ? formatSelectOption(filters.category) : null
              }
              onChange={handleFilterChange("category")}
              options={categories.map((c) => ({ label: c, value: c }))}
              placeholder="Select Category"
              isClearable
            />
          </div>

          {/* Food Type Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700">Food Type</label>
            <Select
              name="foodType"
              value={
                filters.foodType ? formatSelectOption(filters.foodType) : null
              }
              onChange={handleFilterChange("foodType")}
              options={foodTypes.map((f) => ({ label: f, value: f }))}
              placeholder="Select Food Type"
              isClearable
            />
          </div>
        </div>

        {loading ? (
          
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-500"></div>
              </div>
         
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : filteredMenus.length === 0 ? (
          <div className="text-center py-4">No menus found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Item Image</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Item Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Food Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Restaurant</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenus.map((menu) => (
                  <tr key={menu.id}>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {menu.imageUrl ? (
                        <img
                          src={menu.imageUrl}
                          alt={menu.itemName || "Menu Item"}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">{menu.itemName}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{menu.itemDescription}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{menu.price}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{menu.totalQuantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{menu.category}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{menu.foodType}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{menu.restaurantName}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEditClick(menu)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editingMenu && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Menu</h3>
              {updatedMenus.map((menu) => (
                <div key={menu.id}>
                  <label className="block text-sm font-medium">Item Name</label>
                  <input
                    type="text"
                    name="itemName"
                    value={menu.itemName}
                    onChange={(e) => handleInputChange(e, menu.id)}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    name="itemDescription"
                    value={menu.itemDescription}
                    onChange={(e) => handleInputChange(e, menu.id)}
                    className="w-full p-2 mb-2 border rounded"
                  ></textarea>
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={menu.price}
                    onChange={(e) => handleInputChange(e, menu.id)}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    name="totalQuantity"
                    value={menu.totalQuantity}
                    onChange={(e) => handleInputChange(e, menu.id)}
                    className="w-full p-2 mb-2 border rounded"
                  />

                  <label className="block text-sm font-medium">Category</label>
                  <Select
                    name="category"
                    value={menu.category ? formatSelectOption(menu.category) : null}
                    onChange={(option) =>
                      setUpdatedMenus((prev) =>
                        prev.map((m) =>
                          m.id === menu.id ? { ...m, category: option.value } : m
                        )
                      )
                    }
                    options={categories.map((category) => ({
                      label: category,
                      value: category,
                    }))}
                    className="mb-2"
                  />

                  <label className="block text-sm font-medium">Food Type</label>
                  <Select
                    name="foodType"
                    value={menu.foodType ? formatSelectOption(menu.foodType) : null}
                    onChange={(option) =>
                      setUpdatedMenus((prev) =>
                        prev.map((m) =>
                          m.id === menu.id ? { ...m, foodType: option.value } : m
                        )
                      )
                    }
                    options={foodTypes.map((foodType) => ({
                      label: foodType,
                      value: foodType,
                    }))}
                    className="mb-2"
                  />

                  <label className="block text-sm font-medium">Restaurant ID</label>
                  <input
                    type="text"
                    name="restaurantId"
                    value={menu.restaurantId}
                    onChange={(e) => handleInputChange(e, menu.id)}
                    className="w-full p-2 mb-2 border rounded"
                  />
                </div>
              ))}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleUpdateMenus}
                >
                  Save Changes
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => {
                    setEditingMenu(null);
                    setUpdatedMenus([]);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewMenus;
