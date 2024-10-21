// script.js

// Variáveis globais
let produtos = [];
let entradas = [];
let saidas = [];
let responsaveis = [];
let idProduto = 1;
let idEntrada = 1;
let idSaida = 1;
let idResponsavel = 1;

// Carregar dados iniciais
function carregarDados() {
  // Aqui poderíamos carregar dados de um arquivo JSON ou servidor.
  // Para simplificar, iniciaremos com arrays vazios.
}

// Funções para abrir e fechar modais
function abrirModal(modal) {
  modal.style.display = "block";
}

function fecharModal(modal) {
  modal.style.display = "none";
}

// Eventos para os botões
window.onload = function() {
  carregarDados();

  // Botões do menu
  const btnAddProduto = document.getElementById('btnAddProduto');
  const btnSaidaProduto = document.getElementById('btnSaidaProduto');
  const btnRelatorios = document.getElementById('btnRelatorios');

  // Modais
  const modalAddProduto = document.getElementById('modalAddProduto');
  const modalSaidaProduto = document.getElementById('modalSaidaProduto');
  const modalRelatorios = document.getElementById('modalRelatorios');

  // Botões de fechar
  const closeAddProduto = document.getElementById('closeAddProduto');
  const closeSaidaProduto = document.getElementById('closeSaidaProduto');
  const closeRelatorios = document.getElementById('closeRelatorios');

  // Formulários
  const formAddProduto = document.getElementById('formAddProduto');
  const formSaidaProduto = document.getElementById('formSaidaProduto');

  // Eventos de abertura dos modais
  btnAddProduto.onclick = function() {
    abrirModal(modalAddProduto);
    carregarResponsaveisNoSelect('responsavelEntrada');
  };

  btnSaidaProduto.onclick = function() {
    abrirModal(modalSaidaProduto);
    carregarResponsaveisNoSelect('responsavelLiberacao');
  };

  btnRelatorios.onclick = function() {
    abrirModal(modalRelatorios);
    gerarRelatorios();
  };

  // Eventos de fechamento dos modais
  closeAddProduto.onclick = function() {
    fecharModal(modalAddProduto);
  };

  closeSaidaProduto.onclick = function() {
    fecharModal(modalSaidaProduto);
  };

  closeRelatorios.onclick = function() {
    fecharModal(modalRelatorios);
  };

  // Evento para submissão do formulário de adicionar produto
  formAddProduto.onsubmit = function(e) {
    e.preventDefault();
    adicionarProduto();
    fecharModal(modalAddProduto);
  };

  // Evento para submissão do formulário de registrar saída
  formSaidaProduto.onsubmit = function(e) {
    e.preventDefault();
    registrarSaida();
    fecharModal(modalSaidaProduto);
  };
};

// Função para adicionar um produto
function adicionarProduto() {
  const nomeProduto = document.getElementById('nomeProduto').value;
  const identificacaoNF = document.getElementById('identificacaoNF').value;
  const dataValidade = document.getElementById('dataValidade').value;
  const numeroLote = document.getElementById('numeroLote').value;
  const responsavelEntrada = document.getElementById('responsavelEntrada').value;
  const quantidadeEntrada = parseInt(document.getElementById('quantidadeEntrada').value);

  // Criar produto se não existir
  let produto = produtos.find(p => p.nomeProduto === nomeProduto && p.numeroLote === numeroLote);
  if (!produto) {
    produto = {
      idProduto: idProduto++,
      nomeProduto: nomeProduto,
      identificacaoNF: identificacaoNF,
      dataValidade: dataValidade,
      numeroLote: numeroLote,
      quantidade: quantidadeEntrada,
      responsavelEntrada: responsavelEntrada
    };
    produtos.push(produto);
  } else {
    // Atualizar quantidade se já existir
    produto.quantidade += quantidadeEntrada;
  }

  // Registrar entrada
  const entrada = {
    idEntrada: idEntrada++,
    idProduto: produto.idProduto,
    dataEntrada: new Date().toLocaleString(),
    quantidadeEntrada: quantidadeEntrada,
    responsavelEntrada: responsavelEntrada,
    identificacaoNF: identificacaoNF,
    numeroLote: numeroLote,
    dataValidade: dataValidade
  };
  entradas.push(entrada);

  alert('Produto adicionado com sucesso!');
}

// Função para registrar saída
function registrarSaida() {
  const nomeProduto = document.getElementById('produtoSaida').value;
  const numeroLote = document.getElementById('numeroLoteSaida').value;
  const quantidadeSaida = parseInt(document.getElementById('quantidadeSaida').value);
  const localDestino = document.getElementById('localDestino').value;
  const responsavelLiberacao = document.getElementById('responsavelLiberacao').value;

  let produto = produtos.find(p => p.nomeProduto === nomeProduto && p.numeroLote === numeroLote);
  if (!produto) {
    alert('Produto não encontrado!');
    return;
  }

  if (quantidadeSaida > produto.quantidade) {
    alert('Quantidade indisponível em estoque!');
    return;
  }

  produto.quantidade -= quantidadeSaida;

  // Se a quantidade chegar a zero, remover produto da lista
  if (produto.quantidade === 0) {
    produtos = produtos.filter(p => p.idProduto !== produto.idProduto);
  }

  // Registrar saída
  const saida = {
    idSaida: idSaida++,
    idProduto: produto.idProduto,
    dataSaida: new Date().toLocaleString(),
    quantidadeSaida: quantidadeSaida,
    numeroLote: numeroLote,
    localDestino: localDestino,
    responsavelLiberacao: responsavelLiberacao
  };
  saidas.push(saida);

  alert('Saída registrada com sucesso!');
}

// Função para carregar responsáveis no select
function carregarResponsaveisNoSelect(selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = '';
  responsaveis.forEach(resp => {
    const option = document.createElement('option');
    option.value = resp.nomeResponsavel;
    option.text = resp.nomeResponsavel;
    select.appendChild(option);
  });
}

// Função para gerar relatórios
function gerarRelatorios() {
  const relatoriosContent = document.getElementById('relatoriosContent');
  relatoriosContent.innerHTML = '';

  // Exemplo de relatório de produtos em estoque
  const titulo = document.createElement('h3');
  titulo.textContent = 'Produtos em Estoque';
  relatoriosContent.appendChild(titulo);

  const tabela = document.createElement('table');
  const cabecalho = document.createElement('tr');
  cabecalho.innerHTML = '<th>Nome do Produto</th><th>Número do Lote</th><th>Quantidade</th><th>Data de Validade</th>';
  tabela.appendChild(cabecalho);

  produtos.forEach(produto => {
    const linha = document.createElement('tr');
    linha.innerHTML = `<td>${produto.nomeProduto}</td><td>${produto.numeroLote}</td><td>${produto.quantidade}</td><td>${produto.dataValidade}</td>`;
    tabela.appendChild(linha);
  });

  relatoriosContent.appendChild(tabela);
}

// Exemplo: Adicionar responsáveis iniciais
responsaveis.push({ idResponsavel: idResponsavel++, nomeResponsavel: 'João Silva' });
responsaveis.push({ idResponsavel: idResponsavel++, nomeResponsavel: 'Maria Souza' });
