// src/components/Home.js
import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback
} from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useParams, useLocation } from 'react-router-dom';
import {
  getMenuListByRestaurantIdAndRestaurantName,
  getRestaurantColorTheme,
  getCategoriesByRestaurantId,
  getRestaurantByRestaurantId
} from '../Services/allApi';
import AddCart from './AddCart';

// Debounce hook (unchanged)
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function Home() {
  // ───────────────────────────────────────────────────────────────
  // 1) Router hooks
  // ───────────────────────────────────────────────────────────────
  const { restaurantId } = useParams();
  const location = useLocation();

  // ───────────────────────────────────────────────────────────────
  // 2) State variables
  // ───────────────────────────────────────────────────────────────
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);           // For item-description “more/less”
  const [expandedCategories, setExpandedCategories] = useState([]); // For category accordion
  const [restaurant, setRestaurant] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);

  // Floating MENU panel states
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Ref for the search input, so we can scroll/focus it
  const searchInputRef = useRef(null);

  // Theme color (from localStorage or default)
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('themeColor') || "#e4002b";
  });

  // Debounced searchTerm, so we only filter after user stops typing
  const debouncedSearch = useDebounce(searchTerm, 200);

  // Helper to build headers for API calls (if needed)
  const getHeaders = useCallback(() => ({
    'Authorization': 'Basic ' + btoa(`admin:admin123`)
  }), []);

  // ───────────────────────────────────────────────────────────────
  // A) Force scroll-to-top before paint on every route change
  // ───────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ───────────────────────────────────────────────────────────────
  // B) When the MENU panel is open, prevent background scrolling
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (menuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuVisible]);

  // ───────────────────────────────────────────────────────────────
  // C) We need refs to each category header button so we can scroll to them
  // ───────────────────────────────────────────────────────────────
  const categoryRefs = useRef({});

  // ───────────────────────────────────────────────────────────────
  // 1) Fetch categories + menu items from APIs
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, themeRes, menuRes] = await Promise.all([
          getCategoriesByRestaurantId(restaurantId),
          null, // Replace with getRestaurantColorTheme(restaurantId) if you have that API
          getMenuListByRestaurantIdAndRestaurantName(restaurantId)
        ]);

        // → Categories
        if (isMounted && catRes?.data) {
          const cats = catRes.data.map(cat => cat.name);
          setCategories(cats);
        }

        // → Theme color (if your API returned it)
        if (isMounted && themeRes?.data) {
          const finalColor = themeRes.data.backgroundColor || "#e4002b";
          setThemeColor(finalColor);
          localStorage.setItem('themeColor', finalColor);
        }

        // → Menu items
        if (isMounted && menuRes?.data) {
          setItems(menuRes.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: item.variants?.[0]?.salePrice ?? item.variants?.[0]?.listPrice ?? 0,
            imageUrl: item.imageUrl 
              ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
            images: item.images || [],
            category: item.category?.name ?? 'Starter',
            cartCount: 0,
            type: item.type === 'NON_VEG' ? 'Non-Veg' : 'Veg',
            rating: 4.2,
            ratingCount: 250,
            customisable: (item.variants?.length > 1) || false,
            variants: item.variants || [],
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (restaurantId) fetchData();
    return () => { isMounted = false; };
  }, [restaurantId, getHeaders]);

  // ───────────────────────────────────────────────────────────────
  // 2) As soon as “categories” is set, expand the first category by default
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (categories.length > 0) {
      setExpandedCategories([categories[0]]);
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  // ───────────────────────────────────────────────────────────────
  // 3) Fetch restaurant details (name / notFound)
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function fetchRestaurant() {
      try {
        const res = await getRestaurantByRestaurantId(restaurantId);
        if (isMounted) {
          if (res?.data) {
            setRestaurant(res.data);
            setNotFound(false);
          } else {
            setRestaurant(null);
            setNotFound(true);
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        if (isMounted) {
          setRestaurant(null);
          setNotFound(true);
        }
      }
    }
    if (restaurantId) {
      fetchRestaurant();
    } else {
      setRestaurant(null);
      setNotFound(true);
    }
    return () => { isMounted = false; };
  }, [restaurantId]);

  // ───────────────────────────────────────────────────────────────
  // 4) Filter items by Veg/Non-Veg and search term (debounced)
  // ───────────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesType = !selectedType 
        || item.type.toLowerCase() === selectedType.toLowerCase();
      const searchLower = debouncedSearch.trim().toLowerCase();
      const matchesSearch = (
        !searchLower ||
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
      return matchesType && matchesSearch;
    });
  }, [items, selectedType, debouncedSearch]);

  // ───────────────────────────────────────────────────────────────
  // 5) Helpers for cart key + counts
  // ───────────────────────────────────────────────────────────────
  const cartKey = (id, variant) => {
    if (!variant) return id;
    if (variant.quantityType === "UNIT") {
      return `${id}-UNIT-DEFAULT`;
    }
    return `${id}-${variant.quantityType}-${variant.quantityValue}`;
  };
  const getCartCountForVariant = (id, variant) => {
    if (!variant) return 0;
    const key = cartKey(id, variant);
    const found = cartItems.find(ci => cartKey(ci.id, ci.variant) === key);
    return found ? found.cartCount : 0;
  };
  const getTotalCartCount = (id) => {
    return cartItems.reduce((total, ci) => ci.id === id ? total + ci.cartCount : total, 0);
  };

  // ───────────────────────────────────────────────────────────────
  // 6) Update cart: add/remove items
  // ───────────────────────────────────────────────────────────────
  const updateCartCount = useCallback((id, variant, delta) => {
    setCartItems(prev => {
      const key = cartKey(id, variant);
      const foundIndex = prev.findIndex(ci => cartKey(ci.id, ci.variant) === key);

      if (foundIndex === -1 && delta > 0) {
        // Add new
        const selected = items.find(i => i.id === id);
        if (selected) {
          return [...prev, { ...selected, variant, cartCount: delta }];
        }
        return prev;
      }

      if (foundIndex !== -1) {
        // Update or remove
        const updated = [...prev];
        const newCount = updated[foundIndex].cartCount + delta;
        if (newCount > 0) {
          updated[foundIndex] = { ...updated[foundIndex], cartCount: newCount };
          return updated;
        } else {
          // Remove if count drops to 0
          updated.splice(foundIndex, 1);
          return updated;
        }
      }

      return prev;
    });

    // If customization modal is open for this item, force re-render
    setSelectedItem(prev => {
      if (prev && prev.id === id) {
        return { ...prev };
      }
      return prev;
    });
  }, [items]);

  const updateToCart = useCallback((id, variant) =>
    updateCartCount(id, variant, 1),
  [updateCartCount]);

  // ───────────────────────────────────────────────────────────────
  // 7) plus/minus handlers (open modal if customisable)
  // ───────────────────────────────────────────────────────────────
  const plusItems = useCallback((id, variant, isSimple) => {
    if (!isSimple) {
      const item = items.find(i => i.id === id);
      if (item) openModal(item);
      return;
    }
    updateCartCount(id, variant, 1);
  }, [updateCartCount, items]);

  const minusItems = useCallback((id, variant, isSimple) => {
    if (!isSimple) {
      const item = items.find(i => i.id === id);
      if (item) openModal(item);
      return;
    }
    updateCartCount(id, variant, -1);
  }, [updateCartCount, items]);

  // ───────────────────────────────────────────────────────────────
  // 8) Handlers for Veg / Non-Veg toggles & search input
  // ───────────────────────────────────────────────────────────────
  const handleTypeChange = useCallback((type) => {
    setSelectedType(t => t === type ? '' : type);
  }, []);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // ───────────────────────────────────────────────────────────────
  // 9) Scroll the search bar into view when “VIEW CART” (search icon) is clicked
  // ───────────────────────────────────────────────────────────────
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

  // ───────────────────────────────────────────────────────────────
  // 10) Toggle expand/collapse for item description (“more/less”)
  // ───────────────────────────────────────────────────────────────
  const toggleExpand = useCallback((id) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(eid => eid !== id)
        : [...prev, id]
    );
  }, []);

  // ───────────────────────────────────────────────────────────────
  // 11) Toggle expand/collapse for categories (“Swiggy-style”):
  //     Only one category may be open at a time. If you click a different category,
  //     close the old one and open the new one; clicking the currently open category collapses it.
  // ───────────────────────────────────────────────────────────────
  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      if (prev.includes(category)) {
        // If already open, close it
        return [];
      } else {
        // Otherwise, open exactly this one, closing any others
        return [category];
      }
    });
    setSelectedCategory(category);
  };

  // ───────────────────────────────────────────────────────────────
  // 12) Open / close customization modal
  // ───────────────────────────────────────────────────────────────
  const openModal = (item) => {
    setSelectedItem(item);
    setSelectedVariant(item.variants?.[0] || null);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // ───────────────────────────────────────────────────────────────
  // ✱ MODIFIED: When the “MENU” button is clicked, just toggle visibility
  // ───────────────────────────────────────────────────────────────
  const handleMenuToggle = () => {
    setMenuVisible(v => !v);
  };

  // ───────────────────────────────────────────────────────────────
  // Skeleton loader (unchanged)
  // ───────────────────────────────────────────────────────────────
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

  // ───────────────────────────────────────────────────────────────
  // If loading, show skeletons
  // ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      // REMOVED “p-6” so skeletons render truly flush to top
      <div className="min-h-screen flex flex-col items-center justify-start">
        <div className="flex flex-col px-4 py-6 select-none cursor-default">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
        </div>
        {Array(5).fill().map((_, idx) => <SkeletonLoader key={idx} />)}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────
  // If restaurant not found, show a “not found” message
  // ───────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-700">
          No restaurant found with ID:&nbsp;
          <span className="text-red-600">{restaurantId}</span>
        </h1>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────
  // Main render
  // ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen w-full font-sans text-gray-800 relative">

      {/* --------------------
          Header (flush to top, no extra top-padding)
      -------------------- */}
      <div className="flex flex-col px-4 py-0 mt-6 select-none cursor-default">
        <h1 className="text-gray-900 text-xl leading-tight m-0">
          Find delicious items from
        </h1>
        <h2
          className="font-bold text-2xl mt-1 m-0"
          style={{ color: themeColor }}
        >
          {restaurant ? restaurant.name : 'Loading...'}
        </h2>
      </div>

      {/* --------------------
          Search Bar (sticky)
      -------------------- */}
      <div className="sticky top-0 z-10 p-4 bg-white">
        <div className="relative w-full" ref={searchInputRef}>
          <input
            className="w-full bg-white text-gray-700 text-base placeholder-gray-500 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-transparent shadow-sm transition duration-200 text-[16px]"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for dishes"
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={inputFocused ? { boxShadow: `0 0 0 2px ${themeColor}` } : {}}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition duration-200"
            tabIndex={-1}
          >
            <Icon icon="ic:round-search" className="text-xl" />
          </button>
        </div>
      </div>

      {/* --------------------
          Filter Bar (Veg / Non-Veg)
      -------------------- */}
      <div className="p-3 border-b border-gray-200 flex items-center gap-4">
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
      </div>

      {/* --------------------
          Category Accordion (each category header + count)
          We add `scrollMarginTop` so that when we call scrollIntoView,
          the header sits just below the sticky search bar.
      -------------------- */}
      <div className="mt-4">
        {categories.map(cat => {
          // All filtered items that belong to this category
          const itemsInCategory = filteredItems.filter(i => i.category === cat);
          const countInCategory = itemsInCategory.length;
          // If no items match the current search/type, skip rendering
          if (countInCategory === 0) return null;

          const isExpanded = expandedCategories.includes(cat);

          return (
            <div key={cat} className="border-b border-gray-200">
              {/* Attach a ref to each category header button */}
              <button
                ref={el => categoryRefs.current[cat] = el}
                onClick={() => toggleCategory(cat)}
                className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50"
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  scrollMarginTop: '80px' // ensures it appears below the sticky search bar
                }}
              >
                <span className={`font-semibold text-gray-900`}>
                  {cat} ({countInCategory})
                </span>
                <Icon
                  icon={isExpanded
                    ? "ic:round-arrow-drop-up"
                    : "ic:round-arrow-drop-down"
                  }
                  className="text-2xl text-gray-600"
                />
              </button>

              {/* If expanded, render each item in this category */}
              {isExpanded && (
                <div>
                  {itemsInCategory.map(item => {
                    const totalCount = getTotalCartCount(item.id);
                    const variantsLength = item.variants.length;
                    const firstVariant = variantsLength > 0
                      ? item.variants[0]
                      : { quantityType: "UNIT", quantityValue: "DEFAULT" };

                    return (
                      <div
                        key={item.id}
                        className="w-full flex flex-row items-start p-4 border-b border-gray-100 cursor-pointer"
                      >
                        <div className="flex-1 flex flex-col pr-4">
                          <h1 className="font-semibold text-lg text-gray-900 select-none cursor-default">
                            {item.name}
                          </h1>
                          <h2 className="font-semibold text-md text-gray-800 mb-1 select-none cursor-default">
                            ₹ {item.price}
                          </h2>
                          <div className="flex items-center text-sm mb-2">
                            <Icon icon="mdi:food-steak" />
                            <span className="font-medium text-gray-700 select-none cursor-default">
                              {/* (rating placeholder) */}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 leading-relaxed select-none cursor-default">
                            Serves 1 | {
                              expandedItems.includes(item.id)
                                ? item.description
                                : `${item.description.slice(0, 70)}${item.description.length > 70 ? '...' : ''}`
                            }
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
                            className="w-full h-full object-cover rounded-2xl shadow-md"
                            loading="lazy"
                          />

                          {variantsLength > 1 ? (
                            totalCount === 0 ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(item);
                                }}
                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] font-medium text-base rounded-full shadow-lg"
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  color: themeColor,
                                  boxShadow: `0 2px 4px rgba( ${parseInt(themeColor.slice(1,3),16)}, ${parseInt(themeColor.slice(3,5),16)}, ${parseInt(themeColor.slice(5,7),16)}, 0.2)`,
                                  height: '40px',
                                  width: '120px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <b>ADD</b>
                              </button>
                            ) : (
                              <div
                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] rounded-full bg-white flex items-center shadow-md"
                                style={{
                                  borderColor: themeColor,
                                  height: '40px',
                                  width: '120px',
                                  padding: '0 8px',
                                  boxSizing: 'border-box',
                                  gap: '8px',
                                  cursor: 'pointer'
                                }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(item);
                                  }}
                                  className="flex items-center justify-center rounded-full focus:outline-none"
                                  style={{
                                    color: themeColor,
                                    width: '32px',
                                    height: '32px',
                                    padding: 0
                                  }}
                                >
                                  <Icon icon="ic:baseline-minus" />
                                </button>

                                <span
                                  className="font-bold text-base"
                                  style={{ color: themeColor, minWidth: '24px', textAlign: 'center' }}
                                >
                                  {totalCount}
                                </span>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(item);
                                  }}
                                  className="flex items-center justify-center rounded-full focus:outline-none"
                                  style={{
                                    color: themeColor,
                                    width: '32px',
                                    height: '32px',
                                    padding: 0
                                  }}
                                >
                                  <Icon icon="ic:baseline-plus" />
                                </button>
                              </div>
                            )
                          ) : (
                            totalCount === 0 ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateToCart(item.id, firstVariant);
                                }}
                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] font-medium text-base rounded-full shadow-lg"
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  color: themeColor,
                                  boxShadow: `0 2px 4px rgba( ${parseInt(themeColor.slice(1,3),16)}, ${parseInt(themeColor.slice(3,5),16)}, ${parseInt(themeColor.slice(5,7),16)}, 0.2)`,
                                  height: '40px',
                                  width: '120px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <b>ADD</b>
                              </button>
                            ) : (
                              <div
                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] rounded-full bg-white flex items-center shadow-md"
                                style={{
                                  borderColor: themeColor,
                                  height: '40px',
                                  width: '120px',
                                  padding: '0 8px',
                                  boxSizing: 'border-box',
                                  gap: '8px',
                                }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    minusItems(item.id, firstVariant, true);
                                  }}
                                  className="flex items-center justify-center rounded-full focus:outline-none"
                                  style={{
                                    color: themeColor,
                                    width: '32px',
                                    height: '32px',
                                    padding: 0,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Icon icon="ic:baseline-minus" />
                                </button>

                                <span
                                  className="font-bold text-base"
                                  style={{ color: themeColor, minWidth: '24px', textAlign: 'center' }}
                                >
                                  {totalCount}
                                </span>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    plusItems(item.id, firstVariant, true);
                                  }}
                                  className="flex items-center justify-center rounded-full focus:outline-none"
                                  style={{
                                    color: themeColor,
                                    width: '32px',
                                    height: '32px',
                                    padding: 0,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Icon icon="ic:baseline-plus" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --------------------
          Modal: Customization (Variants / Add-to-Cart)
      -------------------- */}
      {modalVisible && selectedItem && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          ></div>

          <div
            className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-lg shadow-lg max-w-3xl w-full mx-auto p-6 transition-transform duration-300 ease-in-out`}
            style={{
              transform: modalVisible ? 'translateY(0%)' : 'translateY(100%)',
              maxHeight: '80vh',
              overflowY: 'auto',
              paddingBottom: '90px',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
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
                    className="h-40 w-auto rounded-lg object-cover"
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
            <h2 className="text-2xl font-bold mb-2 select-none m-0">{selectedItem.name}</h2>
            <p className="text-gray-700 mb-2 select-none">{selectedItem.description}</p>

            {/* Variant selection */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 select-none">Choose portion</h3>
              <div className="flex gap-4 flex-wrap">
                {selectedItem.variants.map((variant, idx) => {
                  const isSelected = selectedVariant 
                    && JSON.stringify(selectedVariant) === JSON.stringify(variant);
                  const priceToShow = variant.salePrice ?? variant.listPrice;
                  const cartCountForVar = getCartCountForVariant(selectedItem.id, variant);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-full border font-medium select-none focus:outline-none
                        ${isSelected
                          ? ''
                          : 'bg-white border-gray-300 text-gray-800'
                        }
                      `}
                      style={{
                        cursor: 'pointer',
                        borderColor: isSelected ? themeColor : '#d1d5db',
                        borderWidth: '1px',
                        backgroundColor: isSelected ? '#fdecef' : 'white',
                        color: isSelected ? themeColor : '#374151',
                        minWidth: '80px',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      {variant.quantityValue} ({priceToShow} ₹) 
                      {cartCountForVar > 0 && ` x${cartCountForVar}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <p className="font-semibold text-lg mb-4 select-none">
              Price: ₹ {selectedVariant?.salePrice ?? selectedVariant?.listPrice ?? selectedItem.price}
            </p>

            {/* Add to cart controls inside modal */}
            {getCartCountForVariant(selectedItem.id, selectedVariant) === 0 ? (
              <button
                onClick={() => {
                  if (selectedVariant) updateToCart(selectedItem.id, selectedVariant);
                }}
                className="bg-green-500 text-white font-medium rounded-full px-6 py-2 shadow-lg w-full"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: themeColor,
                  boxShadow: `0 2px 4px rgba( ${parseInt(themeColor.slice(1,3),16)}, ${parseInt(themeColor.slice(3,5),16)}, ${parseInt(themeColor.slice(5,7),16)}, 0.2)`,
                }}
              >
                ADD
              </button>
            ) : (
              <div className="border-2 rounded-full p-1 bg-white flex items-center gap-3 shadow-md w-max mx-auto">
                <button
                  onClick={() => minusItems(selectedItem.id, selectedVariant, true)}
                  className="px-3 py-1 font-bold rounded-full text-base focus:outline-none"
                  style={{ color: themeColor, cursor: 'pointer' }}
                >
                  <Icon icon="ic:baseline-minus" />
                </button>
                <span className="font-bold text-base" style={{ color: themeColor }}>
                  {getCartCountForVariant(selectedItem.id, selectedVariant)}
                </span>
                <button
                  onClick={() => plusItems(selectedItem.id, selectedVariant, true)}
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

      {/* --------------------
          AddCart (fixed bottom “View Basket” bar)
      -------------------- */}
      <AddCart
        themeColor={themeColor}
        cartCount={cartItems.length}
        cartItems={cartItems}
        onSearchIconClick={scrollToSearchBar}
      />

      {/* --------------------
          Floating “MENU” Button (uses themeColor)
      -------------------- */}
      <div
        onClick={handleMenuToggle}
        className="fixed"
        style={{
          bottom: '60px',
          right: '16px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          backgroundColor: themeColor,
          color: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          userSelect: 'none',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        MENU
      </div>

      {/* --------------------
          Slide-Up Panel (with outside-click overlay)
      -------------------- */}
      {menuVisible && (
        <>
          {/* Overlay to catch outside clicks */}
          <div
            className="fixed inset-0 z-70"
            onClick={() => setMenuVisible(false)}
          />

          <div
            className="fixed left-0 right-0 bottom-0 z-80"
            style={{
              backgroundColor: '#1f1f1f',
              maxHeight: '50%',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ul>
              {categories.map(cat => {
                // Count how many items belong to this category
                const countInCategory = items.filter(i => i.category === cat).length;
                const isSelected = cat === selectedCategory;
                return (
                  <li key={cat} className="border-gray-700">
                    <button
                      onClick={() => {
                        // 1) Expand and select this category
                        setSelectedCategory(cat);
                        setExpandedCategories([cat]);

                        // 2) Close the slide-up panel
                        setMenuVisible(false);

                        // 3) After a short delay, scroll the category header into view
                        setTimeout(() => {
                          const headerEl = categoryRefs.current[cat];
                          if (headerEl) {
                            headerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 200);
                      }}
                      className={`w-full px-4 py-3 flex justify-between items-center ${
                        isSelected
                          ? 'text-white font-semibold'
                          : 'text-gray-300'
                      } hover:bg-gray-800`}
                      style={{ userSelect: 'none', cursor: 'pointer' }}
                    >
                      <span>{cat}</span>
                      <span>{countInCategory}</span>
                    </button>
                  </li>
                );
              })}

              {categories.length === 0 && (
                <li className="px-4 py-3 text-gray-500 select-none cursor-default">
                  No categories available
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
