let name = document.querySelector('#name'), //----------------Name
  secondName = document.querySelector('#secondName'), //----Second name
  email = document.querySelector('#email'), //--------------Email
  btn = document.querySelector('.btn'), //------------------Отправить
  users = document.querySelector('.users'), //--------------
  clear = document.querySelector('.clear'); //---------------Очистить локал
let middleName = document.querySelector('#middleName');
let phone = document.querySelector('#phone');
let yyuu = '';
// Объект для localStorage

//стораж это обект с ключ:значение или пустой обьект
let storage = JSON.parse(localStorage.getItem('users')) || {};

//создаем экземпляр наблюдателя
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      //console.log(mutation.addedNodes.length); //----
      //console.log(mutation.removedNodes.length); //---
      //console.log('Карта USERS обновилась');
      setListeners();
    }
  });
});
// ( <div class="users"></div> , {  childList: true,  }  )
//еаблюдаем за мутацией дочерних элементтов дива юзерс
observer.observe(users, {
  childList: true,
});

btn.addEventListener('click', getData); // при клике на Отправить вызываем функцию
clear.addEventListener('click', clearLocalStorage); // при клике Очистить вызов функц

// функция
function getData(e) {
  e.preventDefault(); // отменяем действие события по умолчанию
  const data = {}; //создаем обьект дата

  //const data: {-----------записываем в обьект дата ключ:значение
  name:;
  secondName:;
  email: '';

  data.name = name.value || ''; // записываем значение из инпута нейм
  data.secondName = secondName.value || '';
  data.email = email.value || '';
  data.middleName = middleName.value || '';
  data.phone = phone.value || '';

  // создаем ключ по емаилу
  const key = data.email; //--емаил@mm.ru из инпута
  storage[key] = data; // storage[емаил@mm.ru]:data{}
  if (key !== yyuu || key === '') {
    delete storage[yyuu]; // удалили из стораж ключ и значение по ключу- емаил
    localStorage.removeItem('users'); //стерли стораж
    localStorage.setItem('users', JSON.stringify(storage));
  }

  //записываем в локал стораж ( ключ:значение ), значение переводим в строку
  localStorage.setItem('users', JSON.stringify(storage));

  //передаем строку в функцию (строку берем из локал стораж по ключу юзерс)
  rerenderCard(JSON.parse(localStorage.getItem('users')));

  /*возвращаем обьект дата data: {
    name: any;
    secondName: any;
    email: any;
} */
  name.value = '';
  secondName.value = '';
  email.value = '';
  middleName.value = '';
  phone.value = '';
  yyuu = '';

  return data;
}

//создаем HTML для вставки в див с классом users
function createCard({ name, secondName, email, middleName, phone }) {
  return `
        <div data-out=${email} class="user-outer">
            <div class="user-info">
                <p class=n>${name}</p>
                <p class=s>${secondName}</p>
                <p class=m>${middleName}</p>
                <p class=e>${email}</p>
                <p class=p>${phone}</p>
            </div>
            <div class="menu">
                <button data-change=${email} class="change">Изменить</button>
                <button data-delete=${email} class="delete">Удалить</button>
            </div>
        </divd>
    `;
}

function rerenderCard(storage) {
  users.innerHTML = '';

  /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
     */

  /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
     */

  Object.entries(storage).forEach((user) => {
    // user = ['email1', {name: '', secondName: '', email: ''}]
    const [email, userData] = user;
    //console.log('USER  =*== ', user);
    //console.log('EMAIL ==*= ', email);
    //console.log('DATA  ===* ', userData);

    const div = document.createElement('div');
    div.className = 'user';
    div.innerHTML = createCard(userData);
    users.append(div); // добавили
  });
}

function setListeners() {
  const del = document.querySelectorAll('.delete'); // кве элементы с классом делете
  const change = document.querySelectorAll('.change'); // все элементы с классом ченж
  let clicked; // создаем переменную клик
  let key;
  // перебор элементов в массиве дел
  del.forEach((n) => {
    n.addEventListener('click', () => {
      //console.log('УДАЛИТЬ кнопка');
      //console.log('=== NODE:', n);
      clicked = n.getAttribute('data-delete'); // нашли email
      //класс дата оут такой же как у дел и ченж
      const outer = document.querySelector(`[data-out="${clicked}"]`);
      //console.log('=== outer', outer);
      hide(outer); // скрыли див
      delete storage[clicked]; // удалили из стораж ключ и значение по ключу- емаил
      localStorage.removeItem('users'); //стерли стораж
      localStorage.setItem('users', JSON.stringify(storage)); //перезаписали обновленый стораж
    });
  });
  // перебор элементов в масиве ченж
  change.forEach((n) => {
    n.addEventListener('click', () => {
      //console.log('=== ПРИМЕНИТЬ кнопка');
      key = n.getAttribute('data-change'); // нашли email
      let man = storage[key];
      yyuu = key;

      name.value = man.name; //добавляем имя в инпут
      secondName.value = man.secondName; // добавили фамилию в инпут
      email.value = man.email; //добавляем емаил в инпут
      middleName.value = man.middleName;
      phone.value = man.phone;
    });
  });
}

function clearLocalStorage() {
  window.location.reload(); //перезагружаем страницу
  localStorage.removeItem('users'); //удаляем в локал ключ:значение по ключу юзерс
}

function show(el) {
  el.style.display = 'block';
}

function hide(el) {
  el.style.display = 'none';
}

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')));
