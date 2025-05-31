import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { getMenuListByRestaurantIdAndRestaurantName, getRestaurantColorTheme, getCategoriesByRestaurantId, getRestaurantByRestaurantId } from '../Services/allApi';
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
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [notFound, setNotFound] = useState(false);


  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);

  const { restaurantId } = useParams();
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('themeColor') || "#e4002b";
  });

  const debouncedSearch = useDebounce(searchTerm, 200);

  const getHeaders = useCallback(() => ({
    'Authorization': 'Basic ' + btoa(`admin:admin123`)
  }), []);

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
        const cats = catRes.data.map(cat => cat.name);
          setCategories(catRes.data.map(cat => cat.name));
           // Set selectedCategory:
        if (cats.length > 0) {
          setSelectedCategory(cats[0]);
        } else {
          setSelectedCategory('');  // or "Select Category" if you want to display that literally
        }
      }
        

        if (isMounted && themeRes?.data) {
          const finalColor = themeRes.data.backgroundColor || "#e4002b";
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
            images: item.images || [],
            category: item.category?.name ?? 'Starter',
            cartCount: 0,
            type: item.type === 'NON_VEG' ? 'Non-Veg' : 'Veg',
            rating: 4.2,
            ratingCount: 250,
            customisable: item.variants?.length > 1 || false,
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
    return () => { isMounted = false };
  }, [restaurantId, getHeaders]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Unique key for cart item + variant
  const cartKey = (id, variant) => {
    if (!variant) return id;
    if (variant.quantityType === "UNIT") {
      return `${id}-UNIT-DEFAULT`;
    }
    return `${id}-${variant.quantityType}-${variant.quantityValue}`;
  };

  // Get count in cart for a specific item + variant
  const getCartCountForVariant = (id, variant) => {
    if (!variant) return 0;
    const key = cartKey(id, variant);
    const found = cartItems.find(ci => cartKey(ci.id, ci.variant) === key);
    return found ? found.cartCount : 0;
  };

  // Get total count in cart for all variants of an item
  const getTotalCartCount = (id) => {
    return cartItems.reduce((total, ci) => ci.id === id ? total + ci.cartCount : total, 0);
  };

  const updateCartCount = useCallback((id, variant, delta) => {
    setCartItems(prev => {
      const key = cartKey(id, variant);
      const foundIndex = prev.findIndex(ci => cartKey(ci.id, ci.variant) === key);

      if (foundIndex === -1 && delta > 0) {
        const selected = items.find(i => i.id === id);
        if (selected) {
          return [...prev, { ...selected, variant, cartCount: delta }];
        }
        return prev;
      }

      if (foundIndex !== -1) {
        const updated = [...prev];
        const newCount = updated[foundIndex].cartCount + delta;
        if (newCount > 0) {
          updated[foundIndex] = { ...updated[foundIndex], cartCount: newCount };
          return updated;
        } else {
          updated.splice(foundIndex, 1);
          return updated;
        }
      }
      return prev;
    });

    setSelectedItem(prev => {
      if (prev && prev.id === id) {
        return { ...prev };
      }
      return prev;
    });
  }, [items]);

  const updateToCart = useCallback((id, variant) => updateCartCount(id, variant, 1), [updateCartCount]);

  // isSimple = true means allow direct update; false means open modal
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
    setSelectedVariant(item.variants?.[0] || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

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

  return () => {
    isMounted = false;
  };
}, [restaurantId]);

const RestaurantHeaderSkeleton = () => (
  <div className="flex flex-col px-4 py-6 select-none cursor-default">
    <div className="h-6 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
    <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
  </div>
);


if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6">
      <RestaurantHeaderSkeleton />
      {/* You can also add skeleton loaders for the menu/items below if you want */}
      {Array(5).fill().map((_, idx) => <SkeletonLoader key={idx} />)}
    </div>
  );
}


