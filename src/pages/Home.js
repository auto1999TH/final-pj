import React, { useEffect, useState, useContext  } from "react";
import axios from "axios";
import { useNavigate ,Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const [finding, setFinding] = useState("");
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setErrorFind] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/");
            setProducts(response.data);
            console.log(response);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    fetchProducts();
}, []);

useEffect(() => {
  if (token) {
    axios
      .get("http://localhost:5000/user_cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const totalItems = res.data.reduce((sum, item) => sum + item.Quantity, 0);
        setCartCount(totalItems);
      })
      .catch(() => setCartCount(0));
  }
}, [token]);

const handleSearch = (e) => {
  e.preventDefault();
  if (finding.trim() === "") {
    setSelectedCategory("other");
    setSearchResults(null);
  } else {
    const results = products.filter((item) =>
      item.ProductName.toLowerCase().includes(finding.toLowerCase())
    );
    setSearchResults(results);
    setSelectedCategory("");
  }
};

const filteredProducts =
  searchResults !== null
    ? searchResults
    : selectedCategory === "all"
    ? products
    : selectedCategory === "sale"
    ? products.filter((item) => item.Sale === "sale")
    : selectedCategory === "other"
    ? products
    : products.filter((item) => item.Type === selectedCategory);


const addToCart = async (item) => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในตะกร้า");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/add_cart",
        {
          ProductID: item.ProductID,
          CustomerID: user.CustomerID,
          Quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCart((prevCart) => [...prevCart, item]);
        alert("เพิ่มสินค้าในตะกร้าเรียบร้อย");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault(); // ป้องกันการเปลี่ยนหน้า
      alert("กรุณาเข้าสู่ระบบก่อนเข้าตะกร้าสินค้า");
      navigate("/Login");
    }
  };


  return (
    <div>
      <header style={{ backgroundColor: '#FB5630' }} className="text-white p-3 text-center d-flex justify-content-center align-items-center">
        <h1 className="me-5">ShopTar</h1>
          <div className="d-flex align-items-center">
          <form onSubmit={handleSearch}>
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
                <button type="submit" className="btn btn-light me-3">
                  🔍 ค้นหา
                </button>
              </div>
            </div>
          </form>
          <div className="position-relative">
            <Link to="/CartPage" className="btn btn-light" onClick={handleCartClick}>
              🛒 ตะกร้า ({cartCount})
            </Link>
          </div>
        </div>
      </header>

      {/* <nav className="d-flex justify-content-center mt-3">
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("game")}>เครื่องเกม</button>
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("shirt")}>เสื้อผ้าแฟชั่น</button>
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("other")}>อื่นๆ</button>
        <button className="btn btn-dark mx-2" onClick={() => setSelectedCategory("all")}>ทั้งหมด</button>
      </nav> */}
      <nav className="d-flex justify-content-center mt-3">
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("sale")}>
          🔥 โปรโมชั่น
        </button>
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("game")}>
          🎮 เครื่องเกม
        </button>
        <button className="btn btn-light mx-2" onClick={() => setSelectedCategory("shirt")}>
          👕 เสื้อผ้าแฟชั่น
        </button>
        <button className="btn btn-dark mx-2" onClick={() => setSelectedCategory("all")}>
          📦 ทั้งหมด
        </button>
      </nav>


      <div className="container mt-4">
        {searchResults !== null && searchResults.length === 0 && (
          <p className="text-center text-muted">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
        )}

        {selectedCategory === "all" ? (
          <>
            {/* 🎮 หมวดหมู่ เครื่องเกม */}
            <h2 className="mt-4 mb-3">🎮 เครื่องเกม</h2>
            <div className="row">
              {products.filter(item => item.Type === "game").map((item, index) => (
                <ProductCard key={index} item={item} addToCart={addToCart} />
              ))}
            </div>

            {/* 👕 หมวดหมู่ เสื้อผ้า */}
            <h2 className="mt-4 mb-3">👕 เสื้อผ้าแฟชั่น</h2>
            <div className="row">
              {products.filter(item => item.Type === "shirt").map((item, index) => (
                <ProductCard key={index} item={item} addToCart={addToCart} />
              ))}
            </div>

          </>
        ) : (
          <div className="row">
            {filteredProducts.map((item, index) => (
              <ProductCard key={index} item={item} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 📌 สร้าง Component สำหรับแสดงสินค้า
const ProductCard = ({ item, addToCart }) => (
  <div className="col-md-3 mb-4">
    <div className="card h-100">
      <img
        src={"./imgs/" + item.Img + ".jpg"}
        className="card-img-top"
        alt="product"
        style={{ height: "250px", objectFit: "cover" }}
      />
      <div className="card-body text-end">
        <h5 className="card-title">
          {item.ProductName.length > 30 ? item.ProductName.slice(0, 30) + "..." : item.ProductName}
        </h5>
        <p className="card-text">
          {item.Description.length > 35 ? item.Description.slice(0, 35) + "..." : item.Description}
        </p>
        <div className="card-text d-flex justify-content-between">
          <p className="fw-bold mb-0">฿ {item.Price} บาท</p>
          <button className="btn btn-primary" onClick={() => addToCart(item)}>
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  </div>
);


export default Home;