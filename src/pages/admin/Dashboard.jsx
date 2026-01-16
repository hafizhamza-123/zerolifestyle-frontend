import { useEffect, useState } from "react";
import API from "../../api/axios.js";
import { FiBox, FiUsers, FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,             
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [pRes, uRes, oRes, revRes, topRes] = await Promise.all([
          API.get("/products"),
          API.get("/auth/users"),
          API.get("/order"),
          API.get("/order/stats/revenue"),
          API.get("/products/top-selling?limit=3"),
        ]);

        setStats({
          products: pRes.data.products?.length || 0,
          users: uRes.data.users?.length || 0,
          orders: oRes.data.orders?.length || 0,
        });

        setRevenueData(revRes.data.data || []);
        setTopSellingProducts(topRes.data.topSelling || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-600 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={<FiUsers className="text-white text-3xl" />}
            title="Total Customers"
            value={stats.users}
            gradient="from-indigo-500/10 to-indigo-500/5"
            accentColor="indigo"
          />
          <StatCard
            icon={<FiShoppingBag className="text-white text-3xl" />}
            title="Total Orders"
            value={stats.orders}
            gradient="from-indigo-500/10 to-indigo-500/5"
            accentColor="indigo"
          />
          <StatCard
            icon={<FiBox className="text-white text-3xl" />}
            title="Total Products"
            value={stats.products}
            gradient="from-indigo-500/10 to-indigo-500/5"
            accentColor="indigo"
          />
        </div>

        {/* Revenue Chart and Top Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - 2 columns */}
          <div className="lg:col-span-2 bg-from-indigo-500/10 to-indigo-500/5 rounded-2xl shadow-lg border border-slate-200 p-6 transition-all hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-slate-900 font-bold text-xl">
                Revenue Analytics
              </h2>
              <p className="text-sm text-slate-500 mt-1">Last 6 months performance</p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-semibold">
              Paid Orders
            </span>
          </div>

          {revenueData.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-slate-400">
              <div className="text-center">
                <p className="font-medium">No revenue data available</p>
                <p className="text-sm mt-1">Revenue will appear as orders are marked as paid</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      color: "#1e293b",
                    }}
                    cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                  />
                  <defs>
                    <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="revenue"
                    fill="url(#indigoGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          </div>

          {/* Top Selling Products Card - 1 column */}
          <div className="bg-from-indigo-500/10 to-indigo-500/5 rounded-2xl shadow-lg border border-slate-200 p-6 transition-all hover:shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                  <FiTrendingUp className="text-indigo-600" />
                  Top Selling
                </h2>
                <p className="text-sm text-slate-500 mt-1">Best performers</p>
              </div>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-semibold">
                Top 3
              </span>
            </div>

            {topSellingProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-slate-400">
                <div className="text-center">
                  <p className="font-medium">No sales data</p>
                  <p className="text-xs mt-1">Orders pending</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 flex-1 overflow-y-auto">
                {topSellingProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all"
                  >
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 ${
                      index === 0 ? 'bg-linear-to-br from-indigo-500 to-indigo-600' :
                      index === 1 ? 'bg-linear-to-br from-slate-400 to-slate-500' :
                      'bg-linear-to-br from-amber-500 to-amber-600'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Product Image */}
                    {product.featuredImage && (
                      <img
                        src={product.featuredImage}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                      />
                    )}

                    {/* Product Info and Stats */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-900 font-semibold text-xs truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-indigo-600 font-bold text-xs">
                          {product.totalSold} sold
                        </p>
                        <span className="text-slate-300">•</span>
                        <p className="text-green-600 font-semibold text-xs">
                          Rs.{(product.totalRevenue || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, gradient, accentColor }) {
  const accentMap = {
    indigo: "from-indigo-500 to-indigo-600",
    emerald: "from-emerald-500 to-emerald-600",
    cyan: "from-cyan-500 to-cyan-600"
  };

  return (
    <div
      className={`flex items-center gap-4 bg-linear-to-br ${gradient} from-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300`}
    >
      <div className={`p-4 bg-linear-to-br ${accentMap[accentColor]} shadow-sm rounded-xl`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
