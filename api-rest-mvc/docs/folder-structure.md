# 📁 Estrutura de Pastas - API REST MVC

## 🎯 Visão Geral

Esta documentação detalha a organização e responsabilidades de cada pasta e arquivo no projeto, seguindo as melhores práticas de organização de código Node.js/Express.

## 📋 Estrutura Completa

```
api-rest-mvc/
├── 📄 README.md                    # Documentação principal do projeto
├── 📄 package.json                 # Configurações e dependências
├── 📄 .env.example                 # Exemplo de variáveis de ambiente
├── 📄 .gitignore                   # Arquivos ignorados pelo Git
├── 📄 test-api.http               # Testes HTTP para VS Code/REST Client
├── 📁 prisma/                     # Configurações do Prisma ORM
│   ├── 📄 schema.prisma           # Schema do banco de dados
│   └── 📁 migrations/             # Migrações do banco (geradas automaticamente)
├── 📁 src/                        # Código fonte da aplicação
│   ├── 📄 server.js               # Ponto de entrada da aplicação
│   ├── 📁 config/                 # Configurações da aplicação
│   │   └── 📄 swagger.js          # Configuração do Swagger/OpenAPI
│   ├── 📁 controllers/            # Camada de Controllers (HTTP)
│   │   ├── 📄 BaseController.js   # Controller base com métodos comuns
│   │   ├── 📄 ClienteController.js # Controller específico para Clientes
│   │   ├── 📄 ProdutoController.js # Controller específico para Produtos
│   │   ├── 📄 PedidoController.js  # Controller específico para Pedidos
│   │   └── 📄 index.js            # Exportação centralizada dos controllers
│   ├── 📁 services/               # Camada de Services (Lógica de Negócio)
│   │   ├── 📄 BaseService.js      # Service base com métodos comuns
│   │   ├── 📄 ClienteService.js   # Service específico para Clientes
│   │   ├── 📄 ProdutoService.js   # Service específico para Produtos
│   │   ├── 📄 PedidoService.js    # Service específico para Pedidos
│   │   └── 📄 index.js            # Exportação centralizada dos services
│   ├── 📁 models/                 # Camada de Models (Acesso a Dados)
│   │   ├── 📄 BaseModel.js        # Model base com métodos CRUD
│   │   ├── 📄 Cliente.js          # Model específico para Clientes
│   │   ├── 📄 Produto.js          # Model específico para Produtos
│   │   ├── 📄 Pedido.js           # Model específico para Pedidos
│   │   └── 📄 index.js            # Exportação centralizada dos models
│   ├── 📁 routes/                 # Definição de Rotas da API
│   │   ├── 📄 clienteRoutes.js    # Rotas específicas para Clientes
│   │   ├── 📄 produtoRoutes.js    # Rotas específicas para Produtos
│   │   ├── 📄 pedidoRoutes.js     # Rotas específicas para Pedidos
│   │   └── 📄 index.js            # Agregação e configuração das rotas
│   ├── 📁 middleware/             # Middlewares da aplicação
│   │   ├── 📄 validation.js       # Middlewares de validação (Zod)
│   │   ├── 📄 errorHandler.js     # Tratamento global de erros
│   │   └── 📄 logging.js          # Sistema de logging customizado
│   └── 📁 utils/                  # Utilitários e helpers
│       ├── 📄 prisma.js           # Cliente Prisma configurado
│       └── 📄 validation.js       # Schemas de validação (Zod)
└── 📁 docs/                       # Documentação do projeto
    ├── 📄 architecture.md         # Documentação arquitetural
    └── 📄 folder-structure.md     # Esta documentação
```

## 🔍 Detalhamento por Pasta

### **📁 `/` (Raiz do Projeto)**

#### **📄 `README.md`**
- **Responsabilidade:** Documentação principal do projeto
- **Conteúdo:** 
  - Visão geral da API
  - Instruções de instalação e configuração
  - Documentação de endpoints
  - Exemplos de uso
  - Informações de segurança
- **Importância:** Primeiro contato dos desenvolvedores com o projeto

#### **📄 `package.json`**
- **Responsabilidade:** Configuração do projeto Node.js
- **Conteúdo:**
  - Metadados do projeto
  - Dependências (dependencies e devDependencies)
  - Scripts de execução
  - Configurações do nodemon
