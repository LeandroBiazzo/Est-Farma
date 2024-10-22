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
  console.log("DOM completamente carregado e analisado");
  
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

  // Verificação de elementos
  if (!btnAddProduto || !btnSaidaProduto || !btnProdutos || !btnRelatorios) {
    console.error("Um ou mais botões do menu não foram encontrados.");
    return;
  }

  if (!modalAddProduto || !modalAddResponsavel || !modalSaidaProduto || !modalProdutos || !modalRelatorios) {
    console.error("Um ou mais modais não foram encontrados.");
    return;
  }

  // Eventos de abertura dos modais
  btnAddProduto.onclick = function() {
    console.log("Clique em Adicionar Produto");
    abrirModal(modalAddProduto);
    carregarResponsaveisNoSelect('responsavelEntrada');
  };

  btnAddResponsavel.onclick = function() {
    console.log("Clique em Adicionar Responsável");
    abrirModal(modalAddResponsavel);
    carregarResponsaveisNaLista();
  };

  btnSaidaProduto.onclick = function() {
    console.log("Clique em Registrar Saída");
    abrirModal(modalSaidaProduto);
    carregarResponsaveisNoSelect('responsavelLiberacao');
    carregarProdutosNoSelect('produtoSaida');
  };

  btnProdutos.onclick = function() {
    console.log("Clique em Produtos");
    abrirModal(modalProdutos);
    exibirProdutos();
  };

  btnRelatorios.onclick = function() {
    console.log("Clique em Relatórios");
    abrirModal(modalRelatorios);
    gerarRelatorios();
  };

  // Eventos de fechamento dos modais
  closeAddProduto.onclick = function() {
    console.log("Fechar Modal Adicionar Produto");
    fecharModal(modalAddProduto);
  };

  closeAddResponsavel.onclick = function() {
    console.log("Fechar Modal Adicionar Responsável");
    fecharModal(modalAddResponsavel);
  };

  closeSaidaProduto.onclick = function() {
    console.log("Fechar Modal Registrar Saída");
    fecharModal(modalSaidaProduto);
  };

  closeProdutos.onclick = function() {
    console.log("Fechar Modal Produtos");
    fecharModal(modalProdutos);
  };

  closeRelatorios.onclick = function() {
    console.log("Fechar Modal Relatórios");
    fecharModal(modalRelatorios);
  };

  // Evento para submissão do formulário de adicionar produto
  if (formAddProduto) {
    formAddProduto.onsubmit = function(e) {
      e.preventDefault();
      console.log("Submissão do Formulário Adicionar Produto");
      adicionarProduto();
      fecharModal(modalAddProduto);
    };
  } else {
    console.error("Formulário de Adicionar Produto não encontrado.");
  }

  // Evento para submissão do formulário de adicionar responsável
  if (formAddResponsavel) {
    formAddResponsavel.onsubmit = function(e) {
      e.preventDefault();
      console.log("Submissão do Formulário Adicionar Responsável");
      adicionarResponsavel();
    };
  } else {
    console.error("Formulário de Adicionar Responsável não encontrado.");
  }

  // Evento para submissão do formulário de registrar saída
  if (formSaidaProduto) {
    formSaidaProduto.onsubmit = function(e) {
      e.preventDefault();
      console.log("Submissão do Formulário Registrar Saída");
      registrarSaida();
      fecharModal(modalSaidaProduto);
    };
  } else {
    console.error("Formulário de Registrar Saída não encontrado.");
  }
});

// Funções para abrir e fechar modais
function abrirModal(modal) {
  if (!modal) {
    console.error("Modal não encontrado para abrir.");
    return;
  }
  modal.style.display = "block";
}

function fecharModal(modal) {
  if (!modal) {
    console.error("Modal não encontrado para fechar.");
    return;
  }
  modal.style.display = "none";
}

// Função para carregar dados iniciais
function carregarDados() {
  console.log("Carregando dados iniciais do Firestore");
  
  // Carregar responsáveis
  db.collection('responsaveis').onSnapshot((querySnapshot) => {
    responsaveis = [];
    querySnapshot.forEach((doc) => {
      let responsavel = doc.data();
      responsavel.idResponsavel = doc.id;
      responsaveis.push(responsavel);
    });
    console.log("Responsáveis carregados:", responsaveis);
    carregarResponsaveisNoSelect('responsavelEntrada');
    carregarResponsaveisNoSelect('responsavelLiberacao');
    carregarResponsaveisNaLista();
  }, (error) => {
    console.error("Erro ao carregar responsáveis:", error);
  });

  // Carregar produtos
  db.collection('produtos').onSnapshot((querySnapshot) => {
    produtos = [];
    querySnapshot.forEach((doc) => {
      let produto = doc.data();
      produto.idProduto = doc.id;
      produtos.push(produto);
    });
    console.log("Produtos carregados:", produtos);
    carregarProdutosNoSelect('produtoSaida');
    exibirProdutos();
  }, (error) => {
    console.error("Erro ao carregar produtos:", error);
  });
}

