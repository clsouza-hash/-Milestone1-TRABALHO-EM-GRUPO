// API de produtos com Express e CORS.
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Dados em memória
let produtos = [
  {
    id: 1,
    nome: 'Notebook Dell',
    categoria: 'Eletrônicos',
    preco: 3500.00,
    estoque: 5
  },
  {
    id: 2,
    nome: 'Mouse Logitech',
    categoria: 'Eletrônicos',
    preco: 120.00,
    estoque: 20
  },
  {
    id: 3,
    nome: 'Cadeira Gamer',
    categoria: 'Móveis',
    preco: 800.00,
    estoque: 3
  },
  {
    id: 4,
    nome: 'Monitor LG 24"',
    categoria: 'Eletrônicos',
    preco: 1200.00,
    estoque: 8
  },
  {
    id: 5,
    nome: 'Teclado Mecânico',
    categoria: 'Eletrônicos',
    preco: 450.00,
    estoque: 12
  }
];

let proximoId = 6;

// Rotas
app.get('/produtos', (req, res) => {
  res.status(200).json(produtos);
});

app.get('/produtos/filtrar', (req, res) => {
  const categoria = req.query.categoria;

  if (!categoria) {
    return res.status(200).json(produtos);
  }

  const normalizarCategoria = valor => valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const produtosFiltrados = produtos.filter(
    produto => normalizarCategoria(produto.categoria) === normalizarCategoria(categoria)
  );

  res.status(200).json(produtosFiltrados);
});

app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado', id });
  }

  res.status(200).json(produto);
});

app.post('/produtos', (req, res) => {
  const { nome, categoria, preco, estoque } = req.body;

  if (!nome || !categoria || !preco || estoque === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
  }

  const novoProduto = { id: proximoId, nome, categoria, preco, estoque };
  produtos.push(novoProduto);
  proximoId++;

  res.status(201).json(novoProduto);
});

app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = produtos.findIndex(p => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado', id });
  }

  const produtoRemovido = produtos.splice(indice, 1);

  res.status(200).json({ mensagem: 'Produto removido.', produto: produtoRemovido[0] });
});

app.get('/health', (req, res) => {
  res.status(200).json({ mensagem: 'Servidor funcionando.' });
});

const PORTA = 3000;

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
  console.log(`API: http://localhost:${PORTA}/produtos`);
});
