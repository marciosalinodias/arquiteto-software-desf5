# 🚀 API REST MVC - Clientes, Produtos e Pedidos

Uma API REST completa desenvolvida com Node.js, Express e Prisma, seguindo o padrão arquitetural MVC para gerenciamento de clientes, produtos e pedidos.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Endpoints](#-endpoints)
- [Exemplos](#-exemplos)
- [Segurança](#-segurança)
- [Logs](#-logs)
- [Contribuição](#-contribuição)

## ✨ Características

- **🔧 Arquitetura MVC** - Separação clara de responsabilidades
- **🛡️ Segurança** - Validação, sanitização e rate limiting
- **📊 Banco de Dados** - PostgreSQL com Prisma ORM
- **✅ Validação** - Zod schemas para validação robusta
- **📝 Logging** - Sistema completo de logs
- **🔄 Relacionamentos** - Cliente → Pedidos → Produtos
- **📦 Controle de Estoque** - Automático e em tempo real
- **🎯 Paginação** - Suporte a paginação e filtros
- **🛡️ XSS Prevention** - Proteção contra ataques XSS

## 🛠️ Tecnologias

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Banco:** PostgreSQL (Neon)
- **Validação:** Zod
- **Segurança:** Helmet, CORS
- **Logging:** Morgan + Custom Logger

## 🏗️ Arquitetura

```
src/
├── controllers/     # Camada HTTP (Request/Response)
├── services/        # Lógica de Negócio
├── models/          # Camada de Dados (Prisma)
├── routes/          # Definição de Rotas
├── middleware/      # Middlewares (Validação, Logging, etc.)
├── utils/           # Utilitários (Prisma Client, Validação)
└── server.js        # Servidor Principal
```

### **Padrão MVC Implementado:**

- **Models:** Herdam do Prisma Client, operações de banco
- **Services:** Lógica de negócio, validações, relacionamentos
- **Controllers:** HTTP, tratamento de erros, respostas padronizadas
- **Routes:** Definição de endpoints, middlewares de validação

## 🚀 Instalação

### **Pré-requisitos:**
- Node.js 16+
- PostgreSQL (ou Neon)
- npm ou yarn

### **Clone e instale:**
```bash
git clone <repository-url>
cd api-rest-mvc
npm install
```

## 🚀 Deploy na Vercel

Para fazer deploy na Vercel, consulte o [Guia de Deploy](./DEPLOY.md).

### **Deploy Rápido:**
1. Conecte seu repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## ⚙️ Configuração

### **1. Variáveis de Ambiente:**
Crie um arquivo `.env` baseado no `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Server
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
```

### **2. Banco de Dados:**
```bash
# Gerar Prisma Client
npm run db:generate

# Executar migrations
npm run db:migrate

# (Opcional) Visualizar dados
npm run db:studio
```

## 🎯 Uso

### **Desenvolvimento:**
```bash
npm run dev
```

### **Produção:**
```bash
npm start
```

### **Health Check:**
```bash
curl http://localhost:3000/health
```

## 📡 Endpoints

### **Base URL:** `http://localhost:3000/api/v1`

### **👥 Clientes (`/clientes`)**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/clientes` | Listar clientes (com filtros) |
| `GET` | `/clientes/count` | Contar clientes |
| `GET` | `/clientes/:id` | Buscar cliente por ID |
| `POST` | `/clientes` | Criar cliente |
| `PUT` | `/clientes/:id` | Atualizar cliente |
| `DELETE` | `/clientes/:id` | Deletar cliente |
| `GET` | `/clientes/email/:email` | Buscar por email |
| `GET` | `/clientes/nome/:nome` | Buscar por nome |
| `GET` | `/clientes/:id/pedidos` | Pedidos do cliente |

### **📦 Produtos (`/produtos`)**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/produtos` | Listar produtos (com filtros) |
| `GET` | `/produtos/count` | Contar produtos |
| `GET` | `/produtos/:id` | Buscar produto por ID |
| `POST` | `/produtos` | Criar produto |
| `PUT` | `/produtos/:id` | Atualizar produto |
| `DELETE` | `/produtos/:id` | Deletar produto |
| `GET` | `/produtos/nome/:nome` | Buscar por nome |
| `GET` | `/produtos/categoria/:categoria` | Buscar por categoria |
| `GET` | `/produtos/ativos` | Produtos ativos |
| `PATCH` | `/produtos/:id/estoque` | Atualizar estoque |
| `PATCH` | `/produtos/:id/toggle-status` | Ativar/Desativar |

### **🛒 Pedidos (`/pedidos`)**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/pedidos` | Listar pedidos (com filtros) |
| `GET` | `/pedidos/count` | Contar pedidos |
| `GET` | `/pedidos/:id` | Buscar pedido por ID |
| `POST` | `/pedidos` | Criar pedido |
| `PUT` | `/pedidos/:id` | Atualizar pedido |
| `DELETE` | `/pedidos/:id` | Deletar pedido |
| `GET` | `/pedidos/status/:status` | Pedidos por status |
| `GET` | `/pedidos/cliente/:clienteId` | Pedidos do cliente |
| `PATCH` | `/pedidos/:id/status` | Atualizar status |
| `POST` | `/pedidos/:id/itens` | Adicionar item |
| `DELETE` | `/pedidos/:id/itens/:itemId` | Remover item |

## 💡 Exemplos

### **Criar Cliente:**
```bash
curl -X POST http://localhost:3000/api/v1/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "endereco": "Rua das Flores, 123"
  }'
```

### **Criar Produto:**
```bash
curl -X POST http://localhost:3000/api/v1/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Dell",
    "descricao": "Notebook Dell Inspiron 15",
    "preco": 2999.99,
    "estoque": 10,
    "categoria": "Eletrônicos"
  }'
```

### **Criar Pedido:**
```bash
curl -X POST http://localhost:3000/api/v1/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": "uuid-do-cliente",
    "itens": [
      {
        "produtoId": "uuid-do-produto",
        "quantidade": 2,
        "precoUnitario": 2999.99
      }
    ],
    "observacao": "Entregar no período da tarde"
  }'
```

### **Listar com Filtros:**
```bash
# Clientes com paginação
curl "http://localhost:3000/api/v1/clientes?skip=0&take=10&nome=João"

# Produtos por categoria
curl "http://localhost:3000/api/v1/produtos?categoria=Eletrônicos&ativo=true"

# Pedidos por status
curl "http://localhost:3000/api/v1/pedidos?status=PENDENTE"
```

## 🛡️ Segurança

### **Validações Implementadas:**
- ✅ **Zod Schemas** - Validação de tipos e formatos
- ✅ **Sanitização XSS** - Remoção de tags HTML maliciosas
- ✅ **Rate Limiting** - 100 requisições por minuto
- ✅ **Payload Size** - Limite de 10MB por requisição
- ✅ **Helmet.js** - Headers de segurança
- ✅ **CORS** - Controle de origem

### **Exemplo de Validação:**
```javascript
// Schema de validação
const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  endereco: z.string().optional()
});
```

## 📝 Logs

### **Estrutura de Logs:**
```
logs/
├── api-2024-01-15.log
├── api-2024-01-16.log
└── api-2024-01-17.log
```

### **Formato do Log:**
```
[2024-01-15T10:30:45.123Z] POST /api/v1/clientes 201 245 - 45ms - 192.168.1.1 - Mozilla/5.0...
```

### **Logs de Erro:**
```
[2024-01-15T10:30:45.123Z] POST /api/v1/clientes 400 0 - 12ms - 192.168.1.1 - Mozilla/5.0... - ERROR: Email já cadastrado
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor com nodemon

# Produção
npm start            # Servidor de produção

# Banco de Dados
npm run db:generate  # Gerar Prisma Client
npm run db:migrate   # Executar migrations
npm run db:studio    # Abrir Prisma Studio
npm run db:push      # Push do schema

# Testes
npm test             # Executar testes
```

## 📊 Respostas da API

### **Sucesso:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

### **Erro:**
```json
{
  "success": false,
  "error": "Tipo do erro",
  "message": "Descrição do erro",
  "details": [ ... ]
}
```

### **Paginação:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "skip": 0,
    "take": 10,
    "total": 150
  }
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- **Email:** marciosalinodias@gmail.com

---

**Desenvolvido com ❤️ usando Node.js, Express e Prisma**
