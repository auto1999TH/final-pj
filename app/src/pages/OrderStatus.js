import React from "react";
import { Link } from "react-router-dom";

const orders = [
  { id: "PS 5", quantity: 3, price: 120000, status: "กำลังจัดส่ง" },
  { id: "PS 6", quantity: 6, price: 40000, status: "คืนเงิน/คืนสินค้า" },
  { id: "PS 7", quantity: 5, price: 10000, status: "จัดส่งสำเร็จแล้ว" },
];

const OrderStatus = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
        <div className="bg-red-500 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-lg font-bold">
            <span className="mr-2">🛍️</span>ShopTar | สถานะคำสั่งซื้อ
          </h1>
          <Link to="/" className="text-sm hover:underline">🔙 กลับหน้าแรก</Link>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-red-500 mb-4">
            ข้อมูลสถานะสินค้า
          </h2>
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  <div>
                    <p className="font-bold">{order.id}</p>
                    <p className="text-gray-500">
                      คำสั่งซื้อทั้งหมด ({order.quantity} ชิ้น)
                    </p>
                  </div>
                </div>
                <p className="text-red-500 font-bold">
                  ${order.price.toLocaleString()}
                </p>
                <p className="font-semibold">สถานะ : {order.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
