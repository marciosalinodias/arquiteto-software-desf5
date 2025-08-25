# 📚 Documentação Técnica - API REST MVC

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Documentação Disponível](#documentação-disponível)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Fluxo de Dados](#fluxo-de-dados)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Padrões Utilizados](#padrões-utilizados)
- [Segurança](#segurança)
- [Performance](#performance)
- [Escalabilidade](#escalabilidade)
- [Manutenção](#manutenção)

## 🎯 Visão Geral

Esta documentação técnica fornece uma visão completa da API REST MVC, incluindo arquitetura, componentes, fluxos de dados e decisões técnicas tomadas durante o desenvolvimento.

### **Objetivo do Projeto:**
Desenvolver uma API REST robusta e escalável para gerenciamento de clientes, produtos e pedidos, seguindo o padrão arquitetural MVC com separação clara de responsabilidades.

### **Stack Tecnológica:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Banco:** PostgreSQL (Neon)
- **Validação:** Zod
- **Documentação:** Swagger/OpenAPI
- **Segurança:** Helmet, CORS, Rate Limiting

## 📖 Documentação Disponível

### **📄 Documentação Principal:**
- **[README.md](../README.md)** - Documentação geral do projeto
- **[test-api.http](../test-api.http)** - Testes HTTP da API

### **📁 Documentação Técnica:**
- **[architecture.md](./architecture.md)** - Arquitetura e diagramas
- **[components.md](./components.md)** - Componentes e responsabilidades
- **[data-flow.md](./data-flow.md)** - Fluxo de dados detalhado
- **[folder-structure.md](./folder-structure.md)** - Estrutura de pastas

### **📊 Diagramas Interativos:**
- **[diagrams/README.md](./diagrams/README.md)** - Como usar os diagramas XML
- **[diagrams/architecture.xml](./diagrams/architecture.xml)** - Arquitetura de alto nível
- **[diagrams/components.xml](./diagrams/components.xml)** - Hierarquia de componentes
- **[diagrams/data-flow.xml](./diagrams/data-flow.xml)** - Fluxo de dados detalhado
- **[diagrams/database-schema.xml](./diagrams/database-schema.xml)** - Schema do banco

## 🏗️ Arquitetura

### **📊 Diagramas Interativos:**
Para uma visualização completa da arquitetura, consulte os diagramas XML na pasta `diagrams/`:
- **Arquitetura de Alto Nível:** `diagrams/architecture.xml`
- **Hierarquia de Componentes:** `diagrams/components.xml`
- **Fluxo de Dados:** `diagrams/data-flow.xml`
- **Schema do Banco:** `diagrams/database-schema.xml`

### **Padrão MVC Implementado:**

```
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
└─────────────────────────────────────────────────────────────┘
```

### **Princípios Arquiteturais:**

1. **Separação de Responsabilidades:** Cada camada tem uma função específica
2. **Inversão de Dependência:** Camadas superiores não dependem de implementações
3. **Reutilização:** Base classes para funcionalidades comuns
4. **Testabilidade:** Cada componente pode ser testado isoladamente
5. **Manutenibilidade:** Mudanças em uma camada não afetam outras

## 🔧 Componentes

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

### **Responsabilidades por Camada:**

| Camada | Responsabilidade | Componentes |
|--------|------------------|-------------|
| **Routes** | Mapeamento HTTP | `clienteRoutes.js`, `produtoRoutes.js`, `pedidoRoutes.js` |
| **Controllers** | Controle HTTP | `BaseController.js`, `ClienteController.js`, etc. |
| **Services** | Lógica de Negócio | `BaseService.js`, `ClienteService.js`, etc. |
| **Models** | Acesso a Dados | `BaseModel.js`, `Cliente.js`, etc. |
| **Middleware** | Processamento Cross-cutting | `validation.js`, `errorHandler.js`, `logging.js` |
| **Utils** | Funcionalidades Auxiliares | `prisma.js`, `validation.js` |

## 🔄 Fluxo de Dados

### **Fluxo Típico de uma Requisição:**

```
1. Requisição HTTP → Routes
2. Routes → Middleware (validação, sanitização)
3. Middleware → Controller
4. Controller → Service (lógica de negócio)
5. Service → Model (acesso a dados)
6. Model → Prisma → Database
7. Database → Prisma → Model → Service → Controller → Response
```

### **Camadas de Processamento:**

1. **Segurança:** CORS, Helmet, Rate Limiting, Sanitização
2. **Validação:** Zod schemas, validação de tipos e formatos
3. **Controle:** Controllers gerenciam requisições HTTP
4. **Negócio:** Services implementam regras de negócio
5. **Dados:** Models abstraem acesso ao banco
6. **Persistência:** Prisma ORM com PostgreSQL

## 📁 Estrutura de Pastas

### **Organização do Projeto:**

```
api-rest-mvc/
├── 📄 README.md                    # Documentação principal
├── 📄 package.json                 # Configurações e dependências
├── 📄 .env.example                 # Exemplo de variáveis de ambiente
├── 📄 test-api.http               # Testes HTTP para VS Code/REST Client
├── 📁 prisma/                     # Configurações do Prisma ORM
│   ├── 📄 schema.prisma           # Schema do banco de dados
│   └── 📁 migrations/             # Migrações do banco (geradas automaticamente)
├── 📁 src/                        # Código fonte da aplicação
│   ├── 📄 server.js               # Ponto de entrada da aplicação
│   ├── 📁 config/                 # Configurações da aplicação
│   │   └── 📄 swagger.js          # Configuração do Swagger/OpenAPI
│   ├── 📁 controllers/            # Camada de Controllers (HTTP)
│   ├── 📁 services/               # Camada de Services (Lógica de Negócio)
│   ├── 📁 models/                 # Camada de Models (Acesso a Dados)
│   ├── 📁 routes/                 # Definição de Rotas da API
│   ├── 📁 middleware/             # Middlewares da aplicação
│   └── 📁 utils/                  # Utilitários e helpers
└── 📁 docs/                       # Documentação do projeto
    ├── 📄 architecture.md         # Documentação arquitetural
    ├── 📄 components.md           # Componentes e responsabilidades
    ├── 📄 data-flow.md            # Fluxo de dados detalhado
    ├── 📄 folder-structure.md     # Estrutura de pastas
    └── 📄 README.md               # Esta documentação
```

### **Princípios de Organização:**

1. **Separação por Responsabilidade:** Cada pasta tem uma função específica
2. **Herança e Reutilização:** Base classes para funcionalidades comuns
3. **Modularidade:** Cada entidade é independente
4. **Escalabilidade:** Estrutura preparada para crescimento
5. **Documentação:** README principal + documentação técnica separada

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

## 🛡️ Segurança

### **Camadas de Segurança Implementadas:**

1. **Helmet.js** - Headers de segurança
2. **CORS** - Controle de origem
3. **Rate Limiting** - Proteção contra spam
4. **Payload Size** - Limite de tamanho
5. **XSS Prevention** - Sanitização de input
6. **Zod Validation** - Validação de dados
7. **Error Handling** - Não exposição de detalhes internos

### **Exemplo de Sanitização XSS:**

```javascript
const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, ''); // Remove caracteres perigosos
  };
  
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};
```

### **Validação com Zod:**

```javascript
const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  endereco: z.string().optional()
});
```

## 📊 Performance

### **Otimizações Implementadas:**

1. **Paginação** - Controle de volume de dados
2. **Indexação** - Chaves primárias e estrangeiras
3. **Queries Otimizadas** - Via Prisma
4. **Caching** - Preparado para implementação
5. **Compression** - Via Express
6. **Logging Eficiente** - Apenas em produção

### **Exemplo de Paginação:**

```javascript
async findWithPagination({ skip = 0, take = 10, where = {} }) {
  const [data, total] = await Promise.all([
    this.model.findAll({ skip, take, where }),
    this.model.count({ where })
  ]);
  
  return { 
    data, 
    pagination: { skip, take, total } 
  };
}
```

## 🚀 Escalabilidade

### **Preparado para Crescimento:**

1. **Modularidade** - Cada entidade independente
2. **Base Classes** - Fácil adição de novas entidades
3. **Middleware Chain** - Fácil adição de funcionalidades
4. **Database** - PostgreSQL escalável
5. **Stateless** - Pronto para load balancing
6. **Documentação** - Swagger para integração

### **Estrutura Escalável:**

```javascript
// Fácil adição de novas entidades
class NovaEntidade extends BaseModel {
  // Implementação específica
}

class NovaEntidadeService extends BaseService {
  // Lógica de negócio específica
}

class NovaEntidadeController extends BaseController {
  // Endpoints específicos
}
```

## 🔧 Manutenção

### **Facilidades de Manutenção:**

1. **Separação de Responsabilidades** - Mudanças isoladas
2. **Herança** - Funcionalidades comuns centralizadas
3. **Validação Centralizada** - Schemas reutilizáveis
4. **Tratamento de Erros** - Respostas padronizadas
5. **Logging** - Rastreamento de problemas
6. **Documentação** - Swagger sempre atualizado

### **Exemplo de Manutenibilidade:**

```javascript
// Mudança em validação afeta apenas o schema
const clienteSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email(),
  // Nova validação adicionada facilmente
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).optional()
});

// Mudança em lógica de negócio afeta apenas o service
async createCliente(data) {
  // Nova regra de negócio adicionada facilmente
  if (data.cpf && await this.cpfExists(data.cpf)) {
    throw new AppError('CPF já cadastrado', 400);
  }
  
  return await clienteModel.create(data);
}
```

## 📈 Métricas e Monitoramento

### **Logs Implementados:**

1. **Request Logs** - Morgan middleware
2. **Error Logs** - Tratamento centralizado
3. **Performance Logs** - Tempo de resposta
4. **Business Logs** - Operações importantes

### **Exemplo de Logging:**

```javascript
const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};
```

## 🧪 Testes

### **Estratégia de Testes:**

1. **Testes Unitários** - Cada componente isoladamente
2. **Testes de Integração** - Fluxo completo
3. **Testes HTTP** - Endpoints da API
4. **Testes de Validação** - Schemas Zod
5. **Testes de Segurança** - XSS, Rate Limiting

### **Arquivo de Testes:**

O arquivo `test-api.http` contém 40 cenários de teste cobrindo:
- Operações CRUD básicas
- Validações de entrada
- Tratamento de erros
- Relacionamentos entre entidades
- Testes de segurança
- Testes de performance

## 🔮 Próximos Passos

### **Melhorias Futuras:**

1. **Autenticação JWT** - Sistema de login
2. **Autorização RBAC** - Controle de acesso
3. **Cache Redis** - Melhoria de performance
4. **Testes Automatizados** - Jest/Supertest
5. **CI/CD Pipeline** - Deploy automatizado
6. **Monitoramento** - APM e alertas
7. **Documentação Automática** - Geração automática de docs

### **Estrutura Preparada:**

A arquitetura atual já está preparada para essas melhorias, com:
- Middleware chain extensível
- Base classes reutilizáveis
- Separação clara de responsabilidades
- Documentação completa
- Padrões estabelecidos

---

**Esta documentação técnica fornece uma base sólida para entender, manter e expandir a API REST MVC, garantindo que o projeto continue evoluindo de forma organizada e escalável.**
