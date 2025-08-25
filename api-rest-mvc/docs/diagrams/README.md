# 📊 Diagramas XML para Draw.io

Esta pasta contém diagramas em formato XML que podem ser abertos e editados no [Draw.io](https://app.diagrams.net/) (agora chamado de diagrams.net).

## 🎯 Como Usar os Diagramas

### **1. Abrir no Draw.io:**
1. Acesse [app.diagrams.net](https://app.diagrams.net/)
2. Clique em **"Open Existing Diagram"**
3. Selecione o arquivo XML desejado
4. O diagrama será carregado e você poderá editá-lo

### **2. Importar no Draw.io:**
1. No Draw.io, vá em **File → Import From → Device**
2. Selecione o arquivo XML
3. O diagrama será importado automaticamente

### **3. Editar e Personalizar:**
- **Cores:** Clique nos elementos e altere as cores
- **Texto:** Duplo clique para editar textos
- **Posicionamento:** Arraste elementos para reposicionar
- **Tamanho:** Redimensione elementos arrastando as bordas

## 📋 Diagramas Disponíveis

### **🏗️ `architecture.xml`**
**Arquitetura de Alto Nível da API REST MVC**

- **Descrição:** Visão geral da arquitetura completa
- **Componentes:** Cliente, Server, Middlewares, Routes, Controllers, Services, Models, Database
- **Fluxo:** Mostra como os dados fluem entre as camadas
- **Uso:** Apresentações técnicas, documentação arquitetural

### **🔧 `components.xml`**
**Hierarquia de Componentes**

- **Descrição:** Estrutura de herança das classes
- **Componentes:** Base Classes, Models, Services, Controllers específicos
- **Relacionamentos:** Herança entre classes base e específicas
- **Uso:** Entendimento da estrutura de código, manutenção

### **🔄 `data-flow.xml`**
**Fluxo de Dados Detalhado**

- **Descrição:** Fluxo completo de uma requisição POST
- **Etapas:** 7 etapas do processamento de dados
- **Código:** Exemplos de código em cada etapa
- **Uso:** Debugging, otimização, entendimento do fluxo

### **🗄️ `database-schema.xml`**
**Schema do Banco de Dados**

- **Descrição:** Estrutura completa das tabelas
- **Tabelas:** Clientes, Produtos, Pedidos, ItensPedido
- **Relacionamentos:** Chaves estrangeiras e cardinalidade
- **Constraints:** Regras de validação do banco
- **Uso:** Modelagem de dados, migrações, consultas

## 🎨 Personalização

### **Cores Utilizadas:**
- **🟢 Verde:** Primary Keys, Sucesso
- **🔵 Azul:** Foreign Keys, Services
- **🔴 Vermelho:** Required Fields, Controllers
- **🟡 Amarelo:** Optional Fields, Middlewares
- **🟣 Roxo:** Timestamps, Models
- **⚪ Cinza:** Utils, Database

### **Estilos de Linha:**
- **Sólida:** Fluxo principal
- **Tracejada:** Fluxo de resposta
- **Grossa:** Relacionamentos importantes

## 📝 Como Contribuir

### **Adicionar Novos Diagramas:**
1. Crie o diagrama no Draw.io
2. Exporte como XML
3. Salve na pasta `diagrams/`
4. Atualize este README

### **Modificar Diagramas Existentes:**
1. Abra o arquivo XML no Draw.io
2. Faça as modificações necessárias
3. Salve o arquivo
4. Documente as mudanças

## 🔧 Dicas de Uso

### **Para Apresentações:**
- Use o modo de apresentação do Draw.io
- Exporte como PNG ou PDF para slides
- Mantenha a consistência visual

### **Para Documentação:**
- Inclua os diagramas no README principal
- Referencie os arquivos XML para edição
- Mantenha versões atualizadas

### **Para Desenvolvimento:**
- Use como referência durante o desenvolvimento
- Atualize conforme a arquitetura evolui
- Mantenha sincronizado com o código

## 📊 Exportação

### **Formatos Suportados:**
- **PNG:** Para documentação
- **PDF:** Para relatórios
- **SVG:** Para web
- **XML:** Para edição futura

### **Como Exportar:**
1. No Draw.io, vá em **File → Export As**
2. Escolha o formato desejado
3. Configure as opções (tamanho, qualidade)
4. Salve o arquivo

## 🚀 Próximos Passos

### **Diagramas Futuros:**
- **Sequence Diagram:** Interação entre componentes
- **Deployment Diagram:** Infraestrutura de deploy
- **Security Diagram:** Camadas de segurança
- **Performance Diagram:** Pontos de otimização

---

**Estes diagramas são ferramentas valiosas para entender, documentar e comunicar a arquitetura da API REST MVC. Mantenha-os atualizados conforme o projeto evolui!**
