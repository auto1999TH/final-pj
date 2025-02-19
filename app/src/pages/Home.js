import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to MyShop</h1>
      <p>Your one-stop shop for amazing products!</p>
      <nav>
        <Link to="/products">View Products</Link> | 
        <Link to="/orders">My Orders</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
}

export default Home;