// Função para adicionar produto
function adicionarProduto() {
  const nomeProduto = document.getElementById('nomeProduto').value.trim();
  const dataValidade = document.getElementById('dataValidade').value;
  const numeroLote = document.getElementById('numeroLote').value.trim();
  const responsavelEntrada = document.getElementById('responsavelEntrada').value;
  const quantidadeEntrada = parseInt(document.getElementById('quantidadeEntrada').value);

  if (!nomeProduto || !numeroLote) {
    alert('Nome do produto e Número do Lote não podem estar vazios.');
    return;
  }

  if (isNaN(quantidadeEntrada) || quantidadeEntrada <= 0) {
    alert('A quantidade deve ser um número positivo.');
    return;
  }

  let produto = {
    nomeProduto: nomeProduto,
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
      console.log('Produto adicionado com ID:', docRef.id);
      alert('Produto adicionado com sucesso!');
      // Limpar o formulário
      document.getElementById('formAddProduto').reset();
      // Atualizar a lista de produtos
      carregarProdutosNoSelect('produtoSaida');
      exibirProdutos();
    })
    .catch((error) => {
      console.error('Erro ao adicionar produto:', error);
      alert('Erro ao adicionar produto. Verifique o console para mais detalhes.');
    });
}

// Função para adicionar responsável
function adicionarResponsavel() {
  const nomeResponsavel = document.getElementById('nomeResponsavel').value.trim();

  if (nomeResponsavel === "") {
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
      console.log('Responsável adicionado com ID:', docRef.id);
      alert('Responsável adicionado com sucesso!');
      // Limpar o formulário
      document.getElementById('formAddResponsavel').reset();
      carregarResponsaveisNaLista();
      carregarResponsaveisNoSelect('responsavelEntrada');
      carregarResponsaveisNoSelect('responsavelLiberacao');
    })
    .catch((error) => {
      console.error('Erro ao adicionar responsável:', error);
      alert('Erro ao adicionar responsável. Verifique o console para mais detalhes.');
    });
}

// Função para carregar responsáveis nos selects
function carregarResponsaveisNoSelect(idSelect) {
  const select = document.getElementById(idSelect);
  if (!select) {
    console.error(`Elemento com ID "${idSelect}" não encontrado para carregar responsáveis.`);
    return;
  }
  select.innerHTML = ''; // Limpar opções

  responsaveis.forEach(responsavel => {
    const option = document.createElement('option');
    option.value = responsavel.idResponsavel;
    option.textContent = responsavel.nomeResponsavel;
    select.appendChild(option);
  });

  // Adicionar uma opção padrão caso não haja responsáveis
  if (responsaveis.length === 0) {
    const option = document.createElement('option');
    option.value = "";
    option.textContent = "Nenhum responsável disponível";
    select.appendChild(option);
  }
}

// Função para carregar responsáveis na lista do modal
function carregarResponsaveisNaLista() {
  const lista = document.getElementById('listaResponsaveis');
  if (!lista) {
    console.error('Elemento com ID "listaResponsaveis" não encontrado.');
    return;
  }
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

  // Caso não haja responsáveis
  if (responsaveis.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nenhum responsável cadastrado.';
    lista.appendChild(li);
  }
}

// Função para excluir responsável
function excluirResponsavel(idResponsavel) {
  db.collection('responsaveis').doc(idResponsavel).delete()
    .then(() => {
      console.log('Responsável excluído com ID:', idResponsavel);
      alert('Responsável excluído com sucesso!');
      // Atualizar responsáveis em memória
      responsaveis = responsaveis.filter(r => r.idResponsavel !== idResponsavel);
      carregarResponsaveisNaLista();
      carregarResponsaveisNoSelect('responsavelEntrada');
      carregarResponsaveisNoSelect('responsavelLiberacao');
    })
    .catch((error) => {
      console.error('Erro ao excluir responsável:', error);
      alert('Erro ao excluir responsável. Verifique o console para mais detalhes.');
    });
}

// Função para carregar produtos nos selects
function carregarProdutosNoSelect(idSelect) {
  const select = document.getElementById(idSelect);
  if (!select) {
    console.error(`Elemento com ID "${idSelect}" não encontrado para carregar produtos.`);
    return;
  }
  select.innerHTML = ''; // Limpar opções

  produtos.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.idProduto;
    option.textContent = produto.nomeProduto;
    select.appendChild(option);
  });

  // Adicionar uma opção padrão caso não haja produtos
  if (produtos.length === 0) {
    const option = document.createElement('option');
    option.value = "";
    option.textContent = "Nenhum produto disponível";
    select.appendChild(option);
  }
}

// Função para exibir produtos com botões de editar e excluir
function exibirProdutos() {
  const produtosContent = document.getElementById('produtosContent');
  if (!produtosContent) {
    console.error('Elemento com ID "produtosContent" não encontrado.');
    return;
  }
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
      console.log('Produto excluído com ID:', idProduto);
      alert('Produto excluído com sucesso!');
      // Atualizar produtos em memória
      produtos = produtos.filter(p => p.idProduto !== idProduto);
      exibirProdutos();
      carregarProdutosNoSelect('produtoSaida');
    })
    .catch((error) => {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Verifique o console para mais detalhes.');
    });
}

