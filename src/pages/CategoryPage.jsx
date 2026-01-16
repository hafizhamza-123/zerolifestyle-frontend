import { useEffect, useState, useCallback } from "react";
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
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setCategory({
                    id: categoryId,
                    name: response.data.category || categoryName || "Category"
                });
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="h-full">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CategoryPage;
