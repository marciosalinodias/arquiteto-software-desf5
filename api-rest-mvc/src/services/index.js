const BaseService = require('./BaseService');
const ClienteService = require('./ClienteService');
const ProdutoService = require('./ProdutoService');
const PedidoService = require('./PedidoService');

// Instâncias dos services
const clienteService = new ClienteService();
const produtoService = new ProdutoService();
const pedidoService = new PedidoService();

module.exports = {
  BaseService,
  ClienteService,
  ProdutoService,
  PedidoService,
  // Instâncias prontas para uso
  clienteService,
  produtoService,
  pedidoService
};
