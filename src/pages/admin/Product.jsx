import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import API from "../../api/axios.js";
import toast from "react-hot-toast";
import useDebounce from "../../components/DebounceHook.jsx";
import CategoryForm from "./CategoryForm.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const productsPerPage = 5;
  const debouncedSearch = useDebounce(searchTerm, 1000);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.categories || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let res;
        let finalProducts = [];

        // CASE 1: Category selected
        if (categoryFilter) {
          res = await API.get(`/categories/products/${categoryFilter}`);
          finalProducts = res.data.products || [];

          // apply search on category products (client-side)
          if (debouncedSearch.trim()) {
            finalProducts = finalProducts.filter((p) =>
              p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
          }
        }

        // CASE 2: No category
        else {
          if (debouncedSearch.trim()) {
            res = await API.get(`/products/search?q=${debouncedSearch}`);
          } else {
            res = await API.get("/products");
          }

          finalProducts = res.data.products || [];
        }

        setProducts(finalProducts);
        setCurrentPage(1);
      } catch (err) {
        console.error("Product fetch error:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, categoryFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted");
      setSearchTerm("");
      setCategoryFilter("");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Delete this category?")) return;

    try {
      await API.delete(`/categories/${categoryId}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete category");
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <div className="space-y-6">


      {/* Search and Filter */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="flex items-center border border-slate-200 bg-white rounded-lg px-3 py-2 w-64 shadow-sm">
          <FiSearch className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="outline-none w-full text-sm text-slate-700"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm outline-none cursor-pointer text-slate-700"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4 md:gap-8">
        <Link
          to="/admin/products/create"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md"
        >
          <FiPlus /> Add Product
        </Link>

        <button
          onClick={() => setShowCategoryModal(true)}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md cursor-pointer"
        >
          <FiPlus /> Add Category
        </button>
      </div>


      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-linear-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Image</th>
              <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
              <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Price</th>
              <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Stock</th>
              <th className="p-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-500">
                  <div className="flex items-center justify-center h-40">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      {p.featuredImage ? (
                        <img
                          src={p.featuredImage}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                      )}
                    </td>

                    <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="p-3 text-indigo-600 font-bold">
                      ${p.discountedPrice?.toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-700">{p.stockCount}</td>

                    <td className="p-3 flex justify-center gap-4">
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </Link>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No products found
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>

          <span className="text-sm text-slate-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowCategoryModal(false);
                fetchCategories();
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <FiX size={24} />
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
              {/* Form Section */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Category</h2>
                <CategoryForm
                  onSuccess={() => {
                    fetchCategories();
                  }}
                />
              </div>

              {/* Categories List Section */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Existing Categories</h2>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {categories.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No categories yet</p>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{cat.name}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
