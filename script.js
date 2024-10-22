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
  document.getElementById('btnSaidaProduto').addEventListener('click', () => abrirModal('modalSaidaProduto'));
  // Adicionar mais eventos conforme necessário
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
  // Implementar carregamento de dados do Firestore se necessário
}

// Implementação de adicionarProduto, registrarSaida, e outras funções relevantes
function adicionarProduto(e) {
  e.preventDefault();
  // Implementar lógica de adicionar produto
}

// Continuar com mais funções conforme necessário
