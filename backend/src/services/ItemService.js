
const { Op } = require("sequelize");
const { Item, Category } = require("../model/index"); 

class ItemService {
  async createItem(data) {
    const formattedName = data.name.trim().toUpperCase();
    if (
      data.patrimony &&
      (data.patrimony.includes(",") || data.patrimony.includes(";"))
    ) {
      const serials = data.patrimony
        .split(/[;]+/)
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const qtyInformada = Number(data.balance);
      if (serials.length !== qtyInformada) {
        throw new Error(
          `Conflito: Você informou ${serials.length} seriais no campo patrimônio, mas a quantidade definida foi ${qtyInformada}.`,
        );
      }
      const existing = await Item.findOne({
        where: { patrimony: { [Op.in]: serials } },
      });

      if (existing) {
        throw new Error(
          `O serial "${existing.patrimony}" já está cadastrado no sistema.`,
        );
      }
      const createdItems = await Promise.all(
        serials.map((sn) =>
          Item.create({
            name: formattedName,
            patrimony: sn,
            category_id: data.category_id,
            unit_of_measure: data.measure,
            description: data.description,
            balance: 1, 
          }),
        ),
      );

      return createdItems[0]; 
    }

    const patrimony =
      data.patrimony && data.patrimony.trim() !== ""
        ? data.patrimony.trim()
        : null;

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
  async getItemsGroupedByCategory() {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: Item,
            attributes: ["id", "name", "balance", "description", "patrimony"],
          },
        ],
        order: [["name", "ASC"]],
      });

      return categories.map((cat) => {
        const itemsList = cat.Items || [];
        const totalBalance = itemsList.reduce(
          (acc, i) => acc + (Number(i.balance) || 0),
          0,
        );
        return {
          id: cat.id,
          name: cat.name,
          minimum: cat.minimum || 0,
          total: totalBalance,
          lowStock: totalBalance < (cat.minimum || 0),
          items: itemsList.map((i) => {
            const itemPuro = i.get({ plain: true });

            return {
              id: itemPuro.id,
              name: itemPuro.name,
              balance: itemPuro.balance,
              description: itemPuro.description,
              patrimony: itemPuro.patrimony,
            };
          }),
        };
      });
    } catch (error) {
      console.error("ERRO NO BACKEND:", error);
      throw error;
    }
  }
}

module.exports = new ItemService();
