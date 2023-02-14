const knex = require('../knex');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../jwt_secret')

const pwd = securePassword();

const logarUsuario = async (req, res) => {
   const {username, senha}= req.body;

   if(!username || !senha){
     return res.status(400).json('Username e senha deveram ser informados.');
   }

   try {
     const usuario = await knex('usuarios').where('username', username).first().returning('*');
     
     if(!usuario){
       return res.status(400).json('Usuário não encontrado!');
     }

     const verificarSenha = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha,'hex'));

     if(!verificarSenha){
       return res.status(400).json('Usuário ou senha incorretos!');
     }

     switch (verificarSenha) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        return res.status(400).json('mensagem: email  ou senha incorreto');
      case securePassword.VALID:
        break;
      case securePassword.VALID_NEEDS_REHASH:
        try {
          const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
          const update = await knex('usuarios').update({senha: hash, email: email}).where('id', id);
        } catch {
        }
      break;
    }

     const token = jwt.sign({
        id: usuario.id,
        username: usuario.username
      }, jwt_secret, {expiresIn: '2h'}
     );

     return res.status(200).json({
       usuario: {
         id: usuario.id,
         username: usuario.username
       },
       token
     });

   } catch(error) {

    return res.status(400).json(error.message);
    
   }
}

module.exports = { logarUsuario };