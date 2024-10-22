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

document.getElementById('closeAddResponsavel').addEventListener('click', function() {
  fecharModal(document.getElementById('modalAddResponsavel'));
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

// Função para carregar responsáveis no select
function carregarResponsaveis() {
  const selectResponsavel = document.getElementById('responsavelEntrada');
  selectResponsavel.innerHTML = ''; // Limpa as opções existentes

  db.collection('responsaveis').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.data().nomeResponsavel;
      selectResponsavel.appendChild(option);
    });
  });
}

// Função para adicionar responsável
document.getElementById('btnAddResponsavel').addEventListener('click', function() {
  abrirModal(document.getElementById('modalAddResponsavel'));
});

// Função para excluir responsável
document.getElementById('btnExcluirResponsavel').addEventListener('click', function() {
  const selectResponsavel = document.getElementById('responsavelEntrada');
  const idResponsavel = selectResponsavel.value;

  if (idResponsavel && confirm('Tem certeza que deseja excluir este responsável?')) {
    db.collection('responsaveis').doc(idResponsavel).delete()
      .then(() => {
        alert('Responsável excluído com sucesso!');
        carregarResponsaveis(); // Atualiza a lista de responsáveis
      })
      .catch((error) => {
        console.error('Erro ao excluir responsável:', error);
      });
  }
});

// Função para adicionar um novo responsável
document.getElementById('formAddResponsavel').addEventListener('submit', function(e) {
  e.preventDefault();
  const nomeResponsavel = document.getElementById('nomeResponsavel').value;

  if (nomeResponsavel) {
    db.collection('responsaveis').add({
      nomeResponsavel: nomeResponsavel
    })
    .then(() => {
      alert('Responsável adicionado com sucesso!');
      fecharModal(document.getElementById('modalAddResponsavel'));
      carregarResponsaveis(); // Atualiza a lista de responsáveis
    })
    .catch((error) => {
      console.error('Erro ao adicionar responsável:', error);
    });
  } else {
    alert('Por favor, preencha o nome do responsável.');
  }
});

// Carregar responsáveis ao abrir o modal de adicionar produto
document.getElementById('btnAddProduto').addEventListener('click', carregarResponsaveis);