- **Scripts Importantes:**
  - `npm run dev` - Desenvolvimento com hot reload
  - `npm start` - Produção
  - `npm run db:generate` - Gerar Prisma Client
  - `npm run db:migrate` - Executar migrações

#### **📄 `.env.example`**
- **Responsabilidade:** Template de variáveis de ambiente
- **Conteúdo:**
  - DATABASE_URL - URL do banco PostgreSQL
  - PORT - Porta do servidor
  - NODE_ENV - Ambiente de execução
  - LOG_LEVEL - Nível de logging

#### **📄 `test-api.http`**
- **Responsabilidade:** Testes HTTP para VS Code/REST Client
- **Conteúdo:** 40 cenários de teste cobrindo todos os endpoints
- **Uso:** Testes manuais e documentação de uso da API

### **📁 `/prisma`**

#### **📄 `schema.prisma`**
- **Responsabilidade:** Definição do schema do banco de dados
- **Conteúdo:**
  - Configuração do datasource (PostgreSQL)
  - Configuração do generator (Prisma Client)
  - Definição dos modelos: Cliente, Produto, Pedido, ItemPedido
  - Relacionamentos entre as entidades
  - Configurações de índices e constraints

#### **📁 `migrations/`**
- **Responsabilidade:** Histórico de mudanças no banco
- **Conteúdo:** Arquivos SQL gerados automaticamente pelo Prisma
- **Importância:** Versionamento do banco de dados

### **📁 `/src`**

#### **📄 `server.js`**
- **Responsabilidade:** Ponto de entrada da aplicação
- **Conteúdo:**
  - Configuração do Express
  - Middlewares globais
  - Configuração do Swagger
  - Montagem das rotas
  - Tratamento de erros
  - Inicialização do servidor

#### **📁 `/config`**

##### **📄 `swagger.js`**
- **Responsabilidade:** Configuração da documentação Swagger
- **Conteúdo:**
  - Definição OpenAPI 3.0
  - Schemas das entidades
  - Configuração de servidores
  - Informações de contato e licença

#### **📁 `/controllers`**

##### **📄 `BaseController.js`**
- **Responsabilidade:** Controller base com métodos comuns
- **Métodos:**
  - `getAll()` - Listar todos com paginação
  - `getById()` - Buscar por ID
  - `create()` - Criar novo registro
  - `update()` - Atualizar registro
  - `delete()` - Deletar registro
  - `count()` - Contar registros

##### **📄 `ClienteController.js`**
- **Responsabilidade:** Controller específico para Clientes
- **Métodos Específicos:**
  - `getByEmail()` - Buscar por email
  - `getByName()` - Buscar por nome
  - `getPedidos()` - Pedidos do cliente

##### **📄 `ProdutoController.js`**
- **Responsabilidade:** Controller específico para Produtos
- **Métodos Específicos:**
  - `getByName()` - Buscar por nome
  - `getByCategoria()` - Buscar por categoria
  - `getAtivos()` - Listar produtos ativos
  - `updateEstoque()` - Atualizar estoque
  - `toggleStatus()` - Ativar/desativar

##### **📄 `PedidoController.js`**
- **Responsabilidade:** Controller específico para Pedidos
- **Métodos Específicos:**
  - `getByStatus()` - Buscar por status
  - `getByCliente()` - Buscar por cliente
  - `updateStatus()` - Atualizar status
  - `addItem()` - Adicionar item
  - `removeItem()` - Remover item

##### **📄 `index.js`**
- **Responsabilidade:** Exportação centralizada dos controllers
- **Conteúdo:** Instâncias dos controllers para uso nas rotas

#### **📁 `/services`**

##### **📄 `BaseService.js`**
- **Responsabilidade:** Service base com lógica comum
- **Métodos:**
  - `findWithPagination()` - Busca com paginação
  - `validate()` - Validação de dados
  - `handleError()` - Tratamento de erros

##### **📄 `ClienteService.js`**
- **Responsabilidade:** Lógica de negócio para Clientes
- **Métodos Específicos:**
  - `emailExists()` - Verificar se email existe
  - `createCliente()` - Criar com validações
  - `updateCliente()` - Atualizar com validações
  - `findClientes()` - Busca com filtros

