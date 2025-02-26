import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState({ FullName: "", Address: "", Phone: "" });
  const [newAddress, setNewAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("กรุณาเข้าสู่ระบบ");
      return;
    }

    axios
      .get("http://localhost:5000/user_cart", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data))
      .catch((err) => alert("ไม่สามารถโหลดคำสั่งซื้อได้"));
      
    axios
      .get("http://localhost:5000/user_info", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.error("Error fetching user info:", err));
  }, []);

  const totalPrice = orders.reduce((sum, order) => sum + order.Price * order.Quantity, 0);

  const updateAddress = () => {
    axios
      .post("http://localhost:5000/update_address", { Address: newAddress }, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUserInfo((prev) => ({ ...prev, Address: newAddress }));
        setShowModal(false);
        alert("ที่อยู่ได้รับการอัปเดตเรียบร้อย");
      })
      .catch((err) => alert("ไม่สามารถอัปเดตที่อยู่ได้"));
  };

  return (
    <div className="container mt-4">
      <div className="bg-danger text-white p-3 d-flex justify-content-between align-items-center">
        <h2>ShopTar | ทำการสั่งซื้อ</h2>
        <div className="text-white">👤 {userInfo.FullName || "Username"}</div>
      </div>

      <div className="bg-light p-3 my-3">
        <h4>ที่อยู่ในการจัดส่ง</h4>
        <p><strong>ชื่อ:</strong> {userInfo.FullName}</p>
        <p><strong>ที่อยู่:</strong> {userInfo.Address || "ยังไม่มีที่อยู่"} <button className="btn btn-link text-primary" onClick={() => setShowModal(true)}>เปลี่ยนที่อยู่</button></p>
        <p><strong>เบอร์โทร:</strong> {userInfo.Phone || "ยังไม่มีเบอร์โทร"}</p>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>สินค้า</th>
            <th>ราคาต่อหน่วย</th>
            <th>จำนวน</th>
            <th>ราคาสุทธิ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.OrderID}>
              <td>{order.ProductName}</td>
              <td>${order.Price.toLocaleString()}</td>
              <td>{order.Quantity}</td>
              <td>${(order.Price * order.Quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end">
        <h4>คำสั่งซื้อทั้งหมด ({orders.length} ชิ้น) <span className="text-danger">${totalPrice.toLocaleString()}</span></h4>
        <button className="btn btn-danger mt-2">Confirm Order</button>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">เปลี่ยนที่อยู่</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control" placeholder="กรอกที่อยู่ใหม่" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button className="btn btn-primary" onClick={updateAddress}>บันทึก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderPage;
