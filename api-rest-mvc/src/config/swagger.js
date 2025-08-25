const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST MVC - Clientes, Produtos e Pedidos',
      version: '1.0.0',
      description: 'API REST completa desenvolvida com Node.js, Express e Prisma, seguindo o padrão arquitetural MVC para gerenciamento de clientes, produtos e pedidos.',
      contact: {
        name: 'Suporte API',
        email: 'suporte@api.com',
        url: 'https://github.com/user/api-rest-mvc'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.exemplo.com/api/v1',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        // Para futuras implementações de autenticação
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Schema do Cliente
        Cliente: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do cliente'
            },
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nome completo do cliente'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do cliente'
            },
            telefone: {
              type: 'string',
              description: 'Telefone do cliente'
            },
            endereco: {
              type: 'string',
              description: 'Endereço do cliente'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            }
          },
          required: ['nome', 'email']
        },
        
        // Schema do Produto
        Produto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do produto'
            },
            nome: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nome do produto'
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada do produto'
            },
            preco: {
              type: 'number',
              minimum: 0,
              description: 'Preço do produto'
            },
            estoque: {
              type: 'integer',
              minimum: 0,
              description: 'Quantidade em estoque'
            },
            categoria: {
              type: 'string',
              description: 'Categoria do produto'
            },
            ativo: {
              type: 'boolean',
              description: 'Status ativo/inativo do produto'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            }
          },
          required: ['nome', 'preco']
        },
        
        // Schema do Pedido
        Pedido: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do pedido'
            },
            clienteId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do cliente'
            },
            status: {
              type: 'string',
              enum: ['PENDENTE', 'APROVADO', 'CANCELADO', 'ENTREGUE'],
              description: 'Status do pedido'
            },
            total: {
              type: 'number',
              minimum: 0,
              description: 'Valor total do pedido'
            },
            observacao: {
              type: 'string',
              description: 'Observações do pedido'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            },
            cliente: {
              $ref: '#/components/schemas/Cliente'
            },
            itensPedido: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ItemPedido'
              }
            }
          },
          required: ['clienteId']
        },
        
        // Schema do Item do Pedido
        ItemPedido: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do item'
            },
            pedidoId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do pedido'
            },
            produtoId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do produto'
            },
            quantidade: {
              type: 'integer',
              minimum: 1,
              description: 'Quantidade do item'
            },
            precoUnitario: {
              type: 'number',
              minimum: 0,
              description: 'Preço unitário do item'
            },
            subtotal: {
              type: 'number',
              minimum: 0,
              description: 'Subtotal do item'
            },
            produto: {
              $ref: '#/components/schemas/Produto'
            }
          },
          required: ['produtoId', 'quantidade', 'precoUnitario']
        },
        
        // Schema de Erro
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Tipo do erro'
            },
            message: {
              type: 'string',
              description: 'Descrição do erro'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Campo com erro'
                  },
                  message: {
                    type: 'string',
                    description: 'Mensagem de erro do campo'
                  }
                }
              }
            }
          }
        },
        
        // Schema de Resposta com Paginação
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              description: 'Lista de itens'
            },
            pagination: {
              type: 'object',
              properties: {
                skip: {
                  type: 'integer',
                  description: 'Itens pulados'
                },
                take: {
                  type: 'integer',
                  description: 'Itens retornados'
                },
                total: {
                  type: 'integer',
                  description: 'Total de itens'
                }
              }
            }
          }
        }
      }
    },
    security: [
      // Para futuras implementações de autenticação
      // {
      //   bearerAuth: []
      // }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
