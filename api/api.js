const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const db = require('./config');
const cors = require("cors");
const authenticateToken = require("./authenticateToken");

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
    const { fullName, email, password, address, phone } = req.body;
    const hashPassword = bcrypt.hashSync(password, 8);

    db.query("INSERT INTO Customer (FullName, Email, Password ,Address , Phone) VALUES (?, ?, ?,?,?)", [fullName, email, hashPassword, address, phone], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        const customerID = result.insertId;
        res.json({ message: "Customer registered successfully" });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM Customer WHERE Email = ? OR FullName = ?", [email, email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = result[0];  
        const hashedPassword = user.Password;

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
app.get("/user_cart", authenticateToken, (req, res) => {
    const customerID = req.user.id;

    const query = `
        SELECT c.ListID, c.ProductID, p.ProductName, p.Price, c.Quantity
        FROM List c
        JOIN Product p ON c.ProductID = p.ProductID
        WHERE c.CustomerID = ?;
    `;

    db.query(query, [customerID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});

// add_cart
app.post("/add_cart", authenticateToken, (req, res) => {
    const { ProductID, CustomerID, Quantity } = req.body;

    if (!CustomerID) {
        return res.status(400).json({ error: "CustomerID is required" });
    }

    db.query(
        "SELECT * FROM list WHERE CustomerID = ? AND ProductID = ?",
        [CustomerID, ProductID],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                db.query(
                    "UPDATE list SET Quantity = Quantity + ? WHERE CustomerID = ? AND ProductID = ?",
                    [Quantity, CustomerID, ProductID],
                    (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ success: true, message: "Updated cart item quantity" });
                    }
                );
            } else {
                db.query(
                    "INSERT INTO list (CustomerID, ProductID, Quantity) VALUES (?, ?, ?)",
                    [CustomerID, ProductID, Quantity],
                    (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ success: true, message: "Added to cart" });
                    }
                );
            }
        }
    );
});

app.get("/user", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;

        db.query("SELECT CustomerID, FullName, Email, Address, Phone FROM Customer WHERE Email = ? OR FullName = ?", [email,email], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.length === 0) return res.status(404).json({ message: "User not found" });

            res.json(result[0]); 
        });
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
});

// update_cart
app.post("/update_cart", authenticateToken, (req, res) => {
    const { ProductID, Quantity } = req.body;
    const CustomerID = req.user.id;

    if (!ProductID || !Quantity) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    const checkQuery = "SELECT * FROM list WHERE CustomerID = ? AND ProductID = ?";
    db.query(checkQuery, [CustomerID, ProductID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            // ถ้ามีสินค้าในตะกร้าแล้ว ให้ **อัปเดตจำนวนสินค้า**
            const updateQuery = "UPDATE list SET Quantity = ? WHERE CustomerID = ? AND ProductID = ?";
            db.query(updateQuery, [Quantity, CustomerID, ProductID], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "อัปเดตจำนวนสินค้าในตะกร้าสำเร็จ" });
            });
        } else {
            const insertQuery = "INSERT INTO list (CustomerID, ProductID, Quantity) VALUES (?, ?, ?)";
            db.query(insertQuery, [CustomerID, ProductID, Quantity], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "เพิ่มสินค้าในตะกร้าสำเร็จ" });
            });
        }
    });
});

// delete_cart
app.post("/delete_cart", authenticateToken, (req, res) => {
    const { ProductID } = req.body;
    const CustomerID = req.user.id; // ดึง CustomerID จาก Token
  
    if (!ProductID) {
      return res.status(400).json({ error: "ProductID is required" });
    }
  
    const sql = "DELETE FROM list WHERE CustomerID = ? AND ProductID = ?";
    db.query(sql, [CustomerID, ProductID], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found in list" });
      }
      res.json({ message: "Product removed from list successfully" });
    });
  });

app.get("/user_info", authenticateToken, (req, res) => {
    const CustomerID = req.user.id;
    const sql = "SELECT * FROM Customer WHERE CustomerID = ?";
    db.query(sql, [CustomerID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(result[0]);
    });
});

app.post("/update_address", authenticateToken, (req, res) => {
    const CustomerID = req.user.id;
    const { Address } = req.body;
    if (!Address) return res.status(400).json({ error: "Address is required" });

    const sql = "UPDATE Customer SET Address = ? WHERE CustomerID = ?";
    db.query(sql, [Address, CustomerID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Address updated successfully" });
    });
});

app.post("/user_order", authenticateToken, (req, res) => {
    const { Payment, Orders_day, Status } = req.body;
  
    const CustomerID = req.user.id;
  
    if (!Payment || !Orders_day || !Status) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }
    const formattedOrdersDay = new Date(Orders_day);
  
    const query = `
      INSERT INTO Oder (CustomerID, Payment, Orders_day, Status)
      VALUES (?, ?, ?, ?)
    `;
  
    db.query(query, [CustomerID, Payment, formattedOrdersDay, Status], (err, result) => {
        if (err) {
          console.error("Error inserting order:", err);
          return res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ" });
        }
      
      // Successfully inserted order
      return res.status(200).json({
        message: "คำสั่งซื้อถูกบันทึกสำเร็จ",
        orderID: result.insertId, // Optionally return the inserted order ID
      });
    });
  });

// app.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`);
// });
app.listen(5000, () => {
    console.log(`Server running on port http://localhost:5000`);
});
