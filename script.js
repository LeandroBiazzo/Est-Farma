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
  document.getElementById('btnProdutos').addEventListener('click', () => abrirModal('modalProdutos'));
  document.getElementById('btnRelatorios').addEventListener('click', () => abrirModal('modalRelatorios'));

  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', function() {
      const modal = button.closest('.modal');
      if (modal) {
        fecharModal(modal.id);
      }
    });
  });

  document.getElementById('formAddProduto').addEventListener('submit', adicionarProduto);
  // Similarmente, adicione eventos para outros formulários conforme necessário
}

function abrirModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  } else {
    console.error("Modal não encontrado: " + modalId);
  }
}

function fecharModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  } else {
    console.error("Modal não encontrado: " + modalId);
  }
}

function carregarDadosIniciais() {
  // Implementar carregamento de dados do Firestore se necessário
  // Exemplo: Carregar produtos e responsáveis para os <select>
}

function adicionarProduto(e) {
  e.preventDefault();
  const nomeProduto = document.getElementById('nomeProduto').value;
  const dataValidade = document.getElementById('dataValidade').value;
  const numeroLote = document.getElementById('numeroLote').value;
  const responsavelEntrada = document.getElementById('responsavelEntrada').value;
  const quantidadeEntrada = parseInt(document.getElementById('quantidadeEntrada').value);

  let produto = {
    nomeProduto: nomeProduto,
    dataValidade: dataValidade,
    numeroLote: numeroLote,
    quantidade: quantidadeEntrada,
    responsavelEntrada: responsavelEntrada
  };

  db.collection('produtos').add(produto)
    .then(docRef => {
      console.log('Produto adicionado com ID:', docRef.id);
      alert('Produto adicionado com sucesso!');
      document.getElementById('formAddProduto').reset();
      fecharModal('modalAddProduto');
    })
    .catch(error => {
      console.error('Erro ao adicionar produto: ', error);
      alert('Erro ao adicionar produto. Por favor, verifique o console para mais detalhes.');
    });
}

// Funções adicionais para editar, excluir, e registrar saídas podem ser adicionadas aqui.
