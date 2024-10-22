// Função para abrir modal
function abrirModal(modal) {
  modal.style.display = 'block';
}

// Função para fechar modal
function fecharModal(modal) {
  modal.style.display = 'none';
}

// Event listeners para abrir as modais
document.getElementById('btnAddProduto').addEventListener('click', function() {
  abrirModal(document.getElementById('modalAddProduto'));
});

document.getElementById('btnSaidaProduto').addEventListener('click', function() {
  abrirModal(document.getElementById('modalSaidaProduto'));
});

document.getElementById('btnProdutos').addEventListener('click', function() {
  abrirModal(document.getElementById('modalProdutos'));
});

document.getElementById('btnRelatorios').addEventListener('click', function() {
  abrirModal(document.getElementById('modalRelatorios'));
});

// Event listeners para fechar as modais
document.getElementById('closeAddProduto').addEventListener('click', function() {
  fecharModal(document.getElementById('modalAddProduto'));
});

document.getElementById('closeSaidaProduto').addEventListener('click', function() {
  fecharModal(document.getElementById('modalSaidaProduto'));
});

document.getElementById('closeProdutos').addEventListener('click', function() {
  fecharModal(document.getElementById('modalProdutos'));
});

document.getElementById('closeRelatorios').addEventListener('click', function() {
  fecharModal(document.getElementById('modalRelatorios'));
});

// Fechar a modal ao clicar fora dela
window.addEventListener('click', function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      fecharModal(modal);
    }
  });
});

// Função para exibir produtos
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
      <th>Ações</th>
    </tr>
  `;

  produtos.forEach(produto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${produto.nomeProduto}</td>
      <td>${produto.quantidadeEntrada}</td>
      <td>${produto.numeroLote}</td>
      <td>${produto.dataValidade}</td>
      <td>
        <button class="btnEditar" data-id="${produto.idProduto}">Editar</button>
        <button class="btnExcluir" data-id="${produto.idProduto}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  produtosContent.appendChild(table);

  // Add event listeners for edit and delete buttons
  document.querySelectorAll('.btnExcluir').forEach(button => {
    button.addEventListener('click', function() {
      const idProduto = this.getAttribute('data-id');
      excluirProduto(idProduto);
    });
  });

  document.querySelectorAll('.btnEditar').forEach(button => {
    button.addEventListener('click', function() {
      const idProduto = this.getAttribute('data-id');
      editarProduto(idProduto);
    });
  });
}

// Função para excluir produto
function excluirProduto(idProduto) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    db.collection('produtos').doc(idProduto).delete()
      .then(() => {
        alert('Produto excluído com sucesso!');
        carregarDados(); // Atualiza os dados
      })
      .catch((error) => {
        console.error('Erro ao excluir produto:', error);
      });
  }
}

// Função para editar produto
function editarProduto(idProduto) {
  const produto = produtos.find(p => p.idProduto === idProduto);
  if (produto) {
    // Preenche o formulário com os dados do produto
    document.getElementById('nomeProduto').value = produto.nomeProduto;
    document.getElementById('dataValidade').value = produto.dataValidade;
    document.getElementById('numeroLote').value = produto.numeroLote;
    document.getElementById('quantidadeEntrada').value = produto.quantidadeEntrada;

    // Abre o modal para edição
    abrirModal(document.getElementById('modalAddProduto'));

    // Atualiza o envio do formulário para tratar a edição
    const formAddProduto = document.getElementById('formAddProduto');
    formAddProduto.onsubmit = function(e) {
      e.preventDefault();
      atualizarProduto(idProduto);
      fecharModal(document.getElementById('modalAddProduto'));
    };
  }
}

// Função para atualizar produto
function atualizarProduto(idProduto) {
  const nomeProduto = document.getElementById('nomeProduto').value;
  const dataValidade = document.getElementById('dataValidade').value;
  const numeroLote = document.getElementById('numeroLote').value;
  const quantidadeEntrada = document.getElementById('quantidadeEntrada').value;

  if (nomeProduto && dataValidade && numeroLote && quantidadeEntrada) {
    db.collection('produtos').doc(idProduto).update({
      nomeProduto,
      dataValidade,
      numeroLote,
      quantidadeEntrada: parseInt(quantidadeEntrada)
    })
    .then(() => {
      alert('Produto atualizado com sucesso!');
      carregarDados(); // Atualiza os dados
    })
    .catch((error) => {
      console.error('Erro ao atualizar produto:', error);
    });
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}
