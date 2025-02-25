const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const db = require('./config');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());


const JWT_SECRET = "asdasdjlk90"; // ใช้ค่าที่ต้องการได้เลย

// ✅ อนุญาตให้ React (http://localhost:5173) เรียก API ได้
app.use(cors({ origin: "http://localhost:3000",methods:"GET,POST,PUT,DELETE",allowedHeaders:"Content-Type,Authorization" }));
// axios.post("http://localhost:3000", { fullName, email, password }, { mode: 'cors' });


const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

app.post("/register", (req, res) => {
    const { fullName, password, address, phone } = req.body;
    const hashPassword = bcrypt.hashSync(password, 8);

    db.query("INSERT INTO Customer (FullName, Email, Password ,Address , Phone) VALUES (?, ?, ?)", [fullName, email, hashPassword, address, phone], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Customer registered successfully" });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM Customer WHERE Email = ? OR FullName = ?", [email, email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        // ตรวจสอบว่าพบผู้ใช้หรือไม่
        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = result[0];  // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const hashedPassword = user.Password;

        // ตรวจสอบว่ารหัสผ่านถูกต้องหรือไม่
        if (!hashedPassword || !bcrypt.compareSync(password, hashedPassword)) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // สร้าง JWT Token
        const token = jwt.sign(
            { id: user.CustomerID, email: user.Email }, 
            JWT_SECRET, 
            { expiresIn: "2h" } // Token หมดอายุใน 2 ชั่วโมง
        );

        res.json({ message: "Login successful", token });
    });
});

app.get("/products", verifyToken, (req, res) => {
    db.query("SELECT * FROM Product", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/", (req, res) => {
    db.query("SELECT * FROM Product", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post("/products", verifyToken, (req, res) => {
    const { productname, price, stock } = req.body;

    db.query("INSERT INTO Product (ProductName, Price, Stock) VALUES (?, ?, ?)", [productname, price, stock], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product added successfully", productID: result.insertId });
    });
});

app.put("/products/:id", verifyToken, (req, res) => {
    const { productname, price, stock } = req.body;
    const { id } = req.params;

    db.query("UPDATE Product SET ProductName = ?, Price = ?, Stock = ? WHERE ProductID = ?", 
        [productname, price, stock, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product updated successfully" });
    });
});

app.delete("/products/:id", verifyToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM Product WHERE ProductID = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product deleted successfully" });
    });
});

app.post("/orders", verifyToken, (req, res) => {
    const { customerID, orderdate, products } = req.body;

    db.query("INSERT INTO orders (OrderDate, CustomerID) VALUES (?, ?)", [orderdate, customerID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const orderID = result.insertId;
        const orderDetails = products.map(p => [orderID, p.productID, p.quantity]);

        db.query("INSERT INTO orderdetail (OrderID, ProductID, Quantity) VALUES ?", [orderDetails], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Order placed successfully", orderID });
        });
    });
});

app.get("/orders", verifyToken, (req, res) => {
    db.query(`SELECT o.OrderID, o.OrderDate, c.FullName, p.ProductName, od.Quantity FROM orders o 
              JOIN Customer c ON o.CustomerID = c.CustomerID
              JOIN OrderDetail od ON o.OrderID = od.OrderID
              JOIN Product p ON od.ProductID = p.ProductID`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.delete("/orders/:id", verifyToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM orderdetail WHERE OrderID = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query("DELETE FROM orders WHERE OrderID = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Order deleted successfully" });
        });
    });
});

app.get("/customers", verifyToken, (req, res) => {
    db.query("SELECT * FROM customer", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/finding/:find", (req, res) => {
    const { find } = req.params;
    var finding = "%"+ find +"%";
    db.query("SELECT * FROM Product WHERE ProductName like ?",[finding], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// user_cart
app.get("/user_cart", verifyToken, (req, res) => {
    db.query("SELECT * FROM list", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// app.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`);
// });
app.listen(5000, () => {
    console.log(`Server running on port http://localhost:5000`);
});
