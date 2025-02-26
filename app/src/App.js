import React, { useContext } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import OrderStatus from "./pages/OrderStatus"; 
import CartPage from "./pages/CartPage"; 
import Checkout from "./pages/checkout"; 
import { AuthContext } from "./AuthContext";
// import fs from 'fs';

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#FB5630' }}>
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {user ? (
                                <>  
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/products">Products</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/orders">Orders</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/order-status">Order Status</Link> 
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={handleLogout} className="btn btn-light">ออกจากระบบ</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register" style={{ color: 'white' }}>สมัครสมาชิก</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link btn-light" to="/login" style={{ color: 'white' }}>เข้าสู่ระบบ</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order-status" element={<OrderStatus />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/CartPage" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/Orders" element={<Orders />} />
            </Routes>
        </div>
    );
}

export default App;
