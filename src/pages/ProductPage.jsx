import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Minus,
  Plus,
  Star,
  Eye,
  ShieldCheck,
  Truck,
  RotateCcw,
  Users,
} from "lucide-react";

import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import API from "../api/axios.js";
import toast from "react-hot-toast";

const tabs = ["Overview", "Review", "Specs", "FAQ"];

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/products/${id}`);
        const prod = res.data.product;

        setProduct(prod);
        setSelectedImage(prod.featuredImage);

        const relatedRes = await API.get(
          `/categories/products/${prod.categoryId}`
        );

        setRelatedProducts(
          relatedRes.data.products.filter((p) => p.id !== prod.id)
        );
      } catch (err) {
        toast.error("Product not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-600 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} x${quantity} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AnnouncementBar />
      <Navbar />

      {/*  PRODUCT  */}
      <div className="max-w-[1400px] mx-auto px-4 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/*  IMAGES  */}
          <div>
            <div className="bg-[#F9F9F9] rounded-3xl aspect-square flex items-center justify-center border mb-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>

            {/* GALLERY */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar">
              {[product.featuredImage, ...(product.gallery || [])].map(
                (img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 border rounded-xl bg-[#F9F9F9] flex items-center justify-center cursor-pointer ${
                      selectedImage === img
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt="gallery"
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/*  INFO  */}
          <div>
            {/* TAG + REVIEWS */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-purple-600">
                1.38&quot; HD DISPLAY
              </span>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill="#F59E0B"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-gray-600">97 reviews</span>
              </div>
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-bold mt-2">
              {product.name}
            </h1>

            {/* SUBTITLE */}
            <p className="text-gray-500 mt-1">
              BT Calling | 1.38&quot; HD Display
            </p>

            {/* PRICE */}
            <div className="flex items-end gap-4 mt-6">
              <span className="text-3xl font-bold">
                Rs.{product.discountedPrice}
              </span>
              {product.price && (
                <span className="text-lg line-through text-gray-400">
                  Rs.{product.price}
                </span>
              )}
            </div>

            {/* DISCOUNT BANNER */}
            <div className="mt-4 bg-linear-to-r from-purple-600 to-purple-800 text-white rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="font-medium">
                Use <span className="font-bold">Secret Code:</span>{" "}
                <span className="text-yellow-300 font-bold">"500"</span>{" "}
                for Extra Rs 500 discount
              </span>
              <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-lg cursor-pointer">
                500 📋
              </div>
            </div>

            {/* VIEWERS */}
            <div className="flex items-center gap-2 mt-4 text-green-600 font-semibold">
              <Eye size={16} />
              <span>1983+ People viewed this in the last 7 days</span>
            </div>

            {/* COLORS */}
            <div className="mt-6">
              <p className="font-semibold mb-3">
                Color: <span className="font-normal">Jet Black</span>
              </p>

              <div className="flex gap-4">
                {[product.featuredImage, ...(product.gallery || [])]
                  .slice(0, 4)
                  .map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl border bg-gray-100 flex items-center justify-center cursor-pointer ${
                        selectedImage === img
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt="color"
                        className="w-full h-full object-contain p-2"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4 mt-6">
              <span className="font-semibold">Quantity</span>
              <div className="flex items-center border rounded-lg px-3 py-2 w-28 justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-full border-2 border-black font-bold cursor-pointer"
              >
                ADD TO CART
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3 rounded-full bg-black text-white font-bold tracking-widest cursor-pointer"
              >
                BUY NOW
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-4 gap-4 mt-10">
              {[
                { icon: <ShieldCheck />, text: "1 Year Warranty" },
                { icon: <Truck />, text: "Free Shipping" },
                { icon: <Users />, text: "1M+ Customers" },
                { icon: <RotateCcw />, text: "7 Days Replacement" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  {React.cloneElement(item.icon, { size: 26 })}
                  <span className="text-[10px] font-bold mt-1">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-20 border-b flex gap-10 text-sm font-bold">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/*  TAB CONTENT  */}
        <div className="mt-10">
          {activeTab === "Overview" && (
            <p className="text-gray-600 max-w-3xl">
              {product.longDescription || product.description}
            </p>
          )}

          {activeTab === "Review" && (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className="border p-6 rounded-2xl bg-white"
                >
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill="#F59E0B"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Excellent product quality and fast delivery.
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Specs" && (
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              {product.specs?.length
                ? product.specs.map((s, i) => <li key={i}>{s}</li>)
                : <li>Specifications coming soon.</li>}
            </ul>
          )}

          {activeTab === "FAQ" && (
            <div className="text-gray-600">
              <p className="font-semibold">Q: Is this product original?</p>
              <p>A: Yes, 100% original with official warranty.</p>
            </div>
          )}
        </div>
      </div>

      {/* RELATED */}
      {relatedProducts.length > 0 && (
        <div className="py-20 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">
            Related Products
          </h2>
          <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
