import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../api/cartApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = async () => {
    if (isAuthenticated && user?.role === 'ROLE_CUSTOMER') {
      try {
        const res = await getCart();
        setCartItems(res.data.items || []);
        // Calculate total if not provided directly
        const total = (res.data.items || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setCartTotal(total);
      } catch (error) {
        console.error('Failed to fetch cart', error);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addItem = async (productId, quantity = 1) => {
    try {
      await addToCart({ productId, quantity });
      toast.success('Added to cart');
      fetchCart();
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeItem(productId);
    }
    try {
      await updateCartItem({ productId, quantity });
      fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Removed from cart');
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
  };

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, addItem, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
