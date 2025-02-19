import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();

  // ฟังก์ชันอัปเดตค่า formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("เบอร์โทรต้องเป็นตัวเลข 10 หลัก");
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", formData);
      alert("สมัครสมาชิกสำเร็จ!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100 bg-light">
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="row bg-white p-4 rounded shadow w-75">
          <div className="col-md-5 d-flex flex-column align-items-center text-white p-4 rounded-start" style={{ backgroundColor: '#FA4D09' }}>
            <img src="/logo.png" alt="ShopTar Logo" width={100} className="mb-3" />
            <h2>ShopTar</h2>
          </div>

          <div className="col-md-7 p-4">
            <h3 className="text-center mb-3">สมัครสมาชิก</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">ชื่อผู้ใช้ หรือ อีเมล</label>
                <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">รหัสผ่าน</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">ที่อยู่</label>
                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">เบอร์โทร</label>
                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn w-100" style={{ backgroundColor: '#FA4D09', color: 'white' }}>
                สมัครสมาชิก
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
