// นำเข้าโมดูล jsonwebtoken สำหรับการจัดการ JWT (JSON Web Token)
const jwt = require("jsonwebtoken");
// นำเข้าคอนฟิกสำหรับการตรวจสอบ JWT จากไฟล์ config
const config = require("../config/auth.config");
// นำเข้าโมเดลฐานข้อมูล
const db = require("../models");
// ดึงโมเดล User ออกจากฐานข้อมูล
const User = db.User;

// ฟังก์ชันสำหรับตรวจสอบโทเคน (verify token)
verifyToken = (req, res, next) => {
  // ดึงโทเคนจาก header "x-access-token"
  let token = req.headers["x-access-token"];
  // ตรวจสอบว่าโทเคนมีอยู่หรือไม่
  if (!token) {
    return res.status(403).send({
      message: "ไม่มีโทเคนที่ให้มา!",
    });
  }
  // ตรวจสอบความถูกต้องของโทเคน
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "ไม่ได้รับอนุญาต",
      });
    }
    // เก็บ userId ที่ decode ได้จากโทเคนไว้ใน req.userId
    req.userId = decoded.id;
    next(); // ส่งต่อไปยัง middleware ถัดไป
  });
};

// ฟังก์ชันสำหรับตรวจสอบสิทธิ์การเข้าถึงของผู้ใช้ว่าเป็นผู้ดูแลระบบ (Admin) หรือไม่
isAdmin = (req, res, next) => {
  // ค้นหาผู้ใช้จาก userId ที่ได้จาก req
  User.findByPk(req.userId).then((user) => {
    // ดึงบทบาทของผู้ใช้
    user.getRoles().then((roles) => {
      // ตรวจสอบบทบาทของผู้ใช้
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next(); // หากผู้ใช้เป็น Admin ส่งต่อไปยัง middleware ถัดไป
          return;
        }
      }
      // หากไม่พบบทบาท Admin ส่งข้อความข้อผิดพลาด
      return res
        .status(401)
        .send({ message: "ไม่อนุญาตให้เข้าถึง, ต้องการบทบาท Admin" });
    });
  });
};

// ฟังก์ชันสำหรับตรวจสอบสิทธิ์การเข้าถึงของผู้ใช้ว่าเป็นผู้ดูแล (Moderator) หรือไม่
isMod = (req, res, next) => {
  // ค้นหาผู้ใช้จาก userId ที่ได้จาก req
  User.findByPk(req.userId).then((user) => {
    // ดึงบทบาทของผู้ใช้
    user.getRoles().then((roles) => {
      // ตรวจสอบบทบาทของผู้ใช้
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next(); // หากผู้ใช้เป็น Moderator ส่งต่อไปยัง middleware ถัดไป
          return;
        }
      }
      // หากไม่พบบทบาท Moderator ส่งข้อความข้อผิดพลาด
      return res
        .status(401)
        .send({ message: "ไม่อนุญาตให้เข้าถึง, ต้องการบทบาท Moderator" });
    });
  });
};

// ฟังก์ชันสำหรับตรวจสอบสิทธิ์การเข้าถึงของผู้ใช้ว่าเป็นผู้ดูแล (Moderator) หรือผู้ดูแลระบบ (Admin) หรือไม่
isModOrAdmin = (req, res, next) => {
  // ค้นหาผู้ใช้จาก userId ที่ได้จาก req
  User.findByPk(req.userId).then((user) => {
    // ดึงบทบาทของผู้ใช้
    user.getRoles().then((roles) => {
      // ตรวจสอบบทบาทของผู้ใช้
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator" || roles[i].name === "admin") {
          next(); // หากผู้ใช้เป็น Moderator หรือ Admin ส่งต่อไปยัง middleware ถัดไป
          return;
        }
      }
      // หากไม่พบบทบาท Moderator หรือ Admin ส่งข้อความข้อผิดพลาด
      return res
        .status(401)
        .send({ message: "ไม่อนุญาตให้เข้าถึง, ต้องการบทบาท Admin หรือ Moderator" });
    });
  });
};

// รวมฟังก์ชันการตรวจสอบสิทธิ์ทั้งหมดไว้ในอ็อบเจ็กต์ authJwt
const authJwt = {
  verifyToken,
  isAdmin,
  isMod,
  isModOrAdmin,
};

// ส่งออกอ็อบเจ็กต์ authJwt สำหรับการใช้งานในที่อื่นๆ
module.exports = authJwt;