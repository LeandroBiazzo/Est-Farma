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

// Carregar dados iniciais
function carregarDados() {
  // Carregar produtos
  db.collection('produtos').get().then((querySnapshot) => {
    produtos = [];
    querySnapshot.forEach((doc) => {
      let produto = doc.data();
      produto.idProduto = doc.id;
      produtos.push(produto);
    });
  });

  // Carregar responsáveis
  db.collection('responsaveis').get().then((querySnapshot) => {
    responsaveis = [];
    querySnapshot.forEach((doc) => {
      let responsavel = doc.data();
      responsavel.idResponsavel = doc.id;
      responsaveis.push(responsavel);
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
    carregarProdutosNoInput('produtoSaida');
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

  let produto = {
    nomeProduto: nomeProduto,
    identificacaoNF: identificacaoNF,
    dataValidade: dataValidade,
    numeroLote: numeroLote,
    quantidade: quantidadeEntrada,
    responsavelEntrada: responsavelEntrada
  };

  // Salvar no Firestore
  db.collection('produtos').add(produto)
    .then((docRef) => {
      produto.idProduto = docRef.id;
      produtos.push(produto);
      alert('Produto adicionado com sucesso!');
      salvarEntrada(produto.idProduto, quantidadeEntrada, responsavelEntrada, identificacaoNF, numeroLote, dataValidade);
    })
    .catch((error) => {
      console.error('Erro ao adicionar produto: ', error);
    }); 
}

// Função para salvar entrada
function salvarEntrada(idProduto, quantidadeEntrada, responsavelEntrada, identificacaoNF, numeroLote, dataValidade) {
  let entrada = {
    idProduto: idProduto,
    dataEntrada: new Date().toLocaleString(),
    quantidadeEntrada: quantidadeEntrada,
    responsavelEntrada: responsavelEntrada,
    identificacaoNF: identificacaoNF,
    numeroLote: numeroLote,
    dataValidade: dataValidade
  };

  db.collection('entradas').add(entrada)
    .then((docRef) => {
      entrada.idEntrada = docRef.id;
      entradas.push(entrada);
    })
    .catch((error) => {
      console.error('Erro ao registrar entrada: ', error);
    });
}

// Função para registrar saída
function registrarSaida() {
  const nomeProduto = document.getElementById('produtoSaida').value;
  const numeroLote = document.getElementById('numeroLoteSaida').value;
  const quantidadeSaida = parseInt(document.getElementById('quantidadeSaida').value);
  const localDestino = document.getElementById('localDestino').value;
  const responsavelLiberacao = document.getElementById('responsavelLiberacao').value;

  // Encontrar produto no array local
  let produto = produtos.find(p => p.nomeProduto === nomeProduto && p.numeroLote === numeroLote);

  if (!produto) {
    alert('Produto não encontrado!');
    return;
  }

  if (quantidadeSaida > produto.quantidade) {
    alert('Quantidade indisponível em estoque!');
    return;
  }

  // Atualizar quantidade no Firestore
  db.collection('produtos').doc(produto.idProduto).update({
    quantidade: produto.quantidade - quantidadeSaida
  })
  .then(() => {
    produto.quantidade -= quantidadeSaida;

    // Registrar saída
    let saida = {
      idProduto: produto.idProduto,
      dataSaida: new Date().toLocaleString(),
      quantidadeSaida: quantidadeSaida,
      numeroLote: numeroLote,
      localDestino: localDestino,
      responsavelLiberacao: responsavelLiberacao
    };

    db.collection('saidas').add(saida)
      .then((docRef) => {
        saida.idSaida = docRef.id;
        saidas.push(saida);
        alert('Saída registrada com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao registrar saída: ', error);
      });
  })
  .catch((error) => {
    console.error('Erro ao atualizar produto: ', error);
  });
}

// Função para gerar relatórios
function gerarRelatorios() {
  const relatoriosContent = document.getElementById('relatoriosContent');
  relatoriosContent.innerHTML = '';

  // Exemplo de relatório de produtos em estoque
  db.collection('produtos').get().then((querySnapshot) => {
    const titulo = document.createElement('h3');
    titulo.textContent = 'Produtos em Estoque';
    relatoriosContent.appendChild(titulo);

    const tabela = document.createElement('table');
    const cabecalho = document.createElement('tr');
    cabecalho.innerHTML = '<th>Nome do Produto</th><th>Número do Lote</th><th>Quantidade</th><th>Data de Validade</th>';
    tabela.appendChild(cabecalho);

    querySnapshot.forEach((doc) => {
      let produto = doc.data();
      const linha = document.createElement('tr');
      linha.innerHTML = `<td>${produto.nomeProduto}</td><td>${produto.numeroLote}</td><td>${produto.quantidade}</td><td>${produto.dataValidade}</td>`;
      tabela.appendChild(linha);
    });

    relatoriosContent.appendChild(tabela);
  });
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

// Função para carregar produtos no input de saída
function carregarProdutosNoInput(inputId) {
  const input = document.getElementById(inputId);
  input.innerHTML = '';
  produtos.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.nomeProduto;
    option.text = produto.nomeProduto;
    input.appendChild(option);
  });
}
