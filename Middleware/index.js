// นำเข้าโมดูล verifySignUp และ authJwt
const verifySignUp = require("./verlifySignUp");
const authJwt = require("./authJwt");

// ส่งออกอ็อบเจ็กต์ที่รวมโมดูล verifySignUp และ authJwt
module.exports = {
    verifySignUp, // โมดูลที่ใช้สำหรับการตรวจสอบและยืนยันการลงทะเบียน
    authJwt,      // โมดูลที่ใช้สำหรับการตรวจสอบ JWT (JSON Web Token)
}