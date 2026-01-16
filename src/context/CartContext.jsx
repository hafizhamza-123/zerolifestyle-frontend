import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios.js";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const loadCart = async () => {
    try {
      const res = await API.get("/cart");
      const items = res.data.cart.items.map((i) => ({
        id: i.product.id,
        cartItemId: i.id,
        title: i.product.name,
        image: i.product.featuredImage,
        price: i.price,
        quantity: i.quantity,
        selectedColor: "Default",
      }));
      setCart(items);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Load cart error", err);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) loadCart();
  }, []);

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    await API.post("/cart/add", {
      productId: product.id,
      quantity,
    });
    await loadCart();
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    await API.delete(`/cart/remove/${item.cartItemId}`);
    await loadCart();
  };

  // Update item quantity
  const updateQuantity = async (id, _, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) return;

    await API.put("/cart/update", {
      itemId: item.cartItemId,
      quantity: newQty,
    });
    await loadCart();
  };

  const clearCart = async () => {
    try {
      await API.delete("/cart/clear"); 
    } catch (err) {
      console.error("Failed to clear cart on server", err);
    }
    setCart([]); 
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, 
        isCartOpen,
        setIsCartOpen,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
