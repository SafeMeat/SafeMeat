CREATE DATABASE SafeMeat;

USE SafeMeat;

-- 1. CADASTRO DA EMPRESA / MARCA

CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(15) NOT NULL UNIQUE,
    data_contratacao DATE NOT NULL
);

-- 2. CADASTRO DE USUÁRIOS E ACESSOS

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(64) NOT NULL,
    tipo_usuario VARCHAR(20) DEFAULT 'Operador',
    CONSTRAINT chk_tipo_usuario CHECK (tipo_usuario IN ('Administrador', 'Operador', 'Motorista'))
);

-- 3. CADASTRO DO DESTINO (MERCADO)

CREATE TABLE mercado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(15),
    cep CHAR(8) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero INT NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado CHAR(2) NOT NULL
);

CREATE TABLE endereco (
	
);

-- 4. CADASTRO DE PRODUTOS E PARÂMETROS TÉRMICOS *

CREATE TABLE produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    temperatura_minima DECIMAL(4,2) NOT NULL,
    temperatura_maxima DECIMAL(4,2) NOT NULL
);

-- 5. AMBIENTES DE MONITORAMENTO (DO ARMAZÉM À GELADEIRA)

CREATE TABLE ambiente_monitorado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificador VARCHAR(50) NOT NULL, -- Ex: 'CAM-01', 'GELADEIRA-MERCADO-02', 'CAMARA-03'
    tipo_ambiente VARCHAR(30) NOT NULL,
    capacidade_kg DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'Disponível',
    CONSTRAINT chk_tipo_ambiente CHECK (tipo_ambiente IN ('Armazém/Câmara', 'Container', 'Caminhão Frigorífico', 'Geladeira Supermercado')),
    CONSTRAINT chk_status_ambiente CHECK (status IN ('Disponível', 'Em Transporte', 'Em Manutenção'))
);

-- 6. REGISTRO DE OPERAÇÕES DE TRANSPORTE

CREATE TABLE transporte (
    id INT PRIMARY KEY AUTO_INCREMENT,
    placa_veiculo CHAR(7) NOT NULL,
    motorista VARCHAR(100) NOT NULL,
    cpf_motorista CHAR(11) NOT NULL,
    contato_motorista VARCHAR(15),
    data_hora_saida DATETIME NOT NULL,
    data_hora_chegada DATETIME,
    status_viagem VARCHAR(20) DEFAULT 'Em Trânsito',
    CONSTRAINT chk_status_viagem CHECK (status_viagem IN('Em Trânsito', 'Concluído'))
);

-- 7. DISPOSITIVO SENSOR (HARDWARE)

CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_serie VARCHAR(50) NOT NULL, -- UUID ou número de série do sensor
    modelo VARCHAR(50),
    data_instalacao DATE,
    ativo TINYINT(1) DEFAULT 0
);

-- 8. DADOS E LEITURA COLETADOS PELOS SENSORES

CREATE TABLE leitura_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME NOT NULL,
    temperatura DECIMAL(4,2) NOT NULL,
    umidade DECIMAL(4,2) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

-- 9. HISTÓRICO DE ALERTAS (QUEBRA DA CADEIA DO FRIO)

CREATE TABLE alerta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    temperatura_registrada DECIMAL(4,2) NOT NULL,
    data_hora DATETIME NOT NULL,
    nivel_severidade VARCHAR(20) NOT NULL,
    mensagem VARCHAR(255) NOT NULL,
    CONSTRAINT chk_severidade CHECK (nivel_severidade IN ('Alerta Amarelo', 'Crítico - Quebra de Frio'))
);