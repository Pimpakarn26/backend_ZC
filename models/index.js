const sequelize = require("./db");
const Sequelize = require("sequelize");
const User = require("./user.model");
const Role = require("./role.model");
const Store = require("./store.model");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User; // เก็บโมเดลผู้ใช้
db.Role = Role; // เก็บโมเดลบทบาท
db.Store = Store;

// กำหนดความสัมพันธ์ระหว่างโมเดล
db.User.belongsToMany(db.Role, {
  through: "user_roles", // กำหนดตารางเชื่อมโยงชื่อ "user_roles"
});
db.Role.belongsToMany(db.User, {
  through: "user_roles", // กำหนดตารางเชื่อมโยงชื่อ "user_roles"
});

db.User.hasMany(db.Store, {
    foreignKey: "admidId",
});

db.Store.belongsTo(db.User, {
    foreignKey: "admidId",
});


module.exports = db;
