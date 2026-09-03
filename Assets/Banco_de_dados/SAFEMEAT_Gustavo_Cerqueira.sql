CREATE DATABASE safemeat;
USE safemeat;

CREATE TABLE cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(45),
    nome_fantasia VARCHAR(45),
    cnpj CHAR(14),
    email VARCHAR(50),
    data_contratacao DATE
);

CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ativo TINYINT,
    nome_localidade VARCHAR(200),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL
);

CREATE TABLE leitura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    historico_temperatura DECIMAL(4,2),
    historico_umidade DECIMAL(4,2)
);

CREATE TABLE unidade_monitoramento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(45),
    identificador VARCHAR(45)
);

-- Inserts de teste

INSERT INTO cliente (razao_social, nome_fantasia, cnpj, email, data_contratacao)
VALUES 
('Swift Armour do Brasil S.A.', 'Swift', '12345678000199', 'contato@swift.com.br', '2026-08-01'),
('JBS S.A.', 'JBS', '98765432000188', 'contato@jbs.com.br', '2026-07-15');

INSERT INTO sensor (ativo, nome_localidade, latitude, longitude)
VALUES 
(1, 'Caminhão placa ABC-1234', -23.53294700, -46.63505600),
(1, 'Geladeira Mercado Zona Sul - SP', -23.60800000, -46.64200000);

INSERT INTO leitura (data_hora, historico_temperatura, historico_umidade)
VALUES 
('2026-08-30 08:00:00', 4.20, 78.50),
('2026-08-30 08:10:00', 4.35, 79.10),
('2026-08-30 08:20:00', 6.80, 80.00),
('2026-08-30 08:30:00', 3.90, 77.20);

INSERT INTO unidade_monitoramento (tipo, identificador)
VALUES 
('caminhao', 'ABC-1234'),
('geladeira', 'Mercado Zona Sul - SP');

SELECT * FROM cliente;
SELECT * FROM sensor;
SELECT * FROM leitura;
SELECT * FROM unidade_monitoramento;
