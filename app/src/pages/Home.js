import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate ,Link } from "react-router-dom";
// import fs from 'fs';

function Home() {
  const [finding, setFinding] = useState("");
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  // const [cart, setcart] = useState([]);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setErrorFind] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const token = localStorage.getItem("token");
  // const ImgPath = './public/imgs/ps.png';

  useEffect(() => {
    const fetchProducts = async () => {
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

    fetchProducts();
}, []);

const handleSearch = async (e) => {
  e.preventDefault();
  if (!finding) return;

  try {
    const response = await fetch(`http://localhost:5000/finding/${encodeURIComponent(finding)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    
    setSearchResults(data.length > 0 ? data : []);
    setErrorFind(data.length > 0 ? "" : "ไม่พบสินค้าที่ค้นหา");
  } catch (error) {
    setSearchResults([]);
    setErrorFind("ไม่พบสินค้า");
  }
};

const addToCart = (item) => {
  setCart((prevCart) => [...prevCart, item]);
};

const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((item) => item.Type === selectedCategory);

  return (
    <div>
      <header style={{ backgroundColor: '#FB5630' }} className="text-white p-3 text-center d-flex justify-content-center align-items-center">
        <h1 className="me-5">ShopTar</h1>
          <div className="d-flex align-items-center">
            <from onSubmit={handleSearch}>
              <div className="row">
                <div className="col">
                  <input
                    type="search"
                    name="finding"
                    value={finding}
                    onChange={(e) => setFinding(e.target.value)}
                    placeholder="ค้นหารายการสินค้า"
                    className="form-control"
                    style={{ width: "300px" }}
                  />
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
<<<<<<< HEAD
=======
      <nav className="d-flex justify-content-center mt-3">
        <Link to="order-status" className="btn btn-light mx-2">โค๊ตส่วนลด + โค๊ตส่งฟรี</Link>
        <Link to="Orders" className="btn btn-light mx-2">ช็อปปิ้งแฟชั่น</Link>
        <Link to="/category/appliances" className="btn btn-light mx-2">เครื่องเล่นเกม</Link>
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
>>>>>>> 50d01810ec63c9e91366a74f952ef9490c011fc6

      <nav className="d-flex justify-content-center mt-3">
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("game")}>เครื่องเกม</button>
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("shirt")}>เสื้อผ้าแฟชั่น</button>
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("other")}>อื่นๆ</button>
        <button className="btn btn-dark mx-2" onClick={() => setSelectedCategory("all")}>ทั้งหมด</button>
      </nav>


      <div className="container mt-4">
        <h2 className="mb-3">สินค้า{selectedCategory === "all" ? "ทั้งหมด" : selectedCategory}</h2>
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="card" style={{ height: "100%" }}>
                  <div className="card-body text-center">
                    <img 
                      src="./imgs/product-img.png" 
                      className="card-img-top" 
                      alt="product" 
                      style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                    />
                    <h5 className="card-title">{item.ProductName}</h5>
                    <p className="card-text">{item.Description.substring(0, 50)}...</p>
                    <p className="fw-bold">{item.Price} บาท</p>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setCart([...cart, item])} // ✅ เพิ่มสินค้าลงตะกร้า
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">ไม่พบสินค้าในหมวดหมู่นี้</p>
          )}
        </div>
      </div>
    </div>
  );
}


export default Home;