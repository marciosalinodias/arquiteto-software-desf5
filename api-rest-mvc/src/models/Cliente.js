const BaseModel = require('./BaseModel');

class Cliente extends BaseModel {
  constructor() {
    super('cliente');
  }

  // Métodos específicos do Cliente que estendem os métodos base
  async findAll(options = {}) {
    const { nome, email, ...otherOptions } = options;
    
    const where = {};
    if (nome) where.nome = { contains: nome, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };

    return await super.findAll({
      ...otherOptions,
      where,
      include: {
        pedidos: {
          include: {
            itensPedido: {
              include: {
                produto: true
              }
            }
          }
        }
      }
    });
  }

  async findById(id) {
    return await super.findById(id, {
      pedidos: {
        include: {
          itensPedido: {
            include: {
              produto: true
            }
          }
        }
      }
    });
  }

  async findByEmail(email) {
    return await super.findOne({ email });
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
        pedidos: {
          include: {
            itensPedido: {
              include: {
                produto: true
              }
            }
          }
        }
      }
    });
  }

  async count(options = {}) {
    const { nome, email } = options;
    
    const where = {};
    if (nome) where.nome = { contains: nome, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };

    return await super.count(where);
  }
}

module.exports = Cliente;
