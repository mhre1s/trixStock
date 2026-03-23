const axios = require('axios');
const { json } = require('sequelize');
const RBX_CONFIG = {
  url: "https://homologacaotrixnet.rbxsoft.com/routerbox/ws/rbx_server_json.php",
  token: "SBC94S36EF8JTPXTDCLZF4NK7EOQAF",
};

async function exploreRBX (servico)  {
    console.log(`\n--- Testando Serviço: ${servico} ---`);
    const payload = {
        [servico]:{
            "Autenticacao": {
                "ChaveIntegracao": RBX_CONFIG.token
            },
            "Filtro":""
        }
    }
    try {
        const response = await axios.post(RBX_CONFIG.url, payload)
        if (response.data.status === 1){
            console.log(`Sucesso! Retornou ${response.data.result.length} itens.`)
            console.log("Exemplo do primeiro item:", JSON.stringify(response.data.result[0]))
        }
        else{
            console.log(`Aviso do RBX: ${response.data.erro_desc}`)
        }

    } catch (error) {
        console.error("Erro na requisição:", error.message)
    }
}

async function runTests(){
    await exploreRBX("ConsultaModelosProduto");
    await exploreRBX("ConsultaTiposProduto");
    await exploreRBX("ConsultaProdutosEstoque");
    await exploreRBX("ConsultaItensSerialNumber");
}

runTests()