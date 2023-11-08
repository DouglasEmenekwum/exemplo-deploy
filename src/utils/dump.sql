- criando tabela categorias:
create table categorias (
	id serial primary key,
	descricao text unique not null
);

- inserindo dados na tabela categorias:
insert into categorias (descricao)
values
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

- criando tabela usuarios:
create table usuarios (
	id serial primary key,
  nome text not null,
  email text unique not null,
  senha text not null
);