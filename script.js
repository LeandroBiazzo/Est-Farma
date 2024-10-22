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
    carregarResponsaveisNaLista();
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
  db.collection('responsaveis').onSnapshot((querySnapshot) => {
    responsaveis = [];
    querySnapshot.forEach((doc) => {
      let responsavel = doc.data();
      responsavel.idResponsavel = doc.id;
      responsaveis.push(responsavel);
    });
    carregarResponsaveisNoSelect('responsavelEntrada');
    carregarResponsaveisNoSelect('responsavelLiberacao');
    carregarResponsaveisNaLista();
  });

  // Carregar produtos
  db.collection('produtos').onSnapshot((querySnapshot) => {
    produtos = [];
    querySnapshot.forEach((doc) => {
      let produto = doc.data();
      produto.idProduto = doc.id;
      produtos.push(produto);
    });
    carregarProdutosNoSelect('produtoSaida');
    exibirProdutos();
  });
}

// Função para adicionar produto
function adicionarProduto() {
  const nomeProduto = document.getElementById('nomeProduto').value;
  // Removido: const identificacaoNF = document.getElementById('identificacaoNF').value;
  const dataValidade = document.getElementById('dataValidade').value;
  const numeroLote = document.getElementById('numeroLote').value;
  const responsavelEntrada = document.getElementById('responsavelEntrada').value;
  const quantidadeEntrada = parseInt(document.getElementById('quantidadeEntrada').value);

  let produto = {
    nomeProduto: nomeProduto,
    // identificacaoNF: identificacaoNF, // Removido
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
      // Limpar o formulário
      document.getElementById('formAddProduto').reset();
    })
    .catch((error) => {
      console.error('Erro ao adicionar produto: ', error);
    });
}

// Função para adicionar responsável
function adicionarResponsavel() {
  const nomeResponsavel = document.getElementById('nomeResponsavel').value;

  if (nomeResponsavel.trim() === "") {
    alert('O nome do responsável não pode estar vazio.');
    return;
  }

  let responsavel = {
    nomeResponsavel: nomeResponsavel
  };

  // Salvar no Firestore
  db.collection('responsaveis').add(responsavel)
    .then((docRef) => {
      responsavel.idResponsavel = docRef.id;
      responsaveis.push(responsavel);
      alert('Responsável adicionado com sucesso!');
      // Limpar o formulário
      document.getElementById('formAddResponsavel').reset();
      carregarResponsaveisNaLista();
    })
    .catch((error) => {
      console.error('Erro ao adicionar responsável: ', error);
    });
}

// Função para carregar responsáveis nos selects
function carregarResponsaveisNoSelect(idSelect) {
  const select = document.getElementById(idSelect);
  select.innerHTML = ''; // Limpar opções

  responsaveis.forEach(responsavel => {
    const option = document.createElement('option');
    option.value = responsavel.idResponsavel;
    option.textContent = responsavel.nomeResponsavel;
    select.appendChild(option);
  });
}

// Função para carregar responsáveis na lista do modal
function carregarResponsaveisNaLista() {
  const lista = document.getElementById('listaResponsaveis');
  lista.innerHTML = ''; // Limpar a lista

  responsaveis.forEach(responsavel => {
    const li = document.createElement('li');
    li.textContent = responsavel.nomeResponsavel;

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.style.marginLeft = '10px';
    btnExcluir.onclick = function() {
      if (confirm(`Tem certeza que deseja excluir o responsável "${responsavel.nomeResponsavel}"?`)) {
        excluirResponsavel(responsavel.idResponsavel);
      }
    };

    li.appendChild(btnExcluir);
    lista.appendChild(li);
  });
}

// Função para excluir responsável
function excluirResponsavel(idResponsavel) {
  db.collection('responsaveis').doc(idResponsavel).delete()
    .then(() => {
      alert('Responsável excluído com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao excluir responsável: ', error);
    });
}

// Função para carregar produtos nos selects
function carregarProdutosNoSelect(idSelect) {
  const select = document.getElementById(idSelect);
  select.innerHTML = ''; // Limpar opções

  produtos.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.idProduto;
    option.textContent = produto.nomeProduto;
    select.appendChild(option);
  });
}

