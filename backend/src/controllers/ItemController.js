const ItemService = require('../services/ItemService')
class ItemController {
  async store(req, res) {
    try {
      const item = await ItemService.createItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async list(req, res) {
    try {
      const items = await ItemService.getItems(req.query);
      res.status(200);
      return res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar itens" });
      console;
    }
  }
  async deleteQty(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      await ItemService.deleteQuantity(id, quantity);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listByCategory(req, res) {
    try {
      const items = await ItemService.getItemsGroupedByCategory();
      return res.json(items);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar itens por categoria" });
    }
  }
}

    module.exports = new ItemController()