const prisma = require('../utils/prisma');

class BaseModel {
  constructor(modelName) {
    this.modelName = modelName;
    this.prisma = prisma;
  }

  // Métodos base que podem ser usados por todos os models
  async findAll(options = {}) {
    const { skip = 0, take = 10, where = {}, orderBy = { createdAt: 'desc' }, include = {} } = options;
    
    return await this.prisma[this.modelName].findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy,
      include
    });
  }

  async findById(id, include = {}) {
    return await this.prisma[this.modelName].findUnique({
      where: { id },
      include
    });
  }

  async findOne(where, include = {}) {
    return await this.prisma[this.modelName].findFirst({
      where,
      include
    });
  }

  async count(where = {}) {
    return await this.prisma[this.modelName].count({ where });
  }

  async create(data) {
    return await this.prisma[this.modelName].create({
      data
    });
  }

  async update(id, data) {
    return await this.prisma[this.modelName].update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return await this.prisma[this.modelName].delete({
      where: { id }
    });
  }

  // Método para transações
  async transaction(callback) {
    return await this.prisma.$transaction(callback);
  }
}

module.exports = BaseModel;
