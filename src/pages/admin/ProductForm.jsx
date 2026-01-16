import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../validators/ProductFormSchema.jsx"
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [featuredImage, setFeaturedImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      description: "",
      price: "",
      discountedPrice: "",
      stockCount: "",
      bestseller: false,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;

    API.get(`/products/${id}`).then((res) => {
      const p = res.data.product;
      reset({
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        description: p.description || "",
        price: p.price,
        discountedPrice: p.discountedPrice || "",
        stockCount: p.stockCount,
        bestseller: p.bestseller,
      });
      if (p.featuredImage) setFeaturedImage(p.featuredImage);
      if (p.gallery) setGallery(p.gallery);
    });
  }, [id, reset]);

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFeaturedImage(file);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGallery((prev) => [...prev, ...files]);
  };

  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      if (featuredImage) formData.append("featuredImage", featuredImage);
      gallery.forEach((file) => formData.append("gallery", file));

      if (id) {
        await API.put(`/products/${id}`, formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Product updated successfully");
      } else {
        await API.post("/products/createproduct", formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Product created successfully");
      }

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="bg-white p-8 rounded-2xl max-w-3xl space-y-6 border border-slate-200 shadow-lg"
    >
      <h1 className="text-3xl font-bold text-slate-900">
        {id ? "Edit Product" : "Create Product"}
      </h1>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Product Name</label>
        <input
          {...register("name")}
          className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Enter product name"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Slug</label>
        <input
          {...register("slug")}
          className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Enter slug"
        />
        {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>}
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
        <select
          {...register("categoryId")}
          className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
        <textarea
          {...register("description")}
          className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          placeholder="Enter description"
          rows="4"
        />
      </div>

      {/* Price and Discount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Price</label>
          <input
            type="number"
            {...register("price")}
            className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Discounted Price</label>
          <input
            type="number"
            {...register("discountedPrice")}
            className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="0.00"
          />
          {errors.discountedPrice && <p className="text-red-600 text-sm mt-1">{errors.discountedPrice.message}</p>}
        </div>
      </div>

      {/* Stock Count */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Stock Count</label>
        <input
          type="number"
          {...register("stockCount")}
          className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="0"
        />
        {errors.stockCount && <p className="text-red-600 text-sm mt-1">{errors.stockCount.message}</p>}
      </div>

      {/* Bestseller */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <Controller
          control={control}
          name="bestseller"
          render={({ field }) => (
            <input type="checkbox" {...field} checked={field.value} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
          )}
        />
        <label className="text-sm font-semibold text-slate-900 cursor-pointer">Mark as Bestseller</label>
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Featured Image</label>
        <input type="file" accept="image/*" onChange={handleFeaturedImageChange} className="w-full p-3 border border-slate-200 rounded-lg cursor-pointer" />
        {featuredImage && (
          <div className="mt-3 relative w-32 h-32">
            <img
              src={typeof featuredImage === "string" ? featuredImage : URL.createObjectURL(featuredImage)}
              alt="Featured"
              className="w-full h-full object-cover rounded-lg border border-slate-200"
            />
            <button
              type="button"
              onClick={() => setFeaturedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Gallery Images</label>
        <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="w-full p-3 border border-slate-200 rounded-lg cursor-pointer" />
        <div className="flex gap-3 mt-3 flex-wrap">
          {gallery.map((file, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={typeof file === "string" ? file : URL.createObjectURL(file)}
                alt={`Gallery ${index}`}
                className="w-full h-full object-cover rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        className="w-full bg-linear-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
      >
        {loading ? (<div className="flex items-center justify-center h-5">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>) : "Save Product"}
      </button>
    </form>
  );
}
