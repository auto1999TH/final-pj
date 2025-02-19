import React, { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [cart, setCart] = useState([]);

  return (
    <div>
      <header style={{ backgroundColor: '#FB5630' }} className="text-white p-3 text-center d-flex justify-content-center align-items-center">
        <h1 className="me-5">ShopTar</h1>
        <div className="d-flex align-items-center">
          <input type="text" placeholder="ค้นหารายการสินค้า" className="form-control me-2" style={{ width: "300px" }} />
          <button className="btn btn-light me-3">🔍 ค้นหา</button>
          <div className="position-relative">
            <Link to="/cart" className="btn btn-light">
              🛒 ตะกร้า ({cart.length})
            </Link>
          </div>
        </div>
      </header>
      <nav className="d-flex justify-content-center mt-3">
        <Link to="order-status" className="btn btn-light mx-2">อิเล็กทรอนิกส์</Link>
        <Link to="Orders" className="btn btn-light mx-2">เสื้อผ้าแฟชั่น</Link>
        <Link to="/category/appliances" className="btn btn-light mx-2">เครื่องใช้ไฟฟ้า</Link>
        <Link to="/category/other" className="btn btn-light mx-2">อื่นๆ</Link>
      </nav>
      <div className="container mt-4">
        <h2 className="mb-3">รายการสินค้ายอดนิยม</h2>
        <div className="row">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">PS 5</h5>
                  <p className="card-text">เครื่องเล่นเกมที่ทรงพลัง...</p>
                  <p className="fw-bold">$500.00 บาท</p>
                  <button className="btn btn-primary">ADD TO CART</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-4 mb-3">รายการสินค้าประเภทเสื้อผ้า</h2>
        <div className="row">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">เสื้อยืดแฟชั่น</h5>
                  <p className="card-text">เสื้อยืดดีไซน์สวย...</p>
                  <p className="fw-bold">$20.00 บาท</p>
                  <button className="btn btn-primary">ADD TO CART</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;