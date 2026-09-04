CREATE DATABASE SafeMeat;

USE SafeMeat;

-- 1. CADASTRO DA EMPRESA / MARCA : receber dados da empresa /  marca que vai comprar nosso produto

CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    cnpj CHAR(18) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(15) NOT NULL UNIQUE,
    data_contratacao DATETIME NOT NULL
);

-- 2. CADASTRO DE USUÁRIOS E ACESSOS : cadastro de usuários da dashboard

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(64) NOT NULL,
    tipo_usuario VARCHAR(20) DEFAULT 'Operador',
    CONSTRAINT chk_tipo_usuario CHECK (tipo_usuario IN ('Administrador', 'Operador', 'Motorista'))
);

-- 3. CADASTRO DO DESTINO (MERCADO) : cadastro do mercado (usuário final)

CREATE TABLE mercado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    cnpj CHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(15)
);


-- 4. CADASTRO DE ENDEREÇOS : cadastro de endereço do usuário final

CREATE TABLE endereco (
	id INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero INT NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado CHAR(2) NOT NULL
);

-- 5. CADASTRO DE PRODUTOS E PARÂMETROS TÉRMICOS

CREATE TABLE produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    lote CHAR(4) NOT NULL UNIQUE, -- SIF : Serviço de Inspeção Federal
    tipo_produto VARCHAR(20) NOT NULL CONSTRAINT chk_tipo_produto CHECK (tipo_produto IN('Carne bovina', 'Carne suína', 'Ave', 'Peixe')),
    quantidade INT NOT NULL,
    temperatura_minima DECIMAL(4,2) NOT NULL,
    temperatura_maxima DECIMAL(4,2) NOT NULL
);

-- 6. AMBIENTES DE MONITORAMENTO (DO ARMAZÉM À GELADEIRA)

CREATE TABLE ambiente_monitorado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificador VARCHAR(50) NOT NULL, -- EX : 'CAM-01', 'GELADEIRA-MERCADO-02', 'CAMARA-03'
    tipo_ambiente VARCHAR(30) NOT NULL,
    capacidade_kg DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'Disponível',
    CONSTRAINT chk_tipo_ambiente CHECK (tipo_ambiente IN ('Armazém/Câmara', 'Container', 'Caminhão Frigorífico', 'Geladeira Supermercado')),
    CONSTRAINT chk_status_ambiente CHECK (status IN ('Disponível', 'Em Transporte', 'Em Manutenção'))
);

-- 7. REGISTRO DE OPERAÇÕES DE TRANSPORTE : Informações do transporte / motorista

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

-- 8. DISPOSITIVO SENSOR (HARDWARE) : informações do nosso sensor

CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_serie VARCHAR(50) NOT NULL, -- UUID ou número de série do sensor
    modelo VARCHAR(50),
    data_instalacao DATE,
    ativo TINYINT(1) DEFAULT 0
);

-- 9. DADOS E LEITURA COLETADOS PELOS SENSORES : dados recebidos pelo sensor

CREATE TABLE leitura_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME NOT NULL,
    temperatura DECIMAL(4,2) NOT NULL,
    umidade DECIMAL(4,2) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

-- 10. HISTÓRICO DE ALERTAS (QUEBRA DA CADEIA DO FRIO) : dados capturados pelo sensor

CREATE TABLE alerta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    temperatura_registrada DECIMAL(4,2) NOT NULL,
    data_hora DATETIME NOT NULL,
    nivel_severidade VARCHAR(20) NOT NULL,
    mensagem VARCHAR(255) NOT NULL,
    CONSTRAINT chk_severidade CHECK (nivel_severidade IN ('Alerta Amarelo', 'Crítico - Quebra de Frio'))
);

-- INSERÇÃO DE DADOS

-- EMPRESA
INSERT INTO empresa (razao_social, nome_fantasia, cnpj, email, telefone, data_contratacao) VALUES
	('JBS S/A', 'Friboi', '02916265000108', 'friboi@friboi.com.br', '0800-771-2221', NOW()),
    ('Swift Armour S.A. Indústria e Comércio', 'Swift', '60.713.823/0001-96', 'swift@swift.com.br', '0800-400-2892', NOW());
    
-- USUÁRIO
INSERT INTO usuario (nome, email, senha, tipo_usuario) VALUES
	('Adrian', 'adrian@safemeat.com', '12345678', 'Administrador'),
	('Gabriel', 'gabriel@friboi.com', '12345678', 'Operador'),
	('Brian', 'brian@swift.com', '12345678', 'Motorista'),
	('Dayvid', 'dayvid@friboi.com', '12345678', DEFAULT); -- VALOR DEFAULT tipo_usuario = Operador

-- MERCADO
INSERT INTO mercado (razao_social, nome_fantasia, cnpj, telefone) VALUES
	('Carrefour Comercio e industria LTDA', 'Carrefour', '45.543.915/0001-81', '0800-718-2222'),
	('Sendas Distribuidora S/A', 'Assaí Atacadista', '06.057.223/0001-71', '0800-773-2322');