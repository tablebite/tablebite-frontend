import React, { useState, useEffect } from "react";
import Card from "components/card";
import { getAllMenusByRestaurantId } from "../../../../Services/allApi";
import { toggleItemStatus } from "../../../../Services/allApi"; // Import the toggle API
import { getAllCategoriessByRestaurantId } from "../../../../Services/allApi"; // Import the categories API
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Switch from "components/switch"; // Assuming Switch is a custom component
import { FiSearch } from "react-icons/fi";
import Dropdown from "components/icons/Dropdown"; // Import the updated Dropdown

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const restaurantId = '000000000001'; // You can update this with a dynamic value if needed
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Data after applying search filter
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [sorting, setSorting] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All"); // For managing dropdown selection (default to "All")
  const [categories, setCategories] = useState([]); // Store categories fetched from API

  // Define columns for the table
  const columns = [
    columnHelper.accessor("imageUrls", {
      id: "imageUrls",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">IMAGE</p>
      ),
      cell: (info) => {
        const currentRow = info.row.original;
        const firstImage = currentRow.imageUrls && currentRow.imageUrls[0];

        return (
          <div className="flex items-center">
            {firstImage ? (
              <img src={firstImage} alt="item" className="w-16 h-16 object-cover rounded-md" />
            ) : (
              <img
                src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                alt="Placeholder"
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
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
        <p className="text-sm font-bold text-gray-600 dark:text-white">CATEGORY</p>
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
        <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>
      ),
      cell: (info) => {
        const currentRow = info.row.original;

        return (
          <div className="mt-3 flex items-center gap-3">
            <Switch
              id={`switch-${currentRow.id}`}
              checked={currentRow.isEnabled}
              onChange={async () => {
                const updatedData = data.map((item) => {
                  if (item.id === currentRow.id) {
                    return { ...item, isEnabled: !item.isEnabled };
                  }
                  return item;
                });
                setData(updatedData);

                try {
                  await toggleItemStatus(restaurantId, currentRow.id);
                } catch (error) {
                  const revertedData = data.map((item) => {
                    if (item.id === currentRow.id) {
                      return { ...item, isEnabled: currentRow.isEnabled };
                    }
                    return item;
                  });
                  setData(revertedData);
                  setError("Failed to update the status. Please try again.");
                }
              }}
            />
          </div>
        );
      },
    }),
  ];

  // Use React Table hook
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Fetch menus and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!restaurantId) {
          setError("Invalid restaurantId");
          setLoading(false);
          return;
        }

        const menuResponse = await getAllMenusByRestaurantId(restaurantId);
        const categoriesResponse = await getAllCategoriessByRestaurantId(restaurantId);

        setData(menuResponse.data);
        setFilteredData(menuResponse.data); // Initially show all data
        setCategories(categoriesResponse.data); // Set categories

        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  // Filter by search query or category filter
  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedFilter === "All" || item.categoryName === selectedFilter;

      return matchesSearch && matchesCategory;
    });

    setFilteredData(filtered);
  }, [searchQuery, data, selectedFilter]);

  if (loading) {
    return <div className="mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="mt-5">{error}</div>;
  }

  return (
    <Card extra={"w-full sm:w-[100%] md:w-[100%] lg:w-[100%] h-[600px] px-10 pb-10 sm:overflow-x-auto"}>
      <div className="mt-8 flex items-center rounded-md bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
        <p className="text-xl pe-2 ps-3">
          <FiSearch className="h-10 w-4 text-gray-400 dark:text-white" />
        </p>
        <input
          type="text"
          placeholder="Search menu..."
          className="mr-12 block h-full rounded-md bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dropdown categories={categories} setSelectedFilter={setSelectedFilter} />
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                    <div className="items-center justify-between text-xs text-gray-200">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
