const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const frontend_url = process.env.FRONTEND_URL;
const storeRouter = require("./routes/store.router");
const authRouter = require("./routes/auth.router");
const db = require("./models/");
const role = db.Role;

const corsOption = {
  origin: "http://localhost:5173", // เปลี่ยน URL ตามที่เหมาะสม
};

// Dev mode: ใช้สำหรับทดสอบเท่านั้น
// db.sequelize.sync({ force: true }).then(() => {
//   initRole();
//   console.log("Drop and Sync DB");
// });

const initRole = () => {
  role.create({ id: 1, name: "user" });
  role.create({ id: 2, name: "moderator" });
  role.create({ id: 3, name: "admin" });
};

app.use(cors({ origin: frontend_url }));
app.use(express.json()); // ใช้ในการ parse ข้อมูล JSON จาก request body
app.use(express.urlencoded({extended: true}));



// นำเข้า Router สำหรับร้านค้า
app.use("/api/stores", storeRouter);
app.use("/api/auth", authRouter)
// หน้าแรก
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Store Delivery Zone API</h1>");
});

// เริ่มการทำงานของเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log("Server running on port: ${PORT}");
});


