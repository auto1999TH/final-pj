import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/user_cart", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          console.log("Cart Data:", res.data);
          setCart(res.data);
        })
        .catch(() => {
          alert("กรุณาเข้าสู่ระบบ");
          navigate("/Login");
        });
    }
  }, [token, navigate]);

  const updateCart = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await fetch("http://localhost:5000/update_cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ProductID: productId, Quantity: quantity })
      });

      if (response.ok) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.ProductID === productId ? { ...item, Quantity: quantity } : item
          )
        );
      } else {
        console.error("Error updating cart");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const deleteCartItem = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/delete_cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ProductID: productId })
      });

      if (response.ok) {
        setCart((prevCart) => prevCart.filter((item) => item.ProductID !== productId));
      } else {
        console.error("Error deleting item from cart");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.Price || 0) * (item.Quantity || 0), 0);

  return (
    <div>
      <header style={{ backgroundColor: "#FB5630" }} className="text-white p-3 text-center">
        <h1>ShopTar | รถเข็น</h1>
      </header>

      <div className="container mt-4">
        <h2>ตะกร้าสินค้า</h2>

        {cart.length === 0 ? (
          <p>🛒 ตะกร้าว่างเปล่า</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>สินค้า</th>
                <th>ราคาต่อชิ้น</th>
                <th>จำนวน</th>
                <th>ราคารวม</th>
                <th>ลบ</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.ProductID}>
                  <td>{item.ProductName}</td>
                  <td>${item.Price?.toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => updateCart(item.ProductID, item.Quantity - 1)}
                      disabled={item.Quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.Quantity}</span>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => updateCart(item.ProductID, item.Quantity + 1)}
                    >
                      +
                    </button>
                  </td>
                  <td>${(item.Price * item.Quantity)?.toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteCartItem(item.ProductID)}
                      style={{ backgroundColor: '#FB5630' }}
                    >
                      🗑️ ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3>ราคาสินค้ารวมทั้งหมด: ${totalPrice?.toLocaleString()}</h3>
        <Link to="/Orders" className="btn btn-danger" style={{ backgroundColor: '#FB5630' }}>
          Checkout
        </Link>
      </div>
    </div>
  );
}

export default CartPage;
