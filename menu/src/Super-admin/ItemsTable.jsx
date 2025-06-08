// src/components/TransactionsTable.jsx
import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { getAllItemsByRestaurantId, toggleItemStatus } from '../Services/allApi'

export default function TransactionsTable({
  restaurantId,
  initialPage   = 0,
  sortBy        = '',
  sortDirection = 'desc',
}) {
  const [transactions,  setTransactions]   = useState([])
  const [loading,       setLoading]        = useState(false)
  const [error,         setError]          = useState(null)
  const [totalPages,    setTotalPages]     = useState(0)

  const pageSize = 10

  // Persist pagination page in localStorage
  const [page, setPage] = useState(() => {
    const saved = window.localStorage.getItem('transactionsTablePage')
    return saved !== null ? Number(saved) : initialPage
  })
  useEffect(() => {
    window.localStorage.setItem('transactionsTablePage', page)
  }, [page])

  // Fetch when restaurantId, page, sortBy or sortDirection change
  useEffect(() => {
    if (!restaurantId) return
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const raw = await getAllItemsByRestaurantId(
          restaurantId,
          page,
          pageSize,
          sortBy,
          sortDirection
        )
        if (cancelled) return
        const payload = raw.data ?? raw
        setTransactions(Array.isArray(payload.content) ? payload.content : [])
        setTotalPages(payload.totalPages ?? 0)
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          setError('Failed to load items.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [restaurantId, page, sortBy, sortDirection])

  // Optimistic toggle with rollback
  const handleToggle = async (id) => {
    const previous = transactions
    const updated  = previous.map(tx =>
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

  const total = transactions.length
  const start = page * pageSize + 1
  const end   = Math.min((page + 1) * pageSize, total)

  const getPageNumbers = () => {
    const delta   = 1
    const current = page + 1
    const range   = []
    for (let i = Math.max(1, current - delta); i <= Math.min(totalPages, current + delta); i++) {
      range.push(i)
    }
    const pages = []
    let last = 0
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || range.includes(i)) {
        if (last + 1 !== i) pages.push('…')
        pages.push(i)
        last = i
      }
    }
    return pages
  }

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800">
      <div className="w-full overflow-x-auto">
        {error && (
          <div className="p-4 text-red-600 bg-red-100 mb-2 rounded">
            {error}
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-white dark:bg-gray-700">
            <tr className="text-xs font-semibold uppercase tracking-wide text-left text-gray-500 dark:text-gray-400">
              <th className="px-6 py-3">IMAGE</th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">NAME</th>
              <th className="px-6 py-3">CATEGORY ID</th>
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
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            ) : (
              transactions.map(item => (
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
                    {item.categoryId}
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
                        className="
                          w-11 h-6 rounded-full
                          bg-gray-200 dark:bg-gray-600
                          peer-focus:ring-4 peer-focus:ring-green-300
                          peer-checked:bg-green-600
                          peer-checked:after:translate-x-full
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                          after:bg-white after:border after:border-gray-300 after:rounded-full
                          after:h-5 after:w-5 after:transition-all
                          relative
                        "
                      />
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          SHOWING {start}-{end} OF {total}
        </span>
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="
              p-2 rounded-md
              bg-white dark:bg-gray-800
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-700
              disabled:opacity-50 transition-colors
            "
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          {getPageNumbers().map((p, idx) =>
            p === '…' ? (
              <span key={idx} className="px-2 text-gray-400 dark:text-gray-500">…</span>
            ) : (
              <button
                key={idx}
                onClick={() => setPage(p - 1)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  p - 1 === page
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
            disabled={page + 1 >= totalPages}
            className="
              p-2 rounded-md
              bg-white dark:bg-gray-800
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-700
              disabled:opacity-50 transition-colors
            "
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  )
}
