import { NavLink, useLocation, useNavigate } from "react-router-dom"; 
import { Search, ShoppingCart, Menu, X, Loader } from "lucide-react";
import zerologo from "../assets/images/zero-lifestyle-logo_5b9310b8-4d88-410b-84d0-b1f7fada86b2.avif"; 
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useRef, useEffect } from "react";
import API from "../api/axios.js";
import useDebounce from "./DebounceHook.jsx";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { cart, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 1000);
  const inputRef = useRef(null);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Smart Watches", path: "/smart-watches" },
    { name: "Zero Earbuds", path: "/earbuds" },
    { name: "Headphones", path: "/headphones" },
    { name: "11 11 Sale", path: "/sale", special: true },
    { name: "Vision 2025", path: "/vision-2025" },
  ];

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    searchProducts(debouncedQuery);
  }, [debouncedQuery]);

  const searchProducts = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await API.get(`/products/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setResults([]);
    setIsSearchOpen(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <nav 
      className={`left-0 w-full z-50 text-white px-4 transition-colors duration-300
      ${isHomePage ? 'absolute bg-transparent' : 'relative bg-black'}`}
    >
      <div className="max-w-[1800px] mx-auto px-4 h-[70px] flex items-center justify-between">

        <div className="flex items-center gap-4 md:hidden">
          <Menu className="w-5 h-5 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
          <Search className="w-5 h-5 cursor-pointer" onClick={() => setIsSearchOpen(true)} />
        </div>

        <div className="flex-1 md:flex-none text-center md:text-left">
          <NavLink to="/">
            <img 
              src={zerologo} 
              alt="Zero Lifestyle" 
              className="h-7 md:h-8 mx-auto md:mx-0 object-contain"
            />
          </NavLink>
        </div>

        <div className="hidden md:flex gap-9 text-sm font-light items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `transition-opacity duration-200 
                ${link.special ? "text-[#dbc481] font-semibold animate-pulse" : "hover:opacity-70"} 
                ${isActive && !link.special ? "opacity-100 font-medium border-b-2 border-white pb-1" : "opacity-90"}`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {user && (
            <div className="flex items-center gap-4 ml-6">
              <NavLink
                to="/profile"
                className="text-white font-medium hover:text-gray-300 transition"
              >
                {user.name}
              </NavLink>
              <button
                onClick={logout}
                className="text-white text-sm hover:text-gray-300 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}

          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `transition-opacity duration-200 hover:opacity-70 ${isActive ? "opacity-100 font-medium border-b-2 border-white pb-1" : "opacity-90"}`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `transition-opacity duration-200 hover:opacity-70 ${isActive ? "opacity-100 font-medium border-b-2 border-white pb-1" : "opacity-90"}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 hidden md:block cursor-pointer hover:text-gray-300 transition" onClick={() => setIsSearchOpen(true)} />
          <div 
            className="relative group cursor-pointer" 
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-5 h-5 group-hover:text-gray-300 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce-short">
                {totalItems}
              </span>
            )}
          </div>
        </div>

      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 w-full bg-black/90 backdrop-blur-md z-50 border-t">
          <div className="flex flex-col px-4 py-6 gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-light transition-opacity duration-200 ${link.special ? "text-[#dbc481] font-semibold animate-pulse" : "hover:opacity-70"} ${isActive && !link.special ? "opacity-100 font-medium border-b-2 border-white pb-2" : "opacity-90"}`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {user && (
              <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-600">
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-white font-medium hover:opacity-70 transition"
                >
                  {user.name}
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-sm text-white hover:opacity-70 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}

            {!user && (
              <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-600">
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-light transition-opacity duration-200 hover:opacity-70 opacity-90"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-light transition-opacity duration-200 hover:opacity-70 opacity-90"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Dropdown */}
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={closeSearch}
          />

          {/* Search Container */}
          <div className="absolute top-[70px] left-0 right-0 z-50 px-4 md:hidden">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden mx-auto max-w-2xl">
              {/* Search Input */}
              <div className="flex items-center px-4 py-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent ml-3 outline-none text-gray-800 placeholder-gray-400 text-sm"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {(query.trim() || loading) && (
                <div className="border-t border-gray-200 max-h-96 overflow-y-auto">
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  )}

                  {!loading && results.length === 0 && query.trim() && (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No products found for "{query}"
                    </div>
                  )}

                  {results.length > 0 && (
                    <div className="divide-y divide-gray-200">
                      {results.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left group"
                        >
                          {/* Product Image */}
                          {product.featuredImage && (
                            <img
                              src={product.featuredImage}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded bg-gray-100 shrink-0"
                            />
                          )}

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 text-sm font-medium truncate group-hover:text-blue-600 transition">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {product.discountedPrice ? (
                                <>
                                  <span className="text-gray-400 text-xs line-through">
                                    ${product.price}
                                  </span>
                                  <span className="text-green-600 font-semibold text-sm">
                                    ${product.discountedPrice}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-600 font-semibold text-sm">
                                  ${product.price}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stock Status */}
                          {product.stockCount > 0 ? (
                            <span className="text-green-600 text-xs font-medium">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-red-600 text-xs font-medium">
                              Out of Stock
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!query && results.length === 0 && !loading && (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  Start searching products...
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Desktop Search Dropdown */}
      {isSearchOpen && (
        <div className="hidden md:block absolute top-[70px] right-0 z-50 pr-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden w-96">
            {/* Search Input */}
            <div className="flex items-center px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent ml-3 outline-none text-gray-800 placeholder-gray-400 text-sm"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results */}
            {(query.trim() || loading) && (
              <div className="border-t border-gray-200 max-h-96 overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                )}

                {!loading && results.length === 0 && query.trim() && (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No products found for "{query}"
                  </div>
                )}

                {results.length > 0 && (
                  <div className="divide-y divide-gray-200">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left group"
                      >
                        {/* Product Image */}
                        {product.featuredImage && (
                          <img
                            src={product.featuredImage}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded bg-gray-100 shrink-0"
                          />
                        )}

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-sm font-medium truncate group-hover:text-blue-600 transition">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {product.discountedPrice ? (
                              <>
                                <span className="text-gray-400 text-xs line-through">
                                  ${product.price}
                                </span>
                                <span className="text-green-600 font-semibold text-sm">
                                  ${product.discountedPrice}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-600 font-semibold text-sm">
                                ${product.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stock Status */}
                        {product.stockCount > 0 ? (
                          <span className="text-green-600 text-xs font-medium">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-red-600 text-xs font-medium">
                            Out of Stock
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!query && results.length === 0 && !loading && (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                Start searching products...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for desktop */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 hidden md:block"
          onClick={closeSearch}
        />
      )}
    </nav>
  );
};

export default Navbar;
