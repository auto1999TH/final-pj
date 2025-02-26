import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", { fullName, email, password, address, phone });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Error registering");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: "#f25022" }}>
      <div className="w-50 d-flex flex-column align-items-center justify-content-center text-white p-4" style={{ backgroundColor: "#f25022" }}>
        <img src="./logo-A.png" alt="ShopTar Logo" style={{ width: "100px" }} />
        <h2>ShopTar</h2>
      </div>
      <div className="bg-white p-4 rounded shadow-lg d-flex" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="w-50 p-4">
          <form onSubmit={handleRegister}>
          <h3 className="text-center mb-4">🔒 สมัครสมาชิก</h3>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">ชื่อผู้ใช้</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">อีเมล์</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your full name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">รหัสผ่าน</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">ที่อยู่</label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">เบอร์โทร</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">สมัครสมาชิก</button>
          </form>
        </div>
        <div className="mt-3 text-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ShopTarLogin" alt="QR Code" />
          <p className="text-muted">สแกน QR code เพื่อสมัคร ShopTar</p>
        </div>
      </div>
    </div>
  );
}

export default Register;