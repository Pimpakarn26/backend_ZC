const {DataTypes} = require("sequelize")
const sequelize = require("./db")

const Role = sequelize.define("role",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
})
Role.sync({ alter: false })
  .then(() => {
    console.log("Role table created or already exists");
  })
  .catch((error) => {
    console.log("Error creating Role table:", error);
  });

module.exports = Role