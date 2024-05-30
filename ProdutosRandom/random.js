const produtos = [
  { nome: "Caneta", qtde: 10, valor: 7.99 },
  { nome: "Impressora", qtde: 0, valor: 649.5 },
  { nome: "Caderno", qtde: 4, valor: 27.1 },
  { nome: "Lapis", qtde: 3, valor: 5.82 },
  { nome: "Tesoura", qtde: 1, valor: 19.2 },
  { nome: "Borracha", qtde: 2, valor: 3.5 },
];

const tresProdtosAleatorios = (produtos) => {
  return produtos.sort(() => Math.random() - 0.5).slice(0, 3);
};

console.log(tresProdtosAleatorios(produtos));
