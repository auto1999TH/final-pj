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

// const handleSearch = async (e) => {
//   e.preventDefault();
//   if (!finding) return;

//   try {
//     const response = await fetch(`http://localhost:5000/finding/${encodeURIComponent(finding)}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });
//     const data = await response.json();
    
//     setSearchResults(data.length > 0 ? data : []);
//     setErrorFind(data.length > 0 ? "" : "ไม่พบสินค้าที่ค้นหา");
//   } catch (error) {
//     setSearchResults([]);
//     setErrorFind("ไม่พบสินค้า");
//   }
// };

const handleSearch = (e) => {
  e.preventDefault();
  if (finding.trim() === "") {
    setSearchResults(null); // ถ้าค้นหาว่าง ให้รีเซ็ตเป็นค่าเดิม
    return;
  }
  const results = products.filter((item) =>
    item.ProductName.toLowerCase().includes(finding.toLowerCase())
  );
  setSearchResults(results);
  setSelectedCategory(""); // ❌ ปิดหมวดหมู่ ให้แสดงเฉพาะสินค้าที่ค้นหา
};

// 📌 ถ้าไม่มีการค้นหา → แสดงสินค้าตามหมวดหมู่
const filteredProducts =
  searchResults !== null
    ? searchResults
    : selectedCategory === "all"
    ? products
    : products.filter((item) => item.Type === selectedCategory);

const addToCart = (item) => {
  setCart((prevCart) => [...prevCart, item]);
};

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

      <nav className="d-flex justify-content-center mt-3">
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("game")}>เครื่องเกม</button>
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("shirt")}>เสื้อผ้าแฟชั่น</button>
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("other")}>อื่นๆ</button>
        <button className="btn btn-dark mx-2" onClick={() => setSelectedCategory("all")}>ทั้งหมด</button>
      </nav>


      <div className="container mt-4">
        {error && <p className="text-danger">{error}</p>}

        {/* เงื่อนไข: ถ้ายังไม่ค้นหา → แสดงสินค้ายอดนิยม */}
        {searchResults === null ? (
          <>
            <h2 className="mb-3">🎮 รายการสินค้ายอดนิยม</h2>
            <div className="row">
              {products.filter(item => item.Type === "game").map((item, index) => (
                <div key={index} className="col-md-3 mb-4">
                  <div className="card">
                    <div className="card-body text-center">
                    <img 
                        src={
                          // item.Img instanceof Blob || item.Img instanceof File 
                          //   ? URL.createObjectURL(item.Img) 
                          //   : typeof item.Img === "string" && (item.Img.startsWith("data:imgs/") || item.Img.startsWith("http")) 
                          //   ? item.Img 
                          //   : typeof item.Img === "string" 
                          //   ? `data:image/png;base64,${item.Img}`
                          //   : "./imgs/product-img.png" // ใช้รูป Default ถ้าไม่มีรูป
                          "./imgs/ps"+(1+index)+".jpg"
                        } 
                        className="card-img-top" 
                        alt="product" 
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <h5 className="card-title">{item.ProductName.length > 30 ? item.ProductName.slice(0, 30) + "..." : item.ProductName}</h5>
                      <p className="card-text">
                        {item.Description.length > 35 ? item.Description.slice(0, 35) + "..." : item.Description}
                      </p>
                      <p className="fw-bold">฿ {item.Price} บาท</p>
                      <button className="btn btn-primary" onClick={() => addToCart(item)}>ADD TO CART</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-4 mb-3">👕 รายการสินค้าประเภทเสื้อผ้าแฟชั่น</h2>
            <div className="row">
              {products.filter(item => item.Type === "shirt").map((item, index) => (
                <div key={index} className="col-md-3 mb-4">
                  <div className="card">
                    <div className="card-body d-flex flex-column">
                      <img src={"./imgs/t-"+(1+index)+".jpg"} className="card-img-top" alt="product" style={{ height: "250px", objectFit: "cover" }} />
                      <h5 className="card-title">{item.ProductName}</h5>
                      <p className="card-text">{item.Description.length > 80 ? item.Description.slice(0, 80) + "..." : item.Description}</p>
                      <p className="fw-bold">{item.Price} บาท</p>
                      <button className="btn btn-primary mt-auto" onClick={() => addToCart(item)}>ADD TO CART</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          </>
        ) : (
          <>
            {/* เงื่อนไข: ถ้าค้นหาแล้วและไม่เจอ → แสดงข้อความ */}
            {searchResults.length === 0 ? (
              <p className="text-center text-muted">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
            ) : (
              <>
                <h2 className="mb-3">ผลการค้นหา: {finding}</h2>
                <div className="row">
                  {searchResults.map((item, index) => (
                    <div key={index} className="col-md-3 mb-4">
                      <div className="card">
                        <div className="card-body text-center">
                          <img src={"./imgs/t-"+index} className="card-img-top" alt="product" />
                          <h5 className="card-title">{item.ProductName}</h5>
                          <p className="card-text">{item.Description}</p>
                          <p className="fw-bold">{item.Price} บาท</p>
                          <button className="btn btn-primary">ADD TO CART</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}


export default Home;