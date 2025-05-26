import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { getMenuListByRestaurantIdAndRestaurantName, getRestaurantColorTheme, getCategoriesByRestaurantId } from '../Services/allApi';
import AddCart from './AddCart';
import { useSearchParams } from 'react-router';
import { useParams } from 'react-router-dom';

// Debounce utility
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function Home() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Starter');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { restaurantId } = useParams();
  const restaurantName = searchParams.get('restaurantName') || 'Italian Dorado';
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('themeColor') || "#2ebf6c";
  });

  const debouncedSearch = useDebounce(searchTerm, 200);

  const getHeaders = useCallback(() => ({
    'Authorization': 'Basic ' + btoa(`admin:admin123`)
  }), []);

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);

      try {
        const [catRes, themeRes, menuRes] = await Promise.all([
          getCategoriesByRestaurantId(restaurantId),
          getRestaurantColorTheme(restaurantId, getHeaders()),
          getMenuListByRestaurantIdAndRestaurantName(restaurantId)
        ]);

        if (isMounted && catRes?.data) {
          setCategories(catRes.data.map(cat => cat.name));
        }

        if (isMounted && themeRes?.data) {
          const finalColor = themeRes.data.backgroundColor || "#2ebf6c";
          setThemeColor(finalColor);
          localStorage.setItem('themeColor', finalColor);
        }

        if (isMounted && menuRes?.data) {
          setItems(menuRes.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: item.variants?.[0]?.salePrice ?? item.variants?.[0]?.listPrice ?? 0,
            imageUrl: item.imageUrl ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
            images: item.images || [], // Expecting array of image URLs if exists
            category: item.category?.name ?? 'Starter',
            cartCount: 0,
            type: item.type === 'NON_VEG' ? 'Non-Veg' : 'Veg',
            rating: 4.2,
            ratingCount: 250,
            customisable: item.variants?.length > 1 || false
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (restaurantId) fetchData();
    return () => { isMounted = false };
  }, [restaurantId, getHeaders]);

  // Dropdown outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = !selectedCategory || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesType = !selectedType || item.type.toLowerCase() === selectedType.toLowerCase();
      const searchLower = debouncedSearch.trim().toLowerCase();
      const matchesSearch = (
        !searchLower ||
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [items, selectedCategory, selectedType, debouncedSearch]);

  // Cart map
  const cartMap = useMemo(() => {
    const map = new Map();
    cartItems.forEach(ci => map.set(ci.id, ci.cartCount));
    return map;
  }, [cartItems]);

  // Update item in state & cart, also update modal selectedItem to reflect changes inside modal
  const updateCartCount = useCallback((id, delta) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === id) {
          const newCount = Math.max(0, (item.cartCount || 0) + delta);
          return { ...item, cartCount: newCount };
        }
        return item;
      });
      return newItems;
    });
    setCartItems(prev => {
      const found = prev.find(ci => ci.id === id);
      if (!found && delta > 0) {
        // Adding new item
        const selected = items.find(i => i.id === id);
        if (selected) {
          return [...prev, { ...selected, cartCount: 1 }];
        }
        return prev;
      }
      if (found) {
        const updated = prev.map(ci => {
          if (ci.id === id) {
            const newCount = ci.cartCount + delta;
            return newCount > 0 ? { ...ci, cartCount: newCount } : null;
          }
          return ci;
        }).filter(Boolean);
        return updated;
      }
      return prev;
    });

    // Also update modal's selectedItem count
    setSelectedItem(prev => {
      if (prev && prev.id === id) {
        const newCount = Math.max(0, (prev.cartCount || 0) + delta);
        return { ...prev, cartCount: newCount };
      }
      return prev;
    });
  }, [items]);

  const updateToCart = useCallback((id) => updateCartCount(id, 1), [updateCartCount]);
  const plusItems = useCallback((id) => updateCartCount(id, 1), [updateCartCount]);
  const minusItems = useCallback((id) => updateCartCount(id, -1), [updateCartCount]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  }, []);

  const handleTypeChange = useCallback((type) => {
    setSelectedType(t => t === type ? '' : type);
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const scrollToSearchBar = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth' });
      searchInputRef.current.focus();
      searchInputRef.current.style.borderColor = themeColor;
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.style.borderColor = '';
      }, 1000);
    }
  }, [themeColor]);

  const toggleExpand = useCallback((id) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(eid => eid !== id)
        : [...prev, id]
    );
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="w-full flex items-start p-4 border-b border-gray-200 animate-pulse">
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-32 h-32 ml-6 bg-gray-200 rounded-lg"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen w-full font-sans text-gray-800 relative">
      {/* Header */}
      <div className="flex flex-col px-4 py-6 border-b border-gray-200 select-none cursor-default">
        <h1 className="font-bold text-gray-900 text-xl leading-tight">Find delicious items from</h1>
        <h2 className="font-bold text-2xl mt-1 text-green-600">{restaurantName}</h2>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white">
        <div className="relative w-full" ref={searchInputRef}>
          <input
            className="w-full bg-white text-gray-700 text-base placeholder-gray-500 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition duration-200 text-[16px]"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for dishes..."
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition duration-200" tabIndex={-1}>
            <Icon icon="ic:round-search" className="text-xl" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 border-b border-gray-200 flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Non-Veg Toggle */}
        <div className="flex items-center gap-2 select-none cursor-default">
          <label className="relative inline-block w-11 h-6 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedType === 'Non-Veg'}
              onChange={() => handleTypeChange('Non-Veg')}
              className="opacity-0 w-0 h-0 peer"
            />
            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 rounded-full peer-checked:bg-red-600 transition"></span>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></span>
          </label>
          <span className="text-sm text-gray-700 font-medium">Non-Veg</span>
        </div>

        {/* Veg Toggle */}
        <div className="flex items-center gap-2 select-none cursor-default">
          <label className="relative inline-block w-11 h-6 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedType === 'Veg'}
              onChange={() => handleTypeChange('Veg')}
              className="opacity-0 w-0 h-0 peer"
            />
            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 rounded-full peer-checked:bg-green-600 transition"></span>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></span>
          </label>
          <span className="text-sm text-gray-700 font-medium">Veg</span>
        </div>

        {/* Categories Dropdown */}
 <div className="ml-auto relative">
  <button
    onClick={() => setShowDropdown(d => !d)}
    className="border border-gray-300 rounded-md px-3 py-1 text-sm font-medium flex items-center gap-1 focus:outline-none bg-white"
    style={{ userSelect: 'none', cursor: 'pointer' }}
  >
    <span style={{ userSelect: 'none' }}>{selectedCategory || 'Select Category'}</span>
    <Icon
      icon="ic:round-arrow-drop-down"
      className="text-base text-gray-500"
      style={{ userSelect: 'none' }}
    />
  </button>
  {showDropdown && (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10 overflow-hidden">
      {categories.map(cat => (
        <div
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          className={`px-3 py-2 text-sm hover:bg-gray-100 ${
            selectedCategory === cat ? 'font-semibold text-gray-800' : 'text-gray-700'
          }`}
          style={{ userSelect: 'none', cursor: 'pointer' }}
        >
          {cat}
        </div>
      ))}
    </div>
  )}
