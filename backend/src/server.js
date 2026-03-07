const express = require('express')
const { User, Item, Request } = require("./model");
const sequelize = require('./config/database');
const app = express()
const port = 3000

app.use(express.json());

async function startServer(){
    try {
        await sequelize.sync({force: true});
        console.log('Models sincronizados e criados')

        app.listen(port, () => {
          console.log(`Servidor rodando na porta ${port}`);
        });
    } catch (error) {
        console.error("Erro ao conectar ou sincronizar:", error)
    }
}

startServer()

