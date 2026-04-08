const { Op } = require("sequelize");
const { Item, Category } = require("../model/index");
const axios = require("axios");

class ItemService {
  constructor() {
    this.rbxUrl =
      "https://homologacaotrixnet.rbxsoft.com/routerbox/ws_json/ws_json.php";
    this.rbxApiKey = "SBC94S36EF8JTPXTDCLZF4NK7EOQAF";
  }


  async _syncWithRBX(itemLocal) {
    try {
      const rbxPayload = {
        inventory_insert: {
          company_id: 1, 
          code: `STK-${itemLocal.id}`, 
          description: itemLocal.name,
          model_id: 1, 
          serial_controlled: !!itemLocal.patrimony,
          unit_id: 1, 
          sale_price: 0,
          operation_type_workforce: "lending", 
          efd_icms_ipi_item: "07",
          status: "A", 
          invoice: {
            nfe_oper_venda: {
              id_nat_oper: 1,
              cfop: 5949,
              icms: { cst: "00", origem: "0" },
            },
          },
        },
      };

      const response = await axios.post(this.rbxUrl, rbxPayload, {
        headers: { Authorization: `Bearer ${this.rbxApiKey}` },
      });

      if (response.data && response.data.status === 1) {
        await itemLocal.update({ rbx_id: response.data.result.id });
        console.log(
          `[RBX] Item ${itemLocal.id} sincronizado. ID RBX: ${response.data.result.id}`,
        );
      } else {
        console.warn(
          `[RBX] Falha na resposta: ${response.data.error_description}`,
        );
      }
    } catch (error) {
      console.error("[RBX] Erro de conexão:", error.message);
    }
  }

  async createItem(data) {
    const formattedName = data.name.trim().toUpperCase();
    let result;

    if (
      data.patrimony &&
      (data.patrimony.includes(",") || data.patrimony.includes(";"))
    ) {
      const serials = data.patrimony
        .split(/[;,]+/)
        .map((s) => s.trim())
        .filter((s) => s !== "");
      const qtyInformada = Number(data.balance);

      if (serials.length !== qtyInformada) {
        throw new Error(
          `Conflito: ${serials.length} seriais para ${qtyInformada} itens.`,
        );
      }

      const existing = await Item.findOne({
        where: { patrimony: { [Op.in]: serials } },
      });
      if (existing)
        throw new Error(`O serial "${existing.patrimony}" já existe.`);

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

      // Sincroniza apenas o primeiro como modelo de produto no RBX
      await this._syncWithRBX(createdItems[0]);
      return createdItems[0];
    }

    // 2. Caso: Único Serial
    const patrimony =
      data.patrimony && data.patrimony.trim() !== ""
        ? data.patrimony.trim()
        : null;
    if (patrimony !== null) {
      const existingSN = await Item.findOne({ where: { patrimony } });
      if (existingSN) throw new Error("Esse serial já está cadastrado.");

      result = await Item.create({
        name: formattedName,
        patrimony,
        category_id: data.category_id,
        unit_of_measure: data.measure,
        description: data.description,
        balance: 1,
      });

      await this._syncWithRBX(result);
      return result;
    }

    // 3. Caso: Incrementar saldo de item existente (sem serial)
    const existentItem = await Item.findOne({
      where: {
        name: formattedName,
        patrimony: null,
        category_id: data.category_id,
      },
    });

    if (existentItem) {
      return await existentItem.update({
        balance: existentItem.balance + Number(data.balance || 0),
      });
    }

    // 4. Caso: Novo Item Comum
    result = await Item.create({
      name: formattedName,
      patrimony: null,
      category_id: data.category_id,
      unit_of_measure: data.measure,
      description: data.description,
      balance: Number(data.balance || 0),
    });

    await this._syncWithRBX(result);
    return result;
  }

  // --- MÉTODOS DE BUSCA E ATUALIZAÇÃO ---

  async getItems(filters) {
    const { q, category_id } = filters;
    let whereClause = {};

    if (q) whereClause.name = { [Op.iLike]: `%${q}%` };
    if (category_id) whereClause.category_id = category_id;

    return await Item.findAll({
      where: whereClause,
      include: Category,
      order: [["name", "ASC"]],
    });
  }

  async deleteQuantity(id, quantity) {
    const qty = Number(quantity);
    const item = await Item.findByPk(id);

    if (!item) throw new Error("item não encontrado");
    if (item.balance < qty) throw new Error("Estoque insuficiente");

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
            attributes: [
              "id",
              "name",
              "balance",
              "description",
              "patrimony",
              "rbx_id",
            ],
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
          items: itemsList.map((i) => i.get({ plain: true })),
        };
      });
    } catch (error) {
      console.error("ERRO NO BACKEND:", error);
      throw error;
    }
  }
}

module.exports = new ItemService();
