CREATE DATABASE Safemeat;
USE Safemeat;

CREATE TABLE usuario( -- Usuário do projeto, funcionário da empresa cliente
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    senha VARCHAR(30),
    email VARCHAR(45)
    
);

CREATE TABLE sensor(
	id INT PRIMARY KEY AUTO_INCREMENT,
    ativo TINYINT(1),
    data_instalacao DATE,
    latitutde DECIMAL(10,6),
    longitude DECIMAL(11,6),
	UUID CHAR(36) 
);

CREATE TABLE sensor_registro( -- Histórico das temperaturas capturadas
	id INT PRIMARY KEY AUTO_INCREMENT,
    temperatura DECIMAL (5,2),
    umidade DECIMAL (5,2),
    data_hora_leitura TIMESTAMP
);

CREATE TABLE cliente( -- Empresa
	id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(45),
    nome_fantasia VARCHAR(50),
    representante VARCHAR(50),
    CNPJ VARCHAR(18),
    data_contratacao DATE
);

CREATE TABLE representante(
	id INT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE ambientes(
	id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_ambiente VARCHAR(30),
		CONSTRAINT chAmbiente CHECK ( tipo_ambiente IN ('Container', 'Caminhão Frigorífico', 'Geladeira Supermercado')),
	nome_local VARCHAR(40)
    
);
