// Variável global para armazenar a instância do gráfico
let meugrafico = null;

function alternarAba(aba) {
  const abaParametros = document.getElementById('aba-parametros');
  const abaAnalise = document.getElementById('aba-analise');
  const btnParametros = document.getElementById('btn-parametros');
  const btnAnalise = document.getElementById('btn-analise');

  if (aba === 'parametros') {
    if (abaParametros) abaParametros.style.display = 'block';
    if (abaAnalise) abaAnalise.style.display = 'none';
    if (btnParametros) btnParametros.classList.add('active');
    if (btnAnalise) btnAnalise.classList.remove('active');
  } else {
    if (abaParametros) abaParametros.style.display = 'none';
    if (abaAnalise) abaAnalise.style.display = 'block';
    if (btnAnalise) btnAnalise.classList.add('active');
    if (btnParametros) btnParametros.classList.remove('active');
    
    setTimeout(() => {
      gerarAnalise();
    }, 50);
  }
}

function calcularScore(val, nome) {
  // Se o campo não foi preenchido
  if (isNaN(val)) {
    return { 
      score: 0, 
      status: 'pendente', 
      icone: '•', 
      cor: '#9ca3af', 
      titulo: `${nome} não informado`,
      desc: 'Insira o valor deste parâmetro na aba de entrada para gerar a análise.' 
    };
  }

  let status, icone, cor, score, titulo, desc;

  // Paleta Acessível (Daltonismo):
  // Adequado: Azul Claro (#52b2ea)
  // Atenção: Amarelo Âmbar (#f7d000)
  // Crítico: Laranja Avermelhado (#e0531c)

  if (nome === 'pH da Água') {
    if (val >= 6.5 && val <= 7.5) {
      status = 'adequado'; icone = '✓'; cor = '#52b2ea'; score = 100;
      titulo = 'pH Adequado';
      desc = 'Faixa ideal para manutenção dos peixes e equilíbrio biológico.';
    } else if (val >= 6.0 && val <= 8.0) {
      status = 'atencao'; icone = '▲'; cor = '#f7d000'; score = 55;
      titulo = 'pH em Atenção';
      desc = 'Valores levemente fora do ideal. Monitore com frequência.';
    } else {
      status = 'critico'; icone = '■'; cor = '#e0531c'; score = 15;
      titulo = 'pH Crítico';
      desc = 'Nível perigoso para os animais. Correção imediata necessária.';
    }
  } else if (nome === 'Temperatura') {
    if (val >= 24 && val <= 28) {
      status = 'adequado'; icone = '✓'; cor = '#52b2ea'; score = 100;
      titulo = 'Temperatura Adequada';
      desc = 'Temperatura ideal para o metabolismo do ambiente aquático.';
    } else if (val >= 22 && val <= 30) {
      status = 'atencao'; icone = '▲'; cor = '#f7d000'; score = 55;
      titulo = 'Temperatura em Atenção';
      desc = 'Levemente fora da faixa ideal. Ajuste o aquecedor.';
    } else {
      status = 'critico'; icone = '■'; cor = '#e0531c'; score = 15;
      titulo = 'Temperatura Crítica';
      desc = 'Temperatura extrema. Risco imediato para os animais.';
    }
  } else if (nome === 'Turbidez') {
    if (val <= 5) {
      status = 'adequado'; icone = '✓'; cor = '#52b2ea'; score = 100;
      titulo = 'Turbidez Adequada';
      desc = 'Água clara e transparente. Filtração eficiente.';
    } else {
      status = 'critico'; icone = '■'; cor = '#e0531c'; score = 15;
      titulo = 'Turbidez Alta';
      desc = 'Excesso de resíduos em suspensão. Limpe a filtragem.';
    }
  } else if (nome === 'Amônia') {
    if (val <= 0.25) {
      status = 'adequado'; icone = '✓'; cor = '#52b2ea'; score = 100;
      titulo = 'Amônia Adequada';
      desc = 'Nível seguro. Ciclo do nitrogênio funcionando bem.';
    } else {
      status = 'critico'; icone = '■'; cor = '#e0531c'; score = 15;
      titulo = 'Amônia Crítica';
      desc = 'Nível tóxico acumulado. Faça uma TPA imediata.';
    }
  } else if (nome === 'Nitrito') {
    if (val <= 0.1) {
      status = 'adequado'; icone = '✓'; cor = '#52b2ea'; score = 100;
      titulo = 'Nitrito Adequado';
      desc = 'Nível seguro para a saúde dos peixes.';
    } else {
      status = 'critico'; icone = '■'; cor = '#e0531c'; score = 15;
      titulo = 'Nitrito Crítico';
      desc = 'Nível alto e tóxico. Troca de água urgente necessária.';
    }
  }

  return { score, status, icone, cor, titulo, desc };
}

