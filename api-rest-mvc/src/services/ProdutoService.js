const BaseService = require('./BaseService');
const { produtoModel } = require('../models');

class ProdutoService extends BaseService {
  constructor() {
    super(produtoModel);
  }

  // Buscar produtos por nome
  async findByName(nome) {
    return await this.model.findByName(nome);
  }

  // Buscar produtos por categoria
  async findByCategoria(categoria) {
    return await this.model.findByCategoria(categoria);
  }

  // Buscar produtos ativos
  async findAtivos() {
    return await this.model.findAtivos();
  }

  // Verificar se nome já existe
  async nameExists(nome, excludeId = null) {
    const produtos = await this.model.findByName(nome);
    if (produtos.length === 0) return false;
    
    // Se excludeId for fornecido, verificar se é o mesmo registro
    if (excludeId) {
      const hasConflict = produtos.some(produto => produto.id !== excludeId);
      return hasConflict;
    }
    
    return true;
  }

  // Verificar se há estoque suficiente
  async hasStock(produtoId, quantidade) {
    const produto = await this.model.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }
    
    return produto.estoque >= quantidade;
  }

  // Atualizar estoque
  async updateEstoque(produtoId, quantidade) {
    const produto = await this.model.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    // Verificar se há estoque suficiente para decremento
    if (quantidade < 0 && produto.estoque + quantidade < 0) {
      throw new Error(`Estoque insuficiente. Disponível: ${produto.estoque}, solicitado: ${Math.abs(quantidade)}`);
    }

    return await this.model.updateEstoque(produtoId, quantidade);
  }

  // Ativar/Desativar produto
  async toggleStatus(produtoId) {
    const produto = await this.model.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    return await this.model.update(produtoId, { ativo: !produto.ativo });
  }

  // Criar produto com validação
  async createProduto(produtoData) {
    // Verificar se nome já existe
    const nameExists = await this.nameExists(produtoData.nome);
    if (nameExists) {
      throw new Error('Nome já cadastrado');
    }

    return await this.model.create(produtoData);
  }

  // Atualizar produto com validação
  async updateProduto(id, produtoData) {
    // Verificar se produto existe
    const produto = await this.model.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    // Se estiver atualizando nome, verificar se já existe
    if (produtoData.nome) {
      const nameExists = await this.nameExists(produtoData.nome, id);
      if (nameExists) {
        throw new Error('Nome já cadastrado');
      }
    }

    return await this.model.update(id, produtoData);
  }

  // Buscar produtos com filtros
  async findProdutos(filters = {}) {
    const { nome, categoria, ativo, skip = 0, take = 10 } = filters;
    
    const options = { 
      skip: parseInt(skip), 
      take: parseInt(take),
      nome,
      categoria,
      ativo: ativo === 'true' ? true : ativo === 'false' ? false : undefined
    };
    
    const data = await this.model.findAll(options);
    const total = await this.model.count({ nome, categoria, ativo: options.ativo });
    
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

module.exports = ProdutoService;
