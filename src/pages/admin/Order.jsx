import { useEffect, useState } from "react";
import API from "../../api/axios.js";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 5;
  const fetchOrders = async () => {
    try {
      const res = await API.get("/order");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error loading orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find((o) => o.id === orderId);

    if (order?.status === "DELIVERED") {
      toast.error("Delivered orders cannot be modified");
      return;
    }

    setUpdating(orderId);
    try {
      const res = await API.put(`/order/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      toast.success(res.data.message || "Order status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const name = `${o.firstName} ${o.lastName}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesStatus = statusFilter ? o.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-slate-600 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 py-6">
      {/* Search and Filter */}
      <div className="flex justify-between mb-6 gap-4">
        <div className="flex items-center border border-slate-200 bg-white rounded-lg px-3 py-2 w-64 shadow-sm">
          <FiSearch className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="outline-none w-full text-sm text-slate-700"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm outline-none cursor-pointer text-slate-700"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-linear-to-r from-slate-50 to-slate-100">
            <tr>
              {["#", "Customer", "Total", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedOrders.map((o, idx) => (
              <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-slate-700">
                  {startIndex + idx + 1}
                </td>

                <td className="px-5 py-3 font-semibold text-slate-900">
                  {o.firstName} {o.lastName}
                </td>

                <td className="px-5 py-3 font-bold text-indigo-600">
                  ${o.total?.toLocaleString()}
                </td>

                <td className="px-5 py-3">
                  <select
                    value={o.status}
                    onChange={(e) =>
                      handleStatusChange(o.id, e.target.value)
                    }
                    disabled={
                      updating === o.id || o.status === "DELIVERED"
                    }
                    className={`px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors
                      ${o.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : o.status === "PAID"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : o.status === "SHIPPED"
                            ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                            : o.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                      }
                    `}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>

                <td className="px-5 py-3 text-sm text-slate-600">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  No orders found
                </td>
              </tr>
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
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors cursor-pointer"
          >
            Previous
          </button>

          <span className="text-sm text-slate-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