function gerarAnalise() {
  let totalScore = 0;
  let radarScores = [];
  let radarCores = [];
  let progressHTML = '';
  let cardsHTML = '';

  const ph = parseFloat(document.getElementById('input-ph')?.value);
  const temp = parseFloat(document.getElementById('input-temp')?.value);
  const turbidez = parseFloat(document.getElementById('input-turbidez')?.value);
  const amonia = parseFloat(document.getElementById('input-amonia')?.value);
  const nitrito = parseFloat(document.getElementById('input-nitrito')?.value);

  const lista = [
    { nome: 'pH da Água', val: ph, unit: '' },
    { nome: 'Temperatura', val: temp, unit: '°C' },
    { nome: 'Turbidez', val: turbidez, unit: 'NTU' },
    { nome: 'Amônia', val: amonia, unit: 'mg/L' },
    { nome: 'Nitrito', val: nitrito, unit: 'mg/L' }
  ];

  lista.forEach(p => {
    const calc = calcularScore(p.val, p.nome);
    totalScore += calc.score;
    radarScores.push(calc.score);
    radarCores.push(calc.cor);

    progressHTML += `
      <div class="progress-item">
        <span class="progress-label" style="color: ${calc.cor}">
          <span>${calc.icone}</span> ${p.nome}
        </span>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${calc.score}%; background-color: ${calc.cor}"></div>
        </div>
        <span class="progress-value" style="color: ${calc.cor}">${calc.score}%</span>
      </div>
    `;

    let tagTexto = '';
    if (calc.status === 'adequado') {
      tagTexto = '✓ ADEQUADO';
    } else if (calc.status === 'atencao') {
      tagTexto = '▲ ATENÇÃO';
    } else if (calc.status === 'critico') {
      tagTexto = '■ CRÍTICO';
    } else {
      tagTexto = '• SEM DADOS';
    }

    cardsHTML += `
      <div class="res-card ${calc.status}">
        <div class="res-header">
          <span class="title">${p.nome}</span>
          <span class="tag ${calc.status}">${tagTexto}</span>
        </div>
        <div class="res-val">${isNaN(p.val) ? '—' : p.val} <span>${p.unit}</span></div>
        <div class="res-title">${calc.titulo}</div>
        <div class="res-desc">${calc.desc}</div>
      </div>
    `;
  });

  let mediaSaude = Math.round(totalScore / 5);
  let saudeElem = document.getElementById('saude-texto');

  if (saudeElem) {
    if (mediaSaude >= 80) {
      saudeElem.innerHTML = `Adequado • ${mediaSaude}%`;
      saudeElem.style.color = '#52b2ea';
    } else if (mediaSaude >= 40) {
      saudeElem.innerHTML = `Atenção • ${mediaSaude}%`;
      saudeElem.style.color = '#f7d000';
    } else {
      saudeElem.innerHTML = `Crítico • ${mediaSaude}%`;
      saudeElem.style.color = '#e0531c';
    }
  }

  const elemProgress = document.getElementById('progress-list');
  if (elemProgress) elemProgress.innerHTML = progressHTML;

  const elemCards = document.getElementById('resultados-cards');
  if (elemCards) elemCards.innerHTML = cardsHTML;

  desenharRadar(radarScores, radarCores);
}

function desenharRadar(dados, coresPontos) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (meugrafico) meugrafico.destroy();

  meugrafico = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['pH da Água', 'Temperatura', 'Turbidez', 'Amônia', 'Nitrito'],
      datasets: [{
        data: dados,
        backgroundColor: 'rgba(82, 178, 234, 0.2)',
        borderColor: '#52b2ea',
        borderWidth: 2,
        pointBackgroundColor: coresPontos,
        pointBorderColor: coresPontos,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
          grid: { color: 'rgba(255, 255, 255, 0.15)' },
          pointLabels: { 
            color: '#8eb1c7', 
            font: { size: 10 } 
          },
          ticks: { display: false },
          min: 0, 
          max: 100
        }
      },
      plugins: { 
        legend: { display: false } 
      }
    }
  });
}