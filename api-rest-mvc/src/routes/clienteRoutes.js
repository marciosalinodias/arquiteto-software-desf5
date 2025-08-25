const express = require('express');
const { clienteController } = require('../controllers');
const { validate, clienteSchema } = require('../utils/validation');
const { validateId, validateQuery, clienteQuerySchema } = require('../middleware/validation');

const router = express.Router();

// Usar a instância já criada
const controller = clienteController;

// Rotas CRUD básicas
router.get('/', validateQuery(clienteQuerySchema), controller.getAll.bind(controller));
router.get('/count', validateQuery(clienteQuerySchema), controller.count.bind(controller));
router.get('/:id', validateId, controller.getById.bind(controller));
router.post('/', validate(clienteSchema), controller.create.bind(controller));
router.put('/:id', validateId, validate(clienteSchema), controller.update.bind(controller));
router.delete('/:id', validateId, controller.delete.bind(controller));

// Rotas específicas
router.get('/email/:email', controller.getByEmail.bind(controller));
router.get('/nome/:nome', controller.getByName.bind(controller));
router.get('/:id/pedidos', validateId, controller.getPedidos.bind(controller));

module.exports = router;
