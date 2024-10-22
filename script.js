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

function excluirProduto(idProduto) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    db.collection('produtos').doc(idProduto).delete()
      .then(() => {
        alert('Produto excluído com sucesso!');
        carregarDados(); // Refresh the data
      })
      .catch((error) => {
        console.error('Erro ao excluir produto:', error);
      });
  }
}

function editarProduto(idProduto) {
  const produto = produtos.find(p => p.idProduto === idProduto);
  if (produto) {
    // Pre-fill the form with product data for editing
    document.getElementById('nomeProduto').value = produto.nomeProduto;
    document.getElementById('dataValidade').value = produto.dataValidade;
    document.getElementById('numeroLote').value = produto.numeroLote;
    document.getElementById('quantidadeEntrada').value = produto.quantidadeEntrada;

    // Open the modal for editing
    abrirModal(document.getElementById('modalAddProduto'));

    // Update the form submission to handle editing
    const formAddProduto = document.getElementById('formAddProduto');
    formAddProduto.onsubmit = function(e) {
      e.preventDefault();
      atualizarProduto(idProduto);
      fecharModal(document.getElementById('modalAddProduto'));
    };
  }
}

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
      carregarDados(); // Refresh the data
    })
    .catch((error) => {
      console.error('Erro ao atualizar produto:', error);
    });
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}
