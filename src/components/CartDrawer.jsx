import { Link } from 'react-router-dom';
import { X, Lock, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  const freeShippingThreshold = 4000;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const isFreeShipping = subtotal >= freeShippingThreshold;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in">

        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Cart</h2>
            <span className="bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 bg-[#FAFAFA]">
          <p className="text-center text-sm font-medium mb-2">
            {isFreeShipping
              ? "You are eligible for free shipping!"
              : `Spend Rs. ${(freeShippingThreshold - subtotal).toLocaleString()} more for free shipping!`}
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>Your cart is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-black underline font-bold cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedColor}-${idx}`} className="flex gap-4">
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain mix-blend-multiply p-2"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                      <div className="text-right">
                        <p className="font-bold text-sm">Rs.{item.price.toLocaleString()}</p>
                        {item.oldPrice && (
                          <p className="text-xs text-gray-400 line-through">Rs.{item.oldPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{item.selectedColor}</p>
                  </div>

                  <div className="flex justify-between items-end mt-3">
                    <div className="flex items-center border border-gray-300 rounded-md h-8">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColor, -1)}
                        className="px-3 hover:bg-gray-100 h-full flex items-center cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColor, 1)}
                        className="px-3 hover:bg-gray-100 h-full flex items-center cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.selectedColor)}
                      className="text-xs text-gray-500 underline hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <button className="text-xs font-bold underline text-gray-600 cursor-pointer hover:text-black">Add order note</button>
              <span className="text-xs text-gray-500">Shipping & taxes calculated at checkout</span>
            </div>

            <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
              <button className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-between px-6 hover:bg-gray-900 transition-all shadow-lg active:scale-[0.99] cursor-pointer">
                <span className="flex items-center gap-2">
                <Lock size={16} /> CHECKOUT
              </span>
              <span>• Rs.{subtotal.toLocaleString()} PKR</span>
              </button>
            </Link>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;