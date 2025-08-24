const BaseModel = require('./BaseModel');
const Cliente = require('./Cliente');
const Produto = require('./Produto');
const Pedido = require('./Pedido');

// Instâncias dos models
const clienteModel = new Cliente();
const produtoModel = new Produto();
const pedidoModel = new Pedido();

module.exports = {
  BaseModel,
  Cliente,
  Produto,
  Pedido,
  // Instâncias prontas para uso
  clienteModel,
  produtoModel,
  pedidoModel
};
