const knex = require('../knex');

const nova_postagem = async ( req, res) => {
  const { id } = req.usuario;
  const { texto, id_imagens, localizacao } = req.body;

  if(!usuario){
    return res.status(401).json('Usuário não autorizado!')
  }

  if(!id_imagens){
    return res.status(404).json('Erro no cadastramento de fotos');
  }

  try{
    localizacao = localizacao ? localizacao : null;

    const novas_publicacao = await knex('postagem').insert({texto, id_usuario: id, id_imagens, curtidas: null, localizacao});

    if(!novas_publicacao){
      return res.status(400).json('Não foi possível postar as fotos');
    }

    return res.status(200).json('Publicação cadastrada com sucesso!');
  } catch (error){
    return res.status(400).json(error.message);
  }
}


const alterar_postagem = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;
  let { texto, id_imagens, localizacao } = req.body;
  
  if(!usuario){
    return res.status(401).json('Usuário não autorizado!');
  }

  try {
    const buscar_publicacao = await knex('postagens').where({id}).andWhere({id_usuario: usuario.id}).first();

    if(!buscar_publicacao){
      return res.status(400).json('Não foi possível localizar a publicação!');
    }


    texto = texto ? texto : buscar_publicacao.texto;
    localizacao = localizacao ? localizacao : buscar_publicacao.localizacao;
    id_imagens = (id_imagens !== buscar_publicacao.id_imagens) ? id_imagens.filter(id_imagens) : buscar_publicacao.id_imagens;

    const atualizar_postagens = await knex('postagens')
    .update({
      texto,
      localizacao,
      id_imagens
    }).where({id})
    .andWhere({id_usuario: usuario.id});

    if(!atualizar_postagens){
      return res.status(400).json('Não foi possível atualizar a postagem!');
    }

    return res.status(200).json('Publicação alterada com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

function buscar_url_imagem(id_imagens){
  let array_urls = [];

  id_imagens.forEach(element => {
    const url = await knex('postagens_fotos').where({id: element}).first();

    array_urls.push(url.url);
  });

  return array_urls;
}

const listar_postagens = async (req, res) => {
  try{
    const listar_postagens = await knex('postagens')
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  nova_postagem,
  alterar_postagem
}