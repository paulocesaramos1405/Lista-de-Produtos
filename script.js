const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const Produto = document.querySelector('#m-produto');
const Descricao = document.querySelector('#m-descricao');
const Valor = document.querySelector('#m-valor');
const btnSalvar = document.querySelector('#btnSalvar');
const buttonS = document.querySelector('#buttonS');
const buttonN = document.querySelector('#buttonN');

let itens = [];
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    Produto.value = itens[index].produto;
    Descricao.value = itens[index].descricao;
    Valor.value = itens[index].valor;
    id = index;

    if (itens[index].disponivel) {
      buttonS.classList.add('selected');
      buttonN.classList.remove('selected');
    } else {
      buttonN.classList.add('selected');
      buttonS.classList.remove('selected');
    }
  } else {
    Produto.value = '';
    Descricao.value = '';
    Valor.value = '';
    buttonS.classList.remove('selected');
    buttonN.classList.remove('selected');
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.produto}</td>
    <td>${item.descricao}</td>
    <td>R$ ${item.valor}</td>
    <td>${item.disponivel ? 'Sim' : 'Não'}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = e => {
  e.preventDefault();

  if (Produto.value === '' || Descricao.value === '' || Valor.value === '') {
    return;
  }

  let disponivel = false;
  if (buttonS.classList.contains('selected')) {
    disponivel = true;
  } else if (buttonN.classList.contains('selected')) {
    disponivel = false;
  }

  const item = {
    produto: Produto.value,
    descricao: Descricao.value,
    valor: parseFloat(Valor.value), 
    disponivel: disponivel
  };

  if (id !== undefined) {
    itens[id] = item;
  } else {
    itens.push(item);
  }

  setItensBD();
  modal.classList.remove('active');
  loadItens();
  id = undefined;
};

function loadItens() {
  itens = getItensBD(); 
  itens.sort((a, b) => a.valor - b.valor); 
  tbody.innerHTML = ''; 
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

function getItensBD() {
  return JSON.parse(localStorage.getItem('produtos')) || [];
}

function setItensBD() {
  localStorage.setItem('produtos', JSON.stringify(itens));
}

buttonS.addEventListener('click', () => {
  buttonS.classList.add('selected');
  buttonN.classList.remove('selected');
});

buttonN.addEventListener('click', () => {
  buttonN.classList.add('selected');
  buttonS.classList.remove('selected');
});

loadItens(); 
