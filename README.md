🚀 TrixStock

Sistema de Gestão de Ativos & Integração com ERP Routerbox

Este projeto foi desenvolvido para a Trixnet com o objetivo de centralizar o controle de equipamentos de rede e automatizar a sincronização com o ERP oficial da empresa.

🔗 Links Úteis
🌐 Aplicação Online: (adicione o link aqui)
📄 Documentação da API: Disponível sob consulta
🔑 Acesso para Recrutadores (Sandbox)

Para testar o sistema sem expor dados sensíveis, utilize as credenciais abaixo:

Usuário: testerecrutador
Senha: 12345678

⚠️ Nota:
Este ambiente está conectado ao endpoint de homologação do Routerbox.
Nenhum dado inserido aqui afeta a produção real.

🚀 Visão Geral do Sistema

O TrixStock foi projetado para eliminar retrabalho e garantir integridade de dados através de:

🔄 Sincronização em Duas Etapas
O item é salvo localmente e depois enviado ao ERP.
O ID retornado (rbx_id) é armazenado para consultas futuras.
🧠 Tratamento de Concorrência
Lógica de backend para evitar duplicidade de:
MAC Address
Número de Série
📊 Dashboard Inteligente
Filtros por:
Status (Novo, Usado, Defeito)
Categorias de ativos
🛠️ Stack Tecnológica
Camada	Tecnologia
Backend	Node.js + Express.js
Frontend	React + Tailwind CSS
Banco de Dados	PostgreSQL + Sequelize ORM
Integração	Axios (API REST)
Infraestrutura	Docker + Docker Compose
Produtividade	n8n + Vibe Coding
📸 Demonstração

(Adicione prints aqui)

📌 Tela de Cadastro com Integração

(print aqui)

📌 Listagem de Equipamentos

(print aqui)

⚙️ Como Executar o Projeto (Local)
1. Clone o repositório
git clone https://github.com/mhre1s/trixstock.git
2. Instale as dependências
npm install
3. Configure o ambiente

Crie um arquivo .env na raiz do projeto com base no .env.example.

4. Execute o projeto
npm run dev
👨‍💻 Autor

Desenvolvido por Matheus Reis 🚀
