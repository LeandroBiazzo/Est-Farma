// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2-ZPAOjhI1wxsU-6uNFhj7MLmlu_8CAw",
  authDomain: "estoque-338a7.firebaseapp.com",
  projectId: "estoque-338a7",
  storageBucket: "estoque-338a7.appspot.com",
  messagingSenderId: "839845305923",
  appId: "1:839845305923:web:79e0582a590c450618fef6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
  adicionarEventos();
  carregarDadosIniciais();
});

function adicionarEventos() {
  document.getElementById('btnAddProduto').addEventListener('click', () => abrirModal('modalAddProduto'));
  document.getElementById('btnAddResponsavel').addEventListener('click', () => abrirModal('modalAddResponsavel'));
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', function() {
      const modal = button.closest('.modal');
      fecharModal(modal.id);
    });
  });

  document.getElementById('formAddProduto').addEventListener('submit', adicionarProduto);
  document.getElementById('formAddResponsavel').addEventListener('submit', adicionarResponsavel);
}

function abrirModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
}

function fecharModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
}

function carregarDadosIniciais() {
  // Carregue dados necessários para os selects ou listas
}

function adicionarProduto(e) {
  e.preventDefault();
  // Implemente a adição de produto ao Firestore
}

function adicionarResponsavel(e) {
  e.preventDefault();
  // Implemente a adição de responsável ao Firestore
}

// Implemente funções adicionais conforme necessário
