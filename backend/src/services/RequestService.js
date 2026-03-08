const Request = require("../model/Request");
const Item = require("../model/Item");

class RequestService {
  async createRequest(data) {
    const item = await Item.findByPk(data.itemId);

    if (!item) throw new Error("Item não encontrado.");

    if (item.balance < data.quantity) {
      throw new Error("Estoque insuficiente.");
    }

    await item.update({ balance: item.balance - data.quantity });


    const saldoTotalCategoria = await Item.sum("balance", {
      where: { category: item.category },
    });

    if (saldoTotalCategoria <= item.minimum) {
      console.log(`\n🚨 [ALERTA DE COMPRAS]`);
      console.log(`A categoria ${item.category} atingiu o limite mínimo!`);
      console.log(`Saldo total no estoque: ${saldoTotalCategoria}`);
      console.log(`Limite configurado: ${item.minimum}\n`);

    }

    return await Request.create(data);
  }
  async getRequest(){
    const request = await Request.findAll()
    return request
  }
}

module.exports = new RequestService();