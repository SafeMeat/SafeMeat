// 1. ENGINE E REGRAS DE NEGÓCIO (Port de calculadoraEngine.ts)

function formatarMoedaBRL(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarNumeroBR(valor, decimais = 2) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  });
}

function calcularMitigacaoPerdas(input) {
  const pesoTotalKg = Math.max(0, Number(input.pesoTotalKg) || 0);
  const valorMedioKg = Math.max(0, Number(input.valorMedioKg) || 0);
  const estadoMercadoria = input.estadoMercadoria === 'resfriada' ? 'resfriada' : 'congelada';
  const custoDispositivo = Math.max(0, Number(input.custoDispositivo ?? 2200));
  const viagensMes = Math.max(1, Number(input.viagensMes ?? 14));

  const valorTotalCarga = pesoTotalKg * valorMedioKg;

  // 12% Perda Térmica
  const taxaPerdaTermica = 0.12;
  const perdaCadeiaFrio = valorTotalCarga * taxaPerdaTermica;

  // 2% Perda Desidratação
  const taxaPerdaDesidratacao = 0.02;
  const pesoEvaporadoKg = pesoTotalKg * taxaPerdaDesidratacao;
  const perdaDesidratacao = pesoEvaporadoKg * valorMedioKg;

  const valorEstimadoDesperdicioEvitado = perdaCadeiaFrio + perdaDesidratacao;

  const isResfriada = estadoMercadoria === 'resfriada';
  const destaqueResfriada = {
    ativo: isResfriada,
    titulo: isResfriada 
      ? 'Atenção Crítica: Carga Resfriada (In Natura)' 
      : 'Carga Congelada: Controle Preventivo',
    descricao: isResfriada
      ? `A proteína in natura resfriada possui alta atividade de água superficial. O desvio dos níveis ideais de umidade relativa causa evaporação hídrica direta, subtraindo peso na balança do entreposto.`
      : `Mesmo congelada, a quebra de 2% por sublimação e formação de escarcha foi calculada em ${formatarNumeroBR(pesoEvaporadoKg, 1)} kg (${formatarMoedaBRL(perdaDesidratacao)}). A integridade do invólucro e temperatura estável mantêm o valor nominal.`
  };

  const economiaLiquidaPrimeiraViagem = valorEstimadoDesperdicioEvitado - custoDispositivo;
  const roiMultiplicador = custoDispositivo > 0 ? (valorEstimadoDesperdicioEvitado / custoDispositivo) : 0;
  const desperdicioMensalEstimado = valorEstimadoDesperdicioEvitado * viagensMes;
  const desperdicioAnualEstimado = desperdicioMensalEstimado * 12;

  return {
    valorTotalCarga,
    perdaCadeiaFrio,
    pesoEvaporadoKg,
    perdaDesidratacao,
    valorEstimadoDesperdicioEvitado,
    destaqueResfriada,
    estadoMercadoria,
    metricasComplementares: {
      custoDispositivo,
      economiaLiquidaPrimeiraViagem,
      roiMultiplicador,
      desperdicioMensalEstimado,
      desperdicioAnualEstimado,
    },
  };
}


// 2. DADOS DE TELEMETRIA
const veiculos = [
  {
    placa: 'ABC-1234',
    motorista: 'Carlos Silva',
    cnh: 'CNH-E • 8 anos',
    temperatura: '1.8°C',
    umidade: '89%',
    statusTemp: 'normal',
    rota: 'SP → RJ',
    chegadaEstimada: '~14h30',
    bateria: '96%',
    sinal: '-72 dBm (Forte)',
    estadoCarga: 'Resfriada (Cortes Bovinos)',
    dispositivo: 'ColdTrack SN-0041',
  },
  {
    placa: 'DEF-5678',
    motorista: 'Marcos Oliveira',
    cnh: 'CNH-E • 12 anos',
    temperatura: '4.5°C ↑',
    umidade: '74% ↓',
    statusTemp: 'alerta-preditivo',
    rota: 'SP → BH',
    chegadaEstimada: '~16h00',
    bateria: '78%',
    sinal: '-89 dBm (Médio)',
    estadoCarga: 'Resfriada (In Natura)',
    dispositivo: 'ColdTrack SN-0042',
  },
  {
    placa: 'GHI-9012',
    motorista: 'Roberto Fonseca',
    cnh: 'CNH-E • 5 anos',
    temperatura: '2.6°C',
    umidade: '92%',
    statusTemp: 'normal',
    rota: 'SP → CWB',
    chegadaEstimada: '~18h45',
    bateria: '100% (Veicular)',
    sinal: '-68 dBm (Forte)',
    estadoCarga: 'Congelada (-18°C)',
    dispositivo: 'ColdTrack SN-0043',
  },
];


