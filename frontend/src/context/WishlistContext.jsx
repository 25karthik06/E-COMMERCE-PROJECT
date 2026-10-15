import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { isAuthenticated, user } = useAuth();
  
  // Only customers have wishlists
  const isCustomer = user?.role === 'ROLE_CUSTOMER';

  const fetchWishlist = async () => {
    if (!isAuthenticated || !isCustomer) return;
    try {
      const res = await getWishlist();
      setWishlistItems(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, isCustomer]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated || !isCustomer) {
      toast.error('Please login as a customer to use wishlist');
      return;
    }

    const isSaved = wishlistItems.some(item => item.id === product.id);
    
    // Optimistic update
    if (isSaved) {
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
    } else {
      setWishlistItems(prev => [...prev, product]);
    }

    try {
      if (isSaved) {
        await removeFromWishlist(product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      // Revert on failure
      fetchWishlist();
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
