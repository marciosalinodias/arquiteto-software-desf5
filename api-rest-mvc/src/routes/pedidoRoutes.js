const express = require('express');
const { pedidoController } = require('../controllers');
const { validate, pedidoSchema, pedidoUpdateSchema } = require('../utils/validation');
const { validateId, validateQuery, pedidoQuerySchema } = require('../middleware/validation');
const { z } = require('zod');

const router = express.Router();

// Usar a instância já criada
const controller = pedidoController;

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar pedidos
 *     description: Retorna uma lista paginada de pedidos com filtros opcionais
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de itens para pular
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens para retornar
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, APROVADO, CANCELADO, ENTREGUE]
 *         description: Filtrar por status do pedido
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID do cliente
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Parâmetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/count:
 *   get:
 *     summary: Contar pedidos
 *     description: Retorna o total de pedidos com filtros opcionais
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, APROVADO, CANCELADO, ENTREGUE]
 *         description: Filtrar por status do pedido
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID do cliente
 *     responses:
 *       200:
 *         description: Contagem retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: integer
 *                   description: Total de pedidos
 *       400:
 *         description: Parâmetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     description: Retorna um pedido específico pelo ID com seus itens
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar pedido
 *     description: Cria um novo pedido com itens
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do cliente
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: string
 *                       format: uuid
 *                       description: ID do produto
 *                     quantidade:
 *                       type: integer
 *                       minimum: 1
 *                       description: Quantidade do item
 *                     precoUnitario:
 *                       type: number
 *                       minimum: 0
 *                       description: Preço unitário do item
 *                   required:
 *                     - produtoId
 *                     - quantidade
 *                     - precoUnitario
 *               observacao:
 *                 type: string
 *                 description: Observações do pedido
 *             required:
 *               - clienteId
 *               - itens
 *           example:
 *             clienteId: "uuid-do-cliente"
 *             itens:
 *               - produtoId: "uuid-do-produto"
 *                 quantidade: 2
 *                 precoUnitario: 2999.99
 *             observacao: "Entregar no período da tarde"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *                 message:
 *                   type: string
 *                   example: "Pedido criado com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente ou produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Estoque insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Atualizar pedido
 *     description: Atualiza um pedido existente
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do cliente
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, APROVADO, CANCELADO, ENTREGUE]
 *                 description: Status do pedido
 *               observacao:
 *                 type: string
 *                 description: Observações do pedido
 *           example:
 *             clienteId: "uuid-do-cliente"
 *             status: "APROVADO"
 *             observacao: "Pedido aprovado e em preparação"
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *                 message:
 *                   type: string
 *                   example: "Pedido atualizado com sucesso"
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Deletar pedido
 *     description: Remove um pedido do sistema
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pedido deletado com sucesso"
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/status/{status}:
 *   get:
 *     summary: Buscar pedidos por status
 *     description: Retorna pedidos com um status específico
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PENDENTE, APROVADO, CANCELADO, ENTREGUE]
 *         description: Status dos pedidos
 *     responses:
 *       200:
 *         description: Pedidos encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Nenhum pedido encontrado com este status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/cliente/{clienteId}:
 *   get:
 *     summary: Buscar pedidos do cliente
 *     description: Retorna todos os pedidos de um cliente específico
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Pedidos do cliente retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Cliente não encontrado ou sem pedidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID do cliente inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     description: Atualiza apenas o status de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, APROVADO, CANCELADO, ENTREGUE]
 *                 description: Novo status do pedido
 *             required:
 *               - status
 *           example:
 *             status: "APROVADO"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *                 message:
 *                   type: string
 *                   example: "Status atualizado com sucesso"
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Status inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/{id}/itens:
 *   post:
 *     summary: Adicionar item ao pedido
 *     description: Adiciona um novo item a um pedido existente
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produtoId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do produto
 *               quantidade:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantidade do item
 *               precoUnitario:
 *                 type: number
 *                 minimum: 0
 *                 description: Preço unitário do item
 *             required:
 *               - produtoId
 *               - quantidade
 *               - precoUnitario
 *           example:
 *             produtoId: "uuid-do-produto"
 *             quantidade: 1
 *             precoUnitario: 1999.99
 *     responses:
 *       200:
 *         description: Item adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *                 message:
 *                   type: string
 *                   example: "Item adicionado com sucesso"
 *       404:
 *         description: Pedido ou produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Estoque insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /pedidos/{id}/itens/{itemId}:
 *   delete:
 *     summary: Remover item do pedido
 *     description: Remove um item específico de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do pedido
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do item
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *                 message:
 *                   type: string
 *                   example: "Item removido com sucesso"
 *       404:
 *         description: Pedido ou item não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: IDs inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Schema para atualização de status
const statusSchema = z.object({
  status: z.enum(['PENDENTE', 'APROVADO', 'CANCELADO', 'ENTREGUE'])
});

// Schema para adicionar item ao pedido
const itemPedidoSchema = z.object({
  produtoId: z.string().uuid('ID do produto inválido'),
  quantidade: z.number().int().positive('Quantidade deve ser positiva'),
  precoUnitario: z.number().positive('Preço unitário deve ser positivo')
});

// Rotas CRUD básicas
router.get('/', validateQuery(pedidoQuerySchema), controller.getAll.bind(controller));
router.get('/count', validateQuery(pedidoQuerySchema), controller.count.bind(controller));
router.get('/:id', validateId, controller.getById.bind(controller));
router.post('/', validate(pedidoSchema), controller.create.bind(controller));
router.put('/:id', validateId, validate(pedidoUpdateSchema), controller.update.bind(controller));
router.delete('/:id', validateId, controller.delete.bind(controller));

// Rotas específicas
router.get('/status/:status', controller.getByStatus.bind(controller));
router.get('/cliente/:clienteId', controller.getByCliente.bind(controller));
router.patch('/:id/status', validateId, validate(statusSchema), controller.updateStatus.bind(controller));

// Rotas para gerenciar itens do pedido
router.post('/:id/itens', validateId, validate(itemPedidoSchema), controller.addItem.bind(controller));
router.delete('/:id/itens/:itemId', validateId, controller.removeItem.bind(controller));

module.exports = router;
