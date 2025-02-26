import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                await login(data.token);
                navigate("/");
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Login failed. Try again.");
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#FF5722" }}>
            <div className="row w-100">
                <div className="col-md-6 text-center text-white d-flex flex-column align-items-center justify-content-center">
                    <div className="mb-3">
                        <img src="./logo-A.png" alt="ShopTar Logo" style={{ width: "100px" }} />
                    </div>
                    <h1 className="fw-bold">ShopTar</h1>
                </div>

                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="card p-4 shadow-lg" style={{ borderRadius: "10px", width: "350px" }}>
                        <h3 className="text-center mb-3 fw-bold">🔒 เข้าสู่ระบบ</h3>
                        {error && <p className="text-danger text-center">{error}</p>}
                        
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-bold">ชื่อผู้ใช้ หรือ อีเมล</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    // id="email" 
                                    placeholder="กรอกอีเมลของคุณ"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-bold">รหัสผ่าน</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="password" 
                                    placeholder="กรอกรหัสผ่าน" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-bold">เข้าสู่ระบบ</button>
                        </form>

                        <div className="d-grid gap-2 mt-3">
                            <a href="/Register" className="btn btn-outline-primary fw-bold">สมัครสมาชิก</a>
                            <button className="btn btn-link text-muted">🔑 ลืมรหัสผ่าน / เปลี่ยนรหัสผ่าน</button>
                        </div>

                        <div className="text-center mt-3">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ShopTarLogin" alt="QR Code" />
                            <p className="text-muted small mt-2">🔍 สแกน QR code เพื่อเข้าสู่ระบบ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
