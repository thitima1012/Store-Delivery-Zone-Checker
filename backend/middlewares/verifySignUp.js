const User = require("../models/user.model");
const Role = require("../models/role.model");
const { Op } = require("sequelize");

checkDublicateUsernameOrEmail = async (req, res, next) => {
  // ตรวจสอบว่ามีค่า username หรือไม่
  if (!req.body.username) {
    return res.status(400).send({
      message: "Failed! Username is not provided!",
    });
  }

  // ตรวจสอบว่ามีค่า email หรือไม่
  if (!req.body.email) {
    return res.status(400).send({
      message: "Failed! Email is not provided!",
    });
  }
  //check username
  await User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      }
      next();
      // middleware Have next becouse send software next
    });
  });
};

//Check Roles are Valid
checkRolesExisted = async (req, res, next) => {
  if (req.body.roles) {
    Role.findAll({ where: { name: { [Op.or]: req.body.roles } } }).then(
      (roles) => {
        if (roles.length != req.body.roles.length) {
          res.status(400).send({
            message: "Failed! Role does not exist!",
          });
          return;
        }
        next();
      }
    );
  } else {
    next();
  }
};

//Verify SignUp
const verifySignUp = {
  checkDublicateUsernameOrEmail,
  checkRolesExisted,
};
module.exports = verifySignUp;
