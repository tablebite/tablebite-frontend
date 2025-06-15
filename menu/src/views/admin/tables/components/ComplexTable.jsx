// src/components/ComplexTable.jsx

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
  updateItemByRestaurantId,
} from "../../../../Services/allApi";
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

  // react-select styles
  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
      borderColor: isDark ? "#334155" : "#d1d5db",
      color: isDark ? "#f1f5f9" : "#111827",
    }),
    singleValue: (base) => ({ ...base, color: isDark ? "#f1f5f9" : "#111827" }),
    placeholder: (base) => ({ ...base, color: isDark ? "#94a3b8" : "#6b7280" }),
    menu: (base) => ({ ...base, backgroundColor: isDark ? "#1e293b" : "#ffffff" }),
    menuList: (base) => ({ ...base, backgroundColor: isDark ? "#1e293b" : "#ffffff" }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? (isDark ? "#334155" : "#f3f4f6") : "transparent",
      color: isDark ? "#f1f5f9" : "#111827",
    }),
    input: (base) => ({ ...base, color: isDark ? "#f1f5f9" : "#111827" }),
  };

  // DATA & FILTERS
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Select all category");
  const [selectedStatus, setSelectedStatus] = useState("Select all status");

  // LOADING / ERROR / SORTING
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);

  // CATEGORIES
  const [categories, setCategories] = useState([]);

  // EDIT MODAL
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    categoryName: "",
    type: "",
    imageUrls: [],
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
        return matchText && matchCat && matchStatus;
      })
    );
  }, [searchQuery, data, selectedFilter, selectedStatus]);

  // open/close edit modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormValues({
      name: item.name || "",
      description: item.description || "",
      categoryName: item.categoryName || "",
      type: item.type || "",
      imageUrls: item.imageUrls || [],
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
      const resp = await updateItemByRestaurantId(
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
        <button
          onClick={() => openEditModal(row.original)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
        >
          <FiEdit className="w-5 h-5 text-blue-500" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) return <div className="mt-5">Loading...</div>;

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const options = categories.map((c) => ({ value: c.name, label: c.name }));

  return (
    <>
      {/* fixed-height card with always-on scrollbar */}
      <Card extra="h-[600px] px-10 pb-10 overflow-y-scroll">
        {/* FILTER BAR */}
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
          <div className="w-full sm:w-64 relative z-20">
            <Dropdown
              options={["Select all category", ...categories.map((c) => c.name)]}
              selectedOption={selectedFilter}
              setSelectedOption={setSelectedFilter}
            />
          </div>
          <div className="w-full sm:w-64 relative z-20">
            <Dropdown
              options={["Select all status", "Active", "Inactive"]}
              selectedOption={selectedStatus}
              setSelectedOption={setSelectedStatus}
            />
          </div>
        </div>

        {/* TABLE (now table-fixed!) */}
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
              <div className="relative z-20">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Category
                </label>
                <Select
                  value={{ value: formValues.categoryName, label: formValues.categoryName }}
                  onChange={(opt) => handleFormChange("categoryName", opt.value)}
                  options={options}
                  menuPlacement="bottom"
                  styles={{
                    ...selectStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                />
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
                  : `Yes, ${confirmState.newStatus ? "Activate" : "Deactivate"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
