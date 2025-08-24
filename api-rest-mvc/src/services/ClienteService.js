const BaseService = require('./BaseService');
const { clienteModel } = require('../models');

class ClienteService extends BaseService {
  constructor() {
    super(clienteModel);
  }

  // Buscar cliente por email
  async findByEmail(email) {
    return await this.model.findByEmail(email);
  }

  // Buscar clientes por nome
  async findByName(nome) {
    return await this.model.findByName(nome);
  }

  // Verificar se email já existe
  async emailExists(email, excludeId = null) {
    const cliente = await this.model.findByEmail(email);
    if (!cliente) return false;
    
    // Se excludeId for fornecido, verificar se é o mesmo registro
    if (excludeId && cliente.id === excludeId) return false;
    
    return true;
  }

  // Criar cliente com validação
  async createCliente(clienteData) {
    // Verificar se email já existe
    const emailExists = await this.emailExists(clienteData.email);
    if (emailExists) {
      throw new Error('Email já cadastrado');
    }

    return await this.model.create(clienteData);
  }

  // Atualizar cliente com validação
  async updateCliente(id, clienteData) {
    // Verificar se cliente existe
    const cliente = await this.model.findById(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    // Se estiver atualizando email, verificar se já existe
    if (clienteData.email) {
      const emailExists = await this.emailExists(clienteData.email, id);
      if (emailExists) {
        throw new Error('Email já cadastrado');
      }
    }

    return await this.model.update(id, clienteData);
  }

  // Buscar clientes com filtros
  async findClientes(filters = {}) {
    const { nome, email, skip = 0, take = 10 } = filters;
    
    const options = { 
      skip: parseInt(skip), 
      take: parseInt(take),
      nome,
      email
    };
    
    const data = await this.model.findAll(options);
    const total = await this.model.count({ nome, email });
    
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

module.exports = ClienteService;
