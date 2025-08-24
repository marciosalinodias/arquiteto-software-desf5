const { z } = require('zod');

// Schema para validação de ID UUID
const idSchema = z.string().uuid('ID inválido');

// Middleware para validar ID na URL
const validateId = (req, res, next) => {
  try {
    const { id } = req.params;
    idSchema.parse(id);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'O ID fornecido não é válido'
      });
    }
    next(error);
  }
};

// Middleware para validar query parameters
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.validatedQuery = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Parâmetros de consulta inválidos',
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

// Schemas para query parameters
const clienteQuerySchema = z.object({
  nome: z.string().optional(),
  email: z.string().email().optional()
});

const produtoQuerySchema = z.object({
  nome: z.string().optional(),
  categoria: z.string().optional(),
  ativo: z.string().transform(val => val === 'true').optional()
});

const pedidoQuerySchema = z.object({
  status: z.enum(['PENDENTE', 'APROVADO', 'CANCELADO', 'ENTREGUE']).optional(),
  clienteId: z.string().uuid().optional()
});

module.exports = {
  validateId,
  validateQuery,
  clienteQuerySchema,
  produtoQuerySchema,
  pedidoQuerySchema
};
