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
  getCategoriesByRestaurantId,
  getRestaurantByRestaurantId
} from '../Services/allApi';
import AddCart from './AddCart';
import '../App.css'; 

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function Home() {
  const { restaurantId } = useParams();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [animationTrigger, setAnimationTrigger] = useState(null);


  const searchInputRef = useRef(null);

  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('themeColor') || "#e4002b";
  });

  const skipHighlightOnFocus = useRef(false);

  const debouncedSearch = useDebounce(searchTerm, 200);

  const getHeaders = useCallback(() => ({
    'Authorization': 'Basic ' + btoa(`admin:admin123`)
  }), []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  const categoryRefs = useRef({});

  useEffect(() => {
  if (animationTrigger) {
    const timer = setTimeout(() => {
      setAnimationTrigger(null);
    }, 200); // Same as animation duration

    return () => clearTimeout(timer);
  }
}, [animationTrigger]);


  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, menuRes] = await Promise.all([
          getCategoriesByRestaurantId(restaurantId),
          getMenuListByRestaurantIdAndRestaurantName(restaurantId)
        ]);

        if (isMounted && catRes?.data) {
          const cats = catRes.data.map(cat => cat.name);
          setCategories(cats);
        }

        if (isMounted && menuRes?.data) {
          setItems(menuRes.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: item.variants?.[0]?.salePrice ?? item.variants?.[0]?.listPrice ?? 0,
            imageUrl: (item.imageUrls && item.imageUrls.length > 0)
              ? item.imageUrls[0]
              : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
            images: item.images || [],
            imageUrls: item.imageUrls || [],
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

  useEffect(() => {
    if (categories.length > 0) {
      setExpandedCategories([categories[0]]);
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

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

  // Trigger the animation
  setAnimationTrigger({ id, variant });
  setIsModalVisible(false); // Reset modal state when adding/removing items.
}, [items]);



  const updateToCart = useCallback((id, variant) =>
    updateCartCount(id, variant, 1),
    [updateCartCount]);

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


  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      if (categories.length > 0) {
        setExpandedCategories([categories[0]]);
        setSelectedCategory(categories[0]);
      }
      return;
    }

    const matchingCategories = categories.filter(cat =>
      filteredItems.some(item => item.category === cat)
    );

    if (matchingCategories.length > 0) {
      setExpandedCategories(matchingCategories);
      setSelectedCategory(matchingCategories[0]);

      setTimeout(() => {
        const el = categoryRefs.current[matchingCategories[0]];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setExpandedCategories([]);
      setSelectedCategory(null);
    }
  }, [debouncedSearch, filteredItems, categories]);

  const handleTypeChange = useCallback((type) => {
    setSelectedType(t => t === type ? '' : type);
  }, []);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const toggleExpand = useCallback((id) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(eid => eid !== id)
        : [...prev, id]
    );
  }, []);

  const handleRemoveCartItem = useCallback((index) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      if (prev.includes(category)) {
        return [];
      } else {
        return [category];
      }
    });
    setSelectedCategory(category);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setSelectedVariant(item.variants?.[0] || null);
    setModalVisible(true);
    document.body.style.overflow = 'hidden';  // Prevent scrolling on body
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
    document.body.style.overflow = '';  // Re-enable scrolling on body
  };

  const handleMenuToggle = () => {
    setMenuVisible(v => !v);
  };

  // BUTTON CLICK ANIMATION CLASS
  // Scale down effect on click or tap for Add/Minus buttons (slightly stronger scale)
  const buttonClickClass = "transition-transform duration-150 ease-in-out active:scale-90";

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start">
        <div className="w-full bg-white-smoke-300 mb-8 p-4 animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
        {Array(5).fill().map((_, idx) => <SkeletonLoader key={idx} />)}
      </div>
    );
  }

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

  return (
    <div className="bg-white min-h-screen w-full font-sans text-gray-800 relative flex flex-col">

      {/* Header */}
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

      {/* Search Bar */}
      <div className="sticky top-0 z-10 p-4 bg-white">
        <div className="relative w-full" ref={searchInputRef}>
          <input
            className="w-full bg-white text-gray-700 text-base placeholder-gray-500 px-5 py-3 rounded-full border border-gray-300 focus:outline-none shadow-sm transition duration-200 text-[16px]"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for dishes"
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={inputFocused ? { boxShadow: `0 0 0 2px ${themeColor}`, borderColor: themeColor } : {}}
          />
          <button
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition duration-200`}
            tabIndex={-1}
          >
            <Icon icon="ic:round-search" className="text-xl" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 border-b border-gray-200 flex items-center gap-4">
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

      {/* Category Accordion */}
      <div className="mt-4">
        {categories.map(cat => {
          const itemsInCategory = filteredItems.filter(i => i.category === cat);
          const countInCategory = itemsInCategory.length;
          const isExpanded = expandedCategories.includes(cat);

          return (
            <div key={cat} className="border-b border-gray-200">
              <button
                ref={el => (categoryRefs.current[cat] = el)}
                onClick={() => toggleCategory(cat)}
                className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50"
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  scrollMarginTop: '80px'
                }}
              >
                <span className="font-semibold text-gray-900">
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

              {isExpanded && (
                <div>
                  {itemsInCategory.map((item, index) => {
                    const totalCount = getTotalCartCount(item.id);
                    const variantsLength = item.variants.length;
                    const firstVariant = variantsLength > 0
                      ? item.variants[0]
                      : { quantityType: "UNIT", quantityValue: "DEFAULT" };
                    const isLastItem = index === itemsInCategory.length - 1;

                    return (
                      <div
                        key={item.id}
                        className={`w-full flex flex-row items-start p-4 cursor-pointer ${
                          isLastItem ? '' : 'border-b border-gray-100'
                        }`}
                        onClick={() => openModal(item)}
                      >
                        <div className="flex-1 flex flex-col pr-4">
                          <h1 className="font-semibold text-lg text-gray-900 select-none cursor-default">
                            {item.name}
                          </h1>
                          <h2 className="font-semibold text-md text-gray-800 mb-1 select-none cursor-default">
                            ₹ {item.price}
                          </h2>
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
                                onMouseDown={e => e.stopPropagation()}
                              >
                                {expandedItems.includes(item.id) ? 'less' : 'more'}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="relative w-36 h-36 mb-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-2xl shadow-md"
                            loading="lazy"
                          />
                          {/* Add to cart buttons */}
                          {variantsLength > 1 ? (
                            totalCount === 0 ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(item);
                                }}
                                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] font-medium text-base rounded-full shadow-lg ${buttonClickClass}`}
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  color: themeColor,
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
                                  className={`flex items-center justify-center rounded-full focus:outline-none ${buttonClickClass}`}
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
  className={`font-bold text-base ${animationTrigger && animationTrigger.id === item.id ? 'quantity-animate' : ''}`}
  style={{ color: themeColor, minWidth: '24px', textAlign: 'center' }}
