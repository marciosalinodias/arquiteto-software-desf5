const fs = require('fs');
const path = require('path');

// Função para formatar timestamp
const formatTimestamp = () => {
  return new Date().toISOString();
};

// Função para formatar duração
const formatDuration = (startTime) => {
  const duration = Date.now() - startTime;
  return `${duration}ms`;
};

// Função para obter IP do cliente
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.headers['x-forwarded-for'] ||
         'unknown';
};

// Função para formatar log
const formatLog = (req, res, duration, error = null) => {
  const timestamp = formatTimestamp();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const statusCode = res.statusCode;
  const userAgent = req.get('User-Agent') || 'unknown';
  const ip = getClientIP(req);
  const contentLength = res.get('Content-Length') || 0;
  
  let logMessage = `[${timestamp}] ${method} ${url} ${statusCode} ${contentLength} - ${duration} - ${ip} - ${userAgent}`;
  
  if (error) {
    logMessage += ` - ERROR: ${error.message}`;
  }
  
  return logMessage;
};

// Função para escrever log em arquivo
const writeToFile = (logMessage) => {
  // Na Vercel, não podemos escrever arquivos no sistema de arquivos
  // Apenas log no console
  console.log(`[FILE LOG] ${logMessage}`);
  
  // Em ambiente local, podemos escrever arquivos
  if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    try {
      const logDir = path.join(__dirname, '../../logs');
      const logFile = path.join(logDir, `api-${new Date().toISOString().split('T')[0]}.log`);
      
      // Criar diretório de logs se não existir
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      // Escrever log no arquivo
      fs.appendFileSync(logFile, logMessage + '\n');
    } catch (error) {
      console.error('Erro ao escrever log em arquivo:', error.message);
    }
  }
};

// Middleware de logging
const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Log da requisição
  console.log(`📥 ${req.method} ${req.originalUrl} - ${getClientIP(req)}`);
  
  // Interceptar o final da resposta
  const originalSend = res.send;
  res.send = function(data) {
    const duration = formatDuration(startTime);
    const logMessage = formatLog(req, res, duration);
    
    // Log no console
    console.log(`📤 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}`);
    
    // Log em arquivo (apenas em desenvolvimento local)
    writeToFile(logMessage);
    
    // Chamar o método original
    originalSend.call(this, data);
  };
  
  // Interceptar erros
  const originalJson = res.json;
  res.json = function(data) {
    const duration = formatDuration(startTime);
    const logMessage = formatLog(req, res, duration);
    
    // Log no console
    console.log(`📤 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}`);
    
    // Log em arquivo (apenas em desenvolvimento local)
    writeToFile(logMessage);
    
    // Chamar o método original
    originalJson.call(this, data);
  };
  
  next();
};

// Middleware para logging de erros
const errorLoggingMiddleware = (err, req, res, next) => {
  const duration = formatDuration(req.startTime || Date.now());
  const logMessage = formatLog(req, res, duration, err);
  
  // Log de erro no console
  console.error(`❌ ${req.method} ${req.originalUrl} - ERROR: ${err.message}`);
  console.error(err.stack);
  
  // Log em arquivo (apenas em desenvolvimento local)
  writeToFile(logMessage);
  
  next(err);
};

module.exports = {
  loggingMiddleware,
  errorLoggingMiddleware
};
