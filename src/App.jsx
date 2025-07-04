import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import ProductDetail from "@/components/pages/ProductDetail";
import Cart from "@/components/pages/Cart";
import CardDetails from "@/components/pages/CardDetails";
import CustomerDetails from "@/components/pages/CustomerDetails";
import Category from "@/components/pages/Category";
import Search from "@/components/pages/Search";
import Address from "@/components/pages/Address";
import Home from "@/components/pages/Home";

function App() {
  return (
    <>
    <BrowserRouter>
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
    </BrowserRouter>
    </>
  );
}

export default App;