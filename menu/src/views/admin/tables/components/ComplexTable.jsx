// ComplexTable.jsx
import React, { useState, useEffect } from "react";
import Card from "components/card";
import {
  getAllMenusByRestaurantId,
  toggleItemStatus,
  getAllCategoriessByRestaurantId,
} from "../../../../Services/allApi";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Switch from "components/switch";
import { FiSearch } from "react-icons/fi";
import Dropdown from "components/icons/Dropdown";

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const restaurantId = "000000000001";
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Select all category");
  const [selectedStatus, setSelectedStatus] = useState("Select all status");
  const [categories, setCategories] = useState([]);

  const columns = [
    columnHelper.accessor("imageUrls", {
      id: "imageUrls",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">IMAGE</p>
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
        <p className="text-sm font-bold text-gray-600 dark:text-white">NAME</p>
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
        <p className="text-sm font-bold text-gray-600 dark:text-white">TYPE</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
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
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, [restaurantId]);

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

  if (loading) return <div className="mt-5">Loading...</div>;
  if (error) return <div className="mt-5 text-red-500">{error}</div>;

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <Card extra="h-[600px] px-10 pb-10 sm:overflow-x-auto">
      {/* FILTER BAR */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-y-2 sm:gap-x-4">
        {/* Search */}
        <div className="w-full sm:w-64 relative">
          <FiSearch
            className="
              pointer-events-none
              absolute left-3
              top-1/2 transform -translate-y-1/2
              h-5 w-5
              text-gray-400 dark:text-white
            "
          />
          <input
            type="text"
            placeholder="Search menu..."
            className="
              w-full h-12 pl-10 pr-3
              rounded-md bg-lightPrimary
              text-sm font-medium text-navy-700
              outline-none placeholder-gray-400
              dark:bg-navy-900 dark:text-white dark:placeholder-gray-500
            "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-64 sm:mt-0 mt-2">
          <Dropdown
            options={["Select all category", ...categories.map((c) => c.name)]}
            selectedOption={selectedFilter}
            setSelectedOption={setSelectedFilter}
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-64 sm:mt-0 mt-2">
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
                    className="
                      cursor-pointer border-b-[1px] border-gray-200
                      pt-4 pb-2 pr-4 text-start
                    "
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
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="min-w-[150px] border-white/0 py-3 pr-4"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headerGroups[0].headers.length}
                  className="text-center py-8 text-gray-500"
                >
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
