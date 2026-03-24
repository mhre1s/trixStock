const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Item = sequelize.define(
  "Item",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
       type: DataTypes.INTEGER,
        allowNull: false
    },
    patrimony: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rbx_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeSave: (item) => {
        item.name = item.name.trim().toUpperCase();
        if (item.description) {
          item.description = item.description.trim();
        }
      },
    },
  },
);
module.exports = Item
