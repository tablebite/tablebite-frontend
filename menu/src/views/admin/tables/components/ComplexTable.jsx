import React, { useState, useEffect } from "react";
import Card from "components/card";
import Switch from "components/switch";
import Dropdown from "components/icons/Dropdown";
import ImageUploader, { uploadOne } from "./ImageUploader";

import loadingWebm from '../../../../assets/gif/loader-anim.webm'

import {
  getAllMenusByRestaurantId,
  toggleItemStatus,
  getAllCategoriessByRestaurantId,
  updateItemById,
  deleteItemById,
  addItem,
} from "../../../../Services/allApi";
import { FiTrash2, FiSearch, FiEdit } from "react-icons/fi";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

  // CATEGORIES
  const [categories, setCategories] = useState([]);

  // MODALS & FORM
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    categoryName: "",
    type: "VEG",
    imageUrls: [],
    vegNonVeg: "Select Veg/Non-Veg",
  });

  // validation
  const [nameError, setNameError] = useState("");

  // for Add flow
  const [pendingFiles, setPendingFiles] = useState([]);
  const [addUploading, setAddUploading] = useState(false);

  // for Edit flow
  const [pendingEditFiles, setPendingEditFiles] = useState([]);
  const [saveUploading, setSaveUploading] = useState(false);

  // STATUS CONFIRM
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    item: null,
    newStatus: false,
    loading: false,
  });

  // LOADING / ERROR
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SORTING (default: by id descending)
  const [sorting, setSorting] = useState([{ id: "id", desc: true }]);

  // prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow =
      isEditOpen || confirmState.isOpen || isAddModalOpen
        ? "hidden"
        : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditOpen, confirmState.isOpen, isAddModalOpen]);

  // fetch data & categories, then sort descending by id
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [menusRes, catsRes] = await Promise.all([
          getAllMenusByRestaurantId(restaurantId),
          getAllCategoriessByRestaurantId(restaurantId),
        ]);
        const sorted = [...menusRes.data].sort(
          (a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)
        );
        setData(sorted);
        setFilteredData(sorted);
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
        const matchVegNonVeg =
          formValues.vegNonVeg === "Select Veg/Non-Veg" ||
          (formValues.vegNonVeg === "Veg" && item.type === "Veg") ||
          (formValues.vegNonVeg === "Non-Veg" && item.type === "Non-Veg");
        return matchText && matchCat && matchStatus && matchVegNonVeg;
      })
    );
  }, [searchQuery, data, selectedFilter, selectedStatus, formValues.vegNonVeg]);

  // open/close add modal
  const openAddModal = () => {
    setFormValues({
      name: "",
      description: "",
      categoryName: categories[0]?.name || "",
      type: "VEG",
      imageUrls: [],
      vegNonVeg: "Select Veg/Non-Veg",
    });
    setPendingFiles([]);
    setNameError("");
    setError(null);
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setError(null);
    setNameError("");
    setPendingFiles([]);
  };

  // open/close edit modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormValues({
      name: item.name || "",
      description: item.description || "",
      categoryName: item.categoryName || "",
      type: (item.type ?? "").toUpperCase().replace(/-/g, "_"),
      imageUrls: item.imageUrls || [],
      vegNonVeg: item.vegNonVeg || "Select Veg/Non-Veg",
    });
    setPendingEditFiles([]);
    setNameError("");
    setError(null);
    setIsEditOpen(true);
  };
  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingItem(null);
    setError(null);
    setNameError("");
    setPendingEditFiles([]);
  };

  // open/close delete modal
  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // STATUS CONFIRM
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
    setConfirmState((s) => ({ ...s, loading: true }));
    try {
      await toggleItemStatus(restaurantId, confirmState.item.id);
      setData((d) =>
        d.map((i) =>
          i.id === confirmState.item.id
            ? { ...i, isEnabled: confirmState.newStatus }
            : i
        )
      );
      setFilteredData((d) =>
        d.map((i) =>
          i.id === confirmState.item.id
            ? { ...i, isEnabled: confirmState.newStatus }
            : i
        )
      );
      closeConfirm();
    } catch {
      setError("Failed to update status");
      setConfirmState((s) => ({ ...s, loading: false }));
    }
  };

  // handle delete
  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItemById(restaurantId, itemToDelete.id);
      setData((d) => d.filter((i) => i.id !== itemToDelete.id));
      setFilteredData((d) => d.filter((i) => i.id !== itemToDelete.id));
      closeDeleteModal();
    } catch {
      setError("Error deleting item");
    }
  };

  // form change helper (clears nameError when user types)
  const handleFormChange = (field, value) => {
    setFormValues((fv) => ({ ...fv, [field]: value }));
    if (field === "name") setNameError("");
  };

  // save edited item (with optional upload of pendingEditFiles)
  const handleSave = async () => {
    if (!editingItem) return;
    setError(null);
    // validation
    if (!formValues.name.trim()) {
      setNameError("Name is required");
      return;
    }
    setSaveUploading(true);
    try {
      // upload any new files
      let finalUrls = formValues.imageUrls;
      if (pendingEditFiles.length > 0) {
        const uploaded = await Promise.all(
          pendingEditFiles.map((f) => uploadOne(f))
        );
        finalUrls = [...finalUrls, ...uploaded];
      }
      // build payload
      const chosenCat = categories.find(
        (c) => c.name === formValues.categoryName
      );
      const payload = {
        name: formValues.name,
        description: formValues.description,
        categoryId: chosenCat?.id || "",
        type: formValues.type,
        imageUrls: finalUrls,
      };
      // call API
      const resp = await updateItemById(
        restaurantId,
        editingItem.id,
        payload
      );
      const updated = resp.data;
      // update state
      setData((d) => d.map((i) => (i.id === updated.id ? updated : i)));
      setFilteredData((d) =>
        d.map((i) => (i.id === updated.id ? updated : i))
      );
      // cleanup
      setPendingEditFiles([]);
      closeEditModal();
    } catch {
      setError("Failed to update item");
    } finally {
      setSaveUploading(false);
    }
  };

  // add new item (with optional upload of pendingFiles)
  const handleAdd = async () => {
    setError(null);
    // validation
    if (!formValues.name.trim()) {
      setNameError("Name is required");
      return;
    }
    setAddUploading(true);
    try {
      // upload any new files
      let finalUrls = formValues.imageUrls;
      if (pendingFiles.length > 0) {
        const uploaded = await Promise.all(
          pendingFiles.map((f) => uploadOne(f))
        );
        finalUrls = [...finalUrls, ...uploaded];
      }
      // build request
      const chosenCat = categories.find(
        (c) => c.name === formValues.categoryName
      );
      const requestBody = {
        name: formValues.name,
        description: formValues.description,
        restaurantId,
        categoryId: chosenCat?.id,
        type: formValues.type,
        imageUrls: finalUrls,
      };
      const resp = await addItem(requestBody);
      const newItem = resp.data;
      // insert & sort
      setData((prev) =>
        [...prev, newItem].sort(
          (a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)
        )
      );
      setFilteredData((prev) =>
        [...prev, newItem].sort(
          (a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)
        )
      );
      // cleanup
      setPendingFiles([]);
      closeAddModal();
    } catch {
      setError("Error adding item");
    } finally {
      setAddUploading(false);
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
      header: () => (
        <p className="text-sm font-bold flex items-center">NAME</p>
      ),
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
        <span className="text-sm">{info.getValue().replace(/_/g, " ")}</span>
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
          <button
            onClick={() => openDeleteModal(row.original)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
          >
            <FiTrash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      ),
    }),
  ];

  // build the table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetSorting: false,
  });






  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <>
      <Card extra="h-[600px] px-10 pb-10">
        {/* Filters & Add button */}
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
              options={[
                "Select all category",
                ...categories.map((c) => c.name),
              ]}
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
          <div className="w-full sm:w-64 relative z-20">
            <Dropdown
              options={["Select Veg/Non-Veg", "Veg", "Non-Veg"]}
              selectedOption={formValues.vegNonVeg}
              setSelectedOption={(value) =>
                handleFormChange("vegNonVeg", value)
              }
            />
          </div>
          <div className="w-full sm:w-64 relative z-10 flex items-center justify-end">
            <button
              onClick={openAddModal}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl h-12"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Table */}
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
                      {flexRender(
                        h.column.columnDef.header,
                        h.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-navy-900/50 z-10">
                  <video
                    src={loadingWebm}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-[70px] w-[70px] object-contain"
                  />
                </div>
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-navy-700 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 align-top"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeAddModal}
        >
          <div
            className="relative bg-white dark:bg-navy-900 shadow-lg rounded-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Add Item
            </h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) =>
                    handleFormChange("name", e.target.value)
                  }
                  className={`w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 dark:text-white focus:outline-none ${
                    nameError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Description
                </label>
                <textarea
                  value={formValues.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-navy-800 dark:text-white"
                />
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Category <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formValues.categoryName}
                  onChange={(e) =>
                    handleFormChange("categoryName", e.target.value)
                  }
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
                  Type <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formValues.type}
                  onChange={(e) =>
                    handleFormChange("type", e.target.value)
                  }
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
                hideUploadButton={true}
                onFilesChange={(files) => setPendingFiles(files)}
              />
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
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
                  disabled={addUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {pendingFiles.length > 0
                    ? addUploading
                      ? "Uploading & Saving…"
                      : "Upload & Save"
                    : "Save"}
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
            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Edit Item
            </h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) =>
                    handleFormChange("name", e.target.value)
                  }
                  className={`w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 dark:text-white focus:outline-none ${
                    nameError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Description
                </label>
                <textarea
                  value={formValues.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-navy-800 dark:text-white"
                />
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Category <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formValues.categoryName}
                  onChange={(e) =>
                    handleFormChange("categoryName", e.target.value)
                  }
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
                  Type <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formValues.type}
                  onChange={(e) =>
                    handleFormChange("type", e.target.value)
                  }
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
                hideUploadButton={true}
                onFilesChange={(files) => setPendingEditFiles(files)}
              />
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
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
                  disabled={saveUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {pendingEditFiles.length > 0
                    ? saveUploading
                      ? "Uploading & Saving…"
                      : "Upload & Save"
                    : "Save"}
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
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {confirmState.loading
                  ? "Saving..."
                  : `Yes, ${
                      confirmState.newStatus ? "Activate" : "Deactivate"
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