if (notFound) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-gray-700">
        No restaurant found with ID: <span className="text-red-600">{restaurantId}</span>
      </h1>
    </div>
  );
}

  return (
    <div className="bg-white min-h-screen w-full font-sans text-gray-800 relative">
      {/* Header */}
      <div className="flex flex-col px-4 py-6 select-none cursor-default">
        <h1 className="font-bold text-gray-900 text-xl leading-tight">Find delicious items from</h1>
       <h2 className="font-bold text-2xl mt-1" style={{ color: themeColor }}>
          {restaurant ? restaurant.name : 'Loading...'}
        </h2>
      </div>
      {/* Search Bar */}
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
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition duration-200" tabIndex={-1}>
            <Icon icon="ic:round-search" className="text-xl" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 border-b border-gray-200 flex items-center gap-4 relative fade-top-gradient" ref={dropdownRef}>
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
        <span style={{ userSelect: 'none' }}>
          {selectedCategory}
        </span>
        <Icon
          icon="ic:round-arrow-drop-down"
          className="text-base text-gray-500"
          style={{ userSelect: 'none' }}
        />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10 overflow-hidden">
              {categories.length > 0 ? (
                categories.map(cat => (
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
                ))
              ) : (
                <div
                  className="px-3 py-2 text-sm text-gray-500 select-none cursor-default"
                  style={{ userSelect: 'none' }}
                >
                  No categories available
                </div>
              )}
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
          filteredItems.map((item) => {
            const totalCount = getTotalCartCount(item.id);
            const variantsLength = item.variants.length;
            const firstVariant = variantsLength > 0 ? item.variants[0] : { quantityType: "UNIT", quantityValue: "DEFAULT" };

            return (
              <div
                key={item.id}
                className="w-full flex flex-row items-start p-4 border-b border-gray-200 cursor-pointer"
              >
                <div className="flex-1 flex flex-col pr-4">
                  <h1 className="font-semibold text-lg text-gray-900 select-none cursor-default">{item.name}</h1>
                  <h2 className="font-semibold text-md text-gray-800 mb-1 select-none cursor-default">₹ {item.price}</h2>
                  <div className="flex items-center text-sm mb-2">
                    <Icon icon="mdi:food-steak" />
                    <span className="font-medium text-gray-700 select-none cursor-default">{/* rating placeholder */}</span>
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
                          color: '#e4002b',
                          boxShadow: '0 2px 4px rgba(228, 0, 43, 0.2)',
                          height: '40px',
                          width: '120px',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxSizing: 'border-box',
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
                            openModal(item);  // OPEN MODAL on minus click for multi-variant
                          }}
                          className="flex items-center justify-center rounded-full focus:outline-none"
                          style={{
                            color: themeColor,
                            width: '32px',
                            height: '32px',
                            padding: 0,
                            cursor: 'pointer',
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
                            openModal(item);  // OPEN MODAL on plus click for multi-variant
                          }}
                          className="flex items-center justify-center rounded-full focus:outline-none"
                          style={{
                            color: themeColor,
                            width: '32px',
                            height: '32px',
                            padding: 0,
                            cursor: 'pointer',
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
                          color: '#e4002b',
                          boxShadow: '0 2px 4px rgba(228, 0, 43, 0.2)',
                          height: '40px',
                          width: '120px',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxSizing: 'border-box',
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
          })
        )}
      </div>

      {/* Modal */}
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

            {/* Variant selection */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 select-none">Choose portion</h3>
              <div className="flex gap-4 flex-wrap">
                {selectedItem.variants.map((variant, idx) => {
                  const isSelected = selectedVariant && JSON.stringify(selectedVariant) === JSON.stringify(variant);
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
                          : 'bg-white border-gray-300 text-gray-800'}
                      `}
style={{
  cursor: 'pointer',
  borderColor: isSelected ? themeColor : '#d1d5db',
  borderWidth: '1px',         // reduced from 2px or default
  backgroundColor: isSelected ? '#fdecef' : 'white',
  color: isSelected ? themeColor : '#374151',
  minWidth: '80px',
  textAlign: 'center',
  fontSize: '0.85rem',
}}


                    >
                      {variant.quantityValue} ({priceToShow} ₹) {cartCountForVar > 0 && ` x${cartCountForVar}`}
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
              color: '#e4002b',
              boxShadow: '0 2px 4px rgba(228, 0, 43, 0.2)',

            }}
          >
            ADD
          </button>
            ) : (
              <div className="border-2 rounded-full p-1 bg-white flex items-center gap-3 shadow-md w-max mx-auto">
                <button
                  onClick={() => minusItems(selectedItem.id, selectedVariant, true /* direct update in modal */)}
                  className="px-3 py-1 font-bold rounded-full text-base focus:outline-none"
                  style={{ color: themeColor, cursor: 'pointer' }}
                >
                  <Icon icon="ic:baseline-minus" />
                </button>
                <span className="font-bold text-base" style={{ color: themeColor }}>
                  {getCartCountForVariant(selectedItem.id, selectedVariant)}
                </span>
                <button
                  onClick={() => plusItems(selectedItem.id, selectedVariant, true /* direct update in modal */)}
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
