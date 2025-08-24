const BaseController = require('./BaseController');
const { clienteService } = require('../services');

class ClienteController extends BaseController {
  constructor() {
    super(clienteService);
  }

  // Buscar cliente por email
  async getByEmail(req, res) {
    try {
      const { email } = req.params;
      const cliente = await this.service.findByEmail(email);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: cliente
      });
    } catch (error) {
      console.error('Erro ao buscar cliente por email:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Buscar clientes por nome
  async getByName(req, res) {
    try {
      const { nome } = req.params;
      const clientes = await this.service.findByName(nome);
      
      res.status(200).json({
        success: true,
        data: clientes,
        total: clientes.length
      });
    } catch (error) {
      console.error('Erro ao buscar clientes por nome:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Buscar pedidos de um cliente
  async getPedidos(req, res) {
    try {
      const { id } = req.params;
      
      const cliente = await this.service.findById(id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      // Usar o service de Pedido para buscar pedidos do cliente
      const { pedidoService } = require('../services');
      const pedidos = await pedidoService.findByCliente(id);
      
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

  // Sobrescreve create para usar service específico
  async create(req, res) {
    try {
      const data = await this.service.createCliente(req.validatedData);
      
      res.status(201).json({
        success: true,
        data,
        message: 'Cliente criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({
          success: false,
          error: 'Email já cadastrado',
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
      const data = await this.service.updateCliente(id, req.validatedData);
      
      res.status(200).json({
        success: true,
        data,
        message: 'Cliente atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('já cadastrado')) {
        return res.status(400).json({
          success: false,
          error: 'Email já cadastrado',
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

module.exports = ClienteController;
