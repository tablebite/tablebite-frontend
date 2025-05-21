import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState, useRef } from 'react';
import { getMenuListByRestaurantIdAndRestaurantName, getRestaurantColorTheme } from '../Services/allApi';
import AddCart from './AddCart';
import { useSearchParams } from 'react-router';

function Home() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Starters'); 
  const [selectedType, setSelectedType] = useState('Veg');
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();

  const restaurantId = searchParams.get('restaurantId');
  const restaurantName = searchParams.get('restaurantName') || 'Italian Dorado';

  const [themeColor, setThemeColor] = useState(() => {
    const cachedTheme = localStorage.getItem('themeColor');
    return cachedTheme ? cachedTheme : "#2ebf6c";
  });

  const searchInputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fixed categories
  const categories = ['Starters', 'Main Course', 'Desserts'];

  useEffect(() => {
    fetchColorTheme();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getHeaders = () => {
    const username = "admin";
    const password = "admin123";
    return {
      'Authorization': 'Basic ' + btoa(`${username}:${password}`),
    };
  };

  const fetchColorTheme = async (headers) => {
    try {
      const res = await getRestaurantColorTheme(restaurantId, headers);
      if (res?.status === 500) {
        alert('Failed to fetch the restaurant color theme.');
        return;
      }
      const newTheme = res?.data || {};
      const finalColor = newTheme.backgroundColor || "#2ebf6c";
      setThemeColor(finalColor);
      localStorage.setItem('themeColor', finalColor);
    } catch (error) {
      console.error('Error fetching restaurant color theme:', error);
      alert("Failed to fetch the color theme. Please try again later.");
    }
  };

  useEffect(() => {
    getItems();
    window.scrollTo(0, 0); // Ensure the page does not suddenly jump
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const headers = getHeaders();
      await fetchColorTheme(headers);
      setLoading(false);
    };
    fetchData();
  }, []);

  const scrollToSearchBar = () => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth' });
      searchInputRef.current.focus();
      searchInputRef.current.style.borderColor = themeColor;
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.style.borderColor = '';
      }, 1000);
    }
  };

  const updateToCart = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, cartCount: 1 } : item
    ));
    const selectedItem = items.find(item => item.id === id);
    if (selectedItem) {
      const existingItem = cartItems.find(ci => ci.id === id);
      if (!existingItem) {
        setCartItems([...cartItems, { ...selectedItem, cartCount: 1 }]);
      } else {
        setCartItems(cartItems.map(ci => ci.id === id ? { ...ci, cartCount: 1 } : ci));
      }
    }
  };

  const plusItems = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, cartCount: item.cartCount + 1 } : item
    ));
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, cartCount: item.cartCount + 1 } : item
    ));
  };

  const minusItems = (id) => {
    setItems(items.map(item =>
      item.id === id && item.cartCount > 1
        ? { ...item, cartCount: item.cartCount - 1 }
        : item.id === id && item.cartCount === 1
          ? { ...item, cartCount: 0 }
          : item
    ));
    setCartItems(cartItems
      .map(item =>
        item.id === id ? { ...item, cartCount: item.cartCount - 1 } : item
      )
      .filter(item => item.cartCount > 0));
  };

  const getItems = async () => {
    const username = "admin";
    const password = "admin123";
    const reqHeaders = {
      'Authorization': 'Basic ' + btoa(username + ":" + password)
    };
    const res = await getMenuListByRestaurantIdAndRestaurantName(restaurantId, restaurantName, reqHeaders);
    const newData = res?.data?.map((item) => ({
      id: item?.id,
      name: item?.itemName,
      description: item?.itemDescription || "",
      price: item?.price,
      imageUrl: item?.imageUrl ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
      category: item?.category ?? 'Starters',
      cartCount: 0,
      type: item?.type ?? 'Veg',
      rating: item?.rating ?? 4.2,
      ratingCount: item?.ratingCount ?? 250,
      customisable: item?.customisable || false
    }));
    setItems(newData);
    setLoading(false);

    if (res?.status === 500) {
      alert('No menus found with provided restaurant id and restaurant name');
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items?.filter(item => {
    return (
      (selectedCategory === '' || item.category === selectedCategory) &&
      (selectedType === 'All' || item.type === selectedType) &&
      (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const SkeletonLoader = () => (
    <div className="w-full flex items-start p-4 border-b border-gray-200 animate-pulse">
      {/* Text Content Skeleton */}
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
  
      {/* Larger Image Skeleton */}
      <div className="w-32 h-32 ml-6 bg-gray-200 rounded-lg"></div>
    </div>
  );
  
  

  return (
    <div className="bg-white min-h-screen w-full font-sans text-gray-800">
      {/* Header Section */}
      <div className="flex flex-col px-4 py-6 border-b border-gray-200">
        <h1 className="font-bold text-gray-900 text-xl leading-tight">Find delicious items from</h1>
        <h2 className="font-bold text-2xl mt-1 text-green-600">{restaurantName}</h2>
      </div>

   {/* Search Bar */}
<div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white " ref={searchInputRef}>
  <div className="relative w-full">
    <input
      className="w-full bg-white text-gray-700 text-base placeholder-gray-500 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition duration-200 text-[16px]"
      type="text"
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder="Search for dishes..."
      style={{ fontSize: '16px' }} /* Ensure consistent font size */
    />
    <button
      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition duration-200"
    >
      <Icon icon="ic:round-search" className="text-xl" />
    </button>
  </div>
</div>

      {/* Veg/Non-Veg Toggle and Custom Dropdown */}
      <div className="p-3 border-b border-gray-200 flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Veg Toggle */}
        <div className="flex items-center gap-2">
          <label className="relative inline-block w-11 h-6">
            <input
              type="checkbox"
              checked={selectedType === 'Veg'}
              onChange={() => handleTypeChange(selectedType === 'Veg' ? 'All' : 'Veg')}
              className="opacity-0 w-0 h-0 peer"
            />
            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 rounded-full peer-checked:bg-green-600 transition"></span>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></span>
          </label>
          <span className="text-sm text-gray-700 font-medium">Veg</span>
        </div>

        {/* Non-Veg Toggle */}
        <div className="flex items-center gap-2">
          <label className="relative inline-block w-11 h-6">
            <input
              type="checkbox"
              checked={selectedType === 'Non-Veg'}
              onChange={() => handleTypeChange(selectedType === 'Non-Veg' ? 'All' : 'Non-Veg')}
              className="opacity-0 w-0 h-0 peer"
            />
            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 rounded-full peer-checked:bg-red-600 transition"></span>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></span>
          </label>
          <span className="text-sm text-gray-700 font-medium">Non-Veg</span>
        </div>

        {/* Fixed Categories Dropdown */}
        <div className="ml-auto relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm font-medium flex items-center gap-1 focus:outline-none bg-white"
          >
            <span>{selectedCategory || 'Select Category'}</span>
            <Icon icon="ic:round-arrow-drop-down" className="text-base text-gray-500" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10 overflow-hidden">
              {['Starters', 'Main Course', 'Desserts'].map(cat => (
                <div
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    selectedCategory === cat ? 'font-semibold text-gray-800' : 'text-gray-700'
                  }`}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


 {/* Item Listing */}
<div className="flex flex-col" style={{ paddingBottom: '70px' }}>
  {loading ? (
    Array(5).fill().map((_, idx) => <SkeletonLoader key={idx} />)
  ) : filteredItems.length === 0 ? (
    <div className="text-center py-10">
      <p className="text-gray-600 text-lg font-medium">No results found</p>
      <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
    </div>
  ) : (
    filteredItems.map((item, index) => (
      <div
        key={item.id}
        className={`w-full flex flex-row items-start p-4 border-b border-gray-200 ${
          index === filteredItems.length - 1 ? 'pb-0' : ''
        }`}
      >
        <div className="flex-1 flex flex-col pr-4">
          <h1 className="font-semibold text-lg text-gray-900">{item.name}</h1>
          <h2 className="font-semibold text-md text-gray-800 mb-1">₹ {item.price}</h2>
          <div className="flex items-center text-sm mb-2">
            <Icon icon="ic:round-star-rate" className="mr-1 text-yellow-500" />
            <span className="font-medium text-gray-700">
              {item.rating ?? 4.2} ({item.ratingCount ?? 250})
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2 leading-relaxed">
            Serves 1 | {item.description.slice(0, 80)}
            {item.description.length > 80 && '...'}{' '}
            <span className="text-sm cursor-pointer font-medium text-blue-600">more</span>
          </p>
        </div>

        <div className="relative w-36 h-36">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
          {item.cartCount === 0 ? (
            <button
              onClick={() => updateToCart(item?.id)}
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
                onClick={() => minusItems(item?.id)}
                className="px-3 py-1 font-bold rounded-full text-base focus:outline-none"
                style={{ color: themeColor }}
              >
                <Icon icon="ic:baseline-minus" />
              </button>

              <span className="font-bold text-base" style={{ color: themeColor }}>
                {item?.cartCount}
              </span>

              <button
                onClick={() => plusItems(item?.id)}
                className="px-3 py-1 font-bold rounded-full text-base focus:outline-none"
                style={{ color: themeColor }}
              >
                <Icon icon="ic:baseline-plus" />
              </button>
            </div>
          )}

          {item.customisable && (
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-sm font-medium text-gray-600">
              Customisable
            </span>
          )}
        </div>
      </div>
    ))
  )}
</div>




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
