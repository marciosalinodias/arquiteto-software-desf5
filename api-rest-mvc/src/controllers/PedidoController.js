const BaseController = require('./BaseController');
const { pedidoService } = require('../services');

class PedidoController extends BaseController {
  constructor() {
    super(pedidoService);
  }

  // Buscar pedidos por status
  async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const pedidos = await this.service.findByStatus(status);
      
      res.status(200).json({
        success: true,
        data: pedidos,
        total: pedidos.length
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos por status:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Buscar pedidos por cliente
  async getByCliente(req, res) {
    try {
      const { clienteId } = req.params;
      
      // Verificar se cliente existe usando ClienteService
      const { clienteService } = require('../services');
      const cliente = await clienteService.findById(clienteId);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      const pedidos = await this.service.findByCliente(clienteId);
      
      res.status(200).json({
        success: true,
        data: {
          cliente: {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email
          },
          pedidos
        },
        total: pedidos.length
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos do cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Atualizar status do pedido
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.validatedData;
      
      const updatedPedido = await this.service.updateStatus(id, status);
      
      res.status(200).json({
        success: true,
        data: updatedPedido,
        message: `Status do pedido atualizado para ${status}`
      });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado',
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

  // Adicionar item ao pedido
  async addItem(req, res) {
    try {
      const { id } = req.params;
      const itemData = req.validatedData;
      
      const itemPedido = await this.service.addItem(id, itemData);
      
      res.status(201).json({
        success: true,
        data: itemPedido,
        message: 'Item adicionado ao pedido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao adicionar item ao pedido:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Pedido ou produto não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('inativo') || error.message.includes('Estoque insuficiente')) {
        return res.status(400).json({
          success: false,
          error: 'Produto não disponível',
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

  // Remover item do pedido
  async removeItem(req, res) {
    try {
      const { id, itemId } = req.params;
      
      await this.service.removeItem(id, itemId);
      
      res.status(200).json({
        success: true,
        message: 'Item removido do pedido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover item do pedido:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado',
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
      const data = await this.service.createPedido(req.validatedData);
      
      res.status(201).json({
        success: true,
        data,
        message: 'Pedido criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Cliente ou produto não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('inativo') || error.message.includes('Estoque insuficiente')) {
        return res.status(400).json({
          success: false,
          error: 'Produto não disponível',
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
      const data = await this.service.updatePedido(id, req.validatedData);
      
      res.status(200).json({
        success: true,
        data,
        message: 'Pedido atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('não pode ser alterado')) {
        return res.status(400).json({
          success: false,
          error: 'Pedido não pode ser alterado',
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

  // Sobrescreve delete para usar service específico
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.deletePedido(id);
      
      res.status(200).json({
        success: true,
        message: 'Pedido deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('não pode ser excluído')) {
        return res.status(400).json({
          success: false,
          error: 'Pedido não pode ser excluído',
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

module.exports = PedidoController;
