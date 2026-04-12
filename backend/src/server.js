const express = require("express");
const routes = require("./routes/routes"); 
const sequelize = require("./config/database");
const cors = require("cors");
require("./model");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

app.use(express.json());

app.use(routes);

async function startServer() {
  try {
    
    await sequelize.sync();
    console.log("Models sincronizados e criados");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ou sincronizar:", error);
  }
}

startServer();
