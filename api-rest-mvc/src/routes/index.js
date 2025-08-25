const express = require('express');
const clienteRoutes = require('./clienteRoutes');
const produtoRoutes = require('./produtoRoutes');
const pedidoRoutes = require('./pedidoRoutes');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sistema
 *   description: Endpoints do sistema
 */

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: Informações da API
 *     description: Retorna informações gerais sobre a API
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Informações da API retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API REST MVC - Clientes, Produtos e Pedidos"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 status:
 *                   type: string
 *                   example: "running"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     clientes:
 *                       type: string
 *                       example: "/api/v1/clientes"
 *                     produtos:
 *                       type: string
 *                       example: "/api/v1/produtos"
 *                     pedidos:
 *                       type: string
 *                       example: "/api/v1/pedidos"
 *                 documentation:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: "API para gerenciamento de clientes, produtos e pedidos"
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "CRUD completo para todas as entidades",
 *                         "Validação de dados com Zod",
 *                         "Paginação e filtros",
 *                         "Controle de estoque automático",
 *                         "Gestão de status de pedidos",
 *                         "Relacionamentos entre entidades"
 *                       ]
 */

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health Check
 *     description: Verifica o status de saúde da API
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 uptime:
 *                   type: number
 *                   description: Tempo de execução em segundos
 *                   example: 3600.5
 *                 environment:
 *                   type: string
 *                   example: "development"
 */

// Prefixo da API
const API_PREFIX = '/api/v1';

// Rotas da API
router.use(`${API_PREFIX}/clientes`, clienteRoutes);
router.use(`${API_PREFIX}/produtos`, produtoRoutes);
router.use(`${API_PREFIX}/pedidos`, pedidoRoutes);

// Rota de documentação da API
router.get(`${API_PREFIX}`, (req, res) => {
  res.json({
    message: 'API REST MVC - Clientes, Produtos e Pedidos',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      clientes: `${API_PREFIX}/clientes`,
      produtos: `${API_PREFIX}/produtos`,
      pedidos: `${API_PREFIX}/pedidos`
    },
    documentation: {
      description: 'API para gerenciamento de clientes, produtos e pedidos',
      features: [
        'CRUD completo para todas as entidades',
        'Validação de dados com Zod',
        'Paginação e filtros',
        'Controle de estoque automático',
        'Gestão de status de pedidos',
        'Relacionamentos entre entidades'
      ]
    }
  });
});

// Rota de health check da API
router.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
