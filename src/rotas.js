const express = require('express');
const usuarios = require('./Controladores/perfil');
const { logarUsuario } = require('./Controladores/login');
const postagens = require('./Controladores/postagens');
const auth = require('./Middleware/middleware');

const rotas = express();

rotas.post('/cadastro', usuarios.cadastrarUsuario);

rotas.put('/perfil', auth, usuarios.atualizarUsuario);
// rotas.get('/perfil', auth, usuarios.obterUsuario);

rotas.post('/login',logarUsuario);

rotas.post('/postagens', postagens.novaPostagens)

module.exports = rotas;