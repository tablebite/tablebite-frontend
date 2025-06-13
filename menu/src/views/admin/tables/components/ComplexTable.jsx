import React, { useState, useEffect } from "react";
import Card from "components/card";
import { getAllMenusByRestaurantId } from "../../../../Services/allApi";
import { toggleItemStatus } from "../../../../Services/allApi"; // Import the toggle API
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Switch from "components/switch"; // Assuming Switch is a custom component

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
      cell: (info) => {
        const currentRow = info.row.original;

        return (
          <div className="mt-3 flex items-center gap-3">
            <Switch
              id={`switch-${currentRow.id}`} // Unique id for each switch
              checked={currentRow.isEnabled} // Set the switch state based on isEnabled
              onChange={async () => {
                // Optimistically update the state locally
                const updatedData = data.map((item) => {
                  if (item.id === currentRow.id) {
                    return {
                      ...item,
                      isEnabled: !item.isEnabled, // Toggle the state
                    };
                  }
                  return item;
                });

                setData(updatedData); // Update the data state to trigger re-render

                try {
                  // Call the API to update the status
                  await toggleItemStatus(restaurantId, currentRow.id);
                } catch (error) {
                  // If the API fails, revert the status back to the previous value
                  const revertedData = data.map((item) => {
                    if (item.id === currentRow.id) {
                      return {
                        ...item,
                        isEnabled: currentRow.isEnabled, // Revert to the original value
                      };
                    }
                    return item;
                  });
                  setData(revertedData); // Revert the data state
                  setError("Failed to update the status. Please try again.");
                }
              }}
            />
            {/* <label
              htmlFor={`switch-${currentRow.id}`}
              className="text-base font-medium text-navy-700 dark:text-white"
            >
              Item comment notifications
            </label> */}
          </div>
        );
      },
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
