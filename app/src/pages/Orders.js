import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3001/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data))
      .catch((err) => alert("Unauthorized"));
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.OrderID}>
            {o.OrderDate} - {o.FullName} ordered {o.ProductName} x{o.Quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
