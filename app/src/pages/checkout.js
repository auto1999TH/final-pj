import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("QR Promptpay");
  const totalPrice = 120000;
  const totalItems = 3;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-xl font-bold text-orange-600">ShopTar | คำการสั่งซื้อ</h1>
        <span className="text-sm text-gray-500">Username</span>
      </div>
      
      <h2 className="text-lg font-bold text-orange-600">วิธีการชำระเงิน</h2>
      <p className="text-sm text-orange-500 mb-4">โปรดเลือกวิธีการชำระเงิน</p>

      <div className="flex space-x-2 mb-6">
        {['QR Promptpay', 'Credit Card', 'PayPal', 'Bank Transfer'].map((method) => (
          <Button 
            key={method} 
            className={`px-4 py-2 text-sm ${paymentMethod === method ? 'bg-orange-600 text-white' : 'bg-gray-300 text-black'}`} 
            onClick={() => setPaymentMethod(method)}
          >
            {method}
          </Button>
        ))}
      </div>
      
      {paymentMethod === "QR Promptpay" && (
        <div className="flex justify-center">
          <Image src="/qr-code.png" alt="QR Code" width={150} height={150} />
        </div>
      )}

      <div className="mt-6 text-right">
        <p className="text-gray-500 text-sm">คำสั่งซื้อทั้งหมด ({totalItems} ชิ้น)</p>
        <p className="text-xl font-bold text-orange-600">${totalPrice.toLocaleString()}</p>
      </div>

      <Button className="w-full mt-4 bg-orange-600 text-white py-3 text-lg font-bold">
        Complete Payment
      </Button>
    </div>
  );
}
