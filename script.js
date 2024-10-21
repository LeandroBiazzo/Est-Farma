// script.js

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2-ZPAOjhI1wxsU-6uNFhj7MLmlu_8CAw",
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

// Eventos para os botões e carregamento de dados
document.addEventListener('DOMContentLoaded', function() {
  carregarDados();

  // Botões do menu
  const btnAddProduto = document.getElementById('btnAddProduto');
  const btnSaidaProduto = document.getElementById('btnSaidaProduto');
  const btnProdutos = document.getElementById('btnProdutos');
  const btnRelatorios = document.getElementById('btnRelatorios');

  // Modais
  const modalAddProduto = document.getElementById('modalAddProduto');
  const modalAddResponsavel = document.getElementById('modalAddResponsavel'); // Novo modal
  const modalSaidaProduto = document.getElementById('modalSaidaProduto');
  const modalProdutos = document.getElementById('modalProdutos');
  const modalRelatorios = document.getElementById('modalRelatorios');

  // Botões de abrir modais
  const btnAddResponsavel = document.getElementById('btnAddResponsavel'); // Novo botão

  // Botões de fechar
  const closeAddProduto = document.getElementById('closeAddProduto');
  const closeAddResponsavel = document.getElementById('closeAddResponsavel'); // Novo
  const closeSaidaProduto = document.getElementById('closeSaidaProduto');
  const closeProdutos = document.getElementById('closeProdutos');
  const closeRelatorios = document.getElementById('closeRelatorios');

  // Formulários
  const formAddProduto = document.getElementById('formAddProduto');
  const formAddResponsavel = document.getElementById('formAddResponsavel'); // Novo
  const formSaidaProduto = document.getElementById('formSaidaProduto');

  // Eventos de abertura dos modais
  btnAddProduto.onclick = function() {
    abrirModal(modalAddProduto);
    carregarResponsaveisNoSelect('responsavelEntrada');
  };

  btnAddResponsavel.onclick = function() {
    abrirModal(modalAddResponsavel);
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

  closeAddResponsavel.onclick = function() {
    fecharModal(modalAddResponsavel);
  };

  closeSaidaProduto.onclick = function() {
    fecharModal(modalSaidaProduto);
  };

  closeProdutos.onclick = function() {
    fecharModal(modalProdutos);
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

  // Evento para submissão do formulário de adicionar responsável
  formAddResponsavel.onsubmit = function(e) {
    e.preventDefault();
    adicionarResponsavel();
    fecharModal(modalAddResponsavel);
  };

  // Evento para submissão do formulário de registrar saída
  formSaidaProduto.onsubmit = function(e) {
    e.preventDefault();
    registrarSaida();
    fecharModal(modalSaidaProduto);
  };
});

// Funções para abrir e fechar modais
function abrirModal(modal) {
  modal.style.display = "block";
}

function fecharModal(modal) {
  modal.style.display = "none";
}

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

// Função para adicionar responsável
function adicionarResponsavel() {
  const nomeResponsavel = document.getElementById('nomeResponsavel').value;
  let responsavel = { nomeResponsavel: nomeResponsavel };

  // Salvar no Firestore
  db.collection('responsaveis').add(responsavel)
    .then((docRef) => {
      responsavel.idResponsavel = docRef.id;
      responsaveis.push(responsavel);
      alert('Responsável adicionado com sucesso!');
      carregarResponsaveisNoSelect('responsavelEntrada'); // Atualiza o select
      carregarResponsaveisNoSelect('responsavelLiberacao'); // Atualiza outro select, se necessário
    })
    .catch((error) => {
      console.error('Erro ao adicionar responsável: ', error);
    });
}

// Função para carregar responsáveis no select
function carregarResponsaveisNoSelect(selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = '';

  // Ordenar responsaveis por nome
  responsaveis.sort((a, b) => a.nomeResponsavel.localeCompare(b.nomeResponsavel));

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

  // Ordenar produtos por nome
  produtos.sort((a, b) => a.nomeProduto.localeCompare(b.nomeProduto));

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

  // Ordenar lotes por número de lote
  lotes.sort((a, b) => a.numeroLote.localeCompare(b.numeroLote));

  lotes.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.numeroLote;
    option.text = produto.numeroLote;
    select.appendChild(option);
  });
}

// Função para exibir produtos em estoque
function exibirProdutos() {
  const produtosContent = document.getElementById('produtosContent');
  produtosContent.innerHTML = '';

  if (produtos.length === 0) {
    produtosContent.innerHTML = '<p>Nenhum produto em estoque.</p>';
    return;
  }

  // Ordenar produtos por nome
  produtos.sort((a, b) => a.nomeProduto.localeCompare(b.nomeProduto));

  const tabela = document.createElement('table');
  const cabecalho = document.createElement('tr');
  cabecalho.innerHTML = '<th>Nome do Produto</th><th>Número do Lote</th><th>Quantidade</th><th>Data de Validade</th>';
  tabela.appendChild(cabecalho);

  produtos.forEach(produto => {
    const linha = document.createElement('tr');
    linha.innerHTML = `<td>${produto.nomeProduto}</td><td>${produto.numeroLote}</td><td>${produto.quantidade}</td><td>${produto.dataValidade}</td>`;
    tabela.appendChild(linha);
  });

  produtosContent.appendChild(tabela);
}

// As demais funções (adicionarProduto, registrarSaida, gerarRelatorios) permanecem as mesmas
