// Variável global para armazenar a instância do gráfico
let meugrafico = null;

function alternarAba(aba) {
  const abaParametros = document.getElementById('aba-parametros');
  const abaAnalise = document.getElementById('aba-analise');
  const abaHistorico = document.getElementById('aba-historico');
  
  const btnParametros = document.getElementById('btn-parametros');
  const btnAnalise = document.getElementById('btn-analise');
  const btnHistorico = document.getElementById('btn-historico');

  // Esconde todas as abas e remove a classe active de todos os botões
  if (abaParametros) abaParametros.style.display = 'none';
  if (abaAnalise) abaAnalise.style.display = 'none';
  if (abaHistorico) abaHistorico.style.display = 'none';

  if (btnParametros) btnParametros.classList.remove('active');
  if (btnAnalise) btnAnalise.classList.remove('active');
  if (btnHistorico) btnHistorico.classList.remove('active');

  // Mostra apenas a aba selecionada e ativa o botão correspondente
  if (aba === 'parametros') {
    if (abaParametros) abaParametros.style.display = 'block';
    if (btnParametros) btnParametros.classList.add('active');
  } else if (aba === 'analise') {
    if (abaAnalise) abaAnalise.style.display = 'block';
    if (btnAnalise) btnAnalise.classList.add('active');
    setTimeout(() => {
      gerarAnalise();
    }, 50);
  } else if (aba === 'historico') {
    if (abaHistorico) abaHistorico.style.display = 'block';
    if (btnHistorico) btnHistorico.classList.add('active');
    carregarHistorico(); // Carrega o histórico filtrado deste aparelho ao abrir a aba
  }
}

function calcularScore(val, nome) {
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
      tagTexto = 'SEM DADOS';
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

// Função para buscar o histórico filtrado pelo ID deste aparelho
async function carregarHistorico() {
  const containerHistorico = document.getElementById('lista-historico');
  if (!containerHistorico) return;

  // Recupera ou cria o ID único deste navegador
  let meuDispositivoId = localStorage.getItem('tambaqui_device_id');
  if (!meuDispositivoId) {
    meuDispositivoId = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('tambaqui_device_id', meuDispositivoId);
  }

  try {
    const resposta = await fetch('http://localhost:3000/medicoes');
    const todasMedicoes = await resposta.json();

    // Filtra apenas os registros que pertencem a este device_id
    const medicoesDesteUsuario = todasMedicoes.filter(m => m.device_id === meuDispositivoId);

    if (medicoesDesteUsuario.length === 0) {
      containerHistorico.innerHTML = '<p style="color: #8eb1c7; text-align: center; padding: 20px;">Nenhuma medição salva neste aparelho.</p>';
      return;
    }

    let htmlHistorico = '<div class="cards-historico" style="margin-top: 15px;">';
    
    medicoesDesteUsuario.forEach(m => {
      // Cria a data garantindo que o fuso horário seja interpretado corretamente
const dataObj = new Date(m.data_hora);
const dataFormatada = dataObj.toLocaleString('pt-BR', {
  timeZone: 'America/Manaus', 
  dateStyle: 'short',
  timeStyle: 'medium'
});

      htmlHistorico += `
        <div class="historico-card" style="background: #1e293b; padding: 15px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #52b2ea; color: #fff;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: #52b2ea;">${m.viveiro || 'Viveiro 01'}</strong> 
            <small style="color: #9ca3af;">${dataFormatada}</small>
          </div>
          <div style="font-size: 0.9rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 5px;">
            <span>pH: <b>${m.ph}</b></span>
            <span>Temp: <b>${m.temperatura}°C</b></span>
            <span>Turbidez: <b>${m.turbidez} NTU</b></span>
            <span>Amônia: <b>${m.amonia} mg/L</b></span>
            <span>Nitrito: <b>${m.nitrito} mg/L</b></span>
          </div>
        </div>
      `;
    });

    htmlHistorico += '</div>';
    containerHistorico.innerHTML = htmlHistorico;

  } catch (erro) {
    console.error('Erro ao carregar histórico:', erro);
    containerHistorico.innerHTML = '<p style="color: #e0531c; text-align: center; padding: 20px;">Erro ao carregar o histórico do servidor.</p>';
  }
}

// Intercepta o envio do formulário, envia o device_id e muda para a aba de análise
const formElement = document.querySelector('.form-container');

if (formElement) {
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Garante que o navegador tem um ID único gerado
    let meuDispositivoId = localStorage.getItem('tambaqui_device_id');
    if (!meuDispositivoId) {
      meuDispositivoId = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('tambaqui_device_id', meuDispositivoId);
    }

    const novaMedicao = {
      viveiro: document.getElementById('input-viveiro').value || "Viveiro 01",
      ph: parseFloat(document.getElementById('input-ph').value),
      temperatura: parseFloat(document.getElementById('input-temp').value),
      oxigenio: 5.8, 
      amonia: parseFloat(document.getElementById('input-amonia').value),
      nitrito: parseFloat(document.getElementById('input-nitrito').value),
      turbidez: parseFloat(document.getElementById('input-turbidez').value),
      device_id: meuDispositivoId // Envia o ID único do aparelho para o backend
    };

    try {
      const resposta = await fetch('http://localhost:3000/medicoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaMedicao)
      });

      if (resposta.ok) {
        console.log('Medição salva com sucesso!');
        alternarAba('analise');
      } else {
        alert('Erro ao salvar a medição na API.');
      }
    } catch (erro) {
      console.error('Erro de conexão com o backend:', erro);
      alert('Não foi possível conectar ao servidor da API na porta 3000.');
    }
  });
}