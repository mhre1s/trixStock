const Request = require("../model/Request");
const Item = require("../model/Item");
const User = require("../model/User");
const Category = require("../model/Category");
const { Op } = require("sequelize");

class RequestService {
  async createRequest(data) {
    const { itemName, quantity } = data;
    const qtyRequested = Number(quantity) || 1;

    console.log(`Buscando item: ${itemName} com quantidade: ${qtyRequested}`);
    const itemDisponivel = await Item.findOne({
      where: {
        name: { [Op.iLike]: itemName.trim() }, 
        balance: { [Op.gte]: qtyRequested },
      },
      order: [["id", "ASC"]],
    });
    if (!itemDisponivel) {
      throw new Error(`Item "${itemName}" não encontrado ou estoque insuficiente.`);
    }
     await itemDisponivel.save();
    return await Request.create({
      item_id: itemDisponivel.id,
      quantity: qtyRequested,
      status: "pendente", 
    })
  }
  async approveRequest(requestId) {
    const request = await Request.findByPk(requestId, {
      include: [{ model: Item, as: "item" }],
    });

    if (!request) {
      throw new Error("Requisição não encontrada.");
    }

    if (request.status !== "pendente") {
      throw new Error("Esta requisição já foi processada.");
    }

    const item = request.item;

    if (item.balance < request.quantity) {
      throw new Error("Estoque insuficiente para aprovar agora!");
    }

    await item.update({
      balance: item.balance - request.quantity,
    });

    await request.update({
      status: "aprovado",
    });

    const category = await Category.findByPk(item.category_id);

    const saldoTotalCategoria = await Item.sum("balance", {
      where: { category_id: item.category_id },
    });

    if (saldoTotalCategoria <= category.minimum) {
      console.log(`\n🚨 [ALERTA DE COMPRAS - TrixStock]`);
      console.log(`Requisição do ID ${request.id} aprovada.`);
      console.log(`Categoria: ${category.name}`);
      console.log(`Saldo atual da categoria: ${saldoTotalCategoria}`);
      console.log(`Mínimo definido: ${category.minimum}\n`);
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
