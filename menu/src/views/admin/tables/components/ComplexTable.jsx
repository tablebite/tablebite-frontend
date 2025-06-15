// ComplexTable.jsx
import React, { useState, useEffect } from "react";
import Card from "components/card";
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
import Switch from "components/switch";
import { FiSearch, FiEdit } from "react-icons/fi";
import Dropdown from "components/icons/Dropdown";

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const restaurantId = "000000000001";

  // raw data & filters
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Select all category");
  const [selectedStatus, setSelectedStatus] = useState("Select all status");

  // loading / error / sorting
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);

  // categories list (for filter and modal)
  const [categories, setCategories] = useState([]);

  // modal & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    categoryName: "",
    type: "",
  });
  const [saving, setSaving] = useState(false);

  // lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // load data & categories
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const menusRes = await getAllMenusByRestaurantId(restaurantId);
        const catsRes = await getAllCategoriessByRestaurantId(restaurantId);
        setData(menusRes.data);
        setFilteredData(menusRes.data);
        setCategories(catsRes.data);
      } catch {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  // open modal & preload form
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormValues({
      name: item.name || "",
      description: item.description || "",
      categoryName: item.categoryName || "",
      type: item.type || "",
    });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError(null);
  };

  // form field change
  const handleFormChange = (field, value) =>
    setFormValues((prev) => ({ ...prev, [field]: value }));

  // save via API
  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      const chosenCategory = categories.find(
        (c) => c.name === formValues.categoryName
      );
      const payload = {
        name: formValues.name,
        description: formValues.description,
        categoryId: chosenCategory?.id || "",
        type: formValues.type,
        imageUrls: editingItem.imageUrls,
      };
      const updatedResp = await updateItemByRestaurantId(
        restaurantId,
        editingItem.id,
        payload
      );
      const updatedItem = updatedResp.data;
      setData((prev) =>
        prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
      );
      closeModal();
    } catch {
      setError("Failed to update item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // table columns
  const columns = [
    columnHelper.accessor("imageUrls", {
      id: "imageUrls",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          IMAGE
        </p>
      ),
      cell: (info) => {
        const img = info.row.original.imageUrls?.[0];
        return (
          <div className="flex items-center">
            <img
              src={
                img ||
                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              }
              alt="item"
              className="w-16 h-16 object-cover rounded-md"
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          NAME
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("categoryName", {
      id: "categoryName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          CATEGORY
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("type", {
      id: "type",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          TYPE
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue().replace(/_/g, " ")}
        </p>
      ),
    }),
    columnHelper.accessor("isEnabled", {
      id: "isEnabled",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          STATUS
        </p>
      ),
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="mt-3 flex items-center gap-3">
            <Switch
              id={`switch-${row.id}`}
              checked={row.isEnabled}
              onChange={async () => {
                const newData = data.map((item) =>
                  item.id === row.id
                    ? { ...item, isEnabled: !item.isEnabled }
                    : item
                );
                setData(newData);
                try {
                  await toggleItemStatus(restaurantId, row.id);
                } catch {
                  setData(data);
                  setError("Failed to update the status. Please try again.");
                }
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ACTIONS
        </p>
      ),
      cell: ({ row }) => (
        <button
          onClick={() => openEditModal(row.original)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
        >
          <FiEdit className="h-5 w-5 text-blue-500" />
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

  return (
    <>
      <Card extra="h-[600px] px-10 pb-10 sm:overflow-x-auto">
        {/* FILTER BAR */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-y-2 sm:gap-x-4">
          {/* Search */}
          <div className="w-full sm:w-64 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white" />
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full h-12 pl-10 pr-3 rounded-md bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-64">
            <Dropdown
              options={[
                "Select all category",
                ...categories.map((c) => c.name),
              ]}
              selectedOption={selectedFilter}
              setSelectedOption={setSelectedFilter}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-64">
            <Dropdown
              options={["Select all status", "Active", "Inactive"]}
              selectedOption={selectedStatus}
              setSelectedOption={setSelectedStatus}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-8 overflow-x-scroll xl:overflow-x-auto">
          <table className="w-full">
            <thead>
              {headerGroups.map((hg) => (
                <tr key={hg.id} className="!border-px !border-gray-400">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      colSpan={h.colSpan}
                      onClick={h.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="min-w-[150px] border-white/0 py-3 pr-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="relative z-60 bg-white dark:bg-navy-900 shadow-lg rounded-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Edit Item
            </h2>

            <div className="flex flex-col space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
                  Description
                </label>
                <textarea
                  value={formValues.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
                  Category
                </label>
                <select
                  value={formValues.categoryName}
                  onChange={(e) =>
                    handleFormChange("categoryName", e.target.value)
                  }
                  className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
                  Type
                </label>
                <select
                  value={formValues.type}
                  onChange={(e) => handleFormChange("type", e.target.value)}
                  className="w-full h-10 px-3 border rounded bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                >
                  <option value="VEG">VEG</option>
                  <option value="NON_VEG">NON VEG</option>
                </select>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              {/* Actions */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={closeModal}
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
    </>
  );
}
