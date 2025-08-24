const BaseController = require('./BaseController');
const { produtoService } = require('../services');

class ProdutoController extends BaseController {
  constructor() {
    super(produtoService);
  }

  // Buscar produtos por nome
  async getByName(req, res) {
    try {
      const { nome } = req.params;
      const produtos = await this.service.findByName(nome);
      
      res.status(200).json({
        success: true,
        data: produtos,
        total: produtos.length
      });
    } catch (error) {
      console.error('Erro ao buscar produtos por nome:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Buscar produtos por categoria
  async getByCategoria(req, res) {
    try {
      const { categoria } = req.params;
      const produtos = await this.service.findByCategoria(categoria);
      
      res.status(200).json({
        success: true,
        data: produtos,
        total: produtos.length
      });
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Buscar produtos ativos
  async getAtivos(req, res) {
    try {
      const produtos = await this.service.findAtivos();
      
      res.status(200).json({
        success: true,
        data: produtos,
        total: produtos.length
      });
    } catch (error) {
      console.error('Erro ao buscar produtos ativos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Atualizar estoque do produto
  async updateEstoque(req, res) {
    try {
      const { id } = req.params;
      const { quantidade } = req.validatedData;
      
      const updatedProduto = await this.service.updateEstoque(id, quantidade);
      
      res.status(200).json({
        success: true,
        data: updatedProduto,
        message: 'Estoque atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('Estoque insuficiente')) {
        return res.status(400).json({
          success: false,
          error: 'Estoque insuficiente',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Ativar/Desativar produto
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      
      const updatedProduto = await this.service.toggleStatus(id);
      
      res.status(200).json({
        success: true,
        data: updatedProduto,
        message: `Produto ${updatedProduto.ativo ? 'ativado' : 'desativado'} com sucesso`
      });
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Sobrescreve create para usar service específico
  async create(req, res) {
    try {
      const data = await this.service.createProduto(req.validatedData);
      
      res.status(201).json({
        success: true,
        data,
        message: 'Produto criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      
      if (error.message.includes('já cadastrado') || error.message.includes('já existe')) {
        return res.status(400).json({
          success: false,
          error: 'Nome já existe',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Sobrescreve update para usar service específico
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await this.service.updateProduto(id, req.validatedData);
      
      res.status(200).json({
        success: true,
        data,
        message: 'Produto atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('já cadastrado') || error.message.includes('já existe')) {
        return res.status(400).json({
          success: false,
          error: 'Nome já existe',
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
}

module.exports = ProdutoController;