</div>



      </div>

      {/* Item Listing */}
      <div className="flex flex-col" style={{ paddingBottom: '90px' }}>
        {loading ? (
          Array(5).fill().map((_, idx) => <SkeletonLoader key={idx} />)
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-10 select-none cursor-default">
            <p className="text-gray-600 text-lg font-medium">No results found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`w-full flex flex-row items-start p-4 border-b border-gray-200 cursor-pointer`}
              onClick={() => openModal(item)}
            >
              <div className="flex-1 flex flex-col pr-4">
                <h1 className="font-semibold text-lg text-gray-900 select-none cursor-default">{item.name}</h1>
                <h2 className="font-semibold text-md text-gray-800 mb-1 select-none cursor-default">₹ {item.price}</h2>
                <div className="flex items-center text-sm mb-2">
                  <Icon icon="ic:round-star-rate" className="mr-1 text-yellow-500" />
                  <span className="font-medium text-gray-700 select-none cursor-default">
                    {item.rating ?? 4.2} ({item.ratingCount ?? 250})
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed select-none cursor-default">
                  Serves 1 | {expandedItems.includes(item.id)
                    ? item.description
                    : `${item.description.slice(0, 70)}${item.description.length > 70 ? '...' : ''}`}
                  {item.description.length > 70 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
                      className="cursor-pointer font-medium text-blue-600 ml-1"
                    
                    >
                      {expandedItems.includes(item.id) ? 'less' : 'more'}
                    </span>
                  )}
                </p>
              </div>
              <div className="relative w-36 h-36">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
                {item.cartCount === 0 ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); updateToCart(item.id); }}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] bg-green-500 text-white font-medium text-base rounded-full px-6 py-2 shadow-lg"
                  >
                    ADD
                  </button>
                ) : (
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] border-2 rounded-full p-1 bg-white flex items-center gap-3 shadow-md"
                    style={{ borderColor: themeColor }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); minusItems(item.id); }}
                      className="px-3 py-1 font-bold rounded-full text-base focus:outline-none"
                      style={{ color: themeColor }}
                    >
                      <Icon icon="ic:baseline-minus" />
                    </button>
                    <span className="font-bold text-base" style={{ color: themeColor }}>
                      {item.cartCount}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); plusItems(item.id); }}
                      className="px-3 py-1 font-bold rounded-full text-base focus:outline-none"
                      style={{ color: themeColor }}
                    >
                      <Icon icon="ic:baseline-plus" />
                    </button>
                  </div>
                )}
                {item.customisable && (
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-sm font-medium text-gray-600 select-none cursor-default">
                    Customisable
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalVisible && selectedItem && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          ></div>

          {/* Bottom modal */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-lg shadow-lg max-w-3xl w-full mx-auto p-6 transition-transform duration-300 ease-in-out`}
            style={{
              transform: modalVisible ? 'translateY(0%)' : 'translateY(100%)',
              maxHeight: '80vh',
              overflowY: 'auto',
              paddingBottom: '90px', // add bottom padding so content not hidden behind AddCart
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <Icon icon="ic:baseline-close" className="text-2xl" />
            </button>

            {/* Images gallery */}
            <div className="flex overflow-x-auto space-x-4 mb-4">
              {selectedItem.images && selectedItem.images.length > 0 ? (
                selectedItem.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${selectedItem.name} image ${idx + 1}`}
                    className="h-40 w-auto rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                  />
                ))
              ) : (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="h-40 w-auto rounded-lg object-cover"
                  loading="lazy"
                />
              )}
            </div>

            {/* Item info */}
            <h2 className="text-2xl font-bold mb-2 select-none">{selectedItem.name}</h2>
            <p className="text-gray-700 mb-2 select-none">{selectedItem.description}</p>
            <p className="font-semibold text-lg mb-2 select-none">₹ {selectedItem.price}</p>
            <div className="flex items-center mb-4 select-none">
              <Icon icon="ic:round-star-rate" className="mr-1 text-yellow-500" />
              <span className="font-medium text-gray-700">{selectedItem.rating ?? 4.2} ({selectedItem.ratingCount ?? 250})</span>
            </div>

            {/* Add to cart controls inside modal */}
            {selectedItem.cartCount === 0 ? (
              <button
                onClick={() => updateToCart(selectedItem.id)}
                className="bg-green-500 text-white font-medium rounded-full px-6 py-2 shadow-lg w-full"
              >
                ADD
              </button>
            ) : (
              <div className="border-2 rounded-full p-1 bg-white flex items-center gap-3 shadow-md w-max mx-auto">
                <button
                  onClick={() => minusItems(selectedItem.id)}
                  className="px-3 py-1 font-bold rounded-full text-base focus:outline-none"
                  style={{ color: themeColor, cursor: 'pointer' }}
                >
                  <Icon icon="ic:baseline-minus" />
                </button>
                <span className="font-bold text-base" style={{ color: themeColor }}>
                  {selectedItem.cartCount}
                </span>
                <button
                  onClick={() => plusItems(selectedItem.id)}
                  className="px-3 py-1 font-bold rounded-full text-base focus:outline-none"
                  style={{ color: themeColor, cursor: 'pointer' }}
                >
                  <Icon icon="ic:baseline-plus" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* AddCart component */}
      <AddCart
        themeColor={themeColor}
        cartCount={cartItems.length}
        cartItems={cartItems}
        onSearchIconClick={scrollToSearchBar}
      />
    </div>
  );
}

export default Home;
