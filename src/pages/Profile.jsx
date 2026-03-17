import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Mail,
  Shield,
  ShoppingBag,
  Truck,
  PackageCheck,
  PackageX,
  Wallet,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";

import API from "../api/axios.js";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const profileEndpoints = ["/auth/profile", "/profile"];
const updateProfileEndpoints = ["/auth/update", "/update"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Profile() {
  const { setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    let lastError = null;

    for (const endpoint of profileEndpoints) {
      try {
        const res = await API.get(endpoint);
        setProfileData(res.data);

        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setForm({
            name: res.data.user.name || "",
            email: res.data.user.email || "",
            password: "",
          });
        }

        setLoading(false);
        return;
      } catch (err) {
        lastError = err;
        if (err.response?.status !== 404) {
          break;
        }
      }
    }

    setError(
      lastError?.response?.data?.error || "Unable to load profile right now."
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaveMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const trimmedName = form.name.trim();
    const normalizedEmail = form.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || trimmedName.length < 3) {
      return "Name must be at least 3 characters.";
    }

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return "Please enter a valid email address.";
    }

    if (form.password && form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setSaveMessage({ type: "", text: "" });

    const validationError = validateForm();
    if (validationError) {
      setSaveMessage({ type: "error", text: validationError });
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    const currentUser = profileData?.user;
    const noNameChange = payload.name === (currentUser?.name || "");
    const noEmailChange = payload.email === (currentUser?.email || "");
    const noPasswordChange = !payload.password;

    if (noNameChange && noEmailChange && noPasswordChange) {
      setSaveMessage({ type: "error", text: "Nothing to update." });
      return;
    }

    setSaving(true);

    let lastError = null;

    for (const endpoint of updateProfileEndpoints) {
      try {
        let res;
        try {
          res = await API.put(endpoint, payload);
        } catch (putErr) {
          if (putErr.response?.status !== 404 && putErr.response?.status !== 405) {
            throw putErr;
          }
          res = await API.patch(endpoint, payload);
        }
        const updatedUser = res.data?.user;

        if (!updatedUser) {
          throw new Error("Invalid update response");
        }

        setProfileData((prev) => ({
          ...prev,
          user: updatedUser,
        }));
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setForm((prev) => ({
          ...prev,
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          password: "",
        }));

        setEditMode(false);
        setSaveMessage({
          type: "success",
          text: res.data?.message || "Profile updated successfully.",
        });
        setSaving(false);
        return;
      } catch (err) {
        lastError = err;
        if (err.response?.status !== 404) {
          break;
        }
      }
    }

    setSaveMessage({
      type: "error",
      text:
        lastError?.response?.data?.error ||
        "Unable to update profile right now.",
    });
    setSaving(false);
  };

  const statCards = useMemo(() => {
    const stats = profileData?.profile?.stats;
    if (!stats) return [];

    return [
      {
        title: "Total Orders",
        value: stats.totalOrders ?? 0,
        icon: ShoppingBag,
      },
      {
        title: "Active Orders",
        value: stats.activeOrders ?? 0,
        icon: Truck,
      },
      {
        title: "Delivered",
        value: stats.deliveredOrders ?? 0,
        icon: PackageCheck,
      },
      {
        title: "Cancelled",
        value: stats.cancelledOrders ?? 0,
        icon: PackageX,
      },
      {
        title: "Total Spent",
        value: formatCurrency(stats.totalSpent),
        icon: Wallet,
      },
      {
        title: "Cart Items",
        value: stats.cartItemsCount ?? 0,
        icon: ShoppingCart,
      },
    ];
  }, [profileData]);

  const latestOrder = profileData?.profile?.latestOrder;
  const user = profileData?.user;
  const profileStats = profileData?.profile?.stats;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
            <h1 className="text-2xl font-semibold">Could not load profile</h1>
            <p className="text-gray-600 mt-2">{error}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={fetchProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition cursor-pointer"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-full border border-gray-300 font-medium hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && user && (
          <div className="space-y-8">
            <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-black to-gray-800 text-white p-6 md:p-8">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_60%)]" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="uppercase tracking-[0.2em] text-xs text-gray-300">
                    My Account
                  </p>
                  <h1 className="text-3xl md:text-4xl font-semibold mt-2">
                    {user.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <Mail size={14} /> {user.email}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Shield size={14} /> {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-sm w-fit">
                  <BadgeCheck size={16} />
                  {user.isVerified ? "Verified Account" : "Verification Pending"}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{card.title}</p>
                      <Icon size={16} className="text-gray-500" />
                    </div>
                    <p className="text-xl font-semibold mt-2 break-words">
                      {card.value}
                    </p>
                  </article>
                );
              })}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Profile Details</h2>
                  {!editMode ? (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setSaveMessage({ type: "", text: "" });
                        setForm({
                          name: user.name || "",
                          email: user.email || "",
                          password: "",
                        });
                      }}
                      className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setSaveMessage({ type: "", text: "" });
                        setForm({
                          name: user.name || "",
                          email: user.email || "",
                          password: "",
                        });
                      }}
                      className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {saveMessage.text && (
                  <div
                    className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                      saveMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {saveMessage.text}
                  </div>
                )}

                {!editMode && (
                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Full Name
                      </p>
                      <p className="font-medium mt-1">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Email
                      </p>
                      <p className="font-medium mt-1">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Joined
                        </p>
                        <p className="font-medium mt-1">{formatDate(user.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Last Updated
                        </p>
                        <p className="font-medium mt-1">{formatDate(user.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {editMode && (
                  <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-xs uppercase tracking-wide text-gray-500"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleInputChange}
                        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter your name"
                        minLength={3}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-xs uppercase tracking-wide text-gray-500"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="text-xs uppercase tracking-wide text-gray-500"
                      >
                        New Password (optional)
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleInputChange}
                        className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Leave blank to keep current password"
                        minLength={6}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setSaveMessage({ type: "", text: "" });
                          setForm({
                            name: user.name || "",
                            email: user.email || "",
                            password: "",
                          });
                        }}
                        className="w-full py-2.5 rounded-full border border-gray-300 font-medium hover:bg-gray-50 transition cursor-pointer"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition cursor-pointer disabled:opacity-60"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </article>

              <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Latest Order
                    </p>
                    {latestOrder ? (
                      <div className="mt-2 rounded-xl border border-gray-200 p-4 bg-gray-50">
                        <p className="font-semibold">#{latestOrder.id}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Status: {latestOrder.status}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Amount: {formatCurrency(latestOrder.total)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Date: {formatDate(latestOrder.createdAt)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-600">No orders yet.</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Cart Subtotal
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {formatCurrency(profileStats?.cartSubtotal)}
                    </p>
                  </div>
                </div>
              </article>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
