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
  const modalSaidaProduto = document.getElementById('modalSaidaProduto');
  const modalProdutos = document.getElementById('modalProdutos');
  const modalRelatorios = document.getElementById('modalRelatorios');

  // Botões de fechar
  const closeAddProduto = document.getElementById('closeAddProduto');
  const closeSaidaProduto = document.getElementById('closeSaidaProduto');
  const closeProdutos = document.getElementById('closeProdutos');
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
});

// Funções para abrir e fechar modais
function abrirModal(modal) {
  modal.style.display = "block";
}

function fecharModal(modal) {
  modal.style.display = "none";
}

// As demais funções permanecem as mesmas
// carregarDados, adicionarProduto, registrarSaida, carregarResponsaveisNoSelect,
// carregarProdutosNoSelect, carregarLotesNoSelect, exibirProdutos, gerarRelatorios

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

// As demais funções continuam iguais, sem alterações
