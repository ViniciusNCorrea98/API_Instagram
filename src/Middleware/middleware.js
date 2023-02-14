const knex = require('../knex');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../jwt_secret')

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization){
    return res.status(401).json('Token não informado!');
  }

  const array =authorization.split(' ');
  const token = array[1];
  
  try{
    const decoded = jwt.verify(token, jwt_secret);

    if(!decoded){
      return res.status(400).json('Token inválido!');
    }

    const usuario = await knex('usuarios').where('id', decoded.id);

    if(!usuario){
      return res.status(404).json('Usuário não encontrado');
    }

    req.usuario = usuario;

    next();
  } catch(error){
    return res.staus(400).json(error.message);
  }
}

module.exports = auth;