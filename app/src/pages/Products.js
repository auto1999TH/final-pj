import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/products", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProducts(res.data))
      // .catch((err) => {alert("Unauthorized"),navigate('/Home');});
      .catch(error => {
        alert('เกิดข้อผิดพลาด');
        navigate('/');
      });
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.ProductID}>{p.ProductName} - ${p.Price}</li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