// 3. LÓGICA DE UI E EVENTOS

let state = {
  pesoTotalKg: 25000,
  valorMedioKg: 28.5,
  estadoMercadoria: 'resfriada',
  custoDispositivo: 2200,
  viagensMes: 14,
  abaAtiva: 'calculadora', // 'calculadora' | 'telemetria'
  exibirInfoTecnica: false
};

// Referências DOM - Calculadora
const inputPeso = document.getElementById('input-peso');
const rangePeso = document.getElementById('range-peso');
const displayPeso = document.getElementById('display-peso');

const inputValor = document.getElementById('input-valor');
const rangeValor = document.getElementById('range-valor');
const displayValor = document.getElementById('display-valor');

const inputCusto = document.getElementById('input-custo');
const inputViagens = document.getElementById('input-viagens');

const optResfriada = document.getElementById('opt-resfriada');
const optCongelada = document.getElementById('opt-congelada');

const btnBovina = document.getElementById('preset-bovina');
const btnFrango = document.getElementById('preset-frango');
const btnSuino = document.getElementById('preset-suino');

const btnRedefinir = document.getElementById('btn-redefinir');
const btnInfoTecnica = document.getElementById('btn-info-tecnica');
const caixaInfoTecnica = document.getElementById('caixa-info-tecnica');
const labelInfoTecnica = document.getElementById('label-info-tecnica');

const btnCalcularEconomia = document.getElementById('btn-calcular-economia');

// Referências DOM - Abas
const tabCalculadora = document.getElementById('tab-nav-calculadora');
const tabTelemetria = document.getElementById('tab-nav-telemetria');
const tabMobileCalculadora = document.getElementById('tab-nav-mobile-calculadora');
const tabMobileTelemetria = document.getElementById('tab-nav-mobile-telemetria');
const secaoCalculadora = document.getElementById('secao-calculadora');
const secaoTelemetria = document.getElementById('secao-telemetria');

// Referência DOM - Tabela
const tabelaBody = document.getElementById('tabela-telemetria-body');

// Inicializar ícones Lucide
lucide.createIcons();


