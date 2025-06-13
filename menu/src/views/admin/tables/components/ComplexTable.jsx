import React, { useState, useEffect } from "react";
import Card from "components/card";
import { getAllMenusByRestaurantId } from "../../../../Services/allApi";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const restaurantId = '000000000001'; // You can update this with a dynamic value if needed
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [sorting, setSorting] = useState([]);

  // Define columns for the table, now using API response fields
  const columns = [
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
      cell: (info) => (
        <div className="flex items-center gap-3">
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              id="switch1"
              checked={info.getValue()}
              onChange={() => {
                // Handle the status toggle here
                const updatedData = [...data];
                const index = updatedData.findIndex(item => item.id === info.row.original.id);
                if (index !== -1) {
                  updatedData[index].isEnabled = !updatedData[index].isEnabled;
                  setData(updatedData);
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-white peer-checked:after:border-2 peer-checked:after:w-6 peer-checked:after:h-6 peer-checked:transition-all peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800 dark:peer-checked:bg-green-600"></div>
          </label>
          <label
            htmlFor="switch1"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Item comment notifications
          </label>
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue() ? "Enabled" : "Disabled"}
          </p>
        </div>
      ),
    }),
  ];

  // Use React Table hook
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      console.log("Fetching data...");

      try {
        if (!restaurantId) {
          setError("Invalid restaurantId");
          setLoading(false);
          return;
        }

        const response = await getAllMenusByRestaurantId(restaurantId);
        console.log("API Response: ", response);

        setData(response.data); // The response should be an array of objects
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Error fetching menus");
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenus();
    }
  }, [restaurantId]);

  if (loading) {
    return <div className="mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="mt-5">{error}</div>;
  }

  return (
    <Card extra={"w-full sm:w-[100%] md:w-[100%] lg:w-[100%] h-[600px] px-10 pb-10 sm:overflow-x-auto"}>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                  >
                    <div className="items-center justify-between text-xs text-gray-200">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
