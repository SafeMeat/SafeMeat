-- SafeMeat

CREATE DATABASE SafeMeat;

USE SafeMeat;

CREATE TABLE empresa (
	id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(45),
    nome_fantasia VARCHAR(45),
    cnpj CHAR(14),
    telefone CHAR(11),
    email VARCHAR(100)
);

CREATE TABLE armazem (
	id INT PRIMARY KEY AUTO_INCREMENT,
    logradouro VARCHAR(45),
    numero INT,
    bairro VARCHAR(45),
    cep CHAR(8),
    cidade VARCHAR(45),
    estado VARCHAR(30),
    empresa_responsavel VARCHAR(45),
    telefone CHAR(11),
    email VARCHAR(100),
    cnpj CHAR(14)
);

CREATE TABLE container (
	id INT PRIMARY KEY AUTO_INCREMENT,
    lote CHAR(6),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

CREATE TABLE sensor (
	id INT PRIMARY KEY AUTO_INCREMENT,
    temperatura DECIMAL(4,2),
    umidade DECIMAL(4,2),
    data_captura DATETIME,
    ativo TINYINT
);

CREATE TABLE caminhao (
	id INT PRIMARY KEY AUTO_INCREMENT,
    placa CHAR(7),
    motorista VARCHAR(45),
    contato_motorista CHAR(11),
    cpf_motorista CHAR(11)
);

CREATE TABLE mercado (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    cnpj CHAR(14),
    logradouro VARCHAR(45),
    numero INT,
    bairro VARCHAR(45),
    cep CHAR(8),
    cidade VARCHAR(45),
    estado VARCHAR(30),
    telefone CHAR(11),
    email VARCHAR(100)
);