>
  {totalCount}
</span>


                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(item);
                                  }}
                                  className={`flex items-center justify-center rounded-full focus:outline-none ${buttonClickClass}`}
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
                                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[35%] font-medium text-base rounded-full shadow-md ${buttonClickClass}`}
                                style={{

                                  backgroundColor: '#FFFFFF',
                                  color: themeColor,
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
                                  className={`flex items-center justify-center rounded-full focus:outline-none ${buttonClickClass}`}
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
                            className={`font-bold text-base ${animationTrigger && animationTrigger.id === item.id ? 'quantity-animate' : ''}`}
                            style={{ color: themeColor, minWidth: '24px', textAlign: 'center' }}
                          >
                            {totalCount}
                          </span>


                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    plusItems(item.id, firstVariant, true);
                                  }}
                                  className={`flex items-center justify-center rounded-full focus:outline-none ${buttonClickClass}`}
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

      {/* Customization Modal */}
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
              className={`absolute top-3 right-3 text-gray-600 hover:text-gray-900 ${buttonClickClass}`}
              onClick={closeModal}
              aria-label="Close modal"
            >
              <Icon icon="ic:baseline-close" className="text-2xl" />
            </button>

            {/* Show all images horizontally scrollable */}
            <div className="flex overflow-x-auto space-x-4 mb-4">
              {(selectedItem.imageUrls && selectedItem.imageUrls.length > 0) ? (
                selectedItem.imageUrls.map((img, idx) => (
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

            <h2 className="text-2xl font-bold mb-2 select-none m-0">{selectedItem.name}</h2>
            <p className="text-gray-700 mb-2 select-none">{selectedItem.description}</p>

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
                        ${buttonClickClass}
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

            <p className="font-semibold text-lg mb-4 select-none">
              Price: ₹ {selectedVariant?.salePrice ?? selectedVariant?.listPrice ?? selectedItem.price}
            </p>

            {getCartCountForVariant(selectedItem.id, selectedVariant) === 0 ? (
              <button
                onClick={() => {
                  if (selectedVariant) updateToCart(selectedItem.id, selectedVariant);
                }}
                className={`bg-green-500 text-white font-medium rounded-full px-6 py-2 shadow-lg w-full ${buttonClickClass}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: themeColor,
                }}
              >
                ADD
              </button>
            ) : (
              <div className="border-2 rounded-full p-1 bg-white flex items-center gap-3 shadow-md w-max mx-auto">
                <button
                  onClick={() => minusItems(selectedItem.id, selectedVariant, true)}
                  className={`px-3 py-1 font-bold rounded-full text-base focus:outline-none ${buttonClickClass}`}
                  style={{ color: themeColor, cursor: 'pointer' }}
                >
                  <Icon icon="ic:baseline-minus" />
                </button>
             

                                              <span
  className={`font-bold text-base ${animationTrigger && animationTrigger.id === selectedItem.id ? 'quantity-animate' : ''}`}
  style={{ color: themeColor, minWidth: '24px', textAlign: 'center' }}
>
                  {getCartCountForVariant(selectedItem.id, selectedVariant)}
                </span>
                <button
                  onClick={() => plusItems(selectedItem.id, selectedVariant, true)}
                  className={`px-3 py-1 font-bold rounded-full text-base focus:outline-none ${buttonClickClass}`}
                  style={{ color: themeColor, cursor: 'pointer' }}
                >
                  <Icon icon="ic:baseline-plus" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer naturally at bottom */}
      <div className="px-4 py-4 bg-gray-100 text-center text-gray-600 text-sm select-none rounded-t-lg border-t border-gray-300 mt-auto">
        <p className="font-semibold text-gray-700 mb-1">Kottayam Nights Family Restro</p>
        <p className="text-gray-600 mb-1">Kottayam, Peroor 686637</p>
        <div className="border-t border-gray-300 pt-2 mt-2 text-xs text-gray-500">
          © 2025.{' '}
          <a
            href="https://tablebite.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-grey-600"
            style={{ textDecoration: 'none' }}
          >
            tablebite.in
          </a>
        </div>
      </div>

      <AddCart
  isModalVisible={isModalVisible} // Pass state
  setIsModalVisible={setIsModalVisible} // Pass setter
  themeColor={themeColor}
  cartCount={cartItems.length}
  cartItems={cartItems}
  onSearchIconClick={() => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth' });
      searchInputRef.current.focus();
    }
  }}
  onRemoveItem={(index) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }}
