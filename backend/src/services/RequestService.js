const Request = require("../model/Request");
const Item = require("../model/Item");
const User = require("../model/User");
const Category = require("../model/Category");

class RequestService {
  async createRequest(data) {
    const { itemName, quantity } = data;
    const qtyRequested = Number(quantity) || 1;

    // 1. BUSCA O PRIMEIRO ITEM DISPONÍVEL COM ESSE NOME
    // Ordenamos pelo ID para pegar o mais antigo (FIFO)
    const itemDisponivel = await Item.findOne({
      where: {
        name: itemName,
        balance: { [Op.gte]: qtyRequested }, // Garante que tem saldo suficiente
      },
      order: [["id", "ASC"]],
    });

    // 2. SE NÃO ACHAR, RETORNA O ERRO QUE VOCÊ VIU
    if (!itemDisponivel) {
      throw new Error(
        "Item não encontrado ou estoque insuficiente para " + itemName,
      );
    }

    // 3. ABATE O SALDO NO ESTOQUE
    // Se for item com serial, o balance vai de 1 para 0
    // Se for cabo, abate a quantidade solicitada
    itemDisponivel.balance -= qtyRequested;
    await itemDisponivel.save();

    // 4. CRIA A SOLICITAÇÃO VINCULANDO O ID REAL DO ITEM
    return await Request.create({
      item_id: itemDisponivel.id,
      quantity: qtyRequested,
      status: "PENDENTE",
      // user_id: data.userId (se você já tiver autenticação)
    });
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
