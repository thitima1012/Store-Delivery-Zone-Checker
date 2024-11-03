const config = require("../config/auth.config");
const db = require("../models");
const UserStore = db.UserStore; // เปลี่ยนจาก User เป็น UserStore
const Role = db.Role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Register a new Signup
exports.signup = async (req, res) => {
  const { username, password, address, latitude, longitude } = req.body; // เพิ่ม address, latitude, longitude
  if (!username || !password || !address || !latitude || !longitude) {
    res.status(400).send({
      message: "Please provide all required fields",
    });
    return;
  }

  // Prepare Sign data
  const newUser = {
    username: username,

    password: bcrypt.hashSync(password, 6),
    address: address, // เพิ่ม address
    latitude: latitude, // เพิ่ม latitude
    longitude: longitude, // เพิ่ม longitude
  };

  // Save User in the database
  await UserStore.create(newUser)
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: { [Op.or]: req.body.roles },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({
              message: "User registered successfully!",
            });
          });
        });
      } else {
        // set default role to "user" id=1
        user.setRoles([1]).then(() => {
          res.send({
            message: "User registered successfully!",
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occurred while registering a new user.",
      });
    });
};

// Signin a user
exports.signin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide all required fields",
    });
    return;
  }

  // Select * from UserStore where username = "username"
  await UserStore.findOne({ where: { username: username } }) // เปลี่ยนจาก User เป็น UserStore
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 1 วัน
      });

      const authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLES_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          address: user.address, // เพิ่ม address
          latitude: user.latitude, // เพิ่ม latitude
          longitude: user.longitude, // เพิ่ม longitude
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "Something error occurred while signing in.",
      });
    });
};
