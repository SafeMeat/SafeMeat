CREATE DATABASE SafeMeat;

USE SafeMeat;

-- 1. CADASTRO DA EMPRESA / MARCA : receber dados da empresa /  marca que vai comprar nosso produto

CREATE TABLE SafeMeat.empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    cnpj CHAR(18) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(15) NOT NULL UNIQUE,
    data_contratacao DATETIME NOT NULL
);

-- 2. CADASTRO DE USUÁRIOS E ACESSOS : cadastro de usuários da dashboard

CREATE TABLE SafeMeat.usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(64) NOT NULL,
    tipo_usuario VARCHAR(20) DEFAULT 'Operador',
    CONSTRAINT chk_tipo_usuario CHECK (tipo_usuario IN ('Administrador', 'Operador', 'Motorista'))
);

-- 3. CADASTRO DO DESTINO (MERCADO) : cadastro do mercado (usuário final)

CREATE TABLE SafeMeat.mercado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    nome_fantasia VARCHAR(100) NOT NULL,
    cnpj CHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(15)
);


-- 4. CADASTRO DE ENDEREÇOS : cadastro de endereço do usuário final

CREATE TABLE SafeMeat.endereco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero INT NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado CHAR(2) NOT NULL
);

-- 5. CADASTRO DE PRODUTOS E PARÂMETROS TÉRMICOS

CREATE TABLE SafeMeat.produto (
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

CREATE TABLE SafeMeat.ambiente_monitorado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificador VARCHAR(50) NOT NULL, -- EX : 'CAM-01', 'GELADEIRA-MERCADO-02', 'CAMARA-03'
    tipo_ambiente VARCHAR(30) NOT NULL,
    capacidade_kg DECIMAL(10,2),
    status_monitoramento VARCHAR(30) DEFAULT 'Disponível',
    CONSTRAINT chk_tipo_ambiente CHECK (tipo_ambiente IN ('Armazém/Câmara', 'Container', 'Caminhão Frigorífico', 'Geladeira Supermercado')),
    CONSTRAINT chk_status_ambiente CHECK (status_monitoramento IN ('Disponível', 'Em Transporte', 'Em Manutenção'))
);

-- 7. REGISTRO DE OPERAÇÕES DE TRANSPORTE : Informações do transporte / motorista

CREATE TABLE SafeMeat.transporte (
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

CREATE TABLE SafeMeat.sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_serie VARCHAR(50) NOT NULL, -- UUID ou número de série do sensor
    modelo VARCHAR(50),
    data_instalacao DATE,
    ativo TINYINT DEFAULT 0
);

-- 9. DADOS E LEITURA COLETADOS PELOS SENSORES : dados recebidos pelo sensor

CREATE TABLE SafeMeat.leitura_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME NOT NULL,
    temperatura DECIMAL(4,2) NOT NULL, -- EM °C
    umidade DECIMAL(4,2) NOT NULL, -- EM %
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

-- 10. HISTÓRICO DE ALERTAS (QUEBRA DA CADEIA DO FRIO) : dados capturados pelo sensor

CREATE TABLE SafeMeat.alerta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    temperatura_registrada DECIMAL(4,2) NOT NULL,
    data_hora DATETIME NOT NULL,
    nivel_severidade VARCHAR(30) NOT NULL,
    mensagem VARCHAR(255) NOT NULL,
    CONSTRAINT chk_severidade CHECK (nivel_severidade IN ('Alerta Amarelo', 'Crítico - Quebra de Frio'))
);



-- INSERÇÃO DE DADOS NAS TABELAS DESENVOLVIDAS --

-- EMPRESA

INSERT INTO SafeMeat.empresa (
	razao_social, 
    nome_fantasia, 
    cnpj, 
    email, 
    telefone, 
    data_contratacao
) VALUES
	('JBS S/A', 'Friboi', '02916265000108', 'friboi@friboi.com.br', '0800-771-2221', NOW()),
    ('Swift Armour S.A. Indústria e Comércio', 'Swift', '60.713.823/0001-96', 'swift@swift.com.br', '0800-400-2892', NOW());
    
-- USUÁRIO

INSERT INTO SafeMeat.usuario (
	nome, 
    email, 
    senha, 
    tipo_usuario
) VALUES
	('Adrian', 'adrian@safemeat.com', '12345678', 'Administrador'),
	('Gabriel', 'gabriel@friboi.com', '12345678', 'Operador'),
	('Brian', 'brian@swift.com', '12345678', 'Motorista'),
	('Dayvid', 'dayvid@friboi.com', '12345678', DEFAULT); -- VALOR DEFAULT tipo_usuario = Operador

-- MERCADO

INSERT INTO SafeMeat.mercado (
	razao_social, 
    nome_fantasia, 
    cnpj, 
    telefone
) VALUES
	('Carrefour Comercio e industria LTDA', 'Carrefour', '45.543.915/0001-81', '0800-718-2222'),
	('Sendas Distribuidora S/A', 'Assaí Atacadista', '06.057.223/0001-71', '0800-773-2322');
    
-- ENDEREÇO

INSERT INTO SafeMeat.endereco (
	cep, 
    logradouro, 
    numero, 
    bairro, 
    cidade, 
    estado) 
