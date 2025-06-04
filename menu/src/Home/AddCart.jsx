import React, { useState, useEffect, useRef } from 'react';

function AddCart({ cartCount = 0, cartItems = [], onViewCart, onRemoveItem, themeColor , isModalVisible, setIsModalVisible,}) {

  const modalRef = useRef(null);

  const handleCloseModal = () => {
  setIsModalVisible(false); // Close the modal
};



  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = 'hidden';
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalVisible]);

 const handleViewCart = () => {
  if (typeof onViewCart === 'function') {
    onViewCart();
  }
  setIsModalVisible(true); // Only show the modal when "VIEW BASKET" is clicked
};

const handleRemoveItem = (index) => {
  if (typeof onRemoveItem === 'function') {
    onRemoveItem(index);
  }

  // Reset the modal if the last item is removed
  if (cartItems.length === 1) {
    setIsModalVisible(false); // Close the cart modal when the last item is removed
  }
};


  // Animation class for button click scale effect
  const buttonClickClass = "transition-transform duration-150 ease-in-out active:scale-90";

  if (cartCount === 0) {
    return null;
  }


  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.cartCount, 0)
  return (
    <>
      {/* Fixed Bottom “View Basket” Bar */}
      <div
        className="fixed bottom-0 w-full z-50 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: themeColor }}
      >
        <span
          className="text-white text-sm font-medium"
          style={{
            userSelect: 'none',
            cursor: 'default',
          }}
        >
          {cartCount} {cartCount === 1 ? 'item' : 'items'} added
        </span>
        <button
          className={`text-white text-sm font-semibold flex items-center ${buttonClickClass}`}
          style={{
            userSelect: 'none',
            cursor: 'pointer',
          }}
          onClick={handleViewCart}
          aria-haspopup="dialog"
          aria-expanded={isModalVisible}
          aria-controls="cart-modal"
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
        <>
          {/* Overlay */}
          <div
            tabIndex={-1}
            ref={modalRef}
            id="cart-modal"
            className="fixed inset-0"
            onClick={handleCloseModal}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 70,
              outline: 'none',
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal panel */}
            <div
              className="fixed left-1/2 top-1/2 rounded-xl overflow-hidden flex flex-col"
              style={{
                backgroundColor: '#fff',
                width: '320px',
                maxHeight: '60vh',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                transform: 'translate(-50%, -50%)',
                zIndex: 80,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="text-lg font-bold mb-4 px-4 pt-4"
                style={{
                  userSelect: 'none',
                  cursor: 'default',
                }}
              >
                Your Basket
              </h2>

              {/* Scrollable items container */}
              <div
                style={{
                  overflowY: 'auto',
                  flexGrow: 1,
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                }}
              >
                {cartItems.length > 0 ? (
                  <ul className="space-y-3">
                    {cartItems.map((item, index) => {
                      const isLast = index === cartItems.length - 1;
                      return (
                        <li
                          key={index}
                          className={`flex justify-between items-center pb-2 ${
                            !isLast ? 'border-b border-gray-200' : ''
                          }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className="font-medium text-sm"
                              style={{
                                userSelect: 'none',
                                cursor: 'default',
                              }}
                            >
                              {item.name}{' '}
                              {item.variant?.quantityValue &&
                              item.variant.quantityValue !== 'DEFAULT'
                                ? `(${item.variant.quantityValue})`
                                : ''}
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
                          <div className="flex items-center gap-4">
                            <span
                              className="font-semibold text-sm"
                              style={{
                                userSelect: 'none',
                                cursor: 'default',
                              }}
                            >
                              ₹{(item.price * item.cartCount).toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className={`text-red-600 hover:text-red-800 focus:outline-none text-xl ${buttonClickClass}`}
                              aria-label={`Remove ${item.name} from cart`}
                              style={{ cursor: 'pointer', lineHeight: 1 }}
                            >
                              <img
                                width="17"
                                height="17"
                                src="https://img.icons8.com/material-outlined/24/filled-trash.png"
                                alt="Remove item"
                              />
                            </button>
                          </div>
                        </li>
                      );
                    })}
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
              </div>

              {/* Fixed total section at bottom */}
              {cartItems.length > 0 && (
                <div
                  className="flex justify-between items-center px-4 py-3 border-t border-gray-200"
                  style={{ userSelect: 'none', cursor: 'default' }}
                >
                  <span className="font-semibold text-sm">Total</span>
                  <span className="font-semibold text-sm">₹{totalPrice.toFixed(2)}</span>
                </div>
              )}

              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCloseModal}
                aria-label="Close modal"
                style={{ cursor: 'pointer' }}
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
        </>
      )}
    </>
  );
}

export default AddCart;
