const express = require("express");
const StoreController = require("../controllers/store.controller");
const router = express.Router();
const authJwt = require("../Middleware/authJwt");
// Route สำหรับ CRUD ร้านค้า
router.post("/",[authJwt.verifyToken, authJwt.isAdmin], StoreController.create);

//Get All Store
router.get("/", StoreController.getAll);

//Get a Store by Id
router.get("/:id", StoreController.getById);

//Update Store
router.put("/:id",[authJwt.verifyToken, authJwt.isAdmin], StoreController.update);

//Delete a store
router.delete("/:id",[authJwt.verifyToken, authJwt.isModOrAdmin], StoreController.delete);

module.exports = router;
