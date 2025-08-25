# 🏗️ Documentação Arquitetural - API REST MVC

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura de Alto Nível](#arquitetura-de-alto-nível)
- [Diagrama de Componentes](#diagrama-de-componentes)
- [Fluxo de Dados](#fluxo-de-dados)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Padrões Utilizados](#padrões-utilizados)
- [Decisões Arquiteturais](#decisões-arquiteturais)

## 🎯 Visão Geral

A API REST MVC foi desenvolvida seguindo o padrão arquitetural **MVC (Model-View-Controller)** adaptado para APIs REST, com separação clara de responsabilidades e herança para reutilização de código.

### **Stack Tecnológica:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Banco:** PostgreSQL (Neon)
- **Validação:** Zod
- **Documentação:** Swagger/OpenAPI

## 🏛️ Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend/Mobile)                │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    API REST MVC                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   MIDDLEWARES   │  │     ROUTES      │  │  CONTROLLERS │ │
│  │                 │  │                 │  │              │ │
│  │ • CORS          │  │ • Cliente       │  │ • Cliente    │ │
│  │ • Helmet        │  │ • Produto       │  │ • Produto    │ │
│  │ • Morgan        │  │ • Pedido        │  │ • Pedido     │ │
│  │ • Rate Limiting │  │ • Health        │  │ • Base       │ │
│  │ • Validation    │  │ • Swagger       │  │              │ │
│  │ • Sanitization  │  │                 │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│           │                     │                    │      │
│           └─────────────────────┼────────────────────┘      │
│                                 │                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │    SERVICES     │  │     MODELS      │  │    UTILS     │ │
│  │                 │  │                 │  │              │ │
│  │ • Cliente       │  │ • Cliente       │  │ • Prisma     │ │
│  │ • Produto       │  │ • Produto       │  │ • Validation │ │
│  │ • Pedido        │  │ • Pedido        │  │ • Error      │ │
│  │ • Base          │  │ • Base          │  │ • Logging    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │ Prisma Client
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   POSTGRESQL (NEON)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │   CLIENTES   │  │   PRODUTOS   │  │      PEDIDOS       │ │
│  │              │  │              │  │                    │ │
│  │ • id         │  │ • id         │  │ • id               │ │
│  │ • nome       │  │ • nome       │  │ • clienteId        │ │
│  │ • email      │  │ • descricao  │  │ • status           │ │
│  │ • telefone   │  │ • preco      │  │ • total            │ │
│  │ • endereco   │  │ • estoque    │  │ • observacao       │ │
│  │ • timestamps │  │ • categoria  │  │ • timestamps       │ │
│  │              │  │ • ativo      │  │ • itensPedido[]    │ │
│  │              │  │ • timestamps │  │                    │ │
│  └──────────────┘  └──────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Diagrama de Componentes

### **Hierarquia de Herança:**

```
┌─────────────────────────────────────────────────────────────┐
│                    BASE CLASSES                             │
├─────────────────────────────────────────────────────────────┤
│  BaseModel          BaseService          BaseController     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ findAll()   │    │ findWith-   │    │ getAll()    │     │
│  │ findById()  │    │ Pagination()│    │ getById()   │     │
│  │ create()    │    │ validate()  │    │ create()    │     │
│  │ update()    │    │ handleError()│   │ update()    │     │
│  │ delete()    │    │             │    │ delete()    │     │
│  │ transaction()│   │             │    │ count()     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         ▲                   ▲                   ▲          │
│         │                   │                   │          │
│         │                   │                   │          │
├─────────┼───────────────────┼───────────────────┼──────────┤
│         │                   │                   │          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ ClienteModel│    │ClienteService│   │ClienteController│  │
│  │ findByEmail()│   │ emailExists()│   │ getByEmail()│     │
│  │ findByName() │   │ createCliente()│ │ getByName() │     │
│  └─────────────┘    │ updateCliente()│ │ getPedidos()│     │
│                     └─────────────┘    └─────────────┘     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ ProdutoModel│    │ProdutoService│   │ProdutoController│ │
│  │ findByName()│    │ nameExists()│    │ getByName() │     │
│  │ findByCategoria()││ hasStock() │    │ getByCategoria()│ │
│  │ findAtivos()│    │ updateEstoque()│ │ getAtivos() │     │
│  │ updateEstoque()│ │ toggleStatus()│  │ updateEstoque()│  │
│  └─────────────┘    └─────────────┘    │ toggleStatus()│  │
│                                        └─────────────┘     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ PedidoModel │    │PedidoService│    │PedidoController│  │
│  │ findByCliente()│ │ validateItens()│ │ getByStatus()│    │
│  │ findByStatus()│  │ createPedido()│  │ getByCliente()│   │
│  │ create()     │   │ addItem()    │   │ updateStatus()│   │
│  │ addItem()    │   │ removeItem() │   │ addItem()    │    │
│  │ removeItem() │   │ updateStatus()│  │ removeItem() │    │
│  │ updateTotal()│   │             │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### **Fluxo Típico de uma Requisição:**

```
1. CLIENTE ENVIA REQUISIÇÃO
   ┌─────────────────────────────────────────────────────────┐
   │ POST /api/v1/clientes                                  │
   │ { "nome": "João", "email": "joao@email.com" }          │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
2. MIDDLEWARES DE SEGURANÇA
   ┌─────────────────────────────────────────────────────────┐
   │ • CORS - Verifica origem                               │
   │ • Helmet - Headers de segurança                        │
   │ • Rate Limiting - Controle de requisições              │
   │ • Payload Size - Tamanho do body                       │
   │ • Sanitize Input - Remove XSS                          │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
3. MIDDLEWARES DE PROCESSAMENTO
   ┌─────────────────────────────────────────────────────────┐
   │ • Morgan - Log da requisição                           │
   │ • express.json() - Parse do JSON                       │
   │ • Validation - Validação Zod                           │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
4. ROUTE HANDLER
   ┌─────────────────────────────────────────────────────────┐
   │ router.post('/clientes', validate(clienteSchema),      │
   │            clienteController.create)                   │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
5. CONTROLLER
   ┌─────────────────────────────────────────────────────────┐
   │ ClienteController.create(req, res) {                   │
   │   const result = await clienteService.createCliente(   │
   │     req.body                                           │
   │   );                                                   │
   │   res.status(201).json(result);                       │
   │ }                                                      │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
6. SERVICE (LÓGICA DE NEGÓCIO)
   ┌─────────────────────────────────────────────────────────┐
   │ ClienteService.createCliente(data) {                   │
   │   // Validações de negócio                             │
   │   if (await this.emailExists(data.email)) {            │
   │     throw new AppError('Email já cadastrado');         │
   │   }                                                    │
   │   // Criação via model                                 │
   │   return await clienteModel.create(data);              │
   │ }                                                      │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
7. MODEL (ACESSO A DADOS)
   ┌─────────────────────────────────────────────────────────┐
   │ ClienteModel.create(data) {                            │
   │   return await prisma.cliente.create({                 │
   │     data: {                                            │
   │       nome: data.nome,                                 │
   │       email: data.email,                               │
   │       telefone: data.telefone,                         │
   │       endereco: data.endereco                          │
   │     }                                                  │
   │   });                                                  │
   │ }                                                      │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
8. PRISMA CLIENT
   ┌─────────────────────────────────────────────────────────┐
   │ • Gera SQL otimizado                                   │
   │ • Executa no PostgreSQL                                │
   │ • Retorna dados formatados                             │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
9. RESPOSTA
   ┌─────────────────────────────────────────────────────────┐
   │ HTTP/1.1 201 Created                                   │
   │ Content-Type: application/json                         │
   │                                                        │
   │ {                                                      │
   │   "success": true,                                     │
   │   "data": {                                            │
   │     "id": "uuid",                                      │
   │     "nome": "João",                                    │
   │     "email": "joao@email.com",                         │
   │     "createdAt": "2024-01-15T..."                      │
   │   },                                                   │
   │   "message": "Cliente criado com sucesso"              │
   │ }                                                      │
   └─────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Pastas

```
api-rest-mvc/
├── 📄 README.md                    # Documentação principal
├── 📄 package.json                 # Dependências e scripts
├── 📄 .env.example                 # Exemplo de variáveis
├── 📄 test-api.http               # Testes HTTP
├── 📁 prisma/
│   ├── 📄 schema.prisma           # Schema do banco
│   └── 📁 migrations/             # Migrações do banco
├── 📁 src/
│   ├── 📄 server.js               # Servidor principal
│   ├── 📁 config/
│   │   └── 📄 swagger.js          # Configuração Swagger
│   ├── 📁 controllers/            # Camada HTTP
│   │   ├── 📄 BaseController.js   # Controller base
│   │   ├── 📄 ClienteController.js
│   │   ├── 📄 ProdutoController.js
│   │   ├── 📄 PedidoController.js
│   │   └── 📄 index.js
│   ├── 📁 services/               # Lógica de negócio
│   │   ├── 📄 BaseService.js      # Service base
│   │   ├── 📄 ClienteService.js
│   │   ├── 📄 ProdutoService.js
│   │   ├── 📄 PedidoService.js
│   │   └── 📄 index.js
│   ├── 📁 models/                 # Camada de dados
│   │   ├── 📄 BaseModel.js        # Model base
│   │   ├── 📄 Cliente.js
│   │   ├── 📄 Produto.js
│   │   ├── 📄 Pedido.js
│   │   └── 📄 index.js
│   ├── 📁 routes/                 # Definição de rotas
│   │   ├── 📄 clienteRoutes.js
│   │   ├── 📄 produtoRoutes.js
│   │   ├── 📄 pedidoRoutes.js
│   │   └── 📄 index.js
│   ├── 📁 middleware/             # Middlewares
│   │   ├── 📄 validation.js       # Validação Zod
│   │   ├── 📄 errorHandler.js     # Tratamento de erros
│   │   └── 📄 logging.js          # Sistema de logs
│   └── 📁 utils/                  # Utilitários
│       ├── 📄 prisma.js           # Cliente Prisma
│       └── 📄 validation.js       # Schemas Zod
└── 📁 docs/
    └── 📄 architecture.md         # Esta documentação
```

## 🎨 Padrões Utilizados

### **1. Padrão MVC (Model-View-Controller)**
- **Model:** Responsável pelo acesso a dados (Prisma)
- **View:** Representado pelas respostas JSON da API
- **Controller:** Gerencia requisições HTTP e delega para Services

### **2. Padrão Service Layer**
- **Services:** Encapsulam lógica de negócio
- **Separação:** Controllers só lidam com HTTP, Services com regras
- **Reutilização:** Lógica compartilhada entre diferentes endpoints

### **3. Padrão Repository (via Prisma)**
- **Models:** Abstraem acesso ao banco de dados
- **Prisma:** ORM que implementa o padrão Repository
- **Transações:** Suporte a operações complexas

### **4. Padrão Factory (Base Classes)**
- **BaseModel:** Factory para operações CRUD
- **BaseService:** Factory para lógica de negócio
- **BaseController:** Factory para respostas HTTP

### **5. Padrão Middleware Chain**
- **Pipeline:** Requisições passam por múltiplos middlewares
- **Responsabilidades:** Cada middleware tem uma função específica
- **Composição:** Middlewares podem ser combinados

## 🏗️ Decisões Arquiteturais

### **1. Por que MVC?**
- ✅ **Separação clara** de responsabilidades
- ✅ **Manutenibilidade** e escalabilidade
- ✅ **Testabilidade** de cada camada
- ✅ **Reutilização** de código

### **2. Por que Services?**
- ✅ **Lógica de negócio** centralizada
- ✅ **Controllers** focados em HTTP
- ✅ **Reutilização** entre endpoints
- ✅ **Testes unitários** facilitados

### **3. Por que Prisma?**
- ✅ **Type safety** com TypeScript
- ✅ **Migrations** automáticas
- ✅ **Query builder** intuitivo
- ✅ **Relacionamentos** fáceis

### **4. Por que Zod?**
- ✅ **Validação** em runtime
- ✅ **Type inference** automático
- ✅ **Mensagens** de erro customizáveis
- ✅ **Schemas** reutilizáveis

### **5. Por que Herança?**
- ✅ **DRY** (Don't Repeat Yourself)
- ✅ **Consistência** entre entidades
- ✅ **Manutenção** simplificada
- ✅ **Extensibilidade** facilitada

## 🔒 Segurança

### **Camadas de Segurança Implementadas:**

1. **Helmet.js** - Headers de segurança
2. **CORS** - Controle de origem
3. **Rate Limiting** - Proteção contra spam
4. **Payload Size** - Limite de tamanho
5. **XSS Prevention** - Sanitização de input
6. **Zod Validation** - Validação de dados
7. **Error Handling** - Não exposição de detalhes internos

## 📊 Performance

### **Otimizações Implementadas:**

1. **Paginação** - Controle de volume de dados
2. **Indexação** - Chaves primárias e estrangeiras
3. **Queries Otimizadas** - Via Prisma
4. **Caching** - Preparado para implementação
5. **Compression** - Via Express
6. **Logging Eficiente** - Apenas em produção

## 🚀 Escalabilidade

### **Preparado para Crescimento:**

1. **Modularidade** - Cada entidade independente
2. **Base Classes** - Fácil adição de novas entidades
3. **Middleware Chain** - Fácil adição de funcionalidades
4. **Database** - PostgreSQL escalável
5. **Stateless** - Pronto para load balancing
6. **Documentação** - Swagger para integração

---

**Esta arquitetura foi projetada para ser robusta, escalável e fácil de manter, seguindo as melhores práticas de desenvolvimento de APIs REST.**
