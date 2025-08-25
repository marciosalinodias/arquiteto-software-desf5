require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar Prisma Client
const prisma = require('./utils/prisma');

// Importar rotas
const routes = require('./routes');

// Importar middlewares
const { loggingMiddleware, errorLoggingMiddleware } = require('./middleware/logging');
const { errorHandler, unhandledErrorHandler } = require('./middleware/errorHandler');
const { sanitizeInput, validateRateLimit, validatePayloadSize } = require('./middleware/validation');

// Importar Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configurar tratamento de erros não capturados
unhandledErrorHandler();

// Middlewares de segurança e parsing
app.use(helmet()); // Segurança
app.use(cors()); // CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON com limite
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded

// Middlewares de validação e sanitização
app.use(sanitizeInput); // Sanitizar dados de entrada
app.use(validatePayloadSize('10mb')); // Validar tamanho do payload
app.use(validateRateLimit); // Rate limiting

// Middlewares de logging
app.use(loggingMiddleware); // Logging personalizado
app.use(morgan('combined')); // Logging do Morgan

// Rota de teste (raiz)
app.get('/', (req, res) => {
  res.json({
    message: 'API REST MVC - Clientes, Produtos e Pedidos',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/v1'
  });
});

// Rota de health check (raiz)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API REST MVC - Documentação',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true
  }
}));

// Usar rotas da API
app.use(routes);

// Middleware de logging de erros
app.use(errorLoggingMiddleware);

// Middleware de tratamento de erros global
app.use(errorHandler);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor apenas se não estiver na Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${NODE_ENV}`);
    console.log(`📡 API disponível em: http://localhost:${PORT}`);
    console.log(`📚 Documentação: http://localhost:${PORT}/api/v1`);
    console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🔄 Nodemon configurado - reiniciando automaticamente`);
    console.log(`\n📋 Endpoints disponíveis:`);
    console.log(`   👥 Clientes: http://localhost:${PORT}/api/v1/clientes`);
    console.log(`   📦 Produtos: http://localhost:${PORT}/api/v1/produtos`);
    console.log(`   🛒 Pedidos: http://localhost:${PORT}/api/v1/pedidos`);
  });
}

module.exports = app;
