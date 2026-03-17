import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import API from "../api/axios.js";
import toast from "react-hot-toast";
import smartwachesImage from "../assets/images/best-seller-sw.webp";
import earbudsImage from "../assets/images/best-seller-earbuds.webp";
import headphonesImage from "../assets/images/Main-banner-Home-page_4.webp";

const CategoryPage = ({ categoryName }) => {
    const ITEMS_PER_PAGE = 12;
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("default");
    const [searchQuery, setSearchQuery] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [onSaleOnly, setOnSaleOnly] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const fetchCategoryAndProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let response;
            let categoryId;

            if (categoryName && !id) {
                try {
                    const allCategories = await API.get(`/categories`);
                    const categories = allCategories.data?.categories || [];
                    let matchedCategory = categories.find(
                        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
                    );

                    if (!matchedCategory) {
                        matchedCategory = categories.find(
                            (cat) => cat.name.toLowerCase().includes(categoryName.toLowerCase())
                        );
                    }

                    if (!matchedCategory) {
                        console.warn(`Category "${categoryName}" not found. Available categories:`, categories.map(c => c.name));
                        setError(`Category not found`);
                        toast.error("Category not found");
                        navigate("/");
                        return;
                    }

                    categoryId = matchedCategory.id;
                    response = await API.get(`/categories/products/${categoryId}`);
                } catch (err) {
                    console.error("Error fetching categories list:", err);
                    setError("Failed to load categories");
                    toast.error("Failed to load categories");
                    navigate("/");
                    return;
                }
            } else if (id) {
                categoryId = id;
                response = await API.get(`/categories/products/${id}`);
            } else {
                setError("No category specified");
                navigate("/");
                return;
            }

            if (response.data?.success) {
                setProducts(Array.isArray(response.data.products) ? response.data.products : []);
            } else {
                setError("Category not found");
                toast.error("Category not found");
                navigate("/");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to load category";
            console.error("Error fetching category:", error);
            setError(errorMessage);
            toast.error(errorMessage);
            navigate("/");
        } finally {
            setLoading(false);
        }
    }, [id, categoryName, navigate]);

    useEffect(() => {
        if (id || categoryName) {
            fetchCategoryAndProducts();
        }
    }, [id, categoryName, fetchCategoryAndProducts]);

    const normalizedSearch = searchQuery.trim().toLowerCase();

    const processedProducts = useMemo(() => {
        let list = products;

        if (normalizedSearch) {
            list = list.filter((product) =>
                String(product?.name || "").toLowerCase().includes(normalizedSearch)
            );
        }

        if (inStockOnly) {
            list = list.filter((product) => Number(product?.stockCount || 0) > 0);
        }

        if (onSaleOnly) {
            list = list.filter((product) => {
                const price = Number(product?.price || 0);
                const discountedPrice = Number(product?.discountedPrice || price);
                return price > 0 && discountedPrice < price;
            });
        }

        if (sortBy === "default") return list;

        const sorted = [...list];

        const getEffectivePrice = (product) =>
            Number(product?.discountedPrice || product?.price || 0);

        switch (sortBy) {
            case "price-low":
                sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
                break;
            case "price-high":
                sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
                break;
            case "name-asc":
                sorted.sort((a, b) =>
                    String(a?.name || "").localeCompare(String(b?.name || ""))
                );
                break;
            case "name-desc":
                sorted.sort((a, b) =>
                    String(b?.name || "").localeCompare(String(a?.name || ""))
                );
                break;
            case "latest":
                sorted.sort((a, b) => {
                    const aDate = new Date(a?.createdAt || a?.updatedAt || 0).getTime();
                    const bDate = new Date(b?.createdAt || b?.updatedAt || 0).getTime();
                    return bDate - aDate;
                });
                break;
            default:
                break;
        }

        return sorted;
    }, [products, normalizedSearch, inStockOnly, onSaleOnly, sortBy]);

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [normalizedSearch, inStockOnly, onSaleOnly, sortBy]);

    const visibleProducts = useMemo(
        () => processedProducts.slice(0, visibleCount),
        [processedProducts, visibleCount]
    );

    const hasMoreProducts = visibleCount < processedProducts.length;

    const resetFilters = () => {
        setSearchQuery("");
        setInStockOnly(false);
        setOnSaleOnly(false);
        setSortBy("default");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading category...</p>
                </div>
            </div>
        );
    }

    if (error && products.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <AnnouncementBar />
                <Navbar />
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <p className="text-red-500 text-xl font-medium">Error loading category</p>
                        <p className="text-gray-500 mt-2">{error}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col">
            <AnnouncementBar />
            <Navbar />

            {/* Category Banner */}
            <div className="w-full cursor-pointer">
                {categoryName === "Smart Watches" && (
                    <img
                    src={smartwachesImage}
                    alt="Zero Lifestyle"
                    className="w-full"
                />
                )}
                {categoryName === "Zero Earbuds" && (
                    <img
                    src={earbudsImage}
                    alt="Zero Lifestyle"
                    className="w-full"
                />
                )}
                {categoryName === "Headphones" && (
                    <img
                    src={headphonesImage}
                    alt="Zero Lifestyle"
                    className="w-full"
                />
                )}
            </div>

            {/* Category Products Section */}
            <div className="flex-1 py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <div className="flex justify-center items-center h-80">
                            <div className="text-center">
                                <svg
                                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                                <p className="text-gray-500 text-xl font-medium">
                                    No products available in this category
                                </p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Our Collection
                                </h2>
                                <p className="text-gray-600">
                                    {products.length} amazing product{products.length !== 1 ? "s" : ""} waiting for you
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-7">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="categorySearch"
                                            className="text-xs font-semibold tracking-wide text-gray-500 uppercase"
                                        >
                                            Search Product
                                        </label>
                                        <input
                                            id="categorySearch"
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by product name"
                                            className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="categorySort"
                                            className="text-xs font-semibold tracking-wide text-gray-500 uppercase"
                                        >
                                            Sort By
                                        </label>
                                        <select
                                            id="categorySort"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                        >
                                            <option value="default">Default</option>
                                            <option value="latest">Latest</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="name-asc">Name: A-Z</option>
                                            <option value="name-desc">Name: Z-A</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-5">
                                        <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={inStockOnly}
                                                onChange={(e) => setInStockOnly(e.target.checked)}
                                                className="w-4 h-4 accent-black"
                                            />
                                            In Stock Only
                                        </label>
                                        <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={onSaleOnly}
                                                onChange={(e) => setOnSaleOnly(e.target.checked)}
                                                className="w-4 h-4 accent-black"
                                            />
                                            On Sale Only
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {processedProducts.length === 0 && (
                                <div className="bg-white border border-gray-200 rounded-2xl py-10 px-5 text-center mb-7">
                                    <p className="text-gray-800 font-medium">No products match your filters.</p>
                                    <p className="text-gray-500 text-sm mt-1">Try changing filters or resetting all options.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                                {visibleProducts.map((product) => (
                                    <div key={product.id} className="h-full min-w-0">
                                        <ProductCard product={product} fluid />
                                    </div>
                                ))}
                            </div>

                            {hasMoreProducts && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                                        className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CategoryPage;
