# 🔄 Fluxo de Dados - API REST MVC

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Fluxo de Requisição](#fluxo-de-requisição)
- [Fluxo de Resposta](#fluxo-de-resposta)
- [Fluxo de Erro](#fluxo-de-erro)
- [Fluxo de Transação](#fluxo-de-transação)
- [Fluxo de Validação](#fluxo-de-validação)
- [Fluxo de Logging](#fluxo-de-logging)

## 🎯 Visão Geral

Esta documentação detalha como os dados fluem através da aplicação, desde a requisição HTTP até a resposta, incluindo validações, processamento de negócio e persistência.

## 📥 Fluxo de Requisição

### **Fluxo Completo de uma Requisição POST:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Frontend/Mobile)                         │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │ POST /api/v1/clientes
                              │ Content-Type: application/json
                              │ { "nome": "João", "email": "joao@email.com" }
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXPRESS SERVER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   MIDDLEWARES   │  │     ROUTES      │  │        CONTROLLERS          │ │
│  │                 │  │                 │  │                             │ │
│  │ 1. CORS         │  │ 4. Route Match  │  │ 5. ClienteController.create │ │
│  │ 2. Helmet       │  │    /clientes    │  │                             │ │
│  │ 3. Rate Limit   │  │                 │  │                             │ │
│  │ 4. Payload Size │  │                 │  │                             │ │
│  │ 5. Sanitize     │  │                 │  │                             │ │
│  │ 6. Morgan       │  │                 │  │                             │ │
│  │ 7. JSON Parse   │  │                 │  │                             │ │
│  │ 8. Validation   │  │                 │  │                             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│           │                     │                            │              │
│           └─────────────────────┼────────────────────────────┘              │
│                                 │                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │    SERVICES     │  │     MODELS      │  │         PRISMA              │ │
│  │                 │  │                 │  │                             │ │
│  │ 6. ClienteService│ │ 7. ClienteModel │  │ 8. Prisma Client            │ │
│  │    .createCliente│ │    .create()    │  │                             │ │
│  │                 │  │                 │  │                             │ │
│  │ • Valida email  │  │ • Sanitiza dados│  │ • Gera SQL                  │ │
│  │ • Verifica dupl.│  │ • Formata campos│  │ • Executa query             │ │
│  │ • Aplica regras │  │ • Valida tipos  │  │ • Retorna resultado         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │ Prisma Query
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           POSTGRESQL DATABASE                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                              CLIENTES TABLE                             │ │
│  │                                                                         │ │
│  │ 9. INSERT INTO clientes (id, nome, email, telefone, endereco,          │ │
│  │     created_at, updated_at) VALUES (                                    │ │
│  │     'uuid', 'João', 'joao@email.com', NULL, NULL, NOW(), NOW()         │ │
│  │  )                                                                       │ │
│  │                                                                         │ │
│  │ 10. Retorna: { id: 'uuid', nome: 'João', email: 'joao@email.com', ... } │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Detalhamento por Etapa:**

#### **1. Middlewares de Segurança:**
```javascript
// CORS - Verifica origem da requisição
if (allowedOrigins.includes(req.headers.origin)) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
}

// Helmet - Adiciona headers de segurança
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');

// Rate Limiting - Controle de requisições
if (requestsPerMinute > 100) {
  return res.status(429).json({ error: 'Too many requests' });
}

// Payload Size - Limite de tamanho
if (req.headers['content-length'] > 10485760) { // 10MB
  return res.status(413).json({ error: 'Payload too large' });
}

// Sanitize Input - Remove XSS
req.body.nome = req.body.nome.replace(/[<>]/g, '');
```

#### **2. Middlewares de Processamento:**
```javascript
// Morgan - Log da requisição
logger.info(`${req.method} ${req.url} - ${req.ip}`);

// JSON Parse - Converte body para objeto
req.body = JSON.parse(req.body);

// Validation - Valida com Zod
const result = clienteSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.errors });
}
```

#### **3. Route Matching:**
```javascript
// Express Router encontra a rota
router.post('/clientes', validate(clienteSchema), clienteController.create);
```

#### **4. Controller Processing:**
```javascript
// ClienteController.create
async create(req, res) {
  try {
    const result = await clienteService.createCliente(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Cliente criado com sucesso'
    });
  } catch (error) {
    next(error); // Passa para error handler
  }
}
```

#### **5. Service Logic:**
```javascript
// ClienteService.createCliente
async createCliente(data) {
  // Validação de negócio
  if (await this.emailExists(data.email)) {
    throw new AppError('Email já cadastrado', 400);
  }
  
  // Sanitização adicional
  data.nome = data.nome.trim();
  data.email = data.email.toLowerCase();
  
  // Criação via model
  return await clienteModel.create(data);
}
```

#### **6. Model Processing:**
```javascript
// ClienteModel.create
async create(data) {
  return await prisma.cliente.create({
    data: {
      id: uuidv4(),
      nome: data.nome,
      email: data.email,
      telefone: data.telefone || null,
      endereco: data.endereco || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}
```

#### **7. Prisma Query:**
```javascript
// Prisma gera e executa SQL
const result = await prisma.$queryRaw`
  INSERT INTO "Cliente" (id, nome, email, telefone, endereco, "createdAt", "updatedAt")
  VALUES (${uuid}, ${data.nome}, ${data.email}, ${data.telefone}, ${data.endereco}, NOW(), NOW())
  RETURNING *
`;
```

## 📤 Fluxo de Resposta

### **Fluxo de Resposta de Sucesso:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           POSTGRESQL DATABASE                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                              CLIENTES TABLE                             │ │
│  │                                                                         │ │
│  │ Retorna: {                                                              │ │
│  │   id: 'uuid',                                                           │ │
│  │   nome: 'João',                                                         │ │
│  │   email: 'joao@email.com',                                              │ │
│  │   telefone: null,                                                       │ │
│  │   endereco: null,                                                       │ │
│  │   createdAt: '2024-01-15T10:30:45.123Z',                               │ │
│  │   updatedAt: '2024-01-15T10:30:45.123Z'                                │ │
│  │ }                                                                        │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │ Prisma Result
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXPRESS SERVER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │     MODELS      │  │    SERVICES     │  │        CONTROLLERS          │ │
│  │                 │  │                 │  │                             │ │
│  │ 1. ClienteModel │  │ 2. ClienteService│ │ 3. ClienteController        │ │
│  │    .create()    │  │    .createCliente│ │    .create()                │ │
│  │                 │  │                 │  │                             │ │
│  │ • Recebe dados  │  │ • Recebe dados  │  │ • Recebe dados              │ │
│  │ • Formata resposta│ │ • Aplica lógica │  │ • Formata resposta HTTP     │ │
│  │ • Retorna objeto│  │ • Retorna dados │  │ • Define status code        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│           │                     │                            │              │
│           └─────────────────────┼────────────────────────────┘              │
│                                 │                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   MIDDLEWARES   │  │     ROUTES      │  │        RESPONSE             │ │
│  │                 │  │                 │  │                             │ │
│  │ 4. Morgan       │  │ 5. Route        │  │ 6. HTTP Response            │ │
│  │    (Response)   │  │    (Response)   │  │                             │ │
│  │                 │  │                 │  │                             │ │
│  │ • Log response  │  │ • Log route     │  │ • Status: 201 Created       │ │
│  │ • Log duration  │  │ • Log method    │  │ • Headers: Content-Type     │ │
│  │ • Log status    │  │ • Log path      │  │ • Body: JSON response       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │ HTTP Response
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Frontend/Mobile)                         │
│                                                                             │
│ HTTP/1.1 201 Created                                                       │
│ Content-Type: application/json                                             │
│                                                                             │
│ {                                                                           │
│   "success": true,                                                         │
│   "data": {                                                                │
│     "id": "uuid",                                                          │
│     "nome": "João",                                                        │
│     "email": "joao@email.com",                                             │
│     "telefone": null,                                                      │
│     "endereco": null,                                                      │
│     "createdAt": "2024-01-15T10:30:45.123Z",                              │
│     "updatedAt": "2024-01-15T10:30:45.123Z"                               │
│   },                                                                        │
│   "message": "Cliente criado com sucesso"                                 │
│ }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## ❌ Fluxo de Erro

### **Fluxo de Tratamento de Erro:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXPRESS SERVER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │    SERVICES     │  │   CONTROLLERS   │  │      MIDDLEWARES            │ │
│  │                 │  │                 │  │                             │ │
│  │ 1. ClienteService│ │ 2. Controller   │  │ 3. Error Handler            │ │
│  │    .createCliente│ │    .create()    │  │                             │ │
│  │                 │  │                 │  │                             │ │
│  │ • Valida email  │  │ • Recebe erro   │  │ • Captura erro              │ │
│  │ • Email existe  │  │ • Chama next()  │  │ • Classifica tipo           │ │
│  │ • Throw AppError│  │ • Passa erro    │  │ • Formata resposta          │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│           │                     │                            │              │
│           └─────────────────────┼────────────────────────────┘              │
│                                 │                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   LOGGING       │  │   VALIDATION    │  │        RESPONSE             │ │
│  │                 │  │                 │  │                             │ │
│  │ 4. Error Logger │  │ 5. Zod Error    │  │ 6. Error Response           │ │
│  │                 │  │                 │  │                             │ │
│  │ • Log error     │  │ • Parse errors  │  │ • Status: 400 Bad Request   │ │
│  │ • Log stack     │  │ • Format errors │  │ • Headers: Content-Type     │ │
│  │ • Log context   │  │ • Return errors │  │ • Body: Error JSON          │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │ HTTP Error Response
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Frontend/Mobile)                         │
│                                                                             │
│ HTTP/1.1 400 Bad Request                                                   │
│ Content-Type: application/json                                             │
│                                                                             │
│ {                                                                           │
│   "success": false,                                                        │
│   "error": "Validation Error",                                             │
│   "message": "Email já cadastrado",                                        │
│   "details": [                                                             │
│     {                                                                       │
│       "field": "email",                                                    │
│       "message": "Email já cadastrado"                                     │
│     }                                                                       │
│   ]                                                                         │
│ }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Tipos de Erro e Tratamento:**

#### **1. Erro de Validação (Zod):**
```javascript
// Zod validation error
if (!result.success) {
  return res.status(400).json({
    success: false,
    error: 'Validation Error',
    message: 'Dados inválidos',
    details: result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))
  });
}
```

#### **2. Erro de Negócio (AppError):**
```javascript
// Service throws AppError
if (await this.emailExists(data.email)) {
  throw new AppError('Email já cadastrado', 400);
}

// Error handler catches AppError
if (err instanceof AppError) {
  return res.status(err.statusCode).json({
    success: false,
    error: err.name,
    message: err.message
  });
}
```

#### **3. Erro de Banco (Prisma):**
```javascript
// Prisma database error
if (err instanceof Prisma.PrismaClientKnownRequestError) {
  if (err.code === 'P2002') { // Unique constraint
    return res.status(400).json({
      success: false,
      error: 'Database Error',
      message: 'Registro duplicado'
    });
  }
}
```

## 🔄 Fluxo de Transação

### **Fluxo de Criação de Pedido com Transação:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXPRESS SERVER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   CONTROLLERS   │  │    SERVICES     │  │         MODELS              │ │
│  │                 │  │                 │  │                             │ │
│  │ 1. PedidoController│ │ 2. PedidoService│ │ 3. PedidoModel              │ │
│  │    .create()    │  │    .createPedido│ │    .transaction()            │ │
│  │                 │  │                 │  │                             │ │
│  │ • Recebe dados  │  │ • Valida itens  │  │ • Inicia transação          │ │
│  │ • Chama service │  │ • Chama model   │  │ • Executa operações         │ │
│  │ • Retorna resp. │  │ • Gerencia tx   │  │ • Commit/Rollback           │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│           │                     │                            │              │
│           └─────────────────────┼────────────────────────────┘              │
│                                 │                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │     PRISMA      │  │    DATABASE     │  │        TRANSACTION          │ │
│  │                 │  │                 │  │                             │ │
│  │ 4. Prisma Client│  │ 5. PostgreSQL   │  │ 6. Transaction Log          │ │
│  │                 │  │                 │  │                             │ │
│  │ • BEGIN TX      │  │ • BEGIN         │  │ • BEGIN                     │ │
│  │ • INSERT pedido │  │ • INSERT pedido │  │ • INSERT pedido             │ │
│  │ • INSERT itens  │  │ • INSERT itens  │  │ • UPDATE estoque            │ │
│  │ • UPDATE estoque│  │ • UPDATE estoque│  │ • COMMIT                     │ │
│  │ • COMMIT        │  │ • COMMIT        │  │                             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Código da Transação:**

```javascript
// PedidoService.createPedido
async createPedido(data) {
  return await this.model.transaction(async (prisma) => {
    // 1. Criar pedido
    const pedido = await pedidoModel.create(data, prisma);
    
    // 2. Criar itens do pedido
    for (const item of data.itens) {
      await itemPedidoModel.create({
        pedidoId: pedido.id,
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.quantidade * item.precoUnitario
      }, prisma);
      
      // 3. Atualizar estoque do produto
      await produtoModel.updateEstoque(
        item.produtoId, 
        -item.quantidade, 
        prisma
      );
    }
    
    return pedido;
  });
}
```

## ✅ Fluxo de Validação

### **Fluxo de Validação Completa:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Frontend/Mobile)                         │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │ POST /api/v1/clientes
                              │ { "nome": "<script>alert('xss')</script>", "email": "invalid" }
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXPRESS SERVER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   MIDDLEWARES   │  │   VALIDATION    │  │        SANITIZATION         │ │
│  │                 │  │                 │  │                             │ │
│  │ 1. Rate Limit   │  │ 2. Zod Schema   │  │ 3. XSS Prevention           │ │
│  │                 │  │                 │  │                             │ │
│  │ • Check limit   │  │ • Validate type │  │ • Remove < >                │ │
│  │ • Allow/Deny    │  │ • Validate format│ │ • Sanitize strings          │ │
│  │ • Log attempt   │  │ • Return errors │  │ • Clean input               │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│           │                     │                            │              │
│           └─────────────────────┼────────────────────────────┘              │
│                                 │                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   CONTROLLERS   │  │    SERVICES     │  │         MODELS              │ │
│  │                 │  │                 │  │                             │ │
│  │ 4. Controller   │  │ 5. Service      │  │ 6. Model                    │ │
│  │    Validation   │  │    Business     │  │    Database                 │ │
│  │                 │  │    Validation   │  │    Validation               │ │
│  │ • Check params  │  │ • Email unique  │  │ • SQL injection             │ │
│  │ • Validate body │  │ • Business rules│  │ • Constraint check          │ │
│  │ • Format data   │  │ • Data transform│  │ • Type validation           │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Camadas de Validação:**

#### **1. Middleware de Sanitização:**
```javascript
const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, ''); // Remove XSS
  };
  
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};
```

#### **2. Validação Zod:**
```javascript
const clienteSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
  telefone: z.string().optional(),
  endereco: z.string().optional()
});
```

#### **3. Validação de Negócio:**
```javascript
async createCliente(data) {
  // Validação de negócio
  if (await this.emailExists(data.email)) {
    throw new AppError('Email já cadastrado', 400);
  }
  
  // Validação de formato
  if (data.telefone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(data.telefone)) {
    throw new AppError('Telefone em formato inválido', 400);
  }
  
  return await clienteModel.create(data);
}
```

## 📝 Fluxo de Logging

### **Fluxo de Logging Completo:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXPRESS SERVER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   REQUEST LOG   │  │  PROCESSING LOG │  │       RESPONSE LOG          │ │
│  │                 │  │                 │  │                             │ │
│  │ 1. Morgan       │  │ 2. Custom Logger│  │ 3. Response Logger          │ │
│  │                 │  │                 │  │                             │ │
│  │ • Method        │  │ • Service calls │  │ • Status code               │ │
│  │ • URL           │  │ • Database ops  │  │ • Response time             │ │
│  │ • IP            │  │ • Business logic│  │ • Response size             │ │
│  │ • User Agent    │  │ • Errors        │  │ • Headers                   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│           │                     │                            │              │
│           └─────────────────────┼────────────────────────────┘              │
│                                 │                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   ERROR LOG     │  │   AUDIT LOG     │  │        FILE LOG             │ │
│  │                 │  │                 │  │                             │ │
│  │ 4. Error Logger │  │ 5. Audit Logger │  │ 6. File Logger              │ │
│  │                 │  │                 │  │                             │ │
│  │ • Error type    │  │ • User actions  │  │ • Write to file             │ │
│  │ • Stack trace   │  │ • Data changes  │  │ • Rotate logs               │ │
│  │ • Context       │  │ • Access logs   │  │ • Compress old logs         │ │
│  │ • Timestamp     │  │ • Security      │  │ • Archive logs              │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Tipos de Log:**

#### **1. Request Log (Morgan):**
```javascript
// Morgan middleware
morgan(':method :url :status :res[content-length] - :response-time ms - :remote-addr - :user-agent')
// Output: POST /api/v1/clientes 201 245 - 45ms - 192.168.1.1 - Mozilla/5.0...
```

#### **2. Custom Logging:**
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

#### **3. Error Logging:**
```javascript
const errorLoggingMiddleware = (err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  next(err);
};
```

---

**Este fluxo de dados garante que todas as informações sejam processadas de forma segura, validada e rastreada, proporcionando uma experiência robusta e confiável para os usuários da API.**
