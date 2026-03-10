const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Permite a conexão segura mesmo sem um certificado assinado localmente
    },
  },
});

module.exports = sequelize;
