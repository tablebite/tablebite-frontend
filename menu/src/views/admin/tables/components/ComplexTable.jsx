import React, { useState, useEffect } from "react";
import Select from "react-select";
import Card from "components/card";
import Switch from "components/switch";
import Dropdown from "components/icons/Dropdown";
import ImageUploader from "./ImageUploader";
import {
  getAllMenusByRestaurantId,
  toggleItemStatus,
  getAllCategoriessByRestaurantId,
  updateItemById,
  deleteItemById,
  addItem
} from "../../../../Services/allApi";


import { FiTrash2 } from "react-icons/fi";  // Import delete icon

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiSearch, FiEdit } from "react-icons/fi";

const columnHelper = createColumnHelper();
export default function ComplexTable() {
  const restaurantId = "000000000001";

  // detect dark mode
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");


  // DATA & FILTERS
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Select all category");
  const [selectedStatus, setSelectedStatus] = useState("Select all status");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
 

  // LOADING / ERROR / SORTING
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);

  // CATEGORIES
  const [categories, setCategories] = useState([]);

  // EDIT MODAL
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal state
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    categoryName: "",
    type: "",
    imageUrls: [],
    vegNonVeg: "Select Veg/Non-Veg", // Default to "Select Veg/Non-Veg"
  });
  const [saving, setSaving] = useState(false);

  // STATUS CONFIRM
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    item: null,
    newStatus: false,
    loading: false,
  });

  // prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow =
      isEditOpen || confirmState.isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditOpen, confirmState.isOpen]);


const openAddModal = () => {
  setIsAddModalOpen(true);
  setFormValues({
    name: "",
    description: "",
    categoryName: categories.length > 0 ? categories[0].name : "", // Default to first category
    type: "VEG", // Default to "VEG"
    imageUrls: [],
    vegNonVeg: formValues.vegNonVeg || "Select Veg/Non-Veg", // Ensure it retains the previous value of Veg/Non-Veg
  });
};


const closeAddModal = () => {
  setIsAddModalOpen(false);
  setFormValues({
    name: "",
    description: "",
    categoryName: "",
    type: "VEG",
    imageUrls: [],
    vegNonVeg: formValues.vegNonVeg || "Select Veg/Non-Veg", // Make sure this matches the dropdown value
  });
};


  // fetch data & categories
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [menusRes, catsRes] = await Promise.all([
          getAllMenusByRestaurantId(restaurantId),
          getAllCategoriessByRestaurantId(restaurantId),
        ]);
        setData(menusRes.data);
        setFilteredData(menusRes.data);
        setCategories(catsRes.data);
      } catch {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId]);

  // filtering logic
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredData(
      data.filter((item) => {
        const matchText =
          item.name.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q);
        const matchCat =
          selectedFilter === "Select all category" ||
          item.categoryName === selectedFilter;
        const matchStatus =
          selectedStatus === "Select all status" ||
          (selectedStatus === "Active" && item.isEnabled) ||
          (selectedStatus === "Inactive" && !item.isEnabled);

        // Check if Veg/Non-Veg matches the item type
        const matchVegNonVeg =
          formValues.vegNonVeg === "Select Veg/Non-Veg" || // Allow both if no selection is made
          (formValues.vegNonVeg === "Veg" && item.type === "VEG") ||
          (formValues.vegNonVeg === "Non-Veg" && item.type === "NON_VEG");

        return matchText && matchCat && matchStatus && matchVegNonVeg;
      })
    );
  }, [searchQuery, data, selectedFilter, selectedStatus, formValues.vegNonVeg]);

  // open/close edit modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormValues({
      name: item.name || "",
      description: item.description || "",
      categoryName: item.categoryName || "",
      type: item.type || "",
      imageUrls: item.imageUrls || [],
      vegNonVeg: item.vegNonVeg || "Select Veg/Non-Veg", // Default to "Select Veg/Non-Veg" if not provided
    });
    setError(null);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingItem(null);
    setError(null);
  };

  // open/close status confirm
  const openConfirm = (item) => {
    setConfirmState({
      isOpen: true,
      item,
      newStatus: !item.isEnabled,
      loading: false,
    });
  };
  const closeConfirm = () => {
    setConfirmState({
      isOpen: false,
      item: null,
      newStatus: false,
      loading: false,
    });
  };

  const handleConfirmToggle = async () => {
    const { item, newStatus } = confirmState;
    setConfirmState((s) => ({ ...s, loading: true }));
    try {
      await toggleItemStatus(restaurantId, item.id);
      setData((d) =>
        d.map((i) =>
          i.id === item.id ? { ...i, isEnabled: newStatus } : i
        )
      );
      closeConfirm();
    } catch {
      setError("Failed to update status");
      setConfirmState((s) => ({ ...s, loading: false }));
    }
  };
  const handleDelete = async () => {
  if (itemToDelete) {
    try {
      await deleteItemById(restaurantId, itemToDelete.id); // Call delete API
      setData((prevData) => prevData.filter((item) => item.id !== itemToDelete.id)); // Remove deleted item from state
      closeDeleteModal();
    } catch (error) {
      setError("Error deleting item");
    }
  }
};




  // form change
  const handleFormChange = (field, value) =>
    setFormValues((fv) => ({ ...fv, [field]: value }));

  // save item
  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      const chosen = categories.find((c) => c.name === formValues.categoryName);
      const payload = {
        name: formValues.name,
        description: formValues.description,
        categoryId: chosen?.id || "",
        type: formValues.type,
        imageUrls: formValues.imageUrls,
      };
      const resp = await updateItemById(
        restaurantId,
        editingItem.id,
        payload
      );
      const updated = resp.data;
      setData((d) =>
        d.map((i) => (i.id === updated.id ? updated : i))
      );
      closeEditModal();
    } catch {
      setError("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (item) => {
  setItemToDelete(item);
  setIsDeleteModalOpen(true);
};

const closeDeleteModal = () => {
  setItemToDelete(null);
  setIsDeleteModalOpen(false);
};

const handleAdd = async () => {
  setSaving(true);
  const category = categories.find((cat) => cat.name === formValues.categoryName);
  const requestBody = {
    name: formValues.name,
    description: formValues.description,
    restaurantId,
    categoryId: category?.id,
    type: formValues.type,
    imageUrls: formValues.imageUrls,
  };

  try {
    await addItem(requestBody); // Call the addItem API
    setData((prevData) => [requestBody, ...prevData]);
    closeAddModal();
  } catch (error) {
    setError("Error adding item");
  } finally {
    setSaving(false);
  }
};


  // table columns
  const columns = [
    columnHelper.accessor("imageUrls", {
      id: "image",
      header: () => <p className="text-sm font-bold">IMAGE</p>,
      cell: (info) => {
        const img = info.row.original.imageUrls?.[0];
        return (
          <img
            src={
              img ||
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
            }
            alt=""
            className="w-16 h-16 object-cover rounded-md"
          />
        );
      },
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: () => <p className="text-sm font-bold">NAME</p>,
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("categoryName", {
      id: "categoryName",
      header: () => <p className="text-sm font-bold">CATEGORY</p>,
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("type", {
      id: "type",
      header: () => <p className="text-sm font-bold">TYPE</p>,
      cell: (info) => (
        <span className="text-sm">
          {info.getValue().replace(/_/g, " ")}
        </span>
      ),
    }),
    columnHelper.accessor("isEnabled", {
      id: "isEnabled",
      header: () => <p className="text-sm font-bold">STATUS</p>,
      cell: (info) => {
        const row = info.row.original;
        return (
          <Switch
            id={`switch-${row.id}`}
            checked={row.isEnabled}
            onChange={() => openConfirm(row)}
          />
        );
      },
    }),
   
    columnHelper.display({
      id: "actions",
      header: () => <p className="text-sm font-bold">ACTIONS</p>,
      cell: ({ row }) => (
    <div className="flex space-x-2">
      <button
        onClick={() => openEditModal(row.original)}
        className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
      >
        <FiEdit className="w-5 h-5 text-blue-500" />
      </button>
      {/* Delete Button */}
      <button
        onClick={() => openDeleteModal(row.original)}
        className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
      >
        <FiTrash2 className="w-5 h-5 text-red-500" />
      </button>
    </div>
  ),
})

  ];
  

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });


  if (loading) return <div className="mt-5 dark:text-white ">Loading...</div>;

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const options = categories.map((c) => ({ value: c.name, label: c.name }));

  return (
    <>
      <Card extra="h-[600px] px-10 pb-10">
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full h-12 pl-10 pr-3 rounded-md bg-lightPrimary text-sm placeholder-gray-400
                         dark:bg-navy-900 dark:text-white dark:placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-64 relative z-40">
            <Dropdown
              options={["Select all category", ...categories.map((c) => c.name)]}
              selectedOption={selectedFilter}
              setSelectedOption={setSelectedFilter}
            />
          </div>
          <div className="w-full sm:w-64 relative z-30">
            <Dropdown
              options={["Select all status", "Active", "Inactive"]}
              selectedOption={selectedStatus}
              setSelectedOption={setSelectedStatus}
            />
          </div>
          {/* Veg/Non-Veg Dropdown */}
          <div className="w-full sm:w-64 relative z-20">
            <Dropdown
              options={["Select Veg/Non-Veg", "Veg", "Non-Veg"]}
              selectedOption={formValues.vegNonVeg}
              setSelectedOption={(value) => handleFormChange("vegNonVeg", value)} // Handle change
            />
          </div>

          {/* Add Item Button */}
          <div className="w-full sm:w-64 relative z-10 flex items-center justify-end">
          <button
            onClick={() => openAddModal({})}  // Open the edit modal with empty form for adding new item
            className="px-4 py-3 bg-blue-600 text-white rounded-xl h-12" // Set height here to match the dropdown height
          >
            Add Item
          </button>
        </div>

        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              {headerGroups.map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      colSpan={h.colSpan}
                      onClick={h.column.getToggleSortingHandler()}
                      className="sticky top-0 border-b border-gray-200 dark:border-navy-700
                                 px-4 py-2 text-xs text-gray-600 dark:text-white text-left cursor-pointer
                                 bg-white dark:bg-navy-900 z-10"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-navy-700 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={headerGroups[0].headers.length}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isAddModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={closeAddModal}
          >
            <div
              className="relative bg-white dark:bg-navy-900 shadow-lg rounded-lg p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4 dark:text-white">Add Item</h2>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Name</label>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Description</label>
                  <textarea
                    value={formValues.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    className="w-full px-3 py-2 border rounded bg-white dark:bg-navy-800 dark:text-white"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Category</label>
                  <select
                    value={formValues.categoryName}
                    onChange={(e) => handleFormChange("categoryName", e.target.value)}
                    className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Type</label>
                  <select
                    value={formValues.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                    className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 dark:text-white"
                  >
                    <option value="VEG">VEG</option>
                    <option value="NON_VEG">NON VEG</option>
                  </select>
                </div>

              

                {/* Image Uploader */}
                <ImageUploader
                  imageUrls={formValues.imageUrls}
                  onChange={(urls) => setFormValues((fv) => ({ ...fv, imageUrls: urls }))}
                />

                {error && <div className="text-red-500 text-sm">{error}</div>}

                {/* Actions */}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={closeAddModal}
                    className="px-4 py-2 bg-gray-200 rounded dark:bg-navy-700 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



      {/* EDIT MODAL */}
      {isEditOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeEditModal}
        >
          <div
            className="relative bg-white dark:bg-navy-900 shadow-lg rounded-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4 dark:text-white">Edit Item</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Description
                </label>
                <textarea
                  value={formValues.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-navy-800 dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Category
                </label>
                <select
                  value={formValues.categoryName}
                  onChange={(e) => handleFormChange("categoryName", e.target.value)}
                  className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Type
                </label>
                <select
                  value={formValues.type}
                  onChange={(e) => handleFormChange("type", e.target.value)}
                  className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 dark:text-white"
                >
                  <option value="VEG">VEG</option>
                  <option value="NON_VEG">NON VEG</option>
                </select>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                imageUrls={formValues.imageUrls}
                onChange={(urls) =>
                  setFormValues((fv) => ({ ...fv, imageUrls: urls }))
                }
              />

              {error && <div className="text-red-500 text-sm">{error}</div>}

              {/* Actions */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-200 rounded dark:bg-navy-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
{/* DELETE MODAL */}
{isDeleteModalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center"
    onClick={closeDeleteModal}
  >
    <div
      className="relative bg-white dark:bg-navy-900 shadow-lg rounded-lg p-6 w-full max-w-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold dark:text-white">
        Confirm Deletion
      </h3>
      <p className="mt-2 dark:text-gray-300">
        Are you sure you want to remove{" "}
        <strong>{itemToDelete?.name}</strong>?
      </p>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={closeDeleteModal}
          className="px-4 py-2 bg-gray-200 rounded dark:bg-navy-700 dark:text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      {/* STATUS CONFIRMATION MODAL */}
      {confirmState.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeConfirm}
        >
          <div
            className="bg-white dark:bg-navy-900 rounded-lg p-6 w-full max-w-sm shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold dark:text-white">
              Confirm Status Change
            </h3>
            <p className="mt-2 dark:text-gray-300">
              Are you sure you want to{" "}
              <strong>
                {confirmState.newStatus ? "activate" : "deactivate"}{" "}
                {confirmState.item.name}
              </strong>
              ?
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 bg-gray-200 rounded dark:bg-navy-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggle}
                disabled={confirmState.loading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 z-5"
              >
                {confirmState.loading
                  ? "Saving..."
                  : `Yes, ${confirmState.newStatus ? "Activate" : "Deactivate"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
