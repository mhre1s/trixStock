const { Item } = require("../model/Item");
const { Op } = require("sequelize");

class ItemService {
  async createItem(data) {
    const formattedName = data.name.trim().toUpperCase();
    const existentItem = await Item.findOne({ where: { name: formattedName } });

    if (existentItem) {
      const novoSaldo = existentItem.balance + parseInt(data.balance);
      return await existentItem.update({ balance: novoSaldo });
    }

    return await Item.create(data);
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

  async deleteItem(id) {
    return await Item.destroy({ where: { id } });
  }

  async updateItem(data, id) {
    return await Item.update(data, { where: { id } });
  }
}

module.exports = new ItemService();
