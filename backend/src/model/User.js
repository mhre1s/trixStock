const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.ENUM("operacional", "almoxarifado", "gestão"),
    allowNull: false,
    defaultValue: "operacional",
  },
});
module.exports = User
