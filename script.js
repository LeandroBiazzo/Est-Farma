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
  const modalAddResponsavel = document.getElementById('modalAddResponsavel');
  const modalSaidaProduto = document.getElementById('modalSaidaProduto');
  const modalProdutos = document.getElementById('modalProdutos');
  const modalRelatorios = document.getElementById('modalRelatorios');

  // Botões de abrir modais
  const btnAddResponsavel = document.getElementById('btnAddResponsavel');

  // Botões de fechar
  const closeAddProduto = document.getElementById('closeAddProduto');
  const closeAddResponsavel = document.getElementById('closeAddResponsavel');
  const closeSaidaProduto = document.getElementById('closeSaidaProduto');
  const closeProdutos = document.getElementById('closeProdutos');
  const closeRelatorios = document.getElementById('closeRelatorios');

  // Formulários
  const formAddProduto = document.getElementById('formAddProduto');
  const formAddResponsavel = document.getElementById('formAddResponsavel');
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
    carregarResponsaveisNoSelect('responsavelEntrada');
    carregarResponsaveisNoSelect('responsavelLiberacao');
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

  if (nomeResponsavel) {
    db.collection('responsaveis').add({
      nome: nomeResponsavel
    })
    .then(() => {
      alert('Responsável adicionado com sucesso!');
      carregarDados(); // Atualiza a lista de responsáveis
      fecharModal(document.getElementById('modalAddResponsavel'));
    })
    .catch((error) => {
      console.error('Erro ao adicionar responsável:', error);
    });
  } else {
    alert('Por favor, preencha o nome do responsável.');
  }
}

// Função para excluir responsável
function excluirResponsavel(idResponsavel) {
  if (confirm('Tem certeza que deseja excluir este responsável?')) {
    db.collection('responsaveis').doc(idResponsavel).delete().then(() => {
      alert('Responsável excluído com sucesso!');
      carregarDados(); // Atualiza a lista de responsáveis
    }).catch((error) => {
      console.error('Erro ao excluir responsável:', error);
    });
  }
}

// Função para carregar responsáveis no select
function carregarResponsaveisNoSelect(selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = ''; // Limpa as opções atuais
  responsaveis.forEach(responsavel => {
    const option = document.createElement('option');
    option.value = responsavel.idResponsavel;
    option.textContent = responsavel.nome;
    select.appendChild(option);
  });

  // Exibir lista de responsáveis com botão de excluir
  const content = document.getElementById('content');
  content.innerHTML = '<h3>Lista de Responsáveis</h3>';
  responsaveis.forEach(responsavel => {
    const div = document.createElement('div');
    div.innerHTML = `${responsavel.nome} <button onclick="excluirResponsavel('${responsavel.idResponsavel}')">Excluir</button>`;
    content.appendChild(div);
  });
}

// Função para adicionar produto
function adicionarProduto() {
  const nomeProduto = document.getElementById('nomeProduto').value;
  const dataValidade = document.getElementById('dataValidade').value;
  const numeroLote = document.getElementById('numeroLote').value;
  const responsavelEntrada = document.getElementById('responsavelEntrada').value;
  const quantidadeEntrada = document.getElementById('quantidadeEntrada').value;

  if (nomeProduto && dataValidade && numeroLote && responsavelEntrada && quantidadeEntrada) {
    db.collection('produtos').add({
      nomeProduto,
      dataValidade,
      numeroLote,
      responsavelEntrada,
      quantidadeEntrada: parseInt(quantidadeEntrada)
    })
    .then(() => {
      alert('Produto adicionado com sucesso!');
      carregarDados(); // Atualiza a lista de produtos
    })
    .catch((error) => {
      console.error('Erro ao adicionar produto:', error);
    });
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

// Função para carregar produtos no select
function carregarProdutosNoSelect(selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = ''; // Limpa as opções atuais
  produtos.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.idProduto;
    option.textContent = produto.nomeProduto;
    select.appendChild(option);
  });
}
