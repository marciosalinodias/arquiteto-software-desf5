class BaseService {
  constructor(model) {
    this.model = model;
  }

  // Buscar todos os registros
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  // Buscar por ID
  async findById(id) {
    return await this.model.findById(id);
  }

  // Contar registros
  async count(filters = {}) {
    return await this.model.count(filters);
  }

  // Criar registro
  async create(data) {
    return await this.model.create(data);
  }

  // Atualizar registro
  async update(id, data) {
    return await this.model.update(id, data);
  }

  // Deletar registro
  async delete(id) {
    return await this.model.delete(id);
  }

  // Verificar se registro existe
  async exists(id) {
    const record = await this.model.findById(id);
    return !!record;
  }

  // Buscar com paginação
  async findWithPagination(options = {}) {
    const { skip = 0, take = 10, ...filters } = options;
    
    const data = await this.model.findAll({
      skip: parseInt(skip),
      take: parseInt(take),
      ...filters
    });
    
    const total = await this.model.count(filters);
    
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

module.exports = BaseService;