##### **📄 `ProdutoService.js`**
- **Responsabilidade:** Lógica de negócio para Produtos
- **Métodos Específicos:**
  - `nameExists()` - Verificar se nome existe
  - `hasStock()` - Verificar disponibilidade
  - `updateEstoque()` - Atualizar estoque com validação
  - `toggleStatus()` - Alternar status
  - `findProdutos()` - Busca com filtros

##### **📄 `PedidoService.js`**
- **Responsabilidade:** Lógica de negócio para Pedidos
- **Métodos Específicos:**
  - `validateItens()` - Validar itens do pedido
  - `createPedido()` - Criar com transação
  - `addItem()` - Adicionar item com validação de estoque
  - `removeItem()` - Remover item restaurando estoque
  - `updateStatus()` - Atualizar status com validações

##### **📄 `index.js`**
- **Responsabilidade:** Exportação centralizada dos services
- **Conteúdo:** Instâncias dos services para uso nos controllers

#### **📁 `/models`**

##### **📄 `BaseModel.js`**
- **Responsabilidade:** Model base com operações CRUD
- **Métodos:**
  - `findAll()` - Listar todos
  - `findById()` - Buscar por ID
  - `findOne()` - Buscar um registro
  - `count()` - Contar registros
  - `create()` - Criar registro
  - `update()` - Atualizar registro
  - `delete()` - Deletar registro
  - `transaction()` - Executar transação

##### **📄 `Cliente.js`**
- **Responsabilidade:** Acesso a dados para Clientes
- **Métodos Específicos:**
  - `findByEmail()` - Buscar por email
  - `findByName()` - Buscar por nome

##### **📄 `Produto.js`**
- **Responsabilidade:** Acesso a dados para Produtos
- **Métodos Específicos:**
  - `findByName()` - Buscar por nome
  - `findByCategoria()` - Buscar por categoria
  - `findAtivos()` - Listar produtos ativos
  - `updateEstoque()` - Atualizar estoque

##### **📄 `Pedido.js`**
- **Responsabilidade:** Acesso a dados para Pedidos
- **Métodos Específicos:**
  - `findByCliente()` - Buscar por cliente
  - `findByStatus()` - Buscar por status
  - `create()` - Criar com itens (override)
  - `addItem()` - Adicionar item
  - `removeItem()` - Remover item
  - `updateTotal()` - Atualizar total

##### **📄 `index.js`**
- **Responsabilidade:** Exportação centralizada dos models
- **Conteúdo:** Instâncias dos models para uso nos services

#### **📁 `/routes`**

##### **📄 `clienteRoutes.js`**
- **Responsabilidade:** Definição das rotas para Clientes
- **Rotas:**
  - `GET /clientes` - Listar todos
  - `GET /clientes/:id` - Buscar por ID
  - `POST /clientes` - Criar cliente
  - `PUT /clientes/:id` - Atualizar cliente
  - `DELETE /clientes/:id` - Deletar cliente
  - `GET /clientes/email/:email` - Buscar por email
  - `GET /clientes/nome/:nome` - Buscar por nome
  - `GET /clientes/:id/pedidos` - Pedidos do cliente

##### **📄 `produtoRoutes.js`**
- **Responsabilidade:** Definição das rotas para Produtos
- **Rotas:**
  - `GET /produtos` - Listar todos
  - `GET /produtos/:id` - Buscar por ID
  - `POST /produtos` - Criar produto
  - `PUT /produtos/:id` - Atualizar produto
  - `DELETE /produtos/:id` - Deletar produto
  - `GET /produtos/nome/:nome` - Buscar por nome
  - `GET /produtos/categoria/:categoria` - Buscar por categoria
  - `GET /produtos/ativos` - Listar ativos
  - `PATCH /produtos/:id/estoque` - Atualizar estoque
  - `PATCH /produtos/:id/toggle-status` - Alternar status

##### **📄 `pedidoRoutes.js`**
- **Responsabilidade:** Definição das rotas para Pedidos
- **Rotas:**
  - `GET /pedidos` - Listar todos
  - `GET /pedidos/:id` - Buscar por ID
  - `POST /pedidos` - Criar pedido
  - `PUT /pedidos/:id` - Atualizar pedido
  - `DELETE /pedidos/:id` - Deletar pedido
  - `GET /pedidos/status/:status` - Buscar por status
  - `GET /pedidos/cliente/:clienteId` - Buscar por cliente
  - `PATCH /pedidos/:id/status` - Atualizar status
  - `POST /pedidos/:id/itens` - Adicionar item
  - `DELETE /pedidos/:id/itens/:itemId` - Remover item

