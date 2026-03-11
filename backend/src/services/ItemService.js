const Item = require("../model/Item");
const { Op } = require("sequelize");
const Category = require("../model/Category");

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
        category_id: data.category_id,
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
        category_id: data.category_id,
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
      category_id: data.category_id,
      unit_of_measure: data.measure,
      description: data.description,
      balance: Number(data.balance || 0),
    });
  }

  async getItems(filters) {
    const { q, category_id } = filters;

    let whereClause = {};

    if (q) {
      whereClause.name = { [Op.iLike]: `%${q}%` };
    }

    if (category_id) {
      whereClause.category_id = category_id;
    }

    return await Item.findAll({
      where: whereClause,
      include: Category,
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

    await item.decrement("balance", { by: qty });
    await item.reload();

    return item;
  }

  async updateItem(data, id) {
    return await Item.update(data, { where: { id } });
  }

  async getCategoryStock(categoryId) {
    const total = await Item.sum("balance", {
      where: { category_id: categoryId },
    });

    const category = await Category.findByPk(categoryId);

    return {
      category: category.name,
      total,
      minimum: category.minimum,
      lowStock: total < category.minimum,
    };
  }
}

module.exports = new ItemService();
