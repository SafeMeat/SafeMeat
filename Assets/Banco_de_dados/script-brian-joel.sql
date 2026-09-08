CREATE DATABASE teste;
USE	teste;

-- conta para determinado painel - ESSENCIAL
-- definir como tinyint (0 = usuario_motorista ,1 = usuario adm)
CREATE TABLE login_tipo_usuario(
login VARCHAR (30),
senha VARCHAR (15),
tipo_usuario TINYINT
);

-- CLIENTE: MARCA ex FRIBOI - ESSENCIAL
CREATE TABLE empresa (
id INT PRIMARY KEY AUTO_INCREMENT,
razao_social VARCHAR(100) NOT NULL,
nome_fantasia VARCHAR(100) NOT NULL,
cnpj CHAR(18) NOT NULL UNIQUE,
email VARCHAR(100) NOT NULL UNIQUE,
telefone VARCHAR(15) NOT NULL UNIQUE,
data_contratacao DATETIME NOT NULL
);

-- REPRESENTANTE DA MARCA, uma pessoa fisica - ESSENCIAL
CREATE TABLE representante (
nome VARCHAR(100),
marca_representada VARCHAR(100),
telefone CHAR(12),
email VARCHAR(100),
CPF CHAR(11)
);

-- MERCADO NA QUAL O SENSOR ESTA - ESSENCIAL
CREATE TABLE mercado (
id INT PRIMARY KEY AUTO_INCREMENT,
razao_social VARCHAR(100) NOT NULL,
nome_fantasia VARCHAR(100) NOT NULL,
cnpj CHAR(18) NOT NULL UNIQUE,
endereco VARCHAR (200)
);

-- sensor movel, o que vai no container - 
CREATE TABLE tipo_sensores_moveis (
status_monitoramento VARCHAR(30) DEFAULT 'Disponível', 
CONSTRAINT chk_status_ambiente CHECK (status_monitoramento 
IN ('Disponível', 'Em Transporte', 'Em Manutenção')),
ambiente VARCHAR(20) DEFAULT 'Caminhão Frigorífico'
);

-- dados do sensor movel, ele puxa informações de cada sensor
CREATE TABLE sensor_dados_moveis (
id INT PRIMARY KEY AUTO_INCREMENT,
data_hora DATETIME NOT NULL,
temperatura DECIMAL(4,2) NOT NULL, 
umidade DECIMAL(4,2) NOT NULL, 
latitude DECIMAL(10,8),
longitude DECIMAL(11,8)
);

-- PARA A GELADEIRA FIXA -- ESSENCIAL
CREATE TABLE sensores_fixos (
status_monitoramento VARCHAR(30) DEFAULT 'Disponível', 
CONSTRAINT chk_status_ambiente CHECK (status_monitoramento 
IN ('Disponível', 'Indisponível', 'Em Manutenção')),
ambiente VARCHAR(20), CONSTRAINT chk_tipo_ambiente
CHECK (ambiente IN ('Armazém/Câmara', 'Geladeira Supermercado'))
);

-- SENSOR DADOS DA GELADEIRA -- ESSENCIAL
CREATE TABLE sensor_dados_fixos (
id INT PRIMARY KEY AUTO_INCREMENT,
data_hora DATETIME NOT NULL,
temperatura DECIMAL(4,2) NOT NULL, 
umidade DECIMAL(4,2) NOT NULL, 
latitude DECIMAL(10,8),
longitude DECIMAL(11,8)
);