VALUES
	('05001900', 'Rua George Eastman', '213', 'Vila Tramontano', 'São Paulo', 'SP'),
	('02442090', 'Avenida Aricanduva', '5555', 'Vila Aricanduva', 'São Paulo', 'SP');
    
-- PRODUTO

INSERT INTO SafeMeat.produto (
	nome, 
    peso, 
    lote, 
    tipo_produto, 
    quantidade, 
    temperatura_minima, 
    temperatura_maxima
) VALUES
    ('Picanha Bovina Fatiada', 1.20, '1001', 'Carne bovina', 50, -2.00, 4.00),
    ('Costela Suína Resfriada', 2.50, '2045', 'Carne suína', 30, -1.00, 4.00),
    ('Peito de Frango Desossado', 1.00, '3310', 'Ave', 80, -2.00, 2.00),
    ('Filé de Salmão Fresco', 0.85, '4089', 'Peixe', 25, -2.00, 2.00),
    ('Alcatra Bovina Inteira', 3.40, '5123', 'Carne bovina', 40, -2.00, 4.00);

-- AMBIENTE MONITORADO

INSERT INTO SafeMeat.ambiente_monitorado (
	identificador, 
    tipo_ambiente, 
    capacidade_kg, 
    status_monitoramento
) VALUES 
    ('CAM-01', 'Armazém/Câmara', 15000.00, 'Disponível'),
    ('CONT-202', 'Container', 8500.50, 'Disponível'),
    ('CAMINHAO-VOLVO-04', 'Caminhão Frigorífico', 4200.00, 'Em Transporte'),
    ('GELADEIRA-MERCADO-02', 'Geladeira Supermercado', 350.00, 'Disponível'),
    ('CAM-02', 'Armazém/Câmara', 20000.00, 'Em Manutenção');
    
-- TRANSPORTE

INSERT INTO SafeMeat.transporte (
    placa_veiculo, 
    motorista, 
    cpf_motorista, 
    contato_motorista, 
    data_hora_saida, 
    data_hora_chegada, 
    status_viagem
) VALUES
    ('ABC1D23', 'Gustavo Cerqueira', '12345678901', '(11) 98765-4321', '2026-09-04 06:00:00', NULL, 'Em Trânsito'),
    ('XYZ9E87', 'Thiago Yashimura', '98765432100', '(11) 91234-5678', '2026-09-03 14:30:00', '2026-09-03 19:45:00', 'Concluído'),
    ('BRA2E19', 'João Pedro Sakamoto', '45678912300', '(19) 97654-3210', '2026-09-04 08:15:00', NULL, 'Em Trânsito');
    
-- SENSOR

INSERT INTO SafeMeat.sensor (
    numero_serie,
    modelo,
    data_instalacao,
    ativo
) VALUES
    ('DHT11-SN-98234', 'DHT11', '2026-01-15', 1);
    
-- LEITURA SENSOR

INSERT INTO SafeMeat.leitura_sensor (
    data_hora,
    temperatura,
    umidade,
    latitude,
    longitude
) VALUES
    ('2026-09-04 08:30:00', 2.50, 85, -23.55052000, -46.63330800),
    ('2026-09-04 08:45:00', 3.10, 86, -23.55210000, -46.63540000),
    ('2026-09-04 09:00:00', 2.80, 87.20, -23.55430000, -46.63820000),
    ('2026-09-04 09:15:00', 4.20, 91.30, -23.55780000, -46.64150000),
    ('2026-09-04 09:30:00', 3.00, 80.00, -23.56010000, -46.64500000);
    
-- ALERTA

INSERT INTO SafeMeat.alerta (
    temperatura_registrada,
    data_hora,
    nivel_severidade,
    mensagem
) VALUES
    (4.20, '2026-09-04 09:15:00', 'Alerta Amarelo', 'Temperatura próxima ao limite máximo tolerado (4.00°C).'),
    (7.80, '2026-09-04 10:00:00', 'Crítico - Quebra de Frio', 'Limite seguro ultrapassado. Risco iminente de deterioração de carga resfriada.'),
    (4.10, '2026-09-04 10:20:00', 'Alerta Amarelo', 'Oscilação térmica detectada na câmara frigorífica.');
    


-- CONSULTA DE DADOS NAS TABELAS DESENVOLVIDAS --

-- EMPRESA

SELECT * FROM SafeMeat.empresa;

-- USUÁRIO

SELECT * FROM SafeMeat.usuario;

-- MERCADO

SELECT * FROM SafeMeat.mercado;
    
-- ENDEREÇO

SELECT * FROM SafeMeat.endereco;
    
-- PRODUTO

SELECT * FROM SafeMeat.produto;

-- AMBIENTE MONITORADO

SELECT * FROM SafeMeat.ambiente_monitorado;
    
-- TRANSPORTE

SELECT * FROM SafeMeat.transporte;
    
-- SENSOR

SELECT * FROM SafeMeat.sensor;
    
-- LEITURA SENSOR

SELECT * FROM SafeMeat.leitura_sensor;
    
-- ALERTA

SELECT * FROM SafeMeat.alerta;
