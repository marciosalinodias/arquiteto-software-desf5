# Plano de Desenvolvimento - API REST MVC

## 🎯 Objetivo
Desenvolver uma API REST seguindo padrão MVC para expor dados de Cliente/Produto/Pedido aos parceiros da empresa.

## 🏗️ Critérios Arquiteturais

### **Stack Tecnológica:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Padrão:** MVC (Model-View-Controller)
- **Banco de Dados:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Validação:** Zod
- **Variáveis de Ambiente:** dotenv

### **Arquitetura de Dados:**
- **Persistência:** PostgreSQL via Neon
- **Migrations:** Prisma Migrate
- **Relacionamentos:** Cliente → Pedidos, Produto → Pedidos
- **Validação:** Schema validation com Zod

---

## 📋 Tarefas Organizadas

### **FASE 1: Setup e Configuração Inicial**
- [x] **T1.1** - Escolher stack tecnológica (Node.js/Express, Java/Spring, Python/Flask) ✅ **NODE.JS/EXPRESS**
- [x] **T1.2** - Criar estrutura base do projeto ✅ **CONCLUÍDA**
- [x] **T1.3** - Configurar dependências e package.json ✅ **CONCLUÍDA**
- [x] **T1.4** - Configurar servidor básico ✅ **CONCLUÍDA**
- [x] **T1.5** - Testar servidor rodando ✅ **CONCLUÍDA**
- [x] **T1.6** - Configurar Prisma e PostgreSQL ✅ **CONCLUÍDA**
- [x] **T1.7** - Configurar variáveis de ambiente (.env) ✅ **CONCLUÍDA**
- [x] **T1.8** - Configurar Zod para validação ✅ **CONCLUÍDA**

### **FASE 2: Estrutura MVC**
- [x] **T2.1** - Criar pasta `models/` e definir entidades (Cliente, Produto, Pedido) ✅ **CONCLUÍDA**
- [x] **T2.2** - Criar pasta `controllers/` e controllers base ✅ **CONCLUÍDA**
- [x] **T2.3** - Criar pasta `services/` e services base ✅ **CONCLUÍDA**
- [x] **T2.4** - Criar pasta `routes/` e configuração de rotas ✅ **CONCLUÍDA**
- [x] **T2.5** - Testar estrutura MVC funcionando ✅ **CONCLUÍDA**

### **FASE 3: Implementação dos Models**
- [ ] **T3.1** - Definir schema Prisma (Cliente, Produto, Pedido)
- [ ] **T3.2** - Configurar relacionamentos no Prisma
- [ ] **T3.3** - Criar migrations do banco de dados
- [ ] **T3.4** - Implementar Zod schemas para validação
- [ ] **T3.5** - Configurar Prisma Client
- [ ] **T3.6** - Testar conexão com banco de dados

### **FASE 4: Implementação dos Services**
- [ ] **T4.1** - Criar métodos CRUD no ClienteService
- [ ] **T4.2** - Criar métodos CRUD no ProdutoService
- [ ] **T4.3** - Criar métodos CRUD no PedidoService
- [ ] **T4.4** - Implementar lógica de negócio (relacionamentos)
- [ ] **T4.5** - Implementar tratamento de erros
- [ ] **T4.6** - Testar services isoladamente

### **FASE 5: Implementação dos Controllers**
- [ ] **T5.1** - Criar endpoints CRUD básicos para Cliente
- [ ] **T5.2** - Criar endpoints CRUD básicos para Produto
- [ ] **T5.3** - Criar endpoints CRUD básicos para Pedido
- [ ] **T5.4** - Implementar validação de entrada
- [ ] **T5.5** - Configurar respostas HTTP corretas
- [ ] **T5.6** - Testar endpoints via Postman/Insomnia

### **FASE 6: Endpoints Específicos**
- [ ] **T6.1** - Implementar endpoints de contagem total (Clientes, Produtos, Pedidos)
- [ ] **T6.2** - Implementar endpoints Find All (Clientes, Produtos, Pedidos)
- [ ] **T6.3** - Implementar endpoints Find By ID (Clientes, Produtos, Pedidos)
- [ ] **T6.4** - Implementar endpoints Find By Name (Clientes, Produtos)
- [ ] **T6.5** - Implementar endpoints específicos de Pedido (por Cliente, por Status)
- [ ] **T6.6** - Testar todos os endpoints específicos

### **FASE 7: Melhorias e Documentação**
- [ ] **T7.1** - Adicionar middleware de logging
- [ ] **T7.2** - Implementar tratamento de erros global
- [ ] **T7.3** - Adicionar validações de entrada robustas
- [ ] **T7.4** - Criar documentação da API (README)
- [ ] **T7.5** - Testes finais de todos os endpoints

### **FASE 8: Documentação Arquitetural**
- [ ] **T8.1** - Criar diagrama de arquitetura (UML/C4)
- [ ] **T8.2** - Documentar estrutura de pastas
- [ ] **T8.3** - Explicar papel de cada componente
- [ ] **T8.4** - Criar diagrama de fluxo de dados
- [ ] **T8.5** - Finalizar documentação completa

---

## 🚀 Próximos Passos

1. ✅ **Escolher Stack Tecnológica** (T1.1) - **NODE.JS/EXPRESS**
2. ✅ **Definir Entidades** - **CLIENTE, PRODUTO, PEDIDO**
3. ✅ **Setup Inicial Completo** (T1.2 - T1.5)
4. ✅ **Estrutura MVC Completa** (T2.1 - T2.5) - **CONCLUÍDA**
5. **Implementar Models** (T3.1 - T3.6)

---

## 📊 Progresso
- **Total de Tarefas:** 33
- **Concluídas:** 13
- **Pendentes:** 20
- **Progresso:** 39%

---

## 🎯 Critérios de Sucesso
- ✅ API REST funcional com todos os endpoints
- ✅ Padrão MVC implementado corretamente
- ✅ Documentação arquitetural completa
- ✅ Código limpo e bem estruturado
- ✅ Testes funcionando

---

## 🎯 Stack e Entidades Definidas

**✅ Stack Tecnológica:** Node.js/Express  
**✅ Entidades:** Cliente, Produto, Pedido  
**✅ Próxima Tarefa:** T1.2 - Criar estrutura base do projeto

**🚀 Vamos começar a implementação!**
