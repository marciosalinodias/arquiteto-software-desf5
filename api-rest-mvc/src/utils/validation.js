const { z } = require('zod');

// Schema de validação para Cliente
const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  endereco: z.string().optional()
});

// Schema de validação para Produto
const produtoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  descricao: z.string().optional(),
  preco: z.number().positive('Preço deve ser positivo'),
  estoque: z.number().int().min(0, 'Estoque não pode ser negativo'),
  categoria: z.string().optional(),
  ativo: z.boolean().optional().default(true)
});

// Schema de validação para Item do Pedido
const itemPedidoSchema = z.object({
  produtoId: z.string().uuid('ID do produto inválido'),
  quantidade: z.number().int().positive('Quantidade deve ser positiva'),
  precoUnitario: z.number().positive('Preço unitário deve ser positivo')
});

// Schema de validação para Pedido
const pedidoSchema = z.object({
  clienteId: z.string().uuid('ID do cliente inválido'),
  status: z.enum(['PENDENTE', 'APROVADO', 'CANCELADO', 'ENTREGUE']).optional().default('PENDENTE'),
  observacao: z.string().optional(),
  itens: z.array(itemPedidoSchema).min(1, 'Pedido deve ter pelo menos 1 item')
});

// Schema de validação para atualização de Pedido
const pedidoUpdateSchema = z.object({
  status: z.enum(['PENDENTE', 'APROVADO', 'CANCELADO', 'ENTREGUE']).optional(),
  observacao: z.string().optional()
});

// Middleware de validação
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

module.exports = {
  clienteSchema,
  produtoSchema,
  pedidoSchema,
  pedidoUpdateSchema,
  validate
};
