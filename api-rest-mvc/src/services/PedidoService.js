const BaseService = require('./BaseService');
const { pedidoModel, produtoModel, clienteModel } = require('../models');

class PedidoService extends BaseService {
  constructor() {
    super(pedidoModel);
  }

  // Buscar pedidos por status
  async findByStatus(status) {
    return await this.model.findByStatus(status);
  }

  // Buscar pedidos por cliente
  async findByCliente(clienteId) {
    return await this.model.findByCliente(clienteId);
  }

  // Atualizar status do pedido
  async updateStatus(pedidoId, status) {
    const pedido = await this.model.findById(pedidoId);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    return await this.model.updateStatus(pedidoId, status);
  }

  // Validar itens do pedido
  async validateItens(itens) {
    const validations = [];

    for (const item of itens) {
      const produto = await produtoModel.findById(item.produtoId);
      
      if (!produto) {
        validations.push({
          produtoId: item.produtoId,
          error: 'Produto não encontrado'
        });
        continue;
      }

      if (!produto.ativo) {
        validations.push({
          produtoId: item.produtoId,
          nome: produto.nome,
          error: 'Produto inativo'
        });
        continue;
      }

      if (item.quantidade > produto.estoque) {
        validations.push({
          produtoId: item.produtoId,
          nome: produto.nome,
          error: 'Estoque insuficiente',
          estoque: produto.estoque,
          solicitado: item.quantidade
        });
      }
    }

    if (validations.length > 0) {
      throw new Error('Validação de itens falhou');
    }
  }

  // Criar pedido com validações
  async createPedido(pedidoData) {
    const { clienteId, itens, ...pedidoInfo } = pedidoData;

    // Verificar se cliente existe
    const cliente = await clienteModel.findById(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    // Validar itens do pedido
    await this.validateItens(itens);

    // Criar pedido com transação
    const pedido = await this.model.transaction(async (prisma) => {
      // Criar pedido
      const novoPedido = await this.model.create({
        clienteId,
        itens,
        ...pedidoInfo
      });

      // Atualizar estoque dos produtos
      for (const item of itens) {
        await produtoModel.updateEstoque(item.produtoId, -item.quantidade);
      }

      return novoPedido;
    });

    return pedido;
  }

  // Adicionar item ao pedido
  async addItem(pedidoId, itemData) {
    const { produtoId, quantidade, precoUnitario } = itemData;

    // Verificar se pedido existe
    const pedido = await this.model.findById(pedidoId);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    // Verificar se produto existe e está ativo
    const produto = await produtoModel.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    if (!produto.ativo) {
      throw new Error('Produto inativo');
    }

    // Verificar estoque
    if (quantidade > produto.estoque) {
      throw new Error(`Estoque insuficiente. Disponível: ${produto.estoque}, solicitado: ${quantidade}`);
    }

    // Adicionar item
    const itemPedido = await this.model.addItem(pedidoId, {
      produtoId,
      quantidade,
      precoUnitario
    });

    // Atualizar estoque
    await produtoModel.updateEstoque(produtoId, -quantidade);

    return itemPedido;
  }

  // Remover item do pedido
  async removeItem(pedidoId, itemId) {
    // Verificar se pedido existe
    const pedido = await this.model.findById(pedidoId);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    const itemPedido = await this.model.removeItem(pedidoId, itemId);

    // Restaurar estoque
    await produtoModel.updateEstoque(itemPedido.produtoId, itemPedido.quantidade);

    return itemPedido;
  }

  // Atualizar pedido com validações
  async updatePedido(pedidoId, pedidoData) {
    const pedido = await this.model.findById(pedidoId);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    // Não permitir atualização de pedidos finalizados
    if (pedido.status === 'ENTREGUE' || pedido.status === 'CANCELADO') {
      throw new Error('Pedidos entregues ou cancelados não podem ser alterados');
    }

    return await this.model.update(pedidoId, pedidoData);
  }

  // Deletar pedido com validações
  async deletePedido(pedidoId) {
    const pedido = await this.model.findById(pedidoId);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    // Não permitir exclusão de pedidos entregues
    if (pedido.status === 'ENTREGUE') {
      throw new Error('Pedidos entregues não podem ser excluídos');
    }

    // Restaurar estoque dos produtos se pedido não foi entregue
    if (pedido.status !== 'ENTREGUE') {
      for (const item of pedido.itensPedido) {
        await produtoModel.updateEstoque(item.produtoId, item.quantidade);
      }
    }

    await this.model.delete(pedidoId);
    return true;
  }

  // Buscar pedidos com filtros
  async findPedidos(filters = {}) {
    const { status, clienteId, skip = 0, take = 10 } = filters;
    
    const options = { 
      skip: parseInt(skip), 
      take: parseInt(take),
      status,
      clienteId
    };
    
    const data = await this.model.findAll(options);
    const total = await this.model.count({ status, clienteId });
    
    return {
      data,
      pagination: {
        skip: parseInt(skip),
        take: parseInt(take),
        total
      }
    };
  }
}

module.exports = PedidoService;
