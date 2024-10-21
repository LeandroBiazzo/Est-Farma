// script.js

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY", // Substitua por sua chave API do Firebase
  authDomain: "estoque-338a7.firebaseapp.com",
  projectId: "estoque-338a7",
  storageBucket: "estoque-338a7.appspot.com",
  messagingSenderId: "839845305923",
  appId: "1:839845305923:web:79e0582a590c450618fef6"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obter referência ao Firestore
const db = firebase.firestore();

// Variáveis globais
let produtos = [];
let entradas = [];
let saidas = [];
let responsaveis = [];

// Função para carregar dados iniciais
function carregarDados() {
  // Carregar responsáveis
  db.collection('responsaveis').get().then((querySnapshot) => {
    responsaveis = [];
    querySnapshot.forEach((doc) => {
      let responsavel = doc.data();
      responsavel.idResponsavel = doc.id;
      responsaveis.push(responsavel);
    });
  });

  // Carregar produtos
  db.collection('produtos').get().then((querySnapshot) => {
    produtos = [];
    querySnapshot.forEach((doc) => {
      let produto = doc.data();
      produto.idProduto = doc.id;
      produtos.push(produto);
    });
  });
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
  const btnProdutos = document.getElementById('btnProdutos');
  const btnRelatorios = document.getElementById('btnRelatorios');

  // Modais
  const modalAddProduto = document.getElementById('modalAddProduto');
  const modalSaidaProduto = document.getElementById('modalSaidaProduto');
  const modalProdutos = document.getElementById('modalProdutos');
  const modalRelatorios = document.getElementById('modalRelatorios'); // Adicionado

  // Botões de fechar
  const closeAddProduto = document.getElementById('closeAddProduto');
  const closeSaidaProduto = document.getElementById('closeSaidaProduto');
  const closeProdutos = document.getElementById('closeProdutos');
  const closeRelatorios = document.getElementById('closeRelatorios'); // Adicionado

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
    carregarProdutosNoSelect('produtoSaida');
  };

  btnProdutos.onclick = function() {
    abrirModal(modalProdutos);
    exibirProdutos();
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

  closeProdutos.onclick = function() {
    fecharModal(modalProdutos);
  };

  closeRelatorios.onclick = function() { // Adicionado
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
  // ... (sem alterações nesta função)
}

// Função para registrar saída
function registrarSaida() {
  // ... (sem alterações nesta função)
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

// Função para carregar produtos no select de saída
function carregarProdutosNoSelect(selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = '';
  produtos.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.nomeProduto;
    option.text = produto.nomeProduto;
    select.appendChild(option);
  });

  // Evento de mudança para carregar lotes correspondentes
  select.onchange = function() {
    carregarLotesNoSelect('numeroLoteSaida', select.value);
  };

  // Carregar lotes para o primeiro produto por padrão
  if (produtos.length > 0) {
    carregarLotesNoSelect('numeroLoteSaida', produtos[0].nomeProduto);
  }
}

// Função para carregar lotes no select de número de lote
function carregarLotesNoSelect(selectId, nomeProduto) {
  const select = document.getElementById(selectId);
  select.innerHTML = '';
  
  const lotes = produtos.filter(p => p.nomeProduto === nomeProduto);

  lotes.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.numeroLote;
    option.text = produto.numeroLote;
    select.appendChild(option);
  });
}

// Função para exibir produtos em estoque
function exibirProdutos() {
  // ... (sem alterações nesta função)
}

// Função para gerar relatórios (adicionada)
function gerarRelatorios() {
  const relatoriosContent = document.getElementById('relatoriosContent');
  relatoriosContent.innerHTML = '';

  // Exemplo de relatório de produtos em estoque
  if(produtos.length === 0) {
    relatoriosContent.innerHTML = '<p>Nenhum produto em estoque.</p>';
    return;
  }

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
