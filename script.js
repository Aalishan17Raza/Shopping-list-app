const itemForm = document.querySelector('#item-form');
const formInput = document.querySelector('.form-input');
const itemList = document.querySelector('#item-list');
const btnClear = document.querySelector('.btn-clear');
const itemFilter = document.querySelector('.filter');
const formBtn = itemForm.querySelector('.btn');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => {
        addItemToDOM(item);
    });
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = formInput.value;

    if (formInput.value == '') {
        alert("enter a valid input");
        return;
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if(checkIfItemExist(newItem)){
            alert("item already exists!");
            formInput.value ='';
            return;
        }
    }

    addItemToDOM(newItem);
    addItemToStorage(newItem);
    checkUI();
    formInput.value = "";
}

function addItemToDOM(Item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(Item));
    const btn = createButton("remove-item btn-link text-red");
    li.appendChild(btn);
    itemList.appendChild(li);
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function createButton(classes) {
    const btn = document.createElement('button');
    btn.className = classes;
    const i = createIcon("fa-solid fa-xmark");
    btn.appendChild(i);
    return btn;
}

function createIcon(classes) {
    const i = document.createElement('i');
    i.className = classes;
    return i;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => {
        i.classList.remove('edit-mode');
    })

    formInput.value = item.textContent;
    formInput.focus();
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = 'green'
}

function removeItem(item) {
    if (confirm("Are you sure?")) {
        item.remove();
        removeItemFromStorage(item.textContent);
    }
    checkUI();
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter(i => i != item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeAllItem() {
    if (confirm("Are you sure?"))
        while (itemList.firstChild) {
            itemList.firstChild.remove();
        }
    localStorage.removeItem('items');
    checkUI();
}

function checkUI() {
    const items = document.querySelectorAll('li');
    if (items.length === 0) {
        itemFilter.style.display = 'none';
        btnClear.style.display = 'none';
    } else {
        itemFilter.style.display = 'block';
        btnClear.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

function filterItems(e) {
    const items = document.querySelectorAll('li');
    const input = e.target.value.toLowerCase();
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(input) !== -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function checkIfItemExist(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    btnClear.addEventListener('click', removeAllItem);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}

init();
