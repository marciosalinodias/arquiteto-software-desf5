const express = require('express');
const { produtoController } = require('../controllers');
const { validate, produtoSchema } = require('../utils/validation');
const { validateId, validateQuery, produtoQuerySchema } = require('../middleware/validation');
const { z } = require('zod');

const router = express.Router();

// Usar a instância já criada
const controller = produtoController;

// Schema para atualização de estoque
const estoqueSchema = z.object({
  quantidade: z.number().int('Quantidade deve ser um número inteiro')
});

// Schema para toggle status (não precisa de dados)
const toggleStatusSchema = z.object({});

// Rotas CRUD básicas
router.get('/', validateQuery(produtoQuerySchema), controller.getAll.bind(controller));
router.get('/count', validateQuery(produtoQuerySchema), controller.count.bind(controller));
router.get('/:id', validateId, controller.getById.bind(controller));
router.post('/', validate(produtoSchema), controller.create.bind(controller));
router.put('/:id', validateId, validate(produtoSchema), controller.update.bind(controller));
router.delete('/:id', validateId, controller.delete.bind(controller));

// Rotas específicas
router.get('/nome/:nome', controller.getByName.bind(controller));
router.get('/categoria/:categoria', controller.getByCategoria.bind(controller));
router.get('/ativos', controller.getAtivos.bind(controller));
router.patch('/:id/estoque', validateId, validate(estoqueSchema), controller.updateEstoque.bind(controller));
router.patch('/:id/toggle-status', validateId, validate(toggleStatusSchema), controller.toggleStatus.bind(controller));

module.exports = router;
