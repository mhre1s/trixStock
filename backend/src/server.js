const express = require("express");
const routes = require("./routes/routes"); 
const sequelize = require("./config/database");
const cors = require("cors");
require("./model");

const app = express();
const port = 3000;

app.use(cors())

app.use(express.json());

app.use(routes);

async function startServer() {
  try {
    
    await sequelize.sync({ alter: true });
    console.log("Models sincronizados e criados");

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ou sincronizar:", error);
  }
}

startServer();
