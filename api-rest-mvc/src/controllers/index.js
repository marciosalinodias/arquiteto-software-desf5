const BaseController = require('./BaseController');
const ClienteController = require('./ClienteController');
const ProdutoController = require('./ProdutoController');
const PedidoController = require('./PedidoController');

// Instâncias dos controllers
const clienteController = new ClienteController();
const produtoController = new ProdutoController();
const pedidoController = new PedidoController();

module.exports = {
  BaseController,
  ClienteController,
  ProdutoController,
  PedidoController,
  // Instâncias prontas para uso
  clienteController,
  produtoController,
  pedidoController
};
