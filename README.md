# 💡 Zero Lifestyle – Frontend

A modern React e-commerce frontend built with **Vite**, powering the Zero Lifestyle shop.  
Features a public catalogue, authentication & cart, a user checkout flow and a full-featured admin panel.

---

## 📸 Snapshots.

<img width="950" height="407" alt="image" src="https://github.com/user-attachments/assets/099f0076-2d19-4b60-9cb3-aa431459fc04" />
<img width="960" height="414" alt="image" src="https://github.com/user-attachments/assets/befc4c4a-3d2c-466b-bf72-d7bce2a9787d" />
<img width="704" height="407" alt="image" src="https://github.com/user-attachments/assets/5b2381bc-d0fa-492d-8c4f-7fc10e7095d7" />
<img width="499" height="410" alt="image" src="https://github.com/user-attachments/assets/ddc6ed7c-3c74-456d-8f20-76fefa890bf0" />
<img width="950" height="413" alt="image" src="https://github.com/user-attachments/assets/62b23eb8-e1e4-4787-bb62-26684d78f8d0" />


---


## 📦 What’s inside

```
/src
  api/                Axios instance (+ auth/refresh interceptors)
  assets/             Images, icons, etc.
  components/         Reusable UI pieces (Navbar, Hero, ProductCard…)
    product/          Product-specific widgets (BestSeller, JustLaunched…)
  context/            React Contexts for auth & cart state
  data/               Mock data for development
  layouts/            Layout wrappers (AdminLayout)
  pages/              Route components for public & auth flows
    admin/            Admin dashboard pages (products, orders, users…)
  routes/             Route guards (ProtectedRoute, AdminProtectedRoute)
  validators/         Yup schemas for forms
App.jsx               Main router & providers
index.css             Global styles (Tailwind)
main.jsx              Entry point
```

Other top-level files include `package.json`, `vite.config.js`, `.env` and ESLint config.

---

## 🚀 Features

- **Public store**  
  Browse home, categories, individual products, sales and more.

- **User flows**  
  Registration, login, OTP verification, forgot/reset password.

- **Shopping cart & checkout**  
  Cart stored in context, checkout page protected by authentication.

- **Admin interface**  
  `GET /admin`-protected dashboard with CRUD for products and categories, orders, customers.

- **API integration**  
  `src/api/axios.js` uses `VITE_API_BASE_URL` with request/response interceptors for tokens and auto-refresh.

- **Responsive design**  
  Tailwind CSS utility classes and Swiper sliders ensure mobile-friendly layouts.

- **Form validation**  
  `react-hook-form` + `yup` schemas for robust client-side checks.

- **Notifications**  
  `react-hot-toast` for toasts throughout the app.

---

## 🧰 Tech stack

- **Framework:** React 19 (via Vite)  
- **Bundler:** Vite 7  
- **Routing:** react-router-dom v7  
- **State:** Context API  
- **HTTP:** axios  
- **Forms:** react-hook-form, yup  
- **Styling:** Tailwind CSS  
- **Icons:** react-icons, lucide-react  
- **Other:** swiper, react-hot-toast, react-icons

Dev-only: ESLint (with plugins for React), TypeScript types.

---

## ⚙️ Getting started

1. **Prerequisites**

   - Node.js 18+ / npm 9+
   - (Optional) yarn or pnpm

2. **Clone & install**

   ```bash
   git clone <repo-url>
   cd zero_lifestyle
   npm install
   ```

3. **Configure environment**

   Create a `.env` file (already in `.gitignore`) with at least:

   ```env
   VITE_API_BASE_URL="http://localhost:3000/api"
   ```

   Adjust to point at your backend.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) (default) in your browser.

5. **Build for production**

   ```bash
   npm run build
   npm run preview   # verify the production build locally
   ```

---

## 📜 Handy scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start Vite dev server (HMR)        |
| `npm run build` | Generate production assets         |
| `npm run preview` | Serve the build locally          |
| `npm run lint`  | Run ESLint across the repo         |

---

## 🗂 Environment variables

- `VITE_API_BASE_URL` – base URL of the backend API.
  
Anything prefixed with `VITE_` is automatically injected by Vite.

---

## 🛠 Development notes

- **Contexts**:  
  `AuthContext` and `CartContext` live in `src/context`; use `useAuth()` / `useCart()` hooks.

- **Routing**:  
  Public and protected routes are defined in `App.jsx`.  
  Admin routes are wrapped by `AdminProtectedRoute` and rendered inside `AdminLayout`.

- **API**:  
  Axios instance in `src/api/axios.js` handles authorization header injection and token refresh.

- **Form validation schemas** are under `src/validators`.

- **Mock data** (for development without a backend) resides in `src/data/mockData.js`.

---

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/xyz`.
3. Commit with clear messages.
4. Push and open a pull request.

Please run `npm run lint` and **ensure the app builds** before submitting.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

> ⚠️ **Note:** This repository contains only the frontend. It relies on a separate backend API that implements authentication, product management, orders, etc.  
> To fully test user and admin flows, run or deploy the corresponding server and update `VITE_API_BASE_URL` accordingly.

---

> Let me know if you need a deployed demo, API specification or help extending the admin panel!
