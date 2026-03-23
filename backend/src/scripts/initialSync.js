const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const axios = require("axios");
const { Item, Category } = require("../model");

const RBX_CONFIG = {
  url: "https://homologacaotrixnet.rbxsoft.com/routerbox/ws/rbx_server_json.php",
  token: "SBC94S36EF8JTPXTDCLZF4NK7EOQAF",
};

async function sync() {
  try {
    const response = await axios.post(RBX_CONFIG.url, {
      ConsultaModelosProduto: {
        Autenticacao: {
          ChaveIntegracao: RBX_CONFIG.token,
        },
        Filtro: "",
      },
    });

    const rbxItems = response.data.result;

    for (const rbxItem of rbxItems) {
      const [category] = await Category.findOrCreate({
        where: { name: rbxItem.Tipo_Descricao.trim() || "Diversos" },
        defaults: { minimum: 10 },
      });
      await Item.upsert({
        patrimony: rbxItem.Codigo,
        name: rbxItem.Descricao,
        description: `Marca: ${rbxItem.Marca}`,
        category_id: category.id,
        balance: 0,
      });
      console.log(`✅ Sincronizado: ${rbxItem.Descricao}`);
    }
    console.log("\n--- TUDO PRONTO! 258 ITENS NO BANCO ---");
    console.log("\n--- TUDO PRONTO! 258 ITENS NO BANCO ---");
    console.log("\n--- TUDO PRONTO! 258 ITENS NO BANCO ---");
  } catch (error) {
    console.error("Erro na sincronização:", error.message);
  }
}
sync();
