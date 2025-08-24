const express = require('express');
const { pedidoController } = require('../controllers');
const { validate, pedidoSchema, pedidoUpdateSchema } = require('../utils/validation');
const { validateId, validateQuery, pedidoQuerySchema } = require('../middleware/validation');
const { z } = require('zod');

const router = express.Router();

// Instância do controller
const controller = new pedidoController();

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