// --- RENDERIZAÇÃO DA TABELA TELEMETRIA ---
function renderizarTabelaTelemetria() {
  tabelaBody.innerHTML = veiculos.map(v => {
    const isAlerta = v.statusTemp === 'alerta-preditivo';
    const rowClass = `hover:bg-slate-50/80 transition-colors ${isAlerta ? 'bg-amber-50/50' : ''}`;
    
    return `
      <tr class="${rowClass}">
        <td class="py-3-5 px-4">
          <div class="font-mono font-bold text-slate-900 text-sm">${v.placa}</div>
          <div class="text-[11px] text-slate-400">${v.dispositivo}</div>
        </td>
        <td class="py-3-5 px-4">
          <div class="font-semibold text-slate-900">${v.motorista}</div>
          <div class="text-[11px] text-slate-400">${v.cnh}</div>
        </td>
        <td class="py-3-5 px-4">
          <span class="font-bold text-sm ${isAlerta ? 'text-amber-700 font-extrabold' : 'text-emerald-700'}">${v.temperatura}</span>
        </td>
        <td class="py-3-5 px-4">
          <span class="font-semibold ${isAlerta ? 'text-amber-700' : 'text-blue-700'}">${v.umidade}</span>
        </td>
        <td class="py-3-5 px-4">
          <div class="font-semibold text-slate-800">${v.rota}</div>
          <div class="text-[11px] text-slate-400">${v.chegadaEstimada}</div>
        </td>
        <td class="py-3-5 px-4">
          <div class="flex items-center gap-1-5 text-slate-600">
            <i data-lucide="battery-charging" class="w-3-5 h-3-5 text-emerald-600"></i>
            <span>${v.bateria}</span>
          </div>
          <div class="text-[10px] text-slate-400">${v.sinal}</div>
        </td>
        <td class="py-3-5 px-4">
          ${isAlerta 
            ? `<span class="inline-flex items-center gap-1 px-2-5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <i data-lucide="alert-triangle" class="w-3 h-3"></i> Alerta Preditivo
               </span>`
            : `<span class="inline-flex items-center gap-1 px-2-5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <i data-lucide="check-circle" class="w-3 h-3"></i> Normal
               </span>`
          }
        </td>
        <td class="py-3-5 px-4 text-right">
          <button type="button" class="btn-simular-tabela px-2-5 py-1-5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition">
            Simular Perdas
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  lucide.createIcons(); // Recriar ícones na tabela renderizada
  
  // Adicionar eventos aos botões recém criados
  document.querySelectorAll('.btn-simular-tabela').forEach(btn => {
    btn.addEventListener('click', () => {
      mudarAba('calculadora');
    });
  });
}

// --- ATUALIZADOR DE UI (CALCULADORA) ---
function atualizarUI() {
  const res = calcularMitigacaoPerdas(state);

  // Sincronizar inputs numéricos e ranges
  inputPeso.value = state.pesoTotalKg;
  rangePeso.value = state.pesoTotalKg;
  displayPeso.textContent = `${formatarNumeroBR(state.pesoTotalKg, 0)} kg`;

  inputValor.value = state.valorMedioKg;
  rangeValor.value = state.valorMedioKg;
  displayValor.textContent = `${formatarMoedaBRL(state.valorMedioKg)}/kg`;

  inputCusto.value = state.custoDispositivo;
  inputViagens.value = state.viagensMes;

  // Atualizar Estado da Mercadoria Visualmente
  const ehResfriada = state.estadoMercadoria === 'resfriada';
  
  if (ehResfriada) {
    optResfriada.classList.replace('border-slate-200', 'border-blue-600');
    optResfriada.classList.replace('bg-white', 'bg-blue-50/80');
    optResfriada.classList.add('shadow-xs');
    optResfriada.querySelector('.indicator-check').classList.remove('hidden');
    optResfriada.querySelector('.indicator-circle').classList.add('hidden');
    optResfriada.querySelector('[data-lucide]').classList.replace('text-slate-400', 'text-blue-600');

    optCongelada.classList.replace('border-blue-600', 'border-slate-200');
    optCongelada.classList.replace('bg-blue-50/80', 'bg-white');
    optCongelada.classList.remove('shadow-xs');
    optCongelada.querySelector('.indicator-check').classList.add('hidden');
    optCongelada.querySelector('.indicator-circle').classList.remove('hidden');
    optCongelada.querySelector('[data-lucide]').classList.replace('text-blue-600', 'text-slate-400');
  } else {
    optCongelada.classList.replace('border-slate-200', 'border-blue-600');
    optCongelada.classList.replace('bg-white', 'bg-blue-50/80');
    optCongelada.classList.add('shadow-xs');
    optCongelada.querySelector('.indicator-check').classList.remove('hidden');
    optCongelada.querySelector('.indicator-circle').classList.add('hidden');
    optCongelada.querySelector('[data-lucide]').classList.replace('text-slate-400', 'text-blue-600');

    optResfriada.classList.replace('border-blue-600', 'border-slate-200');
    optResfriada.classList.replace('bg-blue-50/80', 'bg-white');
    optResfriada.classList.remove('shadow-xs');
    optResfriada.querySelector('.indicator-check').classList.add('hidden');
    optResfriada.querySelector('.indicator-circle').classList.remove('hidden');
    optResfriada.querySelector('[data-lucide]').classList.replace('text-blue-600', 'text-slate-400');
  }

  // Resumo Passo 1
  document.getElementById('label-passo1-resumo').innerHTML = `${formatarNumeroBR(state.pesoTotalKg, 0)} kg &times; ${formatarMoedaBRL(state.valorMedioKg)}/kg`;
  document.getElementById('valor-total-carga').textContent = formatarMoedaBRL(res.valorTotalCarga);

  // Cards Principais
  document.getElementById('valor-estimado-desperdicio').textContent = formatarMoedaBRL(res.valorEstimadoDesperdicioEvitado);
  document.getElementById('valor-salvo-termica').textContent = formatarMoedaBRL(res.perdaCadeiaFrio);
  document.getElementById('valor-salvo-umidade').textContent = formatarMoedaBRL(res.perdaDesidratacao);
  document.getElementById('lbl-peso-evaporado').textContent = `${formatarNumeroBR(res.pesoEvaporadoKg, 1)} kg de peso não evaporado`;
  
  document.getElementById('val-investimento').textContent = formatarMoedaBRL(res.metricasComplementares.custoDispositivo);
  document.getElementById('val-economia-liquida').textContent = `Economia Líquida na 1ª viagem: +${formatarMoedaBRL(res.metricasComplementares.economiaLiquidaPrimeiraViagem)} (${formatarNumeroBR(res.metricasComplementares.roiMultiplicador, 1)}x de retorno)`;

  // Passo a Passo Tabela
  document.getElementById('lbl-passo-1').innerHTML = `${formatarNumeroBR(state.pesoTotalKg, 0)} kg &times; ${formatarMoedaBRL(state.valorMedioKg)}`;
  document.getElementById('val-passo-1').textContent = formatarMoedaBRL(res.valorTotalCarga);
  document.getElementById('val-passo-2').textContent = formatarMoedaBRL(res.perdaCadeiaFrio);
  document.getElementById('lbl-passo-3').innerHTML = `2% do peso (${formatarNumeroBR(res.pesoEvaporadoKg, 1)} kg) &times; ${formatarMoedaBRL(state.valorMedioKg)}/kg`;
  document.getElementById('val-passo-3').textContent = formatarMoedaBRL(res.perdaDesidratacao);
  document.getElementById('val-passo-4').textContent = formatarMoedaBRL(res.valorEstimadoDesperdicioEvitado);

  // Projeções
  document.getElementById('lbl-proj-mes-viagens').textContent = state.viagensMes;
  document.getElementById('val-proj-mes').textContent = formatarMoedaBRL(res.metricasComplementares.desperdicioMensalEstimado);
  document.getElementById('val-proj-ano').textContent = formatarMoedaBRL(res.metricasComplementares.desperdicioAnualEstimado);

  // Alerta Dinâmico Resfriada/Congelada
  const alertaContainer = document.getElementById('alerta-estado-carga');
  if (ehResfriada) {
    alertaContainer.innerHTML = `
      <div class="bg-sky-50 border-2 border-sky-400/80 rounded-xl p-4-5 shadow-xs transition-all animate-fade-in">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-sky-500 text-white rounded-lg shrink-0 mt-0-5 shadow-xs">
            <i data-lucide="droplets" class="w-5 h-5"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between flex-wrap gap-2 mb-1">
              <h4 class="text-sm font-bold text-sky-950 flex items-center gap-1-5">
                ${res.destaqueResfriada.titulo}
              </h4>
              <span class="text-xs font-bold px-2 py-0-5 rounded bg-sky-200 text-sky-900 border border-sky-300">
                Evaporação Crítica Evitada
              </span>
            </div>
            <p class="text-xs text-sky-900/90 leading-relaxed">
              ${res.destaqueResfriada.descricao}
            </p>
            <div class="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2-5 border-t border-sky-200/80">
              <div class="bg-white/80 rounded-md p-2 border border-sky-200">
                <span class="text-[10px] uppercase font-bold text-sky-600 block">Volume Evaporado</span>
                <span class="text-sm font-extrabold text-sky-950">${formatarNumeroBR(res.pesoEvaporadoKg, 1)} kg</span>
                <span class="text-[10px] text-slate-500 block">água retida na carcaça</span>
              </div>
              <div class="bg-white/80 rounded-md p-2 border border-sky-200">
                <span class="text-[10px] uppercase font-bold text-sky-600 block">Perda Financeira Evitada</span>
                <span class="text-sm font-extrabold text-sky-950">${formatarMoedaBRL(res.perdaDesidratacao)}</span>
                <span class="text-[10px] text-slate-500 block">dinheiro salvo de "carne leve"</span>
              </div>
              <div class="bg-white/80 rounded-md p-2 border border-sky-200 col-span-2 sm:col-span-1">
                <span class="text-[10px] uppercase font-bold text-sky-600 block">Quebra de Balança</span>
                <span class="text-sm font-extrabold text-sky-950">2,0% da carga</span>
                <span class="text-[10px] text-slate-500 block">mitigado com umidade &gt;85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    alertaContainer.innerHTML = `
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <i data-lucide="thermometer-snowflake" class="w-5 h-5 text-slate-500 shrink-0 mt-0-5"></i>
        <div>
          <span class="font-bold text-slate-800 block mb-0-5">Carga Congelada (-18°C)</span>
          <p class="leading-relaxed">
            ${res.destaqueResfriada.descricao}
          </p>
        </div>
      </div>
    `;
  }
  lucide.createIcons();
}


// --- EVENT LISTENERS E MÉTODOS DE UI ---

function mudarAba(aba) {
  state.abaAtiva = aba;
  
  if (aba === 'calculadora') {
    secaoCalculadora.classList.remove('hidden');
    secaoTelemetria.classList.add('hidden');
    
    // Desktop Nav
    tabCalculadora.className = "flex items-center gap-2 px-3-5 py-1-5 rounded-lg text-xs font-semibold transition-all bg-blue-600 text-white shadow-xs";
    tabTelemetria.className = "flex items-center gap-2 px-3-5 py-1-5 rounded-lg text-xs font-semibold transition-all text-slate-300 hover:text-white hover:bg-slate-700/50";
    
    // Mobile Nav
    tabMobileCalculadora.className = "flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1-5 bg-blue-600 text-white";
    tabMobileTelemetria.className = "flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1-5 text-slate-400 bg-slate-800";
    
  } else {
    secaoCalculadora.classList.add('hidden');
    secaoTelemetria.classList.remove('hidden');
    
    // Desktop Nav
    tabCalculadora.className = "flex items-center gap-2 px-3-5 py-1-5 rounded-lg text-xs font-semibold transition-all text-slate-300 hover:text-white hover:bg-slate-700/50";
    tabTelemetria.className = "flex items-center gap-2 px-3-5 py-1-5 rounded-lg text-xs font-semibold transition-all bg-blue-600 text-white shadow-xs";
    
    // Mobile Nav
    tabMobileCalculadora.className = "flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1-5 text-slate-400 bg-slate-800";
    tabMobileTelemetria.className = "flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1-5 bg-blue-600 text-white";
  }
}

// Navegação
tabCalculadora.addEventListener('click', () => mudarAba('calculadora'));
tabTelemetria.addEventListener('click', () => mudarAba('telemetria'));
tabMobileCalculadora.addEventListener('click', () => mudarAba('calculadora'));
tabMobileTelemetria.addEventListener('click', () => mudarAba('telemetria'));
btnCalcularEconomia.addEventListener('click', () => mudarAba('calculadora'));

// Info Técnica
btnInfoTecnica.addEventListener('click', () => {
  state.exibirInfoTecnica = !state.exibirInfoTecnica;
  if (state.exibirInfoTecnica) {
    caixaInfoTecnica.classList.remove('hidden');
    labelInfoTecnica.textContent = 'Ocultar Fontes';
  } else {
    caixaInfoTecnica.classList.add('hidden');
    labelInfoTecnica.textContent = 'Parâmetros & Fontes';
  }
});

// Inputs Range & Text (Sincronizados)
inputPeso.addEventListener('input', (e) => {
  state.pesoTotalKg = Math.max(0, Number(e.target.value));
  atualizarUI();
});
rangePeso.addEventListener('input', (e) => {
  state.pesoTotalKg = Number(e.target.value);
  atualizarUI();
});

inputValor.addEventListener('input', (e) => {
  state.valorMedioKg = Math.max(0, Number(e.target.value));
  atualizarUI();
});
rangeValor.addEventListener('input', (e) => {
  state.valorMedioKg = Number(e.target.value);
  atualizarUI();
});

inputCusto.addEventListener('input', (e) => {
  state.custoDispositivo = Math.max(0, Number(e.target.value));
  atualizarUI();
});
inputViagens.addEventListener('input', (e) => {
  state.viagensMes = Math.max(1, Number(e.target.value));
  atualizarUI();
});

// Opções de Estado da Mercadoria
optResfriada.addEventListener('click', () => {
  state.estadoMercadoria = 'resfriada';
  atualizarUI();
});
optCongelada.addEventListener('click', () => {
  state.estadoMercadoria = 'congelada';
  atualizarUI();
});

// Presets
btnBovina.addEventListener('click', () => {
  state.pesoTotalKg = 28000;
  state.valorMedioKg = 34.00;
  state.estadoMercadoria = 'resfriada';
  atualizarUI();
});
btnFrango.addEventListener('click', () => {
  state.pesoTotalKg = 24000;
  state.valorMedioKg = 14.50;
  state.estadoMercadoria = 'congelada';
  atualizarUI();
});
btnSuino.addEventListener('click', () => {
  state.pesoTotalKg = 22000;
  state.valorMedioKg = 21.00;
  state.estadoMercadoria = 'resfriada';
  atualizarUI();
});

// Redefinir
btnRedefinir.addEventListener('click', () => {
  state.pesoTotalKg = 25000;
  state.valorMedioKg = 28.50;
  state.estadoMercadoria = 'resfriada';
  state.custoDispositivo = 2200;
  state.viagensMes = 14;
  atualizarUI();
});

// Inicialização
renderizarTabelaTelemetria();
atualizarUI();
