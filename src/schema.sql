CREATE DATABASE mini_insta;

CREATE TABLE IF NOT EXISTS usuarios(
  id serial primary key,
  username text NOT NULL UNIQUE,
  senha text NOT NULL,
  email text UNIQUE,
  site text, 
  bio text,
  telefone text,
  genero text,
  verificado boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS postagens(
  id serial primary key,
  usuario_id int NOT NULL,
  foreign key (usuario_id) references usuarios (id),
  data timestamptz DEFAULT NOW(),
  texto text  
);

CREATE TABLE IF NOT EXISTS postagens_fotos(
  id serial primary key,
  postagem_id int NOT NULL,
  foreign key (postagem_id) references postagens (id),
  imagem text NOT NULL,
);

CREATE TABLE IF NOT EXISTS postagens_comentarios(
  id serial primary key,
  postagem_id int NOT NULL,
  foreign key (postagem_id) references postagens (id),
  texto text NOT NULL,
  data timestamptz DEFAULT NOW(),
  usuario_id int NOT NULL,
  foreign key (usuario_id) references usuarios (id)
);

CREATE TABLE postagem_curtidas (
  usuario_id int NOT NULL, 
  postagem_id int NOT NULL,
  data timestamptz DEFAULT NOW(),
  foreign key (usuario_id) references usuarios (id),
  foreign key (postagem_id) references postagens (id)
);