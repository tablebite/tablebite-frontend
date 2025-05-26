import React, { useState } from 'react';

function AddCart({ cartCount = 0, cartItems = [], onViewCart, themeColor }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleViewCart = () => {
    if (typeof onViewCart === 'function') {
      onViewCart();
    }
    setIsModalVisible(true);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.cartCount,
    0
  );

  return (
    <>
      {/* Fixed View Basket Section */}
      <div
        className="fixed bottom-0 w-full z-50 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: themeColor }}
      >
        <span className="text-white text-sm font-medium" style={{
    userSelect: 'none',
    cursor: 'default',
  }}>
          {cartCount > 0 ? `${cartCount} items added` : 'Cart is empty'}
        </span>
        <button
          className="text-white text-sm font-semibold flex items-center"
          style={{
            userSelect: 'none',
            cursor: 'default',
          }}
          onClick={handleViewCart}
        >
          VIEW BASKET
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-4 h-4 ml-1"
            viewBox="0 0 16 16"
          >
            <path d="M2 2a.5.5 0 010-1h2a.5.5 0 01.495.435L4.89 2H14.5a.5.5 0 01.491.592l-1.5 7a.5.5 0 01-.465.408H5.13l-.02.08a2 2 0 101.912 2.49h5.414a.5.5 0 010 1H7.024a3 3 0 11-2.493-3.871l1.365-5.308a.5.5 0 01.49-.408H14.5a.5.5 0 010 1H4.83l-.832 3.24L3.28 2H2z" />
          </svg>
        </button>
      </div>

      {/* Modal to Show Cart Items */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4 relative">
            <h2
              className="text-lg font-bold mb-4"
              style={{
                userSelect: 'none',
                cursor: 'default',
              }}
            >
              Your Basket
            </h2>
            {cartItems.length > 0 ? (
              <ul className="space-y-3">
                {cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b border-gray-200 pb-2"
                  >
                    <div className="flex flex-col">
                      <span
                        className="font-medium text-sm"
                        style={{
                          userSelect: 'none',
                          cursor: 'default',
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-xs text-gray-500"
                        style={{
                          userSelect: 'none',
                          cursor: 'default',
                        }}
                      >
                        Qty: {item.cartCount}
                      </span>
                    </div>
                    <span
                      className="font-semibold text-sm"
                      style={{
                        userSelect: 'none',
                        cursor: 'default',
                      }}
                    >
                      ₹{(item.price * item.cartCount).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="text-gray-500 text-center py-4"
                style={{
                  userSelect: 'none',
                  cursor: 'default',
                }}
              >
                Your cart is empty.
              </p>
            )}

            {cartItems.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <span
                  className="font-semibold text-sm"
                  style={{
                    userSelect: 'none',
                    cursor: 'default',
                  }}
                >
                  Total: ₹{totalPrice.toFixed(2)}
                </span>
                <button
                  className="px-4 py-2 rounded-md text-white"
                  style={{ backgroundColor: themeColor ,  userSelect: 'none', cursor: 'default'}}
                  onClick={() => alert('Proceeding to Checkout...')}
                >
                  Checkout
                </button>
              </div>
            )}

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalVisible(false)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 
                  011.414 0L10 8.586l4.293-4.293a1 
                  1 0 111.414 1.414L11.414 
                  10l4.293 4.293a1 1 0 
                  01-1.414 1.414L10 
                  11.414l-4.293 4.293a1 1 0 
                  01-1.414-1.414L8.586 
                  10 4.293 5.707a1 1 0 
                  010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AddCart;
