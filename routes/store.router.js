const express = require("express");
const StoreController = require("../controllers/store.controller");
const router = express.Router();

// Route สำหรับ CRUD ร้านค้า
router.post("/", StoreController.create);

//Get All Store
router.get("/", StoreController.getAll);

//Get a Store by Id
router.get("/:id", StoreController.getById);

//Update Store
router.put("/:id", StoreController.update);

//Delete a store
router.delete("/:id", StoreController.delete);

module.exports = router;
