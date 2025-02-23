import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate ,Link } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState(
  //   [
  //   { id: 1, name: "PS 5", price: 500, quantity: 1 },
  //   { id: 2, name: "PS 5", price: 500, quantity: 1 },
  //   { id: 3, name: "PS 5", price: 500, quantity: 1 },
  // ]
);

  useEffect(() => {
  axios
  .get("http://localhost:5000/user_cart", { headers: { Authorization: `Bearer ${token}` } })
  .then((res) => setCart(res.data))
  // .catch((err) => {alert("Unauthorized"),navigate('/Home');});
  .catch(error => {
    alert('เกิดข้อผิดพลาด');
    navigate('/Login');
  });

}, []);

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <header style={{ backgroundColor: "#FB5630" }} className="text-white p-3 text-center">
        <h1>ShopTar | รถเข็น</h1>
      </header>

      <div className="container mt-4">
        <h2>ตะกร้าสินค้า</h2>
        <table className="table">
          <thead>
            <tr>
              <th>สินค้า</th>
              <th>ราคาต่อชิ้น</th>
              <th>จำนวน</th>
              <th>ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price.toLocaleString()}</td>
                <td>
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </td>
                <td>${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>รวมทั้งหมด 1: ${totalPrice.toLocaleString()}</h3>
        <Link to="/Orders" className="btn btn-danger">
          Checkout
        </Link>
      </div>
    </div>
  );
}

export default CartPage;