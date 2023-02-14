const knex = require('../knex');
const securePassword = require('secure-password');
const nodemailer = require('../nodemailer');

const pwd = securePassword();

const cadastrarUsuario = async ( req, res) => {
  let { username, senha, foto_perfil} = req.body;

  if(!username || !senha){
    return res.status(400).json('Usuário deverá enviar o username e a senha');
  }

  if(senha.length < 8){
    return res.status(400).json('A senha deverá ter ao menos 8 caracteres');
  }

  try{

    const verificarUsername = await knex('usuarios').where('username', '@' + username).returning('*');

    if(verificarUsername.length){
      return res.status(400).json('Username já em uso!');
    }

  } catch (error) {
    return res.status(400).json(error.message);
  }

  try{
    username = "@" + username;

    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
    const usuario = {
      username,
      senha: hash
    }

    const novoUsuario = await knex('usuarios').insert(usuario);

    if(!novoUsuario){
      return res.status(400).json('Não foi possível cadastrar o usuário.')
    }

    return res.status(200).json('Usuário cadastrado com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const atualizarUsuario = async (req, res) => {
  const {username, senha, email, site, bio, telefone, genero} = req.body;
  const { usuario } = req;
  
  if(!usuario){
    return res. status(401).json('Usuário nao autorizado!');
  }

  if(!username && !senha && !email && !site && !bio && !telefone && !genero){
    return res.status(400).json('Ao menos um dos campos que se deseja alterar, precisa ser informado');
  }

  try{

    const perfil = await knex('usuarios').where('username', usuario.username);
    
    if(!perfil){
      return res.status(400).json('Usuario não encontrado');
    }

  }catch (error){
    return res.status(400).json(error.message);
  }

  try{

    if(senha){
      const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
      const usuarioAtualizado = await knex('usuarios').update({username, 'senha': hash, email, site, bio, telefone, genero}).where('username', usuario[0].username);
    
      if(!usuarioAtualizado){
        return res.status(400).json('Não foi possível atualizar o usuário');
      }

      return res.status(200).json('Usuario atualizado com sucesso!');
    }

    const usuarioAtualizado = await knex('usuarios').update({username, email, site, bio, telefone, genero}).where('username', usuario[0].username);

    if(!usuarioAtualizado){
      return res.status(400).json('Não foi possível atualizar o usuário');
    }

    return res.status(200).json('Usuario atualizado com sucesso!');

  }catch (error){
    return res.status(400).json(error.message);
  }
}

const listarUsuarios = async (req, res) => {
  try{
    const listarUsuarios = await knex('usuarios');

    if(!listarUsuarios){
      return res.status(400).json('Não foi possível listar os usuários!');
    }

    return res.status(200).json(listarUsuarios);
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const deletarUsuario = async (req, res) => {
  const { id } = req.parms;
  const { usuario } = req;
  const {senha} = req.body;

  if(!usuario){
    return res.status(401).json('Usuário nãi identificado!');
  }

  try {
    const buscarUsuario = await knex('usuarios').where({id}).first();

    if(!buscarUsuario){
      return res.status(400).json('Não foi possível localizar o usuário!');
    }

    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

    if(buscarUsuario.hash !== hash){
      return res.status(400).json('Tente a senha novamente!');
    }

    const deletarUsuario = await knex('usuarios').where({id});

    if(!deletarUsuario){
      return res.status(400).json('Não foi possível deletar o usuário!');
    }

    return res.status(200).json(deletarUsuario);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  cadastrarUsuario,
  atualizarUsuario,
  listarUsuarios,
  deletarUsuario
}