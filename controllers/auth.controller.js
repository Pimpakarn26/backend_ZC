const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Role = db.Role;

exports.signup = async (req, res) => {
  const { username, email, password,address, latitude, longitude, roleId } = req.body;

  // ตรวจสอบว่าฟิลด์ทั้งหมดมีค่า
  if (!username || !email || !password ||!address ||!latitude ||!longitude  ) {
      return res.status(400).json({ message: "All fields are required!" });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await User.create({
          username,
          email,
          password: hashedPassword,
          address,
          latitude,
          longitude,
      });

      if (roleId) {
          const role = await Role.findByPk(roleId);
          if (role) {
              await user.setRoles([role]);
          }
      } else {
          const role = await Role.findOne({ where: { name: "user" } });
          await user.setRoles([role]);
      }

      res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
          return res.status(401).json({ accessToken: null, message: "Invalid Password!" });
      }

      // กำหนดค่า secret ในโค้ด
      const secret = "mysecretkey"; // เปลี่ยนค่าเป็น secret ที่คุณต้องการ
      const token = jwt.sign({ id: user.id }, secret, {
          expiresIn: 86400 // 24 hours
      });

      const authorities = [];
      const roles = await user.getRoles();
      for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }

      res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
      });
  } catch (error) {
      console.error("Error signing in: ", error);
      res.status(500).json({ message: "Error signing in", error: error.message || error });
  }
};


