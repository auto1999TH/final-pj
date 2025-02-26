import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("QR Promptpay");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {

    fetch("http://localhost:3000/payment-details", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalPrice(data.totalPrice);
        setTotalItems(data.totalItems);
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error);
      });
  }, []);

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

  return (
    <div className="container mt-5">
      <div className="text-white p-4 rounded shadow-sm" style={{ backgroundColor: '#FB5630' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3 font-weight-bold">ShopTar | คำการสั่งซื้อ</h1>
          <span className="text-sm">Username</span>
        </div>
      </div>

      <div className="bg-white p-4 my-4 rounded shadow-sm">
        <h4 className="">วิธีการชำระเงิน</h4>
        <p className="text-secondary mb-4">โปรดเลือกวิธีการชำระเงิน</p>

        <div className="d-flex justify-content-around mb-4">
          {['QR Promptpay', 'Credit Card', 'PayPal', 'Bank Transfer'].map((method) => (
            <button 
              key={method} 
              className={`btn ${paymentMethod === method ? 'btn-danger text-white' : 'btn-outline-danger text-dark'} px-4 py-2`}
              onClick={() => setPaymentMethod(method)}
              style={{ backgroundColor: '#FB5630' }}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="d-flex justify-content-center mb-4">
          <img src={getQRCode(paymentMethod)} alt="QR Code" />
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <p className="text-secondary mb-0">คำสั่งซื้อทั้งหมด ({totalItems} ชิ้น)</p>
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
