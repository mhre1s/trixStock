const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Request = sequelize.define("Request", {
  
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Items", 
      key: "id",
    },
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  status: {
    type: DataTypes.ENUM("aprovado", "pendente", "rejeitado", "finalizado"),
    allowNull: false,
    defaultValue: "pendente",
  },
  observation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Request;
