# 🚀 TrixStock

> ⏳ **Nota sobre o carregamento:** Esta aplicação está hospedada no plano gratuito do Render. Devido à política de "spin-down" da plataforma, o servidor entra em modo de repouso após inatividade. **O primeiro acesso pode levar de 30 a 60 segundos para despertar o servidor.** Agradeço a paciência!

Sistema de Gestão de Ativos & Integração Estratégica com ERP Routerbox

Este projeto foi desenvolvido para a **Trixnet** com o objetivo de centralizar o controle de equipamentos de rede e automatizar a sincronização com o ERP oficial da empresa.

---

### 🔗 Links Úteis
* 🌐 **Aplicação Online:** [Adicione o link aqui, por exemplo: https://seu-site.trixstock.com]
* 📄 **Documentação da API:** `Disponível sob consulta`

---

### 🔑 Acesso para Recrutadores (Sandbox)
Para testar as funcionalidades sem expor dados sensíveis, utilize as credenciais abaixo:

| Campo | Dado |
| :--- | :--- |
| **Usuário:** | `testerecrutador` |
| **Senha:** | `12345678` |

> ⚠️ **Nota:** Este ambiente está conectado ao **Endpoint de Homologação** do Routerbox. Nenhum dado inserido aqui afeta a produção real.

---

### 💡 Visão Geral do Sistema

O TrixStock elimina o retrabalho e garante a integridade dos dados através de:

* 🔄 **Sincronização em Duas Etapas:** O item é salvo localmente e, em seguida, enviado ao ERP. O ID de retorno (`rbx_id`) é armazenado para consultas futuras.
* 🧠 **Tratamento de Concorrência:** Lógica de backend para evitar duplicidade de: **MAC Address** e **Número de Série**.
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
*(print da tela de cadastro)*
![Cadastro](link_do_print_1)

#### 📌 Listagem de Equipamentos
*(print da tela de listagem)*
![Listagem](link_do_print_2)

---

Desenvolvido por [Matheus Reis](https://matheusreisportfolio.netlify.app/) 🚀