// Função para exibir produtos com botões de editar e excluir
function exibirProdutos() {
  const produtosContent = document.getElementById('produtosContent');
  produtosContent.innerHTML = ''; // Limpar conteúdo

  if (produtos.length === 0) {
    produtosContent.textContent = 'Nenhum produto encontrado.';
    return;
  }

  const table = document.createElement('table');
  table.border = '1';
  table.cellPadding = '10';

  // Cabeçalho da tabela
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Nome', 'Validade', 'Número do Lote', 'Quantidade', 'Responsável', 'Ações'];
  
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Corpo da tabela
  const tbody = document.createElement('tbody');

  produtos.forEach(produto => {
    const tr = document.createElement('tr');

    const tdNome = document.createElement('td');
    tdNome.textContent = produto.nomeProduto;
    tr.appendChild(tdNome);

    const tdValidade = document.createElement('td');
    tdValidade.textContent = produto.dataValidade;
    tr.appendChild(tdValidade);

    const tdLote = document.createElement('td');
    tdLote.textContent = produto.numeroLote;
    tr.appendChild(tdLote);

    const tdQuantidade = document.createElement('td');
    tdQuantidade.textContent = produto.quantidade;
    tr.appendChild(tdQuantidade);

    const tdResponsavel = document.createElement('td');
    const responsavel = responsaveis.find(r => r.idResponsavel === produto.responsavelEntrada);
    tdResponsavel.textContent = responsavel ? responsavel.nomeResponsavel : 'N/A';
    tr.appendChild(tdResponsavel);

    // Ações: Editar e Excluir
    const tdAcoes = document.createElement('td');

    // Botão Editar
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = function() {
      abrirModalEditarProduto(produto);
    };
    tdAcoes.appendChild(btnEditar);

    // Botão Excluir
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.style.marginLeft = '10px';
    btnExcluir.onclick = function() {
      if (confirm(`Tem certeza que deseja excluir o produto "${produto.nomeProduto}"?`)) {
        excluirProduto(produto.idProduto);
      }
    };
    tdAcoes.appendChild(btnExcluir);

    tr.appendChild(tdAcoes);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  produtosContent.appendChild(table);
}

// Função para excluir produto
function excluirProduto(idProduto) {
  db.collection('produtos').doc(idProduto).delete()
    .then(() => {
      alert('Produto excluído com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao excluir produto: ', error);
    });
}

// Função para abrir modal de edição de produto
function abrirModalEditarProduto(produto) {
  // Criar um modal dinâmico ou reutilizar um existente
  // Aqui, vamos criar um modal simples para edição

  // Verificar se o modal de edição já existe
  let modalEditar = document.getElementById('modalEditarProduto');
  if (!modalEditar) {
    modalEditar = document.createElement('div');
    modalEditar.id = 'modalEditarProduto';
    modalEditar.className = 'modal';
    modalEditar.innerHTML = `
      <div class="modal-content">
        <span class="close" id="closeEditarProduto">&times;</span>
        <h2>Editar Produto</h2>
        <form id="formEditarProduto">
          <input type="hidden" id="idEditarProduto">
          <label for="nomeEditarProduto">Nome do Produto:</label>
          <input type="text" id="nomeEditarProduto" name="nomeEditarProduto" required>

          <!-- Removido o campo Identificação da Nota Fiscal -->

          <label for="dataEditarValidade">Data de Validade:</label>
          <input type="date" id="dataEditarValidade" name="dataEditarValidade" required>

          <label for="numeroEditarLote">Número do Lote:</label>
          <input type="text" id="numeroEditarLote" name="numeroEditarLote" required>

          <div class="responsavel-field">
            <label for="responsavelEditarEntrada">Responsável:</label>
            <div class="responsavel-input">
              <select id="responsavelEditarEntrada" name="responsavelEditarEntrada" required>
                <!-- Opções serão carregadas dinamicamente -->
              </select>
              <button type="button" id="btnAddResponsavelEditar">Adicionar Responsável</button>
            </div>
          </div>

          <label for="quantidadeEditarEntrada">Quantidade:</label>
          <input type="number" id="quantidadeEditarEntrada" name="quantidadeEditarEntrada" required>

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    `;
    document.body.appendChild(modalEditar);

    // Eventos de fechamento do modal de editar
    const closeEditarProduto = document.getElementById('closeEditarProduto');
    closeEditarProduto.onclick = function() {
      fecharModal(modalEditar);
    };

    // Evento para submissão do formulário de editar produto
    const formEditarProduto = document.getElementById('formEditarProduto');
    formEditarProduto.onsubmit = function(e) {
      e.preventDefault();
      salvarEdicaoProduto();
      fecharModal(modalEditar);
    };

    // Botão para adicionar responsável dentro do modal de editar
    const btnAddResponsavelEditar = document.getElementById('btnAddResponsavelEditar');
    btnAddResponsavelEditar.onclick = function() {
      abrirModal(modalAddResponsavel);
    };
  }

  // Preencher os campos com os dados do produto
  document.getElementById('idEditarProduto').value = produto.idProduto;
  document.getElementById('nomeEditarProduto').value = produto.nomeProduto;
  document.getElementById('dataEditarValidade').value = produto.dataValidade;
  document.getElementById('numeroEditarLote').value = produto.numeroLote;
  document.getElementById('quantidadeEditarEntrada').value = produto.quantidade;
  carregarResponsaveisNoSelect('responsavelEditarEntrada');
  document.getElementById('responsavelEditarEntrada').value = produto.responsavelEntrada;

  // Abrir o modal de editar
  const modalEditar = document.getElementById('modalEditarProduto');
  abrirModal(modalEditar);
}

// Função para salvar a edição do produto
function salvarEdicaoProduto() {
  const idProduto = document.getElementById('idEditarProduto').value;
  const nomeProduto = document.getElementById('nomeEditarProduto').value;
  const dataValidade = document.getElementById('dataEditarValidade').value;
  const numeroLote = document.getElementById('numeroEditarLote').value;
  const responsavelEntrada = document.getElementById('responsavelEditarEntrada').value;
  const quantidadeEntrada = parseInt(document.getElementById('quantidadeEditarEntrada').value);

  let produtoAtualizado = {
    nomeProduto: nomeProduto,
    dataValidade: dataValidade,
    numeroLote: numeroLote,
    quantidade: quantidadeEntrada,
    responsavelEntrada: responsavelEntrada
  };

  // Atualizar no Firestore
  db.collection('produtos').doc(idProduto).update(produtoAtualizado)
    .then(() => {
      alert('Produto atualizado com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao atualizar produto: ', error);
    });
}

// Função para registrar saída de produto
function registrarSaida() {
  const produtoId = document.getElementById('produtoSaida').value;
  const numeroLote = document.getElementById('numeroLoteSaida').value;
  const quantidadeSaida = parseInt(document.getElementById('quantidadeSaida').value);
  const localDestino = document.getElementById('localDestino').value;
  const responsavelLiberacao = document.getElementById('responsavelLiberacao').value;

  if (quantidadeSaida <= 0) {
    alert('A quantidade de saída deve ser maior que zero.');
    return;
  }

  // Buscar o produto especificado
  db.collection('produtos').doc(produtoId).get()
    .then((doc) => {
      if (doc.exists) {
        let produto = doc.data();
        if (produto.quantidade >= quantidadeSaida) {
          // Atualizar a quantidade no estoque
          db.collection('produtos').doc(produtoId).update({
            quantidade: produto.quantidade - quantidadeSaida
          })
          .then(() => {
            // Registrar a saída
            let saida = {
              produtoId: produtoId,
              nomeProduto: produto.nomeProduto,
              numeroLote: numeroLote,
              quantidade: quantidadeSaida,
              localDestino: localDestino,
              responsavelLiberacao: responsavelLiberacao,
              dataSaida: new Date().toISOString()
            };
            db.collection('saidas').add(saida)
              .then(() => {
                alert('Saída registrada com sucesso!');
                document.getElementById('formSaidaProduto').reset();
              })
              .catch((error) => {
                console.error('Erro ao registrar saída: ', error);
              });
          })
          .catch((error) => {
            console.error('Erro ao atualizar quantidade do produto: ', error);
          });
        } else {
          alert('Quantidade em estoque insuficiente.');
        }
      } else {
        alert('Produto não encontrado.');
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar produto: ', error);
    });
}

// Função para gerar relatórios (a ser implementada)
function gerarRelatorios() {
  // Implementar conforme necessidade
  document.getElementById('relatoriosContent').textContent = 'Funcionalidade de relatórios ainda não implementada.';
}

// Fechar modais ao clicar fora deles
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}
