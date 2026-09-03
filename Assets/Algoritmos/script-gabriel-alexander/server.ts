import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Interface da requisição da calculadora
interface CalculoRequestBody {
  pesoTotalKg?: number;
  valorMedioKg?: number;
  estadoMercadoria?: 'congelada' | 'resfriada';
  custoDispositivo?: number;
  viagensMes?: number;
}

/**
 * Endpoint de Regra de Negócio: Mitigação de Perdas Logísticas
 * Passo 1: Cálculo do Valor Bruto (Peso Total * Valor Médio/kg)
 * Passo 2: Quebra da Cadeia do Frio (Falha Térmica: 12% fixo)
 * Passo 3: Perda Física por Desidratação (Falha de Umidade: 2% do peso total evaporado * valor/kg)
 * Passo 4: Valor Estimado de Desperdício Evitado (Falha Térmica + Perda por Desidratação)
 */
function processarCalculo(data: CalculoRequestBody) {
  const pesoTotalKg = Math.max(0, Number(data.pesoTotalKg) || 0);
  const valorMedioKg = Math.max(0, Number(data.valorMedioKg) || 0);
  const estadoMercadoria = data.estadoMercadoria === 'resfriada' ? 'resfriada' : 'congelada';
  const custoDispositivo = Math.max(0, Number(data.custoDispositivo ?? 2000));
  const viagensMes = Math.max(1, Number(data.viagensMes ?? 12));

  // Passo 1: Cálculo do Valor Bruto
  const valorTotalCarga = pesoTotalKg * valorMedioKg;

  // Passo 2: Cálculo da Perda por Quebra da Cadeia do Frio (Falha Térmica)
  // Perda estatística fixa de 12% decorrente de falta de controle de temperatura
  const taxaPerdaTermica = 0.12;
  const perdaCadeiaFrio = valorTotalCarga * taxaPerdaTermica;

  // Passo 3: Cálculo da Perda Física por Desidratação (Falha de Umidade)
  // Quebra de peso de 2% por evaporação hídrica multiplicada pelo valor do quilo
  const taxaPerdaDesidratacao = 0.02;
  const pesoEvaporadoKg = pesoTotalKg * taxaPerdaDesidratacao;
  const perdaDesidratacao = pesoEvaporadoKg * valorMedioKg;

  // Passo 4: Retorno e Exibição para o Usuário
  // Soma das duas perdas mitigadas pelo dispositivo preditivo
  const valorEstimadoDesperdicioEvitado = perdaCadeiaFrio + perdaDesidratacao;

  // Detalhamento e destaque para carga Resfriada
  const isResfriada = estadoMercadoria === 'resfriada';

  const economiaLiquidaPrimeiraViagem = valorEstimadoDesperdicioEvitado - custoDispositivo;
  const roiMultiplicador = custoDispositivo > 0 ? (valorEstimadoDesperdicioEvitado / custoDispositivo) : 0;
  const paybackViagens = valorEstimadoDesperdicioEvitado > 0 ? Math.ceil(custoDispositivo / valorEstimadoDesperdicioEvitado) : 1;

  const desperdicioMensalEstimado = valorEstimadoDesperdicioEvitado * viagensMes;
  const desperdicioAnualEstimado = desperdicioMensalEstimado * 12;

  return {
    sucesso: true,
    data: {
      valorTotalCarga,
      perdaCadeiaFrio,
      taxaPerdaTermica,
      taxaPerdaDesidratacao,
      pesoEvaporadoKg,
      perdaDesidratacao,
      valorEstimadoDesperdicioEvitado,
      detalhamento: {
        salvoQuebraTermica: perdaCadeiaFrio,
        salvoDesidratacaoUmidade: perdaDesidratacao,
        percentualTermico: taxaPerdaTermica * 100, // 12%
        percentualUmidade: taxaPerdaDesidratacao * 100, // 2%
        pesoEvaporadoKg,
      },
      estadoMercadoria,
      pesoTotalKg,
      valorMedioKg,
      destaqueResfriada: {
        ativo: isResfriada,
        titulo: isResfriada
          ? 'Atenção Crítica: Carga Resfriada (In Natura)'
          : 'Carga Congelada: Controle Preventivo',
        descricao: isResfriada
          ? 'A proteína in natura resfriada possui alta taxa de evaporação hídrica superficial. Sem controle estrito de umidade relativa e ponto de orvalho, a carga sofre quebra de peso ("carne mais leve na balança"), causando perda direta de receita líquida.'
          : 'Em cargas congeladas, o controle preditivo previne a sublimação do gelo intersticial e a perda de umidade celular decorrente de flutuações térmicas no baú.',
        pesoEvaporadoFormatado: `${pesoEvaporadoKg.toFixed(1)} kg`,
        impactoFinanceiro: perdaDesidratacao,
      },
      metricasComplementares: {
        custoDispositivo,
        economiaLiquidaPrimeiraViagem,
        roiMultiplicador,
        paybackViagens,
        desperdicioMensalEstimado,
        desperdicioAnualEstimado,
      },
    },
  };
}

// API Routes
app.post('/api/calculadora-perdas', (req: Request, res: Response) => {
  try {
    const resultado = processarCalculo(req.body);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro ao processar cálculo de perdas logísticas.',
      detalhes: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

// Rota de conveniência /api/calculate
app.post('/api/calculate', (req: Request, res: Response) => {
  try {
    const resultado = processarCalculo(req.body);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro ao processar cálculo de perdas logísticas.',
      detalhes: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    servico: 'ColdTrack Logistics Loss Mitigation Calculator API',
    versao: '2.0.0',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ColdTrack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
