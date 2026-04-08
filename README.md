TrixStock - Gestão de Ativos & Integração ERP
Este repositório contém o código-fonte do TrixStock, um sistema robusto desenvolvido para a empresa Trixnet com o objetivo de gerenciar o inventário de ativos de rede (ONTs, Roteadores, Switche, etc.). O grande diferencial deste projeto é a sincronização em tempo real com o ERP Routerbox, garantindo que o estoque físico e o sistema financeiro/administrativo da empresa estejam sempre alinhados.

Aviso de Sandbox: Para proteger os dados reais da empresa e a integridade do ERP, este repositório está configurado em modo Sandbox. As requisições de API são direcionadas para um ambiente de homologação e as chaves de produção estão protegidas via variáveis de ambiente.

Link do App
https://trixstock-demo.netlify.app/ (Substitua pelo seu link real)

Como acessar (Modo Recrutador)
Usuário: testerecrutador@trixnet.com.br

Senha: 12345678

(Dados de teste são resetados periodicamente)

Demonstração
Visão Geral
O sistema resolve o problema de duplicidade de trabalho ao cadastrar equipamentos em duas plataformas diferentes.

Dashboard de Inventário:

Visualização clara do saldo de equipamentos em estoque.

Filtros por categoria, marca e status (Novo, Usado, Defeito).

Cadastro com "Double-Write":

Ao cadastrar um item no TrixStock, o sistema envia automaticamente os dados para o Routerbox via API.

O sistema aguarda o retorno do ID oficial do ERP e o persiste no banco local (rbx_id), garantindo a integridade referencial entre os sistemas.

Controle de Seriais e MAC:

Validação rigorosa de endereços MAC e números de série para evitar entradas duplicadas de hardware no campo.

Funcionalidades Técnicas
Integração de APIs: Consumo de API REST utilizando Axios com tratamento de erros e retentativas assíncronas.

Sincronização de IDs Externos: Lógica de backend para vincular registros locais a IDs de sistemas de terceiros.

Ambiente Isolado: Separação total entre ambiente de desenvolvimento, homologação e produção via .env.

Tecnologias Utilizadas
Este projeto foi construído com foco em escalabilidade e performance:

Backend: Node.js, Express.js.

ORM: Sequelize (Manipulação de PostgreSQL/MySQL).

Frontend: React, Tailwind CSS.

Integração: Axios para comunicação com API Routerbox.

Containerização: Docker e Docker Compose.

O Gemini disse
Perfeito, Matheus! Vamos adaptar esse modelo para o TrixStock. Note que usei termos que reforçam a segurança (Sandbox), a integração e o fato de ser uma solução real para a empresa, exatamente como discutimos.

Aqui está o conteúdo do seu README.md pronto para copiar:

TrixStock - Gestão de Ativos & Integração ERP
Este repositório contém o código-fonte do TrixStock, um sistema robusto desenvolvido para a empresa Trixnet com o objetivo de gerenciar o inventário de ativos de rede (ONTs, Roteadores, Switche, etc.). O grande diferencial deste projeto é a sincronização em tempo real com o ERP Routerbox, garantindo que o estoque físico e o sistema financeiro/administrativo da empresa estejam sempre alinhados.

Aviso de Sandbox: Para proteger os dados reais da empresa e a integridade do ERP, este repositório está configurado em modo Sandbox. As requisições de API são direcionadas para um ambiente de homologação e as chaves de produção estão protegidas via variáveis de ambiente.

Link do App
https://trixstock-demo.netlify.app/ (Substitua pelo seu link real)

Como acessar (Modo Recrutador)
Usuário: testerecrutador@trixnet.com.br

Senha: 12345678

(Dados de teste são resetados periodicamente)

Demonstração
Visão Geral
O sistema resolve o problema de duplicidade de trabalho ao cadastrar equipamentos em duas plataformas diferentes.

Dashboard de Inventário:

Visualização clara do saldo de equipamentos em estoque.

Filtros por categoria, marca e status (Novo, Usado, Defeito).

Cadastro com "Double-Write":

Ao cadastrar um item no TrixStock, o sistema envia automaticamente os dados para o Routerbox via API.

O sistema aguarda o retorno do ID oficial do ERP e o persiste no banco local (rbx_id), garantindo a integridade referencial entre os sistemas.

Controle de Seriais e MAC:

Validação rigorosa de endereços MAC e números de série para evitar entradas duplicadas de hardware no campo.

Funcionalidades Técnicas
Integração de APIs: Consumo de API REST utilizando Axios com tratamento de erros e retentativas assíncronas.

Sincronização de IDs Externos: Lógica de backend para vincular registros locais a IDs de sistemas de terceiros.

Ambiente Isolado: Separação total entre ambiente de desenvolvimento, homologação e produção via .env.

Tecnologias Utilizadas
Este projeto foi construído com foco em escalabilidade e performance:

Backend: Node.js, Express.js.

ORM: Sequelize (Manipulação de PostgreSQL/MySQL).

Frontend: React, Tailwind CSS.

Integração: Axios para comunicação com API Routerbox.

Containerização: Docker e Docker Compose.

Automação: Fluxos de trabalho auxiliados por n8n.

Como Rodar o Projeto
Pré-requisitos
Node.js instalado

Docker (opcional, para o banco de dados)

Passos
Clone o repositório:

Bash
git clone https://github.com/mhre1s/trixstock.git
Instale as dependências:

Bash
npm install
Configure as variáveis de ambiente (copie o .env.example):

Bash
cp .env.example .env
Inicie o projeto:

Bash
npm run dev
Contribuição
Este é um projeto proprietário desenvolvido para fins de otimização interna, mas sugestões de arquitetura e segurança são sempre bem-vindas via issues.

Desenvolvido com foco em eficiência por Matheus Reis.
