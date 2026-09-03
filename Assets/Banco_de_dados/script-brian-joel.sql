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
CREATE TABLE cliente (

);

-- REPRESENTANTE DA MARCA, uma pessoa fisica - ESSENCIAL
CREATE TABLE representante (
nome VARCHAR(100),
marca_representa VARCHAR(100)
);

-- MERCADO NA QUAL O SENSOR ESTA - ESSENCIAL
CREATE TABLE mercado (

);

-- sensor movel, o que vai no container - 
CREATE TABLE tipo_sensores_moveis (
tipo_sensor VARCHAR (11) CONSTRAINT chxTipoSensor CHECK ((tipo_sensor IN('Temperatura','Umidade')),
quantidade INT,
empresa_responsavel VARCHAR (30),
)

-- dados do sensor movel, ele puxa informações de cada sensor
CREATE TABLE sensor_dados_moveis (
cod du id sensor
latitude DECIMAL 11,2
longidude DECIMAL 10
temperatura
umidade
);

-- PARA A GELADEIRA FIXA -- ESSENCIAL
CREATE TABLE sensores_fixos (
tipo de sensor
quantidade
mercado que esta
geladeira
;

-- SENSOR DADOS DA GELADEIRA -- ESSENCIAL
CREATE TABLE sensor_dados_fixos (
localizacao
temperatura
umidade
localizacao
);

