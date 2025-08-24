const BaseModel = require('./BaseModel');

class Pedido extends BaseModel {
  constructor() {
    super('pedido');
  }

  // Métodos específicos do Pedido que estendem os métodos base
  async findAll(options = {}) {
    const { status, clienteId, ...otherOptions } = options;
    
    const where = {};
    if (status) where.status = status;
    if (clienteId) where.clienteId = clienteId;

    return await super.findAll({
      ...otherOptions,
      where,
      include: {
        cliente: true,
        itensPedido: {
          include: {
            produto: true
          }
        }
      }
    });
  }

  async findById(id) {
    return await super.findById(id, {
      cliente: true,
      itensPedido: {
        include: {
          produto: true
        }
      }
    });
  }

  async findByCliente(clienteId) {
    return await super.findAll({
      where: { clienteId },
      include: {
        cliente: true,
        itensPedido: {
          include: {
            produto: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByStatus(status) {
    return await super.findAll({
      where: { status },
      include: {
        cliente: true,
        itensPedido: {
          include: {
            produto: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async count(options = {}) {
    const { status, clienteId } = options;
    
    const where = {};
    if (status) where.status = status;
    if (clienteId) where.clienteId = clienteId;

    return await super.count(where);
  }

  // Método específico para criar pedido com itens
  async create(pedidoData) {
    const { itens, ...pedidoInfo } = pedidoData;
    
    // Calcular total do pedido
    const total = itens.reduce((sum, item) => {
      return sum + (item.quantidade * item.precoUnitario);
    }, 0);

    return await this.prisma.pedido.create({
      data: {
        ...pedidoInfo,
        total,
        itensPedido: {
          create: itens.map(item => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: item.quantidade * item.precoUnitario
          }))
        }
      },
      include: {
        cliente: true,
        itensPedido: {
          include: {
            produto: true
          }
        }
      }
    });
  }

  async update(id, pedidoData) {
    return await this.prisma.pedido.update({
      where: { id },
      data: pedidoData,
      include: {
        cliente: true,
        itensPedido: {
          include: {
            produto: true
          }
        }
      }
    });
  }

  // Método específico para atualizar status
  async updateStatus(id, status) {
    return await this.prisma.pedido.update({
      where: { id },
      data: { status },
      include: {
        cliente: true,
        itensPedido: {
          include: {
            produto: true
          }
        }
      }
    });
  }

  // Métodos específicos para gerenciar itens do pedido
  async addItem(pedidoId, itemData) {
    const { produtoId, quantidade, precoUnitario } = itemData;
    const subtotal = quantidade * precoUnitario;

    // Criar item do pedido
    const itemPedido = await this.prisma.itemPedido.create({
      data: {
        pedidoId,
        produtoId,
        quantidade,
        precoUnitario,
        subtotal
      },
      include: {
        produto: true
      }
    });

    // Atualizar total do pedido
    await this.updateTotal(pedidoId);

    return itemPedido;
  }

  async removeItem(pedidoId, itemId) {
    const itemPedido = await this.prisma.itemPedido.delete({
      where: { id: itemId }
    });

    // Atualizar total do pedido
    await this.updateTotal(pedidoId);

    return itemPedido;
  }

  async updateTotal(pedidoId) {
    const itens = await this.prisma.itemPedido.findMany({
      where: { pedidoId }
    });

    const total = itens.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal);
    }, 0);

    return await this.prisma.pedido.update({
      where: { id: pedidoId },
      data: { total }
    });
  }
}

module.exports = Pedido;
