# 🔧 Componentes da API REST MVC

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Camada de Apresentação](#camada-de-apresentação)
- [Camada de Controle](#camada-de-controle)
- [Camada de Serviços](#camada-de-serviços)
- [Camada de Dados](#camada-de-dados)
- [Camada de Infraestrutura](#camada-de-infraestrutura)
- [Interações entre Componentes](#interações-entre-componentes)

## 🎯 Visão Geral

A API REST MVC é organizada em camadas bem definidas, cada uma com responsabilidades específicas. Esta documentação explica o papel e funcionamento de cada componente.

## 🎨 Camada de Apresentação

### **📁 `/routes` - Definição de Rotas**

#### **Responsabilidade Principal:**
Definir os endpoints da API e mapear requisições HTTP para os controllers apropriados.

#### **Componentes:**

##### **`clienteRoutes.js`**
```javascript
// Responsabilidade: Rotas específicas para entidade Cliente
router.get('/', clienteController.getAll);           // Listar clientes
router.post('/', validate(clienteSchema), clienteController.create); // Criar cliente
router.get('/:id', validateId, clienteController.getById); // Buscar por ID
```

**Papel:**
- ✅ **Mapeamento HTTP:** Define URLs e métodos HTTP
- ✅ **Validação:** Aplica middlewares de validação
- ✅ **Roteamento:** Direciona requisições para controllers
- ✅ **Versionamento:** Organiza endpoints por versão da API

##### **`produtoRoutes.js`**
```javascript
// Responsabilidade: Rotas específicas para entidade Produto
router.patch('/:id/estoque', validateId, produtoController.updateEstoque);
router.patch('/:id/toggle-status', validateId, produtoController.toggleStatus);
```

**Papel:**
- ✅ **Endpoints Específicos:** Rotas para operações únicas de produtos
- ✅ **Validação Especializada:** Middlewares específicos para produtos
- ✅ **Operações de Negócio:** Endpoints para estoque e status

##### **`pedidoRoutes.js`**
```javascript
// Responsabilidade: Rotas específicas para entidade Pedido
router.post('/:id/itens', validateId, pedidoController.addItem);
router.delete('/:id/itens/:itemId', validateId, pedidoController.removeItem);
```

**Papel:**
- ✅ **Relacionamentos:** Gerencia itens dentro de pedidos
- ✅ **Operações Complexas:** Adição e remoção de itens
- ✅ **Validação Hierárquica:** Valida IDs de pedido e item

##### **`index.js` (Routes)**
```javascript
// Responsabilidade: Agregação e configuração das rotas
app.use('/api/v1/clientes', clienteRoutes);
app.use('/api/v1/produtos', produtoRoutes);
app.use('/api/v1/pedidos', pedidoRoutes);
```

**Papel:**
- ✅ **Centralização:** Agrega todas as rotas
- ✅ **Configuração:** Define prefixos e middlewares globais
- ✅ **Organização:** Estrutura hierárquica das rotas

## 🎮 Camada de Controle

### **📁 `/controllers` - Controllers HTTP**

#### **Responsabilidade Principal:**
Receber requisições HTTP, validar dados de entrada e delegar processamento para os services.

#### **Componentes:**

##### **`BaseController.js`**
```javascript
// Responsabilidade: Controller base com operações CRUD comuns
class BaseController {
  async getAll(req, res) {
    const { skip = 0, take = 10 } = req.query;
    const result = await this.service.findWithPagination({ skip, take });
    res.json(result);
  }
}
```

**Papel:**
- ✅ **Reutilização:** Métodos comuns para todas as entidades
- ✅ **Padronização:** Respostas consistentes
- ✅ **Paginação:** Controle de volume de dados
- ✅ **Tratamento de Erros:** Respostas padronizadas de erro

##### **`ClienteController.js`**
```javascript
// Responsabilidade: Controller específico para Clientes
class ClienteController extends BaseController {
  async getByEmail(req, res) {
    const { email } = req.params;
    const cliente = await clienteService.findByEmail(email);
    res.json({ success: true, data: cliente });
  }
}
```

**Papel:**
- ✅ **Endpoints Específicos:** Operações únicas de clientes
- ✅ **Validação de Entrada:** Verifica dados antes de processar
- ✅ **Delegação:** Passa dados para services
- ✅ **Formatação de Resposta:** Estrutura respostas HTTP

##### **`ProdutoController.js`**
```javascript
// Responsabilidade: Controller específico para Produtos
class ProdutoController extends BaseController {
  async updateEstoque(req, res) {
    const { id } = req.params;
    const { quantidade } = req.body;
    const result = await produtoService.updateEstoque(id, quantidade);
    res.json(result);
  }
}
```

**Papel:**
- ✅ **Operações de Negócio:** Endpoints para estoque e status
- ✅ **Validação de Parâmetros:** Verifica IDs e dados
- ✅ **Controle de Acesso:** Valida permissões (futuro)
- ✅ **Logging:** Registra operações importantes

##### **`PedidoController.js`**
```javascript
// Responsabilidade: Controller específico para Pedidos
class PedidoController extends BaseController {
  async addItem(req, res) {
    const { id } = req.params;
    const itemData = req.body;
    const result = await pedidoService.addItem(id, itemData);
    res.json(result);
  }
}
```

**Papel:**
- ✅ **Operações Complexas:** Gerencia relacionamentos
- ✅ **Transações:** Controla operações atômicas
- ✅ **Validação Hierárquica:** Verifica pedido e itens
- ✅ **Respostas Detalhadas:** Informações completas do pedido

## 🧠 Camada de Serviços

### **📁 `/services` - Lógica de Negócio**

#### **Responsabilidade Principal:**
Implementar a lógica de negócio, validações complexas e orquestração de operações.

#### **Componentes:**

##### **`BaseService.js`**
```javascript
// Responsabilidade: Service base com funcionalidades comuns
class BaseService {
  async findWithPagination({ skip = 0, take = 10, where = {} }) {
    const [data, total] = await Promise.all([
      this.model.findAll({ skip, take, where }),
      this.model.count({ where })
    ]);
    return { data, pagination: { skip, take, total } };
  }
}
```

**Papel:**
- ✅ **Funcionalidades Comuns:** Paginação, validação, tratamento de erros
- ✅ **Reutilização:** Métodos compartilhados entre services
- ✅ **Consistência:** Comportamento padronizado
- ✅ **Manutenibilidade:** Centralização de lógica comum

##### **`ClienteService.js`**
```javascript
// Responsabilidade: Lógica de negócio para Clientes
class ClienteService extends BaseService {
  async createCliente(data) {
    // Validação de negócio
    if (await this.emailExists(data.email)) {
      throw new AppError('Email já cadastrado', 400);
    }
    
    // Criação via model
    return await clienteModel.create(data);
  }
}
```

**Papel:**
- ✅ **Validações de Negócio:** Regras específicas de clientes
- ✅ **Verificação de Unicidade:** Email único
- ✅ **Transformação de Dados:** Formatação antes de salvar
- ✅ **Orquestração:** Coordena operações complexas

##### **`ProdutoService.js`**
```javascript
// Responsabilidade: Lógica de negócio para Produtos
class ProdutoService extends BaseService {
  async updateEstoque(id, quantidade) {
    const produto = await produtoModel.findById(id);
    
    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }
    
    if (produto.estoque + quantidade < 0) {
      throw new AppError('Estoque insuficiente', 400);
    }
    
    return await produtoModel.updateEstoque(id, quantidade);
  }
}
```

**Papel:**
- ✅ **Controle de Estoque:** Validações de disponibilidade
- ✅ **Regras de Negócio:** Prevenção de estoque negativo
- ✅ **Operações Específicas:** Toggle de status, categorização
- ✅ **Validações Complexas:** Verificações multi-campo

##### **`PedidoService.js`**
```javascript
// Responsabilidade: Lógica de negócio para Pedidos
class PedidoService extends BaseService {
  async createPedido(data) {
    // Validação de itens
    await this.validateItens(data.itens);
    
    // Criação com transação
    return await this.model.transaction(async (prisma) => {
      const pedido = await pedidoModel.create(data, prisma);
      
      // Atualizar estoque dos produtos
      for (const item of data.itens) {
        await produtoModel.updateEstoque(item.produtoId, -item.quantidade, prisma);
      }
      
      return pedido;
    });
  }
}
```

**Papel:**
- ✅ **Transações:** Operações atômicas complexas
- ✅ **Validação de Relacionamentos:** Verifica itens e produtos
- ✅ **Orquestração:** Coordena múltiplas operações
- ✅ **Controle de Estado:** Gerencia status do pedido

## 💾 Camada de Dados

### **📁 `/models` - Acesso a Dados**

#### **Responsabilidade Principal:**
Abstrair o acesso ao banco de dados e implementar operações CRUD.

#### **Componentes:**

##### **`BaseModel.js`**
```javascript
// Responsabilidade: Model base com operações CRUD
class BaseModel {
  async findAll(options = {}) {
    return await prisma[this.tableName].findMany({
      ...options,
      include: this.include
    });
  }
  
  async transaction(callback) {
    return await prisma.$transaction(callback);
  }
}
```

**Papel:**
- ✅ **Operações CRUD:** Create, Read, Update, Delete
- ✅ **Abstração do Banco:** Encapsula Prisma
- ✅ **Transações:** Suporte a operações atômicas
- ✅ **Reutilização:** Métodos comuns para todas as entidades

##### **`Cliente.js`**
```javascript
// Responsabilidade: Acesso a dados para Clientes
class Cliente extends BaseModel {
  async findByEmail(email) {
    return await prisma.cliente.findUnique({
      where: { email },
      include: { pedidos: true }
    });
  }
}
```

**Papel:**
- ✅ **Queries Específicas:** Busca por email, nome
- ✅ **Relacionamentos:** Inclui pedidos do cliente
- ✅ **Otimização:** Queries eficientes
- ✅ **Abstração:** Encapsula complexidade do Prisma

##### **`Produto.js`**
```javascript
// Responsabilidade: Acesso a dados para Produtos
class Produto extends BaseModel {
  async updateEstoque(id, quantidade) {
    return await prisma.produto.update({
      where: { id },
      data: { estoque: { increment: quantidade } }
    });
  }
}
```

**Papel:**
- ✅ **Operações Específicas:** Atualização de estoque
- ✅ **Queries Otimizadas:** Busca por categoria, status
- ✅ **Atomicidade:** Operações seguras
- ✅ **Performance:** Queries eficientes

##### **`Pedido.js`**
```javascript
// Responsabilidade: Acesso a dados para Pedidos
class Pedido extends BaseModel {
  async create(data, prismaClient = prisma) {
    const { itens, ...pedidoData } = data;
    
    return await prismaClient.pedido.create({
      data: {
        ...pedidoData,
        itensPedido: {
          create: itens.map(item => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: item.quantidade * item.precoUnitario
          }))
        }
      },
      include: {
        cliente: true,
        itensPedido: {
          include: { produto: true }
        }
      }
    });
  }
}
```

**Papel:**
- ✅ **Operações Complexas:** Criação com relacionamentos
- ✅ **Transações:** Suporte a operações atômicas
- ✅ **Relacionamentos:** Gerencia itens do pedido
- ✅ **Cálculos:** Subtotal automático

## 🛠️ Camada de Infraestrutura

### **📁 `/middleware` - Middlewares**

#### **Responsabilidade Principal:**
Processar requisições antes e depois dos controllers, implementando funcionalidades cross-cutting.

#### **Componentes:**

##### **`validation.js`**
```javascript
// Responsabilidade: Validação de dados de entrada
const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, ''); // Remove XSS
  };
  // ... sanitização recursiva
};
```

**Papel:**
- ✅ **Validação de Dados:** Schemas Zod
- ✅ **Sanitização:** Prevenção XSS
- ✅ **Rate Limiting:** Controle de requisições
- ✅ **Validação de Payload:** Tamanho e formato

##### **`errorHandler.js`**
```javascript
// Responsabilidade: Tratamento global de erros
const errorHandler = (err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      success: false,
      error: 'Database Error',
      message: 'Erro no banco de dados'
    });
  }
  // ... outros tipos de erro
};
```

**Papel:**
- ✅ **Tratamento Centralizado:** Todos os erros em um lugar
- ✅ **Respostas Padronizadas:** Formato consistente
- ✅ **Logging de Erros:** Registro para debugging
- ✅ **Segurança:** Não exposição de detalhes internos

##### **`logging.js`**
```javascript
// Responsabilidade: Sistema de logging
const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};
```

**Papel:**
- ✅ **Monitoramento:** Log de requisições/respostas
- ✅ **Performance:** Medição de tempo de resposta
- ✅ **Debugging:** Informações para troubleshooting
- ✅ **Auditoria:** Registro de operações

### **📁 `/utils` - Utilitários**

#### **Responsabilidade Principal:**
Fornecer funcionalidades auxiliares e configurações compartilhadas.

#### **Componentes:**

##### **`prisma.js`**
```javascript
// Responsabilidade: Configuração do cliente Prisma
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

prisma.$on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

**Papel:**
- ✅ **Configuração Centralizada:** Cliente Prisma único
- ✅ **Logging:** Queries e erros do banco
- ✅ **Conexão:** Gerenciamento de conexões
- ✅ **Performance:** Pool de conexões

##### **`validation.js`**
```javascript
// Responsabilidade: Schemas de validação Zod
const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  endereco: z.string().optional()
});
```

**Papel:**
- ✅ **Validação de Tipos:** Verificação em runtime
- ✅ **Mensagens Customizadas:** Erros amigáveis
- ✅ **Reutilização:** Schemas compartilhados
- ✅ **Type Safety:** Inferência de tipos

## 🔄 Interações entre Componentes

### **Fluxo de Execução:**

```
1. Requisição HTTP → Routes
2. Routes → Middleware (validação, sanitização)
3. Middleware → Controller
4. Controller → Service (lógica de negócio)
5. Service → Model (acesso a dados)
6. Model → Prisma → Database
7. Database → Prisma → Model → Service → Controller → Response
```

### **Dependências:**

```
Routes → Controllers → Services → Models → Prisma
   ↓         ↓          ↓         ↓
Middleware → Validation → Error Handling → Response
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

### **Princípios de Design:**

1. **Separação de Responsabilidades:** Cada componente tem uma função específica
2. **Inversão de Dependência:** Camadas superiores não dependem de implementações
3. **Reutilização:** Base classes para funcionalidades comuns
4. **Testabilidade:** Cada componente pode ser testado isoladamente
5. **Manutenibilidade:** Mudanças em uma camada não afetam outras

---

**Esta arquitetura garante que cada componente tenha uma responsabilidade clara e bem definida, facilitando o desenvolvimento, teste e manutenção da aplicação.**
