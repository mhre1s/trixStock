const Request = require("../model/Request");
const Item = require("../model/Item");
const User = require("../model/User");

class RequestService {
  async createRequest(data) {
    const item = await Item.findByPk(data.item_id);
    const user = await User.findByPk(data.user_id);

    if (!item) throw new Error("Item não encontrado.");
    if (!user) throw new Error("Usuário não encontrado.");

    if (item.balance < data.quantity) {
      throw new Error("Estoque insuficiente para abrir esta solicitação.");
    }

    return await Request.create({
      ...data,
      status: "pendente",
    });
  }

  async approveRequest(requestId) {
    const request = await Request.findByPk(requestId, {
      include: [{ model: Item, as: "item" }],
    });

    if (!request) throw new Error("Requisição não encontrada.");
    if (request.status !== "pendente")
      throw new Error("Esta requisição já foi processada.");

    const item = request.item;

    if (item.balance < request.quantity) {
      throw new Error("Estoque insuficiente para aprovar agora!");
    }

    await item.update({ balance: item.balance - request.quantity });

    await request.update({ status: "aprovado" });

    const saldoTotalCategoria = await Item.sum("balance", {
      where: { category: item.category },
    });

    if (saldoTotalCategoria <= item.minimum) {
      console.log(`\n🚨 [ALERTA DE COMPRAS - TrixStock]`);
      console.log(`Requisição do ID ${request.id} aprovada.`);
      console.log(`A categoria ${item.category} atingiu o limite mínimo!`);
      console.log(`Saldo atual: ${saldoTotalCategoria}\n`);
    }

    return request;
  }

  async rejectRequest(requestId) {
    const request = await Request.findByPk(requestId);
    if (!request) throw new Error("Requisição não encontrada.");

    return await request.update({ status: "rejeitado" });
  }

  async getRequest() {
    return await Request.findAll({
      include: [
        { model: Item, as: "item", attributes: ["name"] },
        { model: User, as: "user", attributes: ["name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
  }
}

module.exports = new RequestService();
