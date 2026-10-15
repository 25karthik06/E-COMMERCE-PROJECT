import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Heart, Star, Trash2 } from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-line max-w-lg mx-auto">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-ink mb-2">Your wishlist is empty</h2>
          <p className="text-muted mb-6">Save items you love and buy them later.</p>
          <Link to="/products" className="btn-primary inline-flex">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-2">My Wishlist</h1>
      <p className="text-muted text-sm mb-8">{wishlistItems.length} items saved</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistItems.map(product => {
          const oldPrice = product.price * 1.25;
          const off = Math.round((1 - product.price / oldPrice) * 100);

          return (
            <div key={product.id} className="card card-hover overflow-hidden group flex flex-col">
              <div className="relative h-44 bg-white p-4 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <ShoppingBag className="w-16 h-16 text-gray-200" />
                )}
                {off > 0 && (
                  <span className="absolute top-2 left-2 badge badge-success">{off}% Off</span>
                )}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-rose-500 hover:scale-110 transition-transform"
                >
                  <Heart size={18} fill="currentColor" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <Link to={`/products/${product.id}`} className="flex-grow">
                  <h3 className="font-semibold text-ink text-sm mb-2 hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="rating-pill">4.5 <Star size={10} fill="currentColor" /></span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-ink">₹{product.price.toFixed(2)}</span>
                  <span className="price-old">₹{oldPrice.toFixed(0)}</span>
                </div>
                <button
                  onClick={() => addItem(product.id, 1)}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
