import React, { useState, useEffect } from 'react'
import { getAllMenusByRestaurantId, toggleItemStatus, getAllCategoriessByRestaurantId } from '../Services/allApi'

export default function Menu({ restaurantId }) {
  const [transactions, setTransactions] = useState([])  // Store all transactions
  const [loading, setLoading] = useState(false)  // Loading state
  const [error, setError] = useState(null)  // Error state
  const [searchQuery, setSearchQuery] = useState('')  // Search query state
  const [filteredTransactions, setFilteredTransactions] = useState([])  // Filtered transactions for display
  const [categories, setCategories] = useState([])  // Categories state
  const [selectedCategory, setSelectedCategory] = useState('')  // Selected category filter

  // Fetch all items and categories when restaurantId changes
  useEffect(() => {
    if (!restaurantId) return
    let cancelled = false

    // Fetch menu items
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const raw = await getAllMenusByRestaurantId(restaurantId)
        if (cancelled) return
        const payload = raw.data ?? raw
        setTransactions(Array.isArray(payload) ? payload : [])
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          setError('Failed to load items.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    // Fetch categories
    ;(async () => {
      try {
        const raw = await getAllCategoriessByRestaurantId(restaurantId)
        const payload = raw.data ?? raw
        setCategories(payload)
      } catch (err) {
        console.error(err)
        setError('Failed to load categories.')
      }
    })()

    return () => { cancelled = true }
  }, [restaurantId])

  // Handle toggling item status
  const handleToggle = async (id) => {
    const previous = transactions
    const updated = previous.map((tx) =>
      tx.id === id ? { ...tx, isEnabled: !tx.isEnabled } : tx
    )
    setTransactions(updated)

    try {
      await toggleItemStatus(restaurantId, id)
    } catch (err) {
      console.error('Toggle failed', err)
      setError('Failed to update status.')
      setTransactions(previous)
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle category change from dropdown
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  // Filter transactions based on search query and selected category
  useEffect(() => {
    let filtered = transactions

    // Apply search query filter for name, categoryName, and id
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.id && item.id.toString().includes(searchQuery.trim())) // Filter by item.id
      )
    }

    // Apply category filter by categoryName
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.categoryName === selectedCategory)
    }

    setFilteredTransactions(filtered)
  }, [searchQuery, transactions, selectedCategory])

  const total = filteredTransactions.length

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800">
      <div className="w-full overflow-x-auto">
        {error && (
          <div className="p-4 text-red-600 bg-red-100 mb-2 rounded">
            {error}
          </div>
        )}

        {/* Search and Category Dropdown */}
        <div className="p-4 flex flex-wrap sm:flex-nowrap gap-4 lg:gap-8">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search menu.."
            className="w-full sm:w-2/5 lg:w-full pl-10 pr-4 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md h-10 dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
          />

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full sm:w-2/5 lg:w-full text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-0 rounded-md h-10 pl-2 pr-4 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table of filtered transactions */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-white dark:bg-gray-700">
              <tr className="text-xs font-semibold uppercase tracking-wide text-left text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3">IMAGE</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">NAME</th>
                <th className="px-6 py-3">CATEGORY NAME</th>
                <th className="px-6 py-3">TYPE</th>
                <th className="px-6 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    Loading…
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No items found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
                      <img
                        src={
                          item.imageUrl ||
                          'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                        }
                        alt={item.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.isEnabled}
                          onChange={() => handleToggle(item.id)}
                        />
                        <div
                          className="w-11 h-6 rounded-full bg-gray-200 dark:bg-gray-600 peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all relative"
                        />
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
