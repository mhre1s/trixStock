const {Sequelize}  = require('sequelize')

const sequelize = new Sequelize("trixnet_db", "matheus", "123",{
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize