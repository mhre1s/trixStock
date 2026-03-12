const Request = require("../model/Request");
const Item = require("../model/Item");
const User = require("../model/User");
const Category = require("../model/Category");
const { Op } = require("sequelize");

class RequestService {
  async createRequest(data) {
    const { itemName, quantity, user_id } = data;
    const qtyRequested = Number(quantity) || 1;
    const searchName = itemName.trim().toUpperCase();
    const totalBalance = await Item.sum("balance", {
      where: {
        name: searchName,
      },
    });
    if (!totalBalance || totalBalance < qtyRequested) {
      throw new Error(
        `Estoque insuficiente para "${itemName}". Disponível: ${totalBalance || 0}`,
      );
    }

    const referenciaItem = await Item.findOne({
      where: { name: searchName },
      order: [["id", "ASC"]],
    });
    return await Request.create({
      item_id: referenciaItem.id,
      user_id,
      quantity: qtyRequested,
      status: "pendente",
    });
  }
  async approveRequest(requestId) {
    const request = await Request.findByPk(requestId, {
      include: [{ model: Item, as: "item" }],
    });

    if (!request || request.status !== "pendente") {
      throw new Error("Solicitação não encontrada ou já processada.");
    }
    const itensDisponiveis = await Item.findAll({
      where: {
        name: request.item.name,
        balance: { [Op.gt]: 0 },
      },
      order: [["id", "ASC"]],
    });
    const totalEstoque = itensDisponiveis.reduce(
      (sum, i) => sum + i.balance,
      0,
    );
    if (totalEstoque < request.quantity) {
      throw new Error("Estoque insuficiente no momento da aprovação.");
    }
    let quantidadeParaAbater = request.quantity;

    for (const item of itensDisponiveis) {
      if (quantidadeParaAbater <= 0) break;

      if (item.balance <= quantidadeParaAbater) {
        quantidadeParaAbater -= item.balance;
        item.balance = 0;
      } else {
        item.balance -= quantidadeParaAbater;
        quantidadeParaAbater = 0;
      }
      await item.save(); 
    }
    request.status = "aprovado";
    await request.save();

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
