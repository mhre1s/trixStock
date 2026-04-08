# 🚀 TrixStock

> ⏳ **Nota sobre o carregamento:** Esta aplicação está hospedada no plano gratuito do Render. Devido à política de "spin-down" da plataforma, o servidor entra em modo de repouso após inatividade. **O primeiro acesso pode levar de 30 a 60 segundos para despertar o servidor.** Agradeço a paciência!

Sistema de Gestão de Ativos & Integração Estratégica com ERP Routerbox.

Este projeto foi desenvolvido para a **Trixnet** com o objetivo de centralizar o controle de equipamentos de rede e automatizar a sincronização com o ERP oficial da empresa.

---

### 🔗 Links Úteis
* 🌐 **Aplicação Online:** [Adicione o link aqui]
* 📄 **Documentação da API:** `Disponível sob consulta`

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
2. **Cadastro de Ativo:** Vá em "Cadastrar Equipamento" e preencha os campos (Marca, Modelo, Serial e MAC).
3. **Validação de Sincronização:** Após salvar, observe que o sistema aguarda a resposta da API do Routerbox. Se a integração for bem-sucedida, o item aparecerá na listagem com o status **"Sincronizado"** e o respectivo `rbx_id`.
4. **Filtros:** Utilize a barra de busca para filtrar por MAC ou Serial, simulando a busca rápida que os técnicos realizam no campo.
5. **Edição:** Tente alterar o status de um item (ex: de "Novo" para "Em Uso") e veja a atualização refletida.

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
![Cadastro](link_do_print_1)

#### 📌 Listagem de Equipamentos
![Listagem](link_do_print_2)

---

Desenvolvido por [Matheus Reis](https://matheusreisportfolio.netlify.app/) 🚀
