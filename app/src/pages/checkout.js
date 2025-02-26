import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { FullName, orders, totalPrice, totalItems } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("QR Promptpay");

  useEffect(() => {
    if (!orders || !totalPrice) {
      alert("ข้อมูลคำสั่งซื้อไม่ถูกต้อง");
      navigate("/orders");
    }
    }, [orders, totalPrice, navigate]);

const getQRCode = (method) => {
  switch (method) {
    case "QR Promptpay":
      return "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ShopTarPromptpay";
    case "Credit Card":
      return "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ShopTarCreditCard";
    case "PayPal":
      return "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ShopTarPayPal";
    case "Bank Transfer":
      return "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ShopTarBankTransfer";
    default:
      return "";
  }
};

const handleCompletePayment = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:5000/user_order", {
      Payment: paymentMethod,
      Orders_day: new Date().toISOString(),  
      Status: "request",
    },{
      headers: {
        Authorization: `Bearer ${token}`, // ส่ง token ใน header
      }
  });

    if (response.status === 200) {
      navigate("/order-status");
    } else {
      alert("เกิดข้อผิดพลาดในการชำระเงิน");
    }
  } catch (error) {
    console.error("Error while submitting order:", error);
    alert("ไม่สามารถทำการชำระเงินได้ กรุณาลองใหม่");
  }
};

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

        <div className="d-flex justify-content-start mb-4">
          {['QR Promptpay', 'Credit Card', 'PayPal', 'Bank Transfer'].map((method) => (
            <button 
              key={method} 
              className={`btn ${paymentMethod === method ? 'btn-danger text-white' : 'btn-outline-danger text-dark'} px-4 py-2 me-2`}
              onClick={() => setPaymentMethod(method)}
              style={{ backgroundColor: '#FB5630' }}
            >
              {method}
            </button>
          ))}
        </div>
        <div className="d-flex justify-content-start mb-4">
          <img src={getQRCode(paymentMethod)} alt="QR Code" />
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <p className="text-secondary mb-0">คำสั่งซื้อทั้งหมด ({totalItems} รายการ)</p>
          <p className="text-xl font-weight-bold text-danger">${totalPrice.toLocaleString()}</p>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-danger btn-lg w-100"
            style={{ backgroundColor: '#FB5630' }}
            onClick={handleCompletePayment} // Call handleCompletePayment when button is clicked
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
}
