# 🥩 SafeMeat

> Sistema de monitoramento da cadeia de frio no transporte de carnes.

## 📋 Sobre o projeto

O **SafeMeat** é um projeto desenvolvido para acompanhar as condições de temperatura durante o transporte de carnes.

A solução tem como foco o monitoramento do **baú frigorífico ou contêiner refrigerado**, acompanhando a carga desde o **fornecedor ou marca** até a chegada ao **mercado**.

O caminhão utilizado no transporte não é necessariamente controlado pela SafeMeat. O principal objetivo do sistema é monitorar as condições do ambiente refrigerado onde os produtos estão armazenados.

## 🎯 Objetivo

- 🌡️ Monitorar a temperatura do baú frigorífico;
- 📡 Coletar dados por meio de sensores;
- 💾 Registrar e armazenar as leituras realizadas;
- 📊 Apresentar os dados em um dashboard;
- ⚠️ Identificar temperaturas fora dos limites definidos;
- 🚨 Gerar alertas para alterações relevantes;
- 🚚 Acompanhar a carga entre o fornecedor e o mercado.

## 🔄 Fluxo do processo

```text
Fornecedor / Marca
        ↓
Preparação da carga
        ↓
Baú Frigorífico
        ↓
Sensores monitoram a temperatura
        ↓
Sistema SafeMeat
        ↓
Armazenamento e análise dos dados
        ↓
Temperatura dentro do limite?
   ┌───────┴────────┐
   │                │
  Sim             Não
   │                │
   ↓                ↓
Continua       Gera alerta
monitorando        │
   │                │
   └───────┬────────┘
           ↓
        Mercado
           ↓
    Consumidor final
```

## 🧩 Participantes

### 🏭 Fornecedor ou Marca
Responsável pelo fornecimento dos produtos que serão transportados.

### 🥩 Produto
Representa os tipos de carne transportados e suas respectivas faixas de temperatura.

### ❄️ Baú Frigorífico
Principal elemento físico monitorado pela SafeMeat. É o ambiente onde a carga permanece durante o transporte.

### 🌡️ Sensor
Responsável por realizar as leituras de temperatura dentro do baú frigorífico.

### 🚚 Transporte
Representa o deslocamento da carga entre o fornecedor e o mercado.

> O caminhão não necessariamente pertence ou é controlado pela SafeMeat.

### 🏪 Mercado
Responsável pelo recebimento da carga transportada.

### 📊 Sistema SafeMeat
Recebe, armazena, analisa e apresenta os dados coletados pelos sensores.

## 📊 Funcionalidades

- Monitoramento da temperatura e umidade;
- Registro das leituras dos sensores;
- Histórico de temperaturas;
- Identificação de valores fora do limite;
- Geração de alertas;
- Dashboard para visualização das informações;
- Cadastro de fornecedores;
- Cadastro de produtos;
- Cadastro de mercados;
- Controle dos baús frigoríficos;
- Acompanhamento dos transportes;
- Indicadores relacionados a possíveis perdas e economia.

## 💰 Indicadores financeiros

O SafeMeat pode utilizar os dados para demonstrar possíveis impactos financeiros relacionados à cadeia de frio.

Exemplos:

- Valor total da carga;
- Prejuízo estimado por perda de produtos;
- Economia gerada pelo monitoramento;
- Custo do sistema de monitoramento;
- Economia líquida;
- Retorno sobre investimento (ROI).

## 🗄️ Estrutura do banco de dados

Atualmente, a estrutura do projeto considera as seguintes entidades:

```text
Em construção🏗️
```

> No estágio atual do projeto, a estrutura não pode ter o uso de `FOREIGN KEY`.

## 🚫 Fora do escopo

O SafeMeat não realiza:

- Controle do caminhão responsável pelo transporte;
- Controle automático da refrigeração;
- Manutenção ou reparo dos equipamentos;
- Fiscalização sanitária;
- Controle completo da operação logística;
- Rastreamento completo do consumidor final;
- Substituição de equipamentos profissionais de refrigeração.

## 🛠️ Tecnologias

Tecnologias previstas ou utilizadas no desenvolvimento:

- HTML
- CSS
- JavaScript
- MySQL
- Sensores de temperatura
- Dashboard para visualização dos dados

## 📌 Premissas

Para o funcionamento do projeto, considera-se:

- Disponibilidade de sensores capazes de realizar leituras de temperatura;
- Existência de um baú frigorífico ou ambiente refrigerado para monitoramento;
- Definição de faixas de temperatura para os produtos;
- Possibilidade de armazenar ou transmitir os dados coletados;
- Ambiente para realização de testes, real ou simulado.

## ⚠️ Restrições

O projeto pode apresentar limitações relacionadas a:

- Orçamento disponível;
- Quantidade e precisão dos sensores;
- Conexão com a internet para transmissão dos dados;
- Disponibilidade de equipamentos;
- Tempo para desenvolvimento e testes;
- Realização de testes em ambientes reais de transporte.

## 👨‍💻 Desenvolvido por

**Adrian Patrício da Silva**

**Brian Joel Duran Villca**

**Dayvid José da Silva Dias**

**Gabriel Alexander Lucena de Oliveira dos Santos**

**Gustavo Cerqueira Fernandes**

**João Pedro Sakamoto Murata Hashimoto**

**Thiago Yashimura Torres**


Projeto acadêmico desenvolvido para fins educacionais.

---

# SafeMeat

**Monitorando a cadeia de frio. Protegendo a qualidade da carga. 🥩❄️**
