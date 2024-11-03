const Sequelize = require("sequelize");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Store = require("../models/store.model");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User; // เก็บโมเดลผู้ใช้
db.Role = Role; // เก็บโมเดลบทบาท
db.Store = Store;

module.exports = db;
