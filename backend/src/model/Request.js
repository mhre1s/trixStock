const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Request = sequelize.define('Request',{
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{min: 1}
    },
    status:{
        type: DataTypes.ENUM("aprovado", "pendente", "rejeitado", "finalizado"),
        allowNull: false,
        defaultValue: 'pendente'
    },
    observation:{
        type: DataTypes.STRING,
        allowNull: true
    }
})
module.exports = Request