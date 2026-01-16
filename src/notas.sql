drop database if exists notas;
create database notas;
use notas;

create table nota (
    id int auto_increment primary key,
    titulo varchar(100) not null,
    descripcion text not null
);