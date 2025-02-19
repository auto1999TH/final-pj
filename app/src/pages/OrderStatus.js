import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const orders = [
  { id: "PS 5", quantity: 3, price: 120000, status: "กำลังจัดส่ง" },
  { id: "PS 6", quantity: 6, price: 40000, status: "คืนเงิน/คืนสินค้า" },
  { id: "PS 7", quantity: 5, price: 10000, status: "จัดส่งสำเร็จแล้ว" },
];

const OrderStatus = () => {
  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
          <h1 className="h5 mb-0">
            <span className="me-2">🛍️</span>ShopTar | สถานะคำสั่งซื้อ
          </h1>
          <Link to="/" className="text-white text-decoration-none small">🔙 กลับหน้าแรก</Link>
        </div>

        <div className="card-body">
          <h2 className="h5 text-danger mb-3">ข้อมูลสถานะสินค้า</h2>
          <div className="list-group">
            {orders.map((order, index) => (
              <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="bg-secondary rounded me-3" style={{ width: "50px", height: "50px" }}></div>
                  <div>
                    <p className="mb-1 fw-bold">{order.id}</p>
                    <p className="text-muted small">คำสั่งซื้อทั้งหมด ({order.quantity} ชิ้น)</p>
                  </div>
                </div>
                <p className="text-danger fw-bold mb-0">${order.price.toLocaleString()}</p>
                <p className="mb-0">{order.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
