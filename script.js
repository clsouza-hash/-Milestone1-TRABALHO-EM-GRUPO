const API_URL = 'http://localhost:3000';

async function verificarServidor() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      document.getElementById('statusServidor').innerHTML = '[ONLINE] Servidor conectado.';
      document.getElementById('statusServidor').classList.add('status-server-online');
    }
  } catch (error) {
    document.getElementById('statusServidor').innerHTML = '[OFFLINE] Servidor indisponivel.';
    document.getElementById('statusServidor').classList.add('status-server-offline');
  }
}

window.addEventListener('load', verificarServidor);

async function listarTodos() {
  try {
    const divResultado = document.getElementById('resultadoListar');
    divResultado.innerHTML = '<p class="loading">Carregando...</p>';
    divResultado.classList.remove('resultado-oculto');

    const response = await fetch(`${API_URL}/produtos`);
    const dados = await response.json();

    let html = `<div class="status-code ok">Status: ${response.status} ${response.statusText}</div>`;
    html += `<p><strong>URL:</strong> GET /produtos</p>`;
    html += `<p><strong>Total:</strong> ${dados.length}</p>`;
    html += `<pre>${JSON.stringify(dados, null, 2)}</pre>`;

    divResultado.innerHTML = html;
    divResultado.classList.add('sucesso');
  } catch (error) {
    exibirErro('resultadoListar', error);
  }
}

async function filtrarPorCategoria() {
  try {
    const categoria = document.getElementById('categoriaFiltro').value;

    if (!categoria) {
      alert('Selecione uma categoria.');
      return;
    }

    const divResultado = document.getElementById('resultadoFiltrar');
    divResultado.innerHTML = '<p class="loading">Filtrando...</p>';
    divResultado.classList.remove('resultado-oculto');

    const url = `${API_URL}/produtos/filtrar?categoria=${encodeURIComponent(categoria)}`;
    const response = await fetch(url);
    const dados = await response.json();

    let html = `<div class="status-code ok">Status: ${response.status} ${response.statusText}</div>`;
    html += `<p><strong>URL:</strong> GET /produtos/filtrar?categoria=${categoria}</p>`;
    html += `<p><strong>req.query:</strong> filtro por categoria</p>`;
    html += `<p><strong>Itens:</strong> ${dados.length}</p>`;
    html += `<pre>${JSON.stringify(dados, null, 2)}</pre>`;

    divResultado.innerHTML = html;
    divResultado.classList.remove('erro');
    divResultado.classList.add('sucesso');
  } catch (error) {
    exibirErro('resultadoFiltrar', error);
  }
}

async function buscarPorId() {
  try {
    const id = document.getElementById('idBusca').value;

    if (!id) {
      alert('Digite um ID.');
      return;
    }

    const divResultado = document.getElementById('resultadoBuscar');
    divResultado.innerHTML = '<p class="loading">Buscando...</p>';
    divResultado.classList.remove('resultado-oculto');

    const response = await fetch(`${API_URL}/produtos/${id}`);
    const dados = await response.json();

    let html = `<div class="status-code ${response.status === 200 ? 'ok' : 'erro'}">Status: ${response.status} ${response.statusText}</div>`;
    html += `<p><strong>URL:</strong> GET /produtos/${id}</p>`;
    html += `<p><strong>req.params:</strong> parametro da rota</p>`;

    if (response.status === 200) {
      html += `<p><strong>Produto:</strong></p>`;
      divResultado.classList.add('sucesso');
    } else {
      divResultado.classList.add('erro');
    }

    html += `<pre>${JSON.stringify(dados, null, 2)}</pre>`;
    divResultado.innerHTML = html;
  } catch (error) {
    exibirErro('resultadoBuscar', error);
  }
}

async function cadastrarProduto() {
  try {
    const nome = document.getElementById('nomeProduto').value;
    const categoria = document.getElementById('categoriaProduto').value;
    const preco = parseFloat(document.getElementById('precoProduto').value);
    const estoque = parseInt(document.getElementById('estoqueProduto').value);

    if (!nome || !categoria || !preco || estoque === undefined) {
      alert('Preencha todos os campos.');
      return;
    }

    const divResultado = document.getElementById('resultadoCadastro');
    divResultado.innerHTML = '<p class="loading">Salvando...</p>';
    divResultado.classList.remove('resultado-oculto');

    const novoProduto = { nome, categoria, preco, estoque };

    const response = await fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto)
    });

    const dados = await response.json();

    let html = `<div class="status-code criado">Status: ${response.status} ${response.statusText}</div>`;
    html += `<p><strong>URL:</strong> POST /produtos</p>`;
    html += `<p><strong>req.body:</strong> payload enviado</p>`;
    html += `<pre>${JSON.stringify(novoProduto, null, 2)}</pre>`;
    html += `<p><strong>Resposta:</strong></p>`;
    html += `<pre>${JSON.stringify(dados, null, 2)}</pre>`;

    divResultado.innerHTML = html;
    divResultado.classList.remove('erro');
    divResultado.classList.add('sucesso');

    document.getElementById('nomeProduto').value = '';
    document.getElementById('categoriaProduto').value = '';
    document.getElementById('precoProduto').value = '';
    document.getElementById('estoqueProduto').value = '';
  } catch (error) {
    exibirErro('resultadoCadastro', error);
  }
}

async function removerProduto() {
  try {
    const id = document.getElementById('idRemover').value;

    if (!id) {
      alert('Digite um ID.');
      return;
    }

    const divResultado = document.getElementById('resultadoRemover');
    divResultado.innerHTML = '<p class="loading">Removendo...</p>';
    divResultado.classList.remove('resultado-oculto');

    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: 'DELETE'
    });

    const dados = await response.json();

    let html = `<div class="status-code ${response.status === 200 ? 'ok' : 'erro'}">Status: ${response.status} ${response.statusText}</div>`;
    html += `<p><strong>URL:</strong> DELETE /produtos/${id}</p>`;

    if (response.status === 200) {
      html += `<p><strong>Resultado:</strong> removido com sucesso</p>`;
      divResultado.classList.add('sucesso');
    } else {
      divResultado.classList.add('erro');
    }

    html += `<pre>${JSON.stringify(dados, null, 2)}</pre>`;
    divResultado.innerHTML = html;

    document.getElementById('idRemover').value = '';
  } catch (error) {
    exibirErro('resultadoRemover', error);
  }
}

function exibirErro(idElemento, error) {
  const divResultado = document.getElementById(idElemento);
  let html = `<div class="status-code erro">Erro na requisicao</div>`;
  html += `<p><strong>Mensagem:</strong> ${error.message}</p>`;
  html += `<p><strong>Causa:</strong></p>`;
  html += `<ul>
    <li>Servidor fora do ar.</li>
    <li>CORS sem configuracao.</li>
    <li>Erro de rede.</li>
  </ul>`;
  html += `<p><strong>Solucao:</strong> verifique o servidor.</p>`;

  divResultado.innerHTML = html;
  divResultado.classList.remove('sucesso');
  divResultado.classList.add('erro');
  divResultado.classList.remove('resultado-oculto');
}
