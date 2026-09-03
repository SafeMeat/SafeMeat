USE sprint1;

CREATE TABLE Fornecedor (
idFornecedor INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
cnpj CHAR(14),
endereco VARCHAR(200)
);

CREATE TABLE Produto (
idProduto INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
tipoCarne VARCHAR(50) NOT NULL,
temperaturaMin DECIMAL(5,2),
temperaturaMax DECIMAL(5,2),
idFornecedor INT
);

CREATE TABLE mercado (
idMercado INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100),
cnpj CHAR(14),
telefone VARCHAR(20),
endereco VARCHAR(200)
);

CREATE TABLE Mercado (
idMercado INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
cnpj CHAR(14),
endereco VARCHAR(200)
);

CREATE TABLE BauFrigorifico (
idBau INT PRIMARY KEY AUTO_INCREMENT,
codigo VARCHAR(50) NOT NULL,
capacidade DECIMAL(10,2),
unidadeCapacidade VARCHAR(20),
status VARCHAR(30),
CONSTRAINT chkStatus CHECK (status IN ('Disponível', 'Em transporte', 'Em manutenção'))
);

CREATE TABLE Sensor (
idSensor INT PRIMARY KEY AUTO_INCREMENT,
codigoSensor VARCHAR(50) NOT NULL,
tipo VARCHAR(50) NOT NULL,
idBau INT
);

CREATE TABLE Transporte (
idTransporte INT PRIMARY KEY AUTO_INCREMENT,
dataSaida DATETIME,
dataChegada DATETIME,
status VARCHAR(30),
idFornecedor INT,
idMercado INT,
idBau INT
);

CREATE TABLE Carga (
idCarga INT PRIMARY KEY AUTO_INCREMENT,
quantidade DECIMAL(10,2) NOT NULL,
unidadeMedida VARCHAR(20) NOT NULL,
idProduto INT,
idTransporte INT
);

CREATE TABLE RegistroTemperatura (
idRegistro INT PRIMARY KEY AUTO_INCREMENT,
temperatura DECIMAL(5,2) NOT NULL,
dataHora DATETIME NOT NULL,
idSensor INT,
idTransporte INT
);

CREATE TABLE Alerta (
idAlerta INT PRIMARY KEY AUTO_INCREMENT,
mensagem VARCHAR(200) NOT NULL,
nivel VARCHAR(30),
dataHora DATETIME NOT NULL,
status VARCHAR(30),
idRegistro INT
);