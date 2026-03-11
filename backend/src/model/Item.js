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
    category: {
      type: DataTypes.ENUM("Onu", "Escritorio", "Cabeamento", "Ferramentas"),
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
    unit_of_measure: {
      type: DataTypes.ENUM("Unidade", "Metros", "Pacote", "Caixa", "Litro"),
      allowNull: false,
      defaultValue: "Unidade",
    },
    minimum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
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
