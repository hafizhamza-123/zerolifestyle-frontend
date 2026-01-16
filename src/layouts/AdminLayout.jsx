import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ZERO_LOGO_BLACK = "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/logo_x320.png?v=1676901766";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/admin/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/admin/products", icon: <FiBox />, label: "Products" },
    { to: "/admin/orders", icon: <FiShoppingBag />, label: "Orders" },
    { to: "/admin/users", icon: <FiUsers />, label: "Customers" },
  ];

  useEffect(() => {
    const current = navItems.find((item) => location.pathname.startsWith(item.to));
    setPageTitle(current ? current.label : "Dashboard");
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-50 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-50 shadow-lg border-r border-slate-200 flex flex-col transition-transform duration-300 text-slate-900
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="py-6 px-6 flex items-center gap-3 border-b border-slate-200">
          
            <img src={ZERO_LOGO_BLACK} alt="ZERO" className="px-8 h-8 object-contain" />
          
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 text-[14px] font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-linear-to-r from-indigo-500 to-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium
      text-white bg-black rounded-lg cursor-pointer
      hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>

      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-slate-700 text-2xl hover:bg-slate-100 p-2 rounded-lg transition-colors"
              >
                {sidebarOpen ? <FiX /> : <FiMenu />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {pageTitle}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Manage your ecommerce business</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-lg">
                <div className="w-9 h-9 bg-linear-to-br from-indigo-400 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user?.name || "Admin"}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
