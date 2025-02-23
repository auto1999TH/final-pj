import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate ,Link } from "react-router-dom";
// import fs from 'fs';

function Home() {
  const { find, finding } = useState("");
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [cart, setcart] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const [error, setErr_find] = useState("");
  // const ImgPath = './public/imgs/ps.png';

  const find_ = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:5000/find/"+e, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
    } catch (error) {
        setErr_find("ไม่พบสินค้า");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/");
            setProducts(response.data);
            console.log(response);
            // console.log("response");
            // console.log(response);
            // const newpro = response.data.map((item)=>{
            //   const imageBlob = new Blob([item.Img], { type: response.headers["content-type"] });
            //   var imageBuffer = item.Img.buffer;
            //   var imageName = 'public/imgs/ps.png';
            //   // fs.watchFile(ImgPath).write(imageBuffer);
            //   // fs.createWriteStream(ImgPath).write(imageBuffer);
            //   return({
            //     ...item,
            //     img_png:("./imgs/ps.png")
            //     // img_png:item.Img.toString("base64")
            //   })
            // })
            // console.log("newPro",newpro)
            // setProducts(newpro);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    fetchUsers();
}, []);

  return (
    <div>
      <header style={{ backgroundColor: '#FB5630' }} className="text-white p-3 text-center d-flex justify-content-center align-items-center">
        <h1 className="me-5">ShopTar</h1>
          <div className="d-flex align-items-center">
            <from onSubmit={find_}>
              <div className="row">
                <div className="col">
                  <input type="text" name="finding" placeholder="ค้นหารายการสินค้า" className="form-control" style={{ width: "300px" }} />
                </div>
                <div className="col">
                  <button type="submit" className="btn btn-light me-3">🔍 ค้นหา</button>
                </div>
              </div>
            </from>
          <div className="position-relative">
            <Link to="CartPage" className="btn btn-light">
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
        {find ?(
          <>
        <h2 className="mb-3">รายการสินค้ายอดนิยม</h2>
        <div className="row">
          {products.map((item, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <img src="./imgs/product-img.png" class="card-img-top"/>
                  <h5 className="card-title">{item.ProductName}</h5>
                  <p className="card-text">{item.Description}</p>
                  <p className="fw-bold">${item.Price} บาท</p>
                  <button className="btn btn-primary">ADD TO CART</button>
                </div>
              </div>
            </div>
          ))}
          {/* <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">{products.ProductID}</h5>
                  <p className="card-text">{products.Description}</p>
                  <p className="fw-bold">${products.Price} บาท</p>
                  <button className="btn btn-primary">ADD TO CART</button>
                </div>
              </div>
            </div> */}
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
        </>
        ) : (
          <>
            <h2 className="mb-3">รายการที่ค้นหา {finding}</h2>
          </>
        )
        }
      </div>
    </div>
  );
}

export default Home;