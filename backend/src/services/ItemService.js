const  Item  = require("../model/Item");
const { Op } = require("sequelize");
console.log("O Item tem o método findOne?", typeof Item.findOne);

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

  async deleteQuantity(id,quantity) {
    const qty = Number(quantity)
    const item = await Item.findByPk(id);
    if(!item){
      throw new Error("item não encontrado")
    }
     if (item.balance < qty) {
       throw new Error("Estoque insuficiente");
     }

     item.balance -= qty
     await item.decrement('balance',{by:qty})
     await item.reload();
     return item
  }

  async updateItem(data, id) {
    return await Item.update(data, { where: { id } });
  }
}

module.exports = new ItemService();
