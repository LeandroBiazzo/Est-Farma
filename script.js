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

// Eventos para os botões e carregamento de dados
document.addEventListener('DOMContentLoaded', function() {
  carregarDados();
  adicionarEventos();
});

function adicionarEventos() {
  document.getElementById('btnAddProduto').addEventListener('click', () => abrirModal(document.getElementById('modalAddProduto')));
  document.getElementById('btnSaidaProduto').addEventListener('click', () => abrirModal(document.getElementById('modalSaidaProduto')));
  document.getElementById('btnProdutos').addEventListener('click', () => abrirModal(document.getElementById('modalProdutos')));
  document.getElementById('btnRelatorios').addEventListener('click', () => abrirModal(document.getElementById('modalRelatorios')));

  document.getElementById('closeAddProduto').addEventListener('click', () => fecharModal(document.getElementById('modalAddProduto')));
  document.getElementById('closeSaidaProduto').addEventListener('click', () => fecharModal(document.getElementById('modalSaidaProduto')));
  document.getElementById('closeProdutos').addEventListener('click', () => fecharModal(document.getElementById('modalProdutos')));
  document.getElementById('closeRelatorios').addEventListener('click', () => fecharModal(document.getElementById('modalRelatorios')));

  document.getElementById('formAddProduto').addEventListener('submit', adicionarProduto);
  document.getElementById('formSaidaProduto').addEventListener('submit', registrarSaida);
}

function abrirModal(modal) {
  modal.style.display = 'block';
}

function fecharModal(modal) {
  modal.style.display = 'none';
}

// Implementação das funções de negócio como adicionarProduto, registrarSaida, etc.