##### **📄 `index.js`**
- **Responsabilidade:** Agregação e configuração das rotas
- **Conteúdo:**
  - Importação das rotas específicas
  - Configuração do prefixo `/api/v1`
  - Rotas de documentação e health check

#### **📁 `/middleware`**

##### **📄 `validation.js`**
- **Responsabilidade:** Middlewares de validação
- **Middlewares:**
  - `validateId` - Validação de IDs UUID
  - `validateQuery` - Validação de query parameters
  - `validatePagination` - Validação de paginação
  - `validateOrderBy` - Validação de ordenação
  - `validateRateLimit` - Rate limiting
  - `validatePayloadSize` - Limite de tamanho
  - `sanitizeInput` - Sanitização XSS

##### **📄 `errorHandler.js`**
- **Responsabilidade:** Tratamento global de erros
- **Componentes:**
  - `AppError` - Classe de erro customizada
  - `errorHandler` - Middleware de tratamento
  - `asyncHandler` - Wrapper para async functions
  - `unhandledErrorHandler` - Tratamento de erros não capturados

##### **📄 `logging.js`**
- **Responsabilidade:** Sistema de logging customizado
- **Componentes:**
  - `loggingMiddleware` - Log de requisições/respostas
  - `errorLoggingMiddleware` - Log de erros
  - Configuração de arquivos de log

#### **📁 `/utils`**

##### **📄 `prisma.js`**
- **Responsabilidade:** Configuração do cliente Prisma
- **Conteúdo:**
  - Instância do PrismaClient
  - Configuração de logging
  - Handlers de conexão/desconexão

##### **📄 `validation.js`**
- **Responsabilidade:** Schemas de validação Zod
- **Schemas:**
  - `clienteSchema` - Validação de cliente
  - `produtoSchema` - Validação de produto
  - `pedidoSchema` - Validação de pedido
  - `itemPedidoSchema` - Validação de item
  - `validate` - Middleware de validação

### **📁 `/docs`**

#### **📄 `architecture.md`**
- **Responsabilidade:** Documentação arquitetural completa
- **Conteúdo:**
  - Visão geral da arquitetura
  - Diagramas de componentes
  - Fluxo de dados
  - Padrões utilizados
  - Decisões arquiteturais

#### **📄 `folder-structure.md`**
- **Responsabilidade:** Esta documentação
- **Conteúdo:** Detalhamento completo da estrutura de pastas

## 🎯 Princípios de Organização

### **1. Separação de Responsabilidades**
- Cada pasta tem uma responsabilidade específica
- Controllers só lidam com HTTP
- Services só lidam com lógica de negócio
- Models só lidam com acesso a dados

### **2. Herança e Reutilização**
- Base classes para funcionalidades comuns
- Redução de código duplicado
- Consistência entre entidades

### **3. Modularidade**
- Cada entidade é independente
- Fácil adição de novas funcionalidades
- Manutenção simplificada

### **4. Escalabilidade**
- Estrutura preparada para crescimento
- Fácil adição de novas entidades
- Middlewares reutilizáveis

### **5. Documentação**
- README principal para visão geral
- Documentação técnica separada
- Exemplos práticos de uso

## 🔄 Fluxo de Dependências

```
Routes → Controllers → Services → Models → Prisma → Database
   ↓         ↓          ↓         ↓
Middleware → Validation → Error Handling → Response
```

## 📝 Convenções de Nomenclatura

### **Arquivos:**
- **Controllers:** `PascalCaseController.js`
- **Services:** `PascalCaseService.js`
- **Models:** `PascalCase.js`
- **Routes:** `camelCaseRoutes.js`
- **Middlewares:** `camelCase.js`
- **Utils:** `camelCase.js`

### **Pastas:**
- **Plural:** `controllers/`, `services/`, `models/`, `routes/`
- **Singular:** `middleware/`, `utils/`, `config/`, `docs/`

### **Variáveis:**
- **Instâncias:** `clienteController`, `produtoService`
- **Classes:** `ClienteController`, `ProdutoService`
- **Métodos:** `camelCase()`
- **Constantes:** `UPPER_SNAKE_CASE`

---

**Esta estrutura foi projetada para ser clara, organizada e fácil de navegar, facilitando o desenvolvimento e manutenção da aplicação.**
