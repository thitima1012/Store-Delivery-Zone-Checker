const { DataTypes } = require("sequelize");
const sequelize = require("./db");

//define DB Schema
const store = sequelize.define("store", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "user", // 'Movies' would also work
      key: "id",
    },
    allowNull: false,
  },
  storeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  deliveryRadius: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

store
  .sync({ force: false })
  .then(() => {
    console.log("User table created or already exists");
  })
  .catch((error) => {
    console.log("Error creating User table:", error);
  });

module.exports = store;
