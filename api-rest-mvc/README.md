# API REST MVC - Clientes, Produtos e Pedidos

API REST desenvolvida com Node.js/Express seguindo o padrão arquitetural MVC para gerenciamento de Clientes, Produtos e Pedidos.

## 🏗️ Arquitetura

- **Padrão:** MVC (Model-View-Controller)
- **Framework:** Express.js
- **Persistência:** JSON Files
- **Validação:** Middleware customizado

## 📁 Estrutura do Projeto

```
api-rest-mvc/
├── src/
│   ├── models/          # Entidades (Cliente, Produto, Pedido)
│   ├── controllers/     # Controladores REST
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── middleware/      # Middlewares customizados
│   ├── utils/           # Utilitários
│   ├── data/            # Arquivos JSON de persistência
│   └── server.js        # Servidor principal
├── package.json
└── README.md
```

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações do Neon

# Executar em desenvolvimento (com nodemon)
npm run dev

# Executar em produção
npm start

# Comandos do Prisma
npm run db:generate  # Gerar Prisma Client
npm run db:migrate   # Executar migrations
npm run db:push      # Push do schema
npm run db:studio    # Abrir Prisma Studio
```

## 📡 Endpoints

### Health Check
- `GET /health` - Status da API

### Clientes
- `GET /api/clientes` - Listar todos
- `GET /api/clientes/:id` - Buscar por ID
- `GET /api/clientes/nome/:nome` - Buscar por nome
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Excluir cliente
- `GET /api/clientes/count` - Contar total

### Produtos
- `GET /api/produtos` - Listar todos
- `GET /api/produtos/:id` - Buscar por ID
- `GET /api/produtos/nome/:nome` - Buscar por nome
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto
- `GET /api/produtos/count` - Contar total

### Pedidos
- `GET /api/pedidos` - Listar todos
- `GET /api/pedidos/:id` - Buscar por ID
- `GET /api/pedidos/cliente/:clienteId` - Buscar por cliente
- `GET /api/pedidos/status/:status` - Buscar por status
- `POST /api/pedidos` - Criar pedido
- `PUT /api/pedidos/:id` - Atualizar pedido
- `DELETE /api/pedidos/:id` - Excluir pedido
- `GET /api/pedidos/count` - Contar total

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados (Neon)
- **Prisma** - ORM
- **Zod** - Validação de schemas
- **dotenv** - Variáveis de ambiente
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Segurança
- **Morgan** - Logging
- **UUID** - Geração de IDs únicos

## 📊 Status do Desenvolvimento

- [x] Setup inicial
- [ ] Models (Cliente, Produto, Pedido)
- [ ] Services
- [ ] Controllers
- [ ] Routes
- [ ] Testes
- [ ] Documentação
