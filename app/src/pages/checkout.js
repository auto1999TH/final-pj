import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { FullName, orders, totalPrice, totalItems } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("QR Promptpay");

  useEffect(() => {
    if (!orders || !totalPrice) {
      alert("ข้อมูลคำสั่งซื้อไม่ถูกต้อง");
      navigate("/orders");
    }
  }, [orders, totalPrice, navigate]);

  return (
    <div className="container mt-5">
      <div className="text-white p-4 rounded shadow-sm" style={{ backgroundColor: '#FB5630' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3 font-weight-bold">ShopTar | คำการสั่งซื้อ</h1>
          <div className="text-white">
            {FullName ? FullName : "Username"}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 my-4 rounded shadow-sm">
        <h4 className="">วิธีการชำระเงิน</h4>
        <p className="text-secondary mb-4">โปรดเลือกวิธีการชำระเงิน</p>

        <div className="d-flex justify-content-around mb-4">
          {['QR Promptpay', 'Credit Card', 'PayPal', 'Bank Transfer'].map((method) => (
            <button 
              key={method} 
              className={`btn ${paymentMethod === method ? 'btn-danger text-white' : 'btn-outline-danger text-dark'} px-4 py-2` }
              onClick={() => setPaymentMethod(method)}
              style={{ backgroundColor: '#FB5630' }}
            >
              {method}
            </button>
          ))}
        </div>

        {paymentMethod === "QR Promptpay" && (
          <div className="d-flex justify-content-center mb-4">
            <img src="/qr-code.png" alt="QR Code" width="150" height="150" />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <p className="text-secondary mb-0">คำสั่งซื้อทั้งหมด ({totalItems} รายการ)</p>
          <p className="text-xl font-weight-bold text-danger">${totalPrice.toLocaleString()}</p>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Link to="/checkout" className="btn btn-danger btn-lg w-100" style={{ backgroundColor: '#FB5630' }}>
            Complete Payment
          </Link>
        </div>
      </div>
    </div>
  );
}