// Função para abrir modal de edição de produto
function abrirModalEditarProduto(produto) {
  console.log("Abrindo Modal de Edição para Produto ID:", produto.idProduto);
  
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
    if (closeEditarProduto) {
      closeEditarProduto.onclick = function() {
        fecharModal(modalEditar);
      };
    } else {
      console.error('Botão de fechar do modalEditarProduto não encontrado.');
    }

    // Evento para submissão do formulário de editar produto
    const formEditarProduto = document.getElementById('formEditarProduto');
    if (formEditarProduto) {
      formEditarProduto.onsubmit = function(e) {
        e.preventDefault();
        salvarEdicaoProduto();
        fecharModal(modalEditar);
      };
    } else {
      console.error('Formulário de editar produto não encontrado no modalEditarProduto.');
    }

    // Botão para adicionar responsável dentro do modal de editar
    const btnAddResponsavelEditar = document.getElementById('btnAddResponsavelEditar');
    if (btnAddResponsavelEditar) {
      btnAddResponsavelEditar.onclick = function() {
        abrirModal(modalAddResponsavel);
        carregarResponsaveisNaLista();
      };
    } else {
      console.error('Botão "Adicionar Responsável" no modalEditarProduto não encontrado.');
    }
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
  const nomeProduto = document.getElementById('nomeEditarProduto').value.trim();
  const dataValidade = document.getElementById('dataEditarValidade').value;
  const numeroLote = document.getElementById('numeroEditarLote').value.trim();
  const responsavelEntrada = document.getElementById('responsavelEditarEntrada').value;
  const quantidadeEntrada = parseInt(document.getElementById('quantidadeEditarEntrada').value);

  if (!idProduto) {
    alert('ID do produto não encontrado.');
    return;
  }

  if (nomeProduto === "" || numeroLote === "") {
    alert('Nome do produto e Número do Lote não podem estar vazios.');
    return;
  }

  if (isNaN(quantidadeEntrada) || quantidadeEntrada <= 0) {
    alert('A quantidade deve ser um número positivo.');
    return;
  }

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
      console.log('Produto atualizado com sucesso:', idProduto);
      alert('Produto atualizado com sucesso!');
      // Atualizar produtos em memória e exibição
      const index = produtos.findIndex(p => p.idProduto === idProduto);
      if (index !== -1) {
        produtos[index] = { ...produtos[index], ...produtoAtualizado };
        exibirProdutos();
        carregarProdutosNoSelect('produtoSaida');
      }
    })
    .catch((error) => {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Verifique o console para mais detalhes.');
    });
}

// Função para registrar saída de produto
function registrarSaida() {
  const produtoId = document.getElementById('produtoSaida').value;
  const numeroLote = document.getElementById('numeroLoteSaida').value.trim();
  const quantidadeSaida = parseInt(document.getElementById('quantidadeSaida').value);
  const localDestino = document.getElementById('localDestino').value;
  const responsavelLiberacao = document.getElementById('responsavelLiberacao').value;

  if (!produtoId) {
    alert('Selecione um produto válido.');
    return;
  }

  if (numeroLote === "") {
    alert('Número do Lote não pode estar vazio.');
    return;
  }

  if (isNaN(quantidadeSaida) || quantidadeSaida <= 0) {
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
                console.log('Saída registrada com sucesso:', saida);
                alert('Saída registrada com sucesso!');
                document.getElementById('formSaidaProduto').reset();
                carregarDados(); // Atualizar dados após registrar saída
              })
              .catch((error) => {
                console.error('Erro ao registrar saída:', error);
                alert('Erro ao registrar saída. Verifique o console para mais detalhes.');
              });
          })
          .catch((error) => {
            console.error('Erro ao atualizar quantidade do produto:', error);
            alert('Erro ao atualizar quantidade do produto. Verifique o console para mais detalhes.');
          });
        } else {
          alert('Quantidade em estoque insuficiente.');
        }
      } else {
        alert('Produto não encontrado.');
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar produto:', error);
      alert('Erro ao buscar produto. Verifique o console para mais detalhes.');
    });
}

// Função para gerar relatórios (a ser implementada)
function gerarRelatorios() {
  // Implementar conforme necessidade
  const relatoriosContent = document.getElementById('relatoriosContent');
  if (relatoriosContent) {
    relatoriosContent.textContent = 'Funcionalidade de relatórios ainda não implementada.';
  } else {
    console.error('Elemento com ID "relatoriosContent" não encontrado.');
  }
}

// Fechar modais ao clicar fora deles
window.onclick = function(event) {
  const modais = document.querySelectorAll('.modal');
  modais.forEach(modal => {
    if (event.target == modal) {
      fecharModal(modal);
    }
  });
}
