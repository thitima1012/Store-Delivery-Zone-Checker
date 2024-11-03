const Store = require("../models/store.model");
const { where } = require("sequelize");

// Create and Save a new store
exports.create = (req, res) => {
  const { storeName, address, latitude, longitude, deliveryRadius } = req.body;

  // Validate request
  if (!storeName || !address || !latitude || !longitude || !deliveryRadius) {
    return res.status(400).send({
      message:
        "All fields (storeName, address, latitude, longitude, deliveryRadius) are required!",
    });
  }

  // Get userId from authenticated user (token)
  const userId = req.userId; // ดึง userId จาก token ที่ middleware verifyToken ได้ตรวจสอบแล้ว

  // Check if store already exists
  Store.findOne({ where: { storeName } })
    .then((existingStore) => {
      if (existingStore) {
        return res.status(400).send({
          message: "Store already exists!",
        });
      }

      // Create a store if it doesn't exist
      const newStore = {
        storeName,
        address,
        latitude,
        longitude,
        deliveryRadius,
        userId, // ใช้ userId จาก token
      };

      return Store.create(newStore);
    })
    .then((store) => {
      res.send(store);
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message || "Some error occurred while creating the store.",
      });
    });
};

// Get all stores
exports.getAll = (req, res) => {
  Store.findAll()
    .then((stores) => {
      res.send(stores);
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message || "Some error occurred while retrieving stores.",
      });
    });
};

// Get a store by ID
exports.getById = (req, res) => {
  const id = req.params.id;

  Store.findByPk(id)
    .then((store) => {
      if (!store) {
        return res.status(404).send({
          message: `Store not found with id ${id}`,
        });
      }
      res.send(store);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || `Error retrieving store with id ${id}`,
      });
    });
};

// Update a store by ID
exports.update = (req, res) => {
  const id = req.params.id;
  Store.update(req.body, {
    where: { id: id },
  })
    .then((updated) => {
      if (updated[0] === 1) {
        return Store.findByPk(id);
      }
      res.status(404).send({
        message: `Store not found with id ${id}`,
      });
    })
    .then((updatedStore) => {
      if (updatedStore) {
        res.send(updatedStore);
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || `Error updating store with id ${id}`,
      });
    });
};

// Delete a store by ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Store.destroy({
    where: { id: id },
  })
    .then((deleted) => {
      if (deleted) {
        return res.send({
          message: "Store was deleted successfully!",
        });
      }
      res.status(404).send({
        message: `Store not found with id ${id}`,
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || `Could not delete store with id ${id}`,
      });
    });
};
