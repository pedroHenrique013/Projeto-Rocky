/* ---------------- Recuperação dos dados originais do banco de dados/arquivo.json ---------------- */
const fs = require("fs");

function lerJson() {
  const data = fs.readFileSync("./broken-database.json", "utf-8");
  return JSON.parse(data);
}

let dados = lerJson();

function corrigirNomes() {
  dados.forEach((elemento) => {
    elemento.name = elemento.name
      .replace(/(æ)/g, "a")
      .replace(/(¢)/g, "c")
      .replace(/(ø)/g, "o")
      .replace(/(ß)/g, "b");
  });
  return dados;
}
corrigirNomes();

function corrigirPrecos() {
  dados.forEach((elemento) => {
    if (typeof elemento.price === "string") {
      elemento.price = Number(elemento.price);
    }
  });
  return dados;
}
corrigirPrecos();

function corrigirQuantidades() {
  dados.forEach((elemento) => {
    if (!elemento.quantity) {
      elemento.quantity = 0;
    }
  });
  const sortOrder = { 
    id: 1, 
    name: 2, 
    quantity: 3, 
    price: 4, 
    category: 5 
  };
  dados = dados.map((elemento) =>
    Object.assign(
      {},
      ...Object.keys(elemento)
        .sort((a, b) => sortOrder[a] - sortOrder[b])
        .map((indice) => {
          return { [indice]: elemento[indice] };
        })
    )
  );
  return dados;
}
corrigirQuantidades();

function exportarJson() {
  const data = JSON.stringify(dados, null, 2);
  fs.writeFileSync("./saida.json", data);
}
exportarJson();

/* ---------------- Validação do banco de dados corrigido ---------------- */

function imprimirNomes(input) {
  let lista = [];
  input.forEach((elemento) => {
    input.sort((a, b) => {
      if (a.category.toLowerCase() > b.category.toLowerCase()) return 1;
      else if (a.category.toLowerCase() < b.category.toLowerCase()) return -1;
      else if (a.id < b.id) return -1;
      return 0;
    });
    lista.push(elemento.name);
  });
  return console.log(lista);
}
imprimirNomes(dados);

function valorTotalPorCateegoria(input) {
  let totalEstoqueAcessorios = 0;
  let totalEstoqueEletrodomesticos = 0;
  let totalEstoqueEletronicos = 0;
  let totalEstoquePanelas = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i].category === "Acessórios") {
      totalEstoqueAcessorios += input[i].price * input[i].quantity;
    } else if (input[i].category === "Eletrodomésticos") {
      totalEstoqueEletrodomesticos += input[i].price * input[i].quantity;
    } else if (input[i].category === "Eletrônicos") {
      totalEstoqueEletronicos += input[i].price * input[i].quantity;
    } else if (input[i].category === "Panelas") {
      totalEstoquePanelas += input[i].price * input[i].quantity;
    }
  }
  return console.log(`
${totalEstoqueAcessorios.toFixed(2)},
${totalEstoqueEletrodomesticos.toFixed(2)},
${totalEstoqueEletronicos.toFixed(2)},
${totalEstoquePanelas.toFixed(2)},
`);
}
valorTotalPorCateegoria(dados);
