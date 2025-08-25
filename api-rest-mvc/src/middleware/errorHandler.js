// Classe para erros personalizados da aplicação
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Função para criar erros operacionais
const createError = (message, statusCode) => {
  return new AppError(message, statusCode);
};

// Middleware de tratamento de erros global
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  console.error('🔥 Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Erro do Prisma - Unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo';
    const message = `Valor duplicado para o campo: ${field}`;
    error = createError(message, 400);
  }

  // Erro do Prisma - Record not found
  if (err.code === 'P2025') {
    const message = 'Registro não encontrado';
    error = createError(message, 404);
  }

  // Erro do Prisma - Foreign key constraint violation
  if (err.code === 'P2003') {
    const message = 'Referência inválida - registro relacionado não existe';
    error = createError(message, 400);
  }

  // Erro de validação do Zod
  if (err.name === 'ZodError') {
    const validationErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      message: 'Dados fornecidos são inválidos',
      details: validationErrors
    });
  }

  // Erro de cast do MongoDB (se fosse usado)
  if (err.name === 'CastError') {
    const message = 'ID inválido';
    error = createError(message, 400);
  }

  // Erro de validação do MongoDB (se fosse usado)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = createError(message, 400);
  }

  // Erro de JWT (se fosse usado)
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = createError(message, 401);
  }

  // Erro de JWT expirado (se fosse usado)
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = createError(message, 401);
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const message = 'JSON inválido';
    error = createError(message, 400);
  }

  // Erro de limite de payload
  if (err.type === 'entity.too.large') {
    const message = 'Payload muito grande';
    error = createError(message, 413);
  }

  // Definir status code padrão
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  // Resposta de erro
  const errorResponse = {
    success: false,
    error: statusCode === 500 ? 'Erro interno do servidor' : 'Erro na requisição',
    message: message
  };

  // Adicionar detalhes em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = {
      name: err.name,
      code: err.code,
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    };
  }

  res.status(statusCode).json(errorResponse);
};

// Middleware para capturar erros assíncronos
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware para capturar erros não tratados
const unhandledErrorHandler = () => {
  process.on('uncaughtException', (err) => {
    console.error('🔥 Uncaught Exception:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.error('🔥 Unhandled Rejection:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
  });
};

module.exports = {
  AppError,
  createError,
  errorHandler,
  asyncHandler,
  unhandledErrorHandler
};
