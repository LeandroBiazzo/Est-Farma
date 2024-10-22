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
