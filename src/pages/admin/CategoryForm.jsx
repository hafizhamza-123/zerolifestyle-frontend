import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../../validators/CategoryFormSchema.jsx";
import API from "../../api/axios.js";
import toast from "react-hot-toast";

export default function CategoryForm({ onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    API.get(`/categories/${id}`).then((res) => {
      const category = res.data.category;
      reset({
        name: category.name,
      });
    });
  }, [id, reset]);

  const handleSubmitForm = async (data) => {
    setLoading(true);

    try {
      if (id) {
        await API.put(`/categories/${id}`, data);
        toast.success("Category updated successfully");
      } else {
        await API.post("/categories/create", data);
        toast.success("Category created successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/admin/categories");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Category Name
        </label>
        <input
          {...register("name")}
          className="w-full border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Enter category name"
          autoFocus
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        className="w-full bg-linear-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
      >
        {loading ? (
          <div className="flex items-center justify-center h-5">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          "Save Category"
        )}
      </button>
    </form>
  );
}
