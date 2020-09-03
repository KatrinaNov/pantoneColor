'use strict';

const output = document.querySelector('.table');
const checkboxes = document.querySelectorAll('input[type=checkbox]');
const resetBtn = document.querySelector('.reset');

// создаем массив из объектов для хранения информации о том, какой чекбокс выбран
const saveCheckData = arr => {
  checkboxes.forEach(item => {
    const newCheck = {
      name: item.id,
      checked: item.checked
    };
    arr.push(newCheck);
  });
};

const checkArrStart = [];
saveCheckData(checkArrStart);
let checkData = JSON.parse(localStorage.getItem('check')) || checkArrStart;

// прячем колонки, если не выбран соответствующий чекбокс
const hideCol = () => {
  const uncheckData = checkData.filter(item => !item.checked);
  if (uncheckData.length !== 0) {
    uncheckData.forEach(item => {
      document.querySelectorAll(`[data-name=${item.name}]`).forEach(td => td.style.display = 'none');
    });
  }
};

// рендер данных на страницу
const render = data => {
  let inner = '';

  data.forEach(item => {
    const name = item.name[0].toUpperCase() + item.name.slice(1);

    inner = `
    <tr class="color">
      <td class="color__id" data-name='id'>${item.id}</td>
      <td class="color__name" data-name='name'>${name}</td>
      <td class="color__year" data-name='year'>${item.year}</td>
      <td class="color__code" data-name='code'>
        <span class="color__example" style="background: ${item.color}"></span>${item.color}
      </td>
      <td class="color__pantone_value" data-name='pantone_value'>${item.pantone_value}</td>
    </tr>
      `;

    output.insertAdjacentHTML('beforeend', inner);

  });
};

const eventHandler = () => {
  // кнопка Reset
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('td').forEach(item => item.style.display = '');
    checkboxes.forEach(item => item.checked = true);
    resetBtn.classList.remove('active');
    checkData = checkArrStart;
    localStorage.setItem('check', JSON.stringify(checkData));
  });

  // прячем колонки при нажатии на чекбоксы
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const target = e.target;
      resetBtn.classList.add('active');
      document.querySelectorAll(`[data-name=${target.id}]`).forEach(item => item.style.display = 'none');

      checkData.forEach(item => item.checked = item.name === target.id ? !item.checked : item.checked);

      localStorage.setItem('check', JSON.stringify(checkData));

    });
  });
};
document.addEventListener('DOMContentLoaded', () => {

  fetch('https://reqres.in/api/unknown?per_page=12')
    .then(value => {
      if (value.status !== 200) {
        throw new Error('status network not 200');
      }
      return value.json();
    })
    .then(data => {
      render(data.data);
      hideCol();
      eventHandler();
    })
    .catch(reason => {
      output.innerHTML = 'Упс ,что-то пошло не так!';
      console.error('error:' + reason.status);
    });

});