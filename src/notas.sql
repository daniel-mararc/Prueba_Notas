drop database if exists notas;
create database notas;
use notas;

create table nota (
    id int,
    id_usu int,
    titulo varchar(100) not null,
    descripcion text not null,
    add constraint PK_Nota
        primary key(id),
    add constraint FK_Nota_Usuarios Foreign Key (id_usu)
        References usuarios(id)
);

create table usuarios (
    id int,
    email varchar(20) not null,
    contraseña varchar(20) not null,
    add constraint PK_Usuarios
        primary key (id)
);