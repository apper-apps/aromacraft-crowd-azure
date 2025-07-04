import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CustomerDetails from "@/components/pages/CustomerDetails";
import Address from "@/components/pages/Address";
import CardDetails from "@/components/pages/CardDetails";
import Layout from "@/components/organisms/Layout";
import ProductDetail from "@/components/pages/ProductDetail";
import Cart from "@/components/pages/Cart";
import Category from "@/components/pages/Category";
import Search from "@/components/pages/Search";
import Home from "@/components/pages/Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen gradient-bg">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
<Route path="/search" element={<Search />} />
            <Route path="/category/:type" element={<Category />} />
            <Route path="/checkout/customer-details" element={<CustomerDetails />} />
            <Route path="/checkout/address" element={<Address />} />
            <Route path="/checkout/payment" element={<CardDetails />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  )
}

export default App