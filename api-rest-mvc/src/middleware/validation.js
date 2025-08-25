const { z } = require('zod');

// Schema para validação de ID UUID
const idSchema = z.string().uuid('ID inválido');

// Schema para validação de paginação
const paginationSchema = z.object({
  skip: z.string().transform(val => parseInt(val)).pipe(z.number().min(0, 'Skip deve ser >= 0')).optional(),
  take: z.string().transform(val => parseInt(val)).pipe(z.number().min(1, 'Take deve ser >= 1').max(100, 'Take deve ser <= 100')).optional()
});

// Schema para validação de ordenação
const orderBySchema = z.object({
  orderBy: z.enum(['createdAt', 'updatedAt', 'nome', 'email', 'preco', 'status']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

// Middleware para validar ID na URL
const validateId = (req, res, next) => {
  try {
    const { id } = req.params;
    idSchema.parse(id);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
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
          success: false,
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

// Middleware para validar paginação
const validatePagination = (req, res, next) => {
  try {
    const validatedPagination = paginationSchema.parse(req.query);
    req.validatedPagination = validatedPagination;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros de paginação inválidos',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// Middleware para validar ordenação
const validateOrderBy = (req, res, next) => {
  try {
    const validatedOrderBy = orderBySchema.parse(req.query);
    req.validatedOrderBy = validatedOrderBy;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros de ordenação inválidos',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// Middleware para validar rate limiting (simulado)
const validateRateLimit = (req, res, next) => {
  // Simulação de rate limiting
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Em produção, usar Redis ou similar
  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = {};
  }
  
  if (!req.app.locals.rateLimit[clientIP]) {
    req.app.locals.rateLimit[clientIP] = {
      count: 0,
      resetTime: now + 60000 // 1 minuto
    };
  }
  
  const rateLimit = req.app.locals.rateLimit[clientIP];
  
  if (now > rateLimit.resetTime) {
    rateLimit.count = 0;
    rateLimit.resetTime = now + 60000;
  }
  
  rateLimit.count++;
  
  if (rateLimit.count > 100) { // 100 requests por minuto
    return res.status(429).json({
      success: false,
      error: 'Rate limit excedido',
      message: 'Muitas requisições. Tente novamente em 1 minuto.'
    });
  }
  
  next();
};

// Middleware para validar tamanho do payload
const validatePayloadSize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSizeBytes = parseSize(maxSize);
    
    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        success: false,
        error: 'Payload muito grande',
        message: `Tamanho máximo permitido: ${maxSize}`
      });
    }
    
    next();
  };
};

// Função para converter tamanho em bytes
const parseSize = (size) => {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+)([kmg]?b)$/);
  if (!match) return 1024 * 1024; // 1MB padrão
  
  const [, value, unit] = match;
  return parseInt(value) * units[unit || 'b'];
};

// Schemas para query parameters específicos
const clienteQuerySchema = z.object({
  nome: z.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  email: z.string().email('Email inválido').optional(),
  skip: z.string().transform(val => parseInt(val)).pipe(z.number().min(0)).optional(),
  take: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional()
});

const produtoQuerySchema = z.object({
  nome: z.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  categoria: z.string().min(1, 'Categoria deve ter pelo menos 1 caractere').optional(),
  ativo: z.string().transform(val => val === 'true').optional(),
  skip: z.string().transform(val => parseInt(val)).pipe(z.number().min(0)).optional(),
  take: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional()
});

const pedidoQuerySchema = z.object({
  status: z.enum(['PENDENTE', 'APROVADO', 'CANCELADO', 'ENTREGUE']).optional(),
  clienteId: z.string().uuid('ID do cliente inválido').optional(),
  skip: z.string().transform(val => parseInt(val)).pipe(z.number().min(0)).optional(),
  take: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional()
});

// Middleware para sanitização de dados
const sanitizeInput = (req, res, next) => {
  // Sanitizar strings
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, ''); // Remover caracteres perigosos
  };
  
  // Sanitizar objeto
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };
  
  // Sanitizar body, query e params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  
  next();
};

module.exports = {
  validateId,
  validateQuery,
  validatePagination,
  validateOrderBy,
  validateRateLimit,
  validatePayloadSize,
  sanitizeInput,
  clienteQuerySchema,
  produtoQuerySchema,
  pedidoQuerySchema
};
