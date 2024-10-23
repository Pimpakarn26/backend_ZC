const Store = require("../models/store.model");

exports.create = async (req, res) => {
  const { storeName, adminId, address, lat, lng, radius } = req.body;

  if (!storeName || !adminId || !address || !lat || !lng || !radius) {
    return res.status(400).send({
      message: "All fields are required!",
    });
  }

  try {
    const store = await Store.findOne({ where: { storeName } });
    if (store) {
      return res.status(400).send({ message: "Store already exists" });
    }

    const newStore = await Store.create({
      storeName,
      adminId,
      address,
      lat,
      lng,
      radius,
    });

    res.send(newStore);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.send(stores);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    // เปลี่ยนการค้นหาให้ใช้ storeId แทน id
    const data = await Store.findOne({ where: { storeId: id } });
    if (!data) {
      return res.status(404).send({
        message: "Not found Store with ID : " + id,
      });
    }
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while retrieving the store!",
    });
  }
};


exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const [updated] = await Store.update(req.body, { where: { id } });
    if (updated) {
      res.send({ message: "Store updated successfully" });
    } else {
      res.send({ message: `Cannot update store with id ${id}` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Store.destroy({ where: { id } });
    if (deleted) {
      res.send({ message: "Store deleted successfully" });
    } else {
      res.send({ message: `Cannot delete store with id ${id}` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occurred" });
  }
};
