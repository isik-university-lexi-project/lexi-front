import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Loginpage } from "./pages/login/Loginpage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import { useState, useEffect } from "react";
import authStore from "./stores/authStore";
import { observer } from "mobx-react-lite";
import AddressesPage from "./pages/AddressesPage";
import OrderPage from "./pages/OrderPage";
import SellerOrderPage from "./pages/SellerOrderPage";

const App = observer(() => {
  const [isLoggedIn, setIsLoggedIn] = useState(authStore.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(authStore.isLoggedIn);
  }, [authStore.isLoggedIn]);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="min-h-screen bg-secondary text-gray-800">
        <Routes>
          {authStore.role === "seller" ? (
            <>
              <Route path="/product-list" element={<ProductListPage />} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/edit-product/:id" element={<EditProductPage />} />
              <Route path="/seller-orders" element={<SellerOrderPage />} />
              <Route path="*" element={<Navigate to="/product-list" />} />
            </>
          ) : (
            <>
              {authStore.isLoggedIn ? <Route path="/" element={<HomePage />} /> : <Route path="/" element={<Loginpage />} />}
              <Route path="/login" element={<Loginpage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/cart" element={<CartPage />} />

              <Route path="/addresses" element={<AddressesPage />} />

              <Route path="/orders" element={<OrderPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
      {
        authStore.isLoggedIn && <Chatbot />
      }
    </Router>
  );
});

export default App;
