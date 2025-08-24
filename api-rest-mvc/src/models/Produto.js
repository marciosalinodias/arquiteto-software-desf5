const BaseModel = require('./BaseModel');

class Produto extends BaseModel {
  constructor() {
    super('produto');
  }

  // Métodos específicos do Produto que estendem os métodos base
  async findAll(options = {}) {
    const { nome, categoria, ativo, ...otherOptions } = options;
    
    const where = {};
    if (nome) where.nome = { contains: nome, mode: 'insensitive' };
    if (categoria) where.categoria = { contains: categoria, mode: 'insensitive' };
    if (ativo !== undefined) where.ativo = ativo;

    return await super.findAll({
      ...otherOptions,
      where,
      include: {
        itensPedido: {
          include: {
            pedido: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    });
  }

  async findById(id) {
    return await super.findById(id, {
      itensPedido: {
        include: {
          pedido: {
            include: {
              cliente: true
            }
          }
        }
      }
    });
  }

  async findByName(nome) {
    return await super.findAll({
      where: {
        nome: {
          contains: nome,
          mode: 'insensitive'
        }
      },
      include: {
        itensPedido: {
          include: {
            pedido: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    });
  }

  async findByCategoria(categoria) {
    return await super.findAll({
      where: {
        categoria: {
          contains: categoria,
          mode: 'insensitive'
        }
      },
      include: {
        itensPedido: {
          include: {
            pedido: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    });
  }

  async findAtivos() {
    return await super.findAll({
      where: { ativo: true },
      include: {
        itensPedido: {
          include: {
            pedido: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    });
  }

  async count(options = {}) {
    const { nome, categoria, ativo } = options;
    
    const where = {};
    if (nome) where.nome = { contains: nome, mode: 'insensitive' };
    if (categoria) where.categoria = { contains: categoria, mode: 'insensitive' };
    if (ativo !== undefined) where.ativo = ativo;

    return await super.count(where);
  }

  // Método específico para atualizar estoque
  async updateEstoque(id, quantidade) {
    return await this.prisma.produto.update({
      where: { id },
      data: {
        estoque: {
          increment: quantidade
        }
      }
    });
  }
}

module.exports = Produto;
