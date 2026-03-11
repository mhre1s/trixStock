const  Item  = require("../model/Item");
const { Op } = require("sequelize");
console.log("O Item tem o método findOne?", typeof Item.findOne);

class ItemService {
  async createItem(data) {
    const formattedName = data.name.trim().toUpperCase();

    const patrimony =
      data.patrimony && data.patrimony.trim() !== ""
        ? data.patrimony.trim()
        : null;

    // ITEM COM SERIAL
    if (patrimony !== null) {
      const existingSN = await Item.findOne({
        where: { patrimony },
      });

      if (existingSN) {
        throw new Error("Esse serial já está cadastrado.");
      }

      return await Item.create({
        name: formattedName,
        patrimony,
        category: data.category,
        unit_of_measure: data.measure,
        description: data.description,
        balance: 1,
      });
    }

    // ITEM SEM SERIAL
    const existentItem = await Item.findOne({
      where: {
        name: formattedName,
        patrimony: null,
      },
    });

    if (existentItem) {
      const novoSaldo = existentItem.balance + Number(data.balance || 0);

      return await existentItem.update({
        balance: novoSaldo,
      });
    }

    return await Item.create({
      name: formattedName,
      patrimony: null,
      category: data.category,
      unit_of_measure: data.measure,
      description: data.description,
      balance: Number(data.balance || 0),
    });
  }

  async getItems(filters) {
    const { q, category } = filters;
    let whereClause = {};

    if (q) {
      whereClause.name = { [Op.iLike]: `%${q}%` };
    }
    if (category) {
      whereClause.category = category;
    }
    return await Item.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
    });
  }

  async deleteQuantity(id, quantity) {
    const qty = Number(quantity);
    const item = await Item.findByPk(id);
    if (!item) {
      throw new Error("item não encontrado");
    }
    if (item.balance < qty) {
      throw new Error("Estoque insuficiente");
    }

    item.balance -= qty;
    await item.decrement("balance", { by: qty });
    await item.reload();
    return item;
  }

  async updateItem(data, id) {
    return await Item.update(data, { where: { id } });
  }
}

module.exports = new ItemService();
