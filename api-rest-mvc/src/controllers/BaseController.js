class BaseController {
  constructor(service) {
    this.service = service;
  }

  // Método para buscar todos os registros
  async getAll(req, res) {
    try {
      const { skip = 0, take = 10, ...filters } = req.query;
      const options = { skip: parseInt(skip), take: parseInt(take), ...filters };
      
      const result = await this.service.findWithPagination(options);
      
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Método para buscar por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);
      
      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Registro não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }

  // Método para criar novo registro
  async create(req, res) {
    try {
      const data = await this.service.create(req.validatedData);
      
      res.status(201).json({
        success: true,
        data,
        message: 'Registro criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      
      // Tratamento específico para erros de validação
      if (error.message.includes('já cadastrado') || error.message.includes('já existe')) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
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

  // Método para atualizar registro
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.validatedData);
      
      res.status(200).json({
        success: true,
        data,
        message: 'Registro atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Registro não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('já cadastrado') || error.message.includes('já existe')) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
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

  // Método para deletar registro
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Registro deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
      
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          error: 'Registro não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('não pode ser')) {
        return res.status(400).json({
          success: false,
          error: 'Operação não permitida',
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

  // Método para contar registros
  async count(req, res) {
    try {
      const filters = req.query;
      const total = await this.service.count(filters);
      
      res.status(200).json({
        success: true,
        data: { total }
      });
    } catch (error) {
      console.error('Erro ao contar registros:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
}

module.exports = BaseController;
