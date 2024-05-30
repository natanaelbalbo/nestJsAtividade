const produtos = [
  { nome: "Maçã", categoria: "Frutas" },
  { nome: "Banana", categoria: "Frutas" },
  { nome: "Pera", categoria: "Frutas" },
  { nome: "Uva", categoria: "Frutas" },
  { nome: "Pêssego", categoria: "Frutas" },
  { nome: "Cenoura", categoria: "Legumes" },
  { nome: "Beterraba", categoria: "Legumes" },
  { nome: "Abobrinha", categoria: "Legumes" },
  { nome: "Tomate", categoria: "Legumes" },
  { nome: "Batata", categoria: "Legumes" },
];

// Constante que armazena um novo Map()
const produtosMap = new Map();

// Percorrer o array de produtos usando forEach - armazenando na variável "produto"
produtos.forEach((produto) => {
  // Um if que verifica se a categoria do produto não existe no Map()
  if (!produtosMap.has(produto.categoria)) {
    // Se ela não existir, ele vai criar um novo array vazio para essa categoria no Map()
    produtosMap.set(produto.categoria, []);
  }

  // Então é só adicionar o produto no array da categoria correspondente
  // Ele usa .get() para pegar o array da categoria
  // e .push() para adicionar o produto
  produtosMap.get(produto.categoria).push(produto);
});

// Printar o Map()
console.log(produtosMap);
