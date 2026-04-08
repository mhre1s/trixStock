# 🚀 TrixStock

> ⏳ **Nota sobre o carregamento:** Esta aplicação está hospedada no plano gratuito do Render. Devido à política de "spin-down" da plataforma, o servidor entra em modo de repouso após inatividade. **O primeiro acesso pode levar de 30 a 60 segundos para despertar o servidor.** Agradeço a paciência!

Sistema de Gestão de Ativos & Integração Estratégica com ERP Routerbox.

Este projeto foi desenvolvido para a **Trixnet** com o objetivo de centralizar o controle de equipamentos de rede e automatizar a sincronização com o ERP oficial da empresa.

---

### 🔗 Links Úteis
* 🌐 **Aplicação Online:** [https://trix-stock.netlify.app/]
---

### 🔑 Acesso para Recrutadores (Sandbox)
Utilize as credenciais abaixo para acessar o ambiente de demonstração:

| Campo | Dado |
| :--- | :--- |
| **Usuário:** | `testerecrutador` |
| **Senha:** | `12345678` |

> ⚠️ **Nota:** Este ambiente está conectado ao **Endpoint de Homologação** do Routerbox. Nenhum dado inserido aqui afeta a produção real.

---

### 📖 Como Testar o Sistema

Para entender o fluxo de integração e as regras de negócio, sugira-se seguir estes passos:

1. **Login:** Acesse com as credenciais acima.
2. **Cadastro de Ativo:** Vá em "Cadastrar Equipamento" e preencha os campos (Marca, Modelo, Serial e etc...).
3. **Validação de Sincronização:** Após salvar, observe que o sistema aguarda a resposta da API do Routerbox. Se a integração for bem-sucedida, o item aparecerá na listagem com o status **"Sincronizado"** e o respectivo `rbx_id`.
4. **Filtros:** Utilize a barra de busca para filtrar por Modelo ou Serial, simulando a busca rápida que os técnicos realizam no campo.
5. **Solicitação de retirada:** Tente solicitar a retirada de um produto no estoque na tela operacional.
6. **Aprovação ou recusa de retirada:** Aprove ou recuse solicitações na tela almoxarifado logo após ter feito a requisição e veja o estoque ser atualizado
7. **Alerta de estoque:** Caso um produto chegue na quantidade mínima aceita, na tela de alerta de estoque vai mostrar os itens que estão críticos.

---

### 💡 Visão Geral do Sistema

O TrixStock elimina o retrabalho e garante a integridade dos dados através de:

* 🔄 **Sincronização em Duas Etapas:** O item é salvo localmente e, em seguida, enviado ao ERP. O ID de retorno (`rbx_id`) é armazenado para consultas futuras.
* 🧠 **Tratamento de Concorrência:** Lógica de backend para evitar duplicidade de: **Número de Série/Patrimônio**.
* 📊 **Dashboard Inteligente:** Filtros por status (Novo, Usado, Defeito) e categorias de ativos.

---

### 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Backend** | Node.js + Express.js |
| **Frontend** | React + Tailwind CSS |
| **Banco de Dados** | PostgreSQL + Sequelize ORM |
| **Integração** | Axios (API REST) |
| **Infraestrutura** | Docker + Docker Compose |

---

### 📸 Demonstração
> **(Arraste e solte seus prints nas áreas indicadas abaixo)**

#### 📌 Tela de Cadastro com Integração
<img width="1822" height="954" alt="Captura de tela 2026-04-08 002731" src="https://github.com/user-attachments/assets/564d6f0f-4957-47a3-a7ec-7d29b97cd8f7" />

#### 📌 Listagem de Equipamentos
<img width="1897" height="948" alt="Captura de tela 2026-04-08 003016" src="https://github.com/user-attachments/assets/02be80c8-3eb7-4ef3-8bc3-0735ae047656" />

#### 📌 Tela de alerta do estoque
<img width="1918" height="953" alt="Captura de tela 2026-04-08 003746" src="https://github.com/user-attachments/assets/4c1a5371-715a-47a8-8b50-ef75505998df" />


Desenvolvido por [Matheus Reis](https://matheusreisportfolio.netlify.app/) 🚀
