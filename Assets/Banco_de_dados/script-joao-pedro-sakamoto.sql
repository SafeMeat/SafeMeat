CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome_empresa VARCHAR(100),
    cnpj VARCHAR(18),
    email VARCHAR(100),
    telefone VARCHAR(11),
    endereco VARCHAR(150)
);

CREATE TABLE representante (
    id_representante INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    cargo VARCHAR(50),
    email VARCHAR(100),
    telefone VARCHAR(11),
    empresa VARCHAR(100)
);

CREATE TABLE sensor (
    id_sensor INT PRIMARY KEY AUTO_INCREMENT,
    numero_serie VARCHAR(50),
    tipo_sensor VARCHAR(50),
    numero_conteiner VARCHAR(30),
    status VARCHAR(20)
);

CREATE TABLE leitura_sensor (
    id_leitura INT PRIMARY KEY AUTO_INCREMENT,
    numero_serie_sensor VARCHAR(50),
    temperatura DECIMAL(5,2),
    local_atual VARCHAR(100),
    data_hora DATETIME,
    status VARCHAR(20)
);

CREATE TABLE conteiner (
    id_conteiner INT PRIMARY KEY AUTO_INCREMENT,
    numero_conteiner VARCHAR(100),
    capacidade_kg DECIMAL(10,2),
    local_atual VARCHAR(100),
    status VARCHAR(20)
);

CREATE TABLE transporte (
    id_transporte INT PRIMARY KEY AUTO_INCREMENT,
    placa_veiculo VARCHAR(10),
    origem VARCHAR(100),
    destino VARCHAR(100),
    temperatura DECIMAL(5,2),
    umidade DECIMAL(5,2),
    data_hora DATETIME,
    status VARCHAR(20)
);

CREATE TABLE mercado (
    id_mercado INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    cnpj VARCHAR(18),
    endereco VARCHAR(150),
    telefone VARCHAR(20)
);

CREATE TABLE leituras (
id INT PRIMARY KEY AUTO_INCREMENT,
sensor_id INT 	,
data_hora DATETIME,
temperatura DECIMAL(3,2),
umidade DECIMAL(5,2),
bateria DECIMAL(5,2)
);


