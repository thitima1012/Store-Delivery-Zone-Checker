const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
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
});

User.sync({ force: false })
  .then(() => {
    console.log("User created or already exists");
  })
  .catch((error) => {
    console.log("Error creating User : ", error);
  });

module.exports = User;
