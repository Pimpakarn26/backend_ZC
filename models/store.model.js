const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Store = sequelize.define("store", {
  id: {
    type: DataTypes.INTEGER, // ประเภทข้อมูลเป็นจำนวนเต็ม
    primaryKey: true,
    autoIncrement: true,
  },
  storeName: {
    type: DataTypes.STRING, // ประเภทข้อมูลเป็นข้อความ
    allowNull: false, // ไม่อนุญาตให้ค่านี้เป็นค่าว่าง
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: "users",
        key: "id",
    },
},
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  radius: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Store.sync({ force: false })
  .then(() => {
    console.log("Store table created successfully.");
  })
  .catch((err) => {
    console.error("Failed to create table:", err);
  });

module.exports = Store;