/>

      <div
        onClick={handleMenuToggle}
        className={`fixed ${buttonClickClass}`}
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
          zIndex: modalVisible ? 10 : 50,
          userSelect: 'none',
        }}
      >
        MENU
      </div>

    {menuVisible && (
  <>
    <div
      className="fixed inset-0"
      onClick={() => setMenuVisible(false)}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 70,
      }}
    />

    <div
      className="fixed left-1/2 bottom-16 rounded-xl overflow-hidden"
      style={{
        backgroundColor: '#121212',
        width: '320px',
        maxHeight: '60vh',
        overflowY: 'auto',
        boxShadow: '0 0 20px rgba(0,0,0,0.8)',
        transform: 'translateX(-50%)',
        zIndex: 80,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul>
        {categories.map(cat => {
          const countInCategory = items.filter(i => i.category === cat).length;
          const isSelected = cat === selectedCategory;
          return (
            <li key={cat}>
              <button
                onClick={() => {
                  setSelectedCategory(cat);
                  setExpandedCategories([cat]);
                  setMenuVisible(false);
                  setTimeout(() => {
                    const headerEl = categoryRefs.current[cat];
                    if (headerEl) {
                      headerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 200);
                }}
                className={`w-full flex justify-between items-center px-5 py-4 ${
                  isSelected
                    ? 'text-white font-semibold'
                    : 'text-gray-300'
                } ${buttonClickClass}`}  // Removed hover styles
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '1rem',
                }}
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
