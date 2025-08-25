// Arquivo de entrada para Vercel Serverless Functions
// Este arquivo é necessário para o deploy na Vercel

const app = require('../src/server');

// Exporta o app Express para a Vercel
module.exports = app;
