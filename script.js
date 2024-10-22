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

  const btnAddProduto = document.getElementById('btnAddProduto');
  const btnSaidaProduto = document.getElementById('btnSaidaProduto');
  const btnProdutos = document.getElementById('btnProdutos');
  const btnRelatorios = document.getElementById('btnRelatorios');

  const modalAddProduto = document.getElementById('modalAddProduto');
  const modalAddResponsavel = document.getElementById('modalAddResponsavel');
  const modalSaidaProduto = document.getElementById('modalSaidaProduto');
  const modalProdutos = document.getElementById('modalProdutos');
  const modalRelatorios = document.getElementById('modalRelatorios');

  const btnAddResponsavel = document.getElementById('btnAddResponsavel');

  const closeAddProduto = document.getElementById('closeAddProduto');
  const closeAddResponsavel = document.getElementById('closeAddResponsavel');
  const closeSaidaProduto = document.getElementById('closeSaidaProduto');
  const closeProdutos = document.getElementById('closeProdutos');
  const closeRelatorios = document.getElementById('closeRelatorios');

  const formAddProduto = document.getElementById('formAddProduto');
  const formAddResponsavel = document.getElementById('formAddResponsavel');
  const formSaidaProduto = document.getElementById('formSaidaProduto');

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

  formAddProduto.onsubmit = function(e) {
    e.preventDefault();
    adicionarProduto();
    fecharModal(modalAddProduto);
  };

  formAddResponsavel.onsubmit = function(e) {
    e.preventDefault();
    adicionarResponsavel();
  };

  formSaidaProduto.onsubmit = function(e) {
    e.preventDefault();
    registrarSaida();
    fecharModal(modalSaidaProduto);
  };
});

function abrirModal(modal) {
  modal.style.display = "block";
}

function fecharModal(modal) {
  modal.style.display = "none";
}

function carregarDados() {
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

  db.collection('produtos').get().then((querySnapshot) => {
    produtos = [];
    querySnapshot.forEach((doc) => {
      let produto = doc.data();
      produto.idProduto = doc.id;
      produtos.push(produto);
    });
  });
}

function adicionarResponsavel() {
  const nomeResponsavel = document.getElementById('nomeResponsavel').value;

  if (nomeResponsavel) {
    db.collection('responsaveis').add({
      nome: nomeResponsavel
    })
    .then(() => {
      alert('Responsável adicionado com sucesso!');
      carregarDados();
      fecharModal(document.getElementById('modalAddResponsavel'));
    })
    .catch((error) => {
      console.error('Erro ao adicionar responsável:', error);
    });
  } else {
    alert('Por favor, preencha o nome do responsável.');
  }
}

function carregarResponsaveisNoSelect(selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = '';
  responsaveis.forEach(responsavel => {
    const option = document.createElement('option');
    option.value = responsavel.idResponsavel;
    option.textContent = responsavel.nome;
    select.appendChild(option);
  });
}

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
      carregarDados();
    })
    .catch((error) => {
      console.error('Erro ao adicionar produto:', error);
    });
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

function exibirProdutos() {
  const produtosContent = document.getElementById('produtosContent');
  produtosContent.innerHTML = '';

  produtos.sort((a, b) => a.nomeProduto.localeCompare(b.nomeProduto));

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  thead.innerHTML = `
    <tr>
      <th>Nome do Produto</th>
      <th>Quantidade</th>
      <th>Lote</th>
      <th>Data de Validade</th>
    </tr>
  `;

  produtos.forEach(produto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${produto.nomeProduto}</td>
      <td>${produto.quantidadeEntrada}</td>
      <td>${produto.numeroLote}</td>
      <td>${produto.dataValidade}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  produtosContent.appendChild(table);
}
