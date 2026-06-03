drop database if exists notas;
create database notas;
use notas;

create table usuarios (
    id int AUTO_INCREMENT,
    email varchar(255) not null,
    contrasena varchar(255) not null,
    tema varchar(7) not null,
    constraint PK_Usuarios
        primary key (id)
);

create table carpetas (
    id varchar(50),
    id_usu int,
    nombre varchar(20),
    constraint PK_Carpetas
        primary key (id, id_usu),
    constraint FK_Carpetas_Usuarios Foreign Key (id_usu)
        References usuarios(id)
        on delete cascade
);

create table notas (
    id varchar(50),
    id_usu int,
    titulo varchar(100) not null,
    descripcion text not null,
    favorita boolean,
    constraint PK_Nota
        primary key(id),
    constraint FK_Nota_Usuarios Foreign Key (id_usu)
        References usuarios(id)
        on delete cascade
);

create table notas_carpetas (
    id_nota varchar(50),
    id_carpeta varchar(50),
    constraint PK_Nota_Carpetas
        primary key (id_nota, id_carpeta),
    constraint FK_Notas Foreign Key (id_nota)
        References notas(id)
        on delete cascade,
    constraint FK_Carpetas Foreign Key (id_carpeta)
        References carpetas(id)
        on delete cascade
);

create table notas_compartidas (
    id_usu int,
    id_nota varchar(50),
    id_comp int,
    constraint PK_Nota_Compartidas
        primary key (id_usu,id_nota,id_comp),
    constraint FK_Compartidas_Usuarios Foreign key (id_usu)
        References usuarios(id),
    constraint FK_Compartidas_Nota Foreign key (id_nota)
        References notas(id),
    constraint FK_Compartidas_UsuariosComp Foreign key (id_comp)
        References usuarios(id),
    constraint UQ_Compartidas Unique (id_nota, id_comp)
);