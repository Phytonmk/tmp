import axios from 'axios';

const qs = 'querySelector';
const qsA = 'querySelectorAll';


document[qs]('.open-main-menu').addEventListener('click', (event) => {
  document[qs]('div.main-menu').classList.remove('hidden')
});
document[qs]('div.main-menu div.wrapper div.close-container').addEventListener('click', (event) => {
  document[qs]('div.main-menu').classList.add('hidden')
});


// time picker
const timePcikers = document[qsA]('div.time-picker');
document[qs]('body').addEventListener('click', (event) => {
  let hide = true;
  if (event.target.dataset.type === 'time-pick')
    hide = false;
  if (hide) {
    const availibleClasses = ['time-picker', 'hours-container', 'hours-row'];
    for (let availibleClass of availibleClasses) {
      if (event.target.classList.contains(availibleClass)) {
        hide = false;
        break;
      }
    }
  }
  if (hide)
    timePcikers.forEach(picker => picker.classList.remove('visible-element'));
  else if (event.target.dataset.type === 'time-pick')
    event.target.previousElementSibling.classList.add('visible-element');
});
document[qsA]('div.time-picker .hours-row').forEach(input => input.addEventListener('click', (event) => {
  event.target.parentNode.parentNode.nextElementSibling.value = event.target.textContent;
  event.target.parentNode.parentNode.classList.remove('visible-element');
}));

// date picker
const datePcikers = document[qsA]('div.date-picker');
document[qs]('body').addEventListener('click', (event) => {
  let hide = true;
  if (event.target.dataset.type === 'date-pick')
    hide = false;
  if (hide) {
    const availibleClasses = ['date-picker', 'month-row', 'month-title', 'date-arrow', 'days-row', 'date-grid', 'date-cell'];
    for (let availibleClass of availibleClasses) {
      if (event.target.classList.contains(availibleClass)) {
        hide = false;
        break;
      }
    }
  }
  if (hide)
    datePcikers.forEach(picker => picker.classList.remove('visible-element'));
  else if (event.target.dataset.type === 'date-pick')
    event.target.previousElementSibling.classList.toggle('visible-element');
});
const monthes = [
'Январь',
'Февраль',
'Март',
'Апрель',
'Май',
'Июнь',
'Июль',
'Август',
'Сентябрь',
'Октябрь',
'Ноябрь',
'Декабрь'
];
const monthesMutated = [
'Января',
'Февраля',
'Марта',
'Апреля',
'Мая',
'Июня',
'Июля',
'Августа',
'Сентября',
'Октября',
'Ноября',
'Декабря'
];
document[qsA]('div.date-picker').forEach((picker) => picker.dataset.date = new Date().getTime());
Date.prototype.daysInMonth = function() {
  return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};
// Date.prototype.day = function() {
//   return this.getDay() == 0 ? 7 : this.getDay();
// };
const getFirstDay = (date) => {
  let firstDay = date.getDate() - date.getDay();
  while (firstDay > 7)
    firstDay -= 7;
  firstDay = 7 - firstDay;
  return firstDay;
}
const renderCalendar = (calendar) => {
  const date = new Date(calendar.dataset.date * 1);
  calendar.children[0].children[1].innerHTML = monthes[date.getMonth()];
  const firstDay = getFirstDay(date);
  const lastDay = getFirstDay(new Date(date.getTime() + 1000 * 60 * 60 * 24 * 30));
  const dayCells = calendar.querySelectorAll('.date-cell');
  dayCells.forEach(cell => {
    cell.innerHTML = '';
    cell.classList.remove('selected-cell');
  });
  let day = 0;
  console.log(firstDay);
  for (let i = firstDay; i < date.daysInMonth() + firstDay; i++) {
    day++;
    dayCells[i].innerHTML = day;
  }
  if (calendar.dataset.selectedDate) {
    const selectedDate = new Date(calendar.dataset.selectedDate * 1);
    if (selectedDate.getFullYear() === date.getFullYear() && selectedDate.getMonth() === date.getMonth()) {
      dayCells[firstDay + selectedDate.getDate() - 1].classList.add('selected-cell');
    }
  }
}
document[qsA]('div.date-picker').forEach(datePicker => renderCalendar(datePicker));
document[qsA]('div.date-picker').forEach((picker) => {
  picker.querySelectorAll('.arrow-left').forEach((arrow) => arrow.addEventListener('click', (event) => {
    const calendar = event.target.parentNode.parentNode;
    const date = new Date(calendar.dataset.date * 1);
    calendar.dataset.date = new Date(date.getTime() - 1000 * 60 * 60 * 24 * date.daysInMonth()).getTime();
    renderCalendar(calendar)
  }));
  picker.querySelectorAll('.arrow-right').forEach((arrow) => arrow.addEventListener('click', (event) => {
    const calendar = event.target.parentNode.parentNode;
    const date = new Date(calendar.dataset.date * 1);
    calendar.dataset.date = new Date(date.getTime() + 1000 * 60 * 60 * 24 * date.daysInMonth()).getTime();
    renderCalendar(calendar)
  }));
  picker.querySelectorAll('.date-cell').forEach((cell) => cell.addEventListener('click', (event) => {
    const calendar = event.target.parentNode.parentNode;
    const calendarDate = new Date(calendar.dataset.date * 1);
    const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), event.target.textContent);
    calendar.dataset.selectedDate = date.getTime();
    renderCalendar(calendar)
    event.target.parentNode.parentNode.nextElementSibling.value = date.getDate() + ' ' + monthesMutated[date.getMonth()] 
    event.target.parentNode.parentNode.classList.remove('visible-element');
  }));
})
// forms handler
document[qsA]('div.form-wrapper form').forEach(form => form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputs = event.target.querySelectorAll('input[type="text"]');
  let invalid = false;
  inputs.forEach(input => {
    if (input.value === '') {
      invalid = true;
      input.classList.add('invalid');
      switch (input.name) {
        case 'name':
          input.setAttribute('placeholder', 'Вы не ввели имя');
          break;
        case 'phone':
          input.setAttribute('placeholder', 'Вы не ввели телефон');
          break;
      }
    }
  });
  if (invalid) {
    event.target.querySelector('input[type=submit]').classList.add('inactive');
  } else {
    event.target.submit();
  }

}));


// all forms closing

document[qsA]('.form-close-btn, .form-wrapper').forEach(closer => closer.addEventListener('click', (event) => {
  if (event.target.classList.contains('form-close-btn') || event.target.classList.contains('form-wrapper')) {
    document[qsA]('.form-wrapper.visible-element').forEach(form => form.classList.remove('visible-element'));
  }
}));



document[qsA]('.call-order-btn').forEach(btn => btn.addEventListener('click', () => {
  document[qs]('div.form-wrapper#contact-form').classList.add('visible-element');
}));

document[qsA]('.row.services ins').forEach(btn => btn.addEventListener('click', () => {
  document[qs]('div.form-wrapper#contact-form input[name=service]').value = 
    event.target.previousElementSibling.previousElementSibling.textContent;
  document[qs]('div.form-wrapper#contact-form').classList.add('visible-element');
}));

document[qsA]('.get-club-card-btn').forEach(btn => btn.addEventListener('click', () => {
  document[qs]('div.form-wrapper#card-form').classList.add('visible-element');
}));

document[qs]('form.questions').addEventListener('submit', (event) => {
  event.preventDefault();
  const inputs = document[qsA]('form.questions input[type=text], form.questions textarea');
  let anyEmpty = false;
  inputs.forEach(input => {
    if(input.value === '')
      anyEmpty = true
  });
  if (!anyEmpty)
    axios[event.target.method.toLowerCase()](event.target.action, {
      name: inputs[0],
      phone: inputs[1],
      question: inputs[2]
    }).then(() => {
      document[qs]('div.form-wrapper#thanks-form').classList.add('visible-element');
    }).catch(e => {
      console.log(e);
    });
});


// sliders

document[qsA]('.slider-block').forEach(block => block.init = (html) => block.innerHTML = `<div class="slider-block-inner">${html}</div>`);
document[qsA]('.slider-block').forEach(block => block.slide = (html, from='right') => {
  if (from === 'left')
    block.children[0].style.transform = 'translateX(-100%)';
  if (from === 'left')
    html = `<div class="slider-block-inner" style="transform: translateX(-100%)">${html}</div>`;
  else
    html = `<div class="slider-block-inner" style="transform: translateX(0%)">${html}</div>`;
  block.insertAdjacentHTML(from === 'left' ? 'afterBegin' : 'beforeEnd', html);
  setTimeout(() => {
    for (let c = 0; c < block.children.length; c++)
      block.children[c].style.transition = '0.3s all';
    setTimeout(() => {
      let newTransform;
      if (from === 'left') {
        block.children[0].style.transform = 'translateX(0%)';
        block.children[1].style.transform = 'translateX(100%)';
      } else {
        block.children[0].style.transform = 'translateX(-100%)';
        block.children[1].style.transform = 'translateX(-100%)';
      }
      setTimeout(() => {
        if (from === 'left')
          block.children[1].remove();
        else
          block.children[0].remove();
        block.children[0].style.transition = '';
        block.children[0].style.transform = '';
      }, 500);
    }, 0);
  }, 0);
});

document[qsA]('.slider').forEach(slider => slider.init = (contents) => {
  const slide = () => {
    if (slider.slide >= contents[0].length)
        slider.slide = 0;
    if (slider.slide < 0)
      slider.slide = contents[0].length - 1;
    if (dotsContainer !== null) {
      dotsContainer.querySelectorAll('.slider-dot.active-dot').forEach(dot => dot.classList.remove('active-dot'));
      dotsContainer.querySelectorAll('.slider-dot')[slider.slide].classList.add('active-dot');
    }
    blocks.forEach((block, i) => block.slide(contents[i][slider.slide]));
  }
  const blocks = slider[qsA]('.slider-block');
  for (let i = 0; i < contents.length; i++) {
    blocks[i].init(contents[i][0]);
  }
  const dotsContainer = slider.querySelector('.slider-dots');
  if (dotsContainer !== null) {
    let dots = '';
    for (let i = 0; i < contents[0].length; i++)
      dots += '<div class="slider-dot"></div>';
    dotsContainer.innerHTML = dots;
    dots = dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => dot.addEventListener('click', () => {
      if (new Date().getTime() - slider.lastUserInput > 700) {
        slider.lastUserInput = new Date().getTime();
        const diraction = i < slider.slide ? 'left' : 'right';
        slider.slide = i;
        slide();
      }
    }));
    dotsContainer.querySelectorAll('.slider-dot')[0].classList.add('active-dot');
  }
  slider.lastUserInput = new Date().getTime();
  slider.slide = 0;
  setInterval(() => {
    if (new Date().getTime() - slider.lastUserInput > 5 * 1000) {
      slider.lastUserInput = new Date().getTime();
      slider.slide++;
      slide();
    }
  }, 1000);

  slider.querySelectorAll('.slide-left').forEach(arrow => arrow.addEventListener('click', () => {
    if (new Date().getTime() - slider.lastUserInput > 700) {
      slider.lastUserInput = new Date().getTime();
      slider.slide--;
      slide();
    }
  }));
  slider.querySelectorAll('.slide-right').forEach(arrow => arrow.addEventListener('click', () => {
    if (new Date().getTime() - slider.lastUserInput > 700) {
      slider.lastUserInput = new Date().getTime();
      slider.slide++;
      slide();
    }
  }));

});
document[qs]('.slider').init([['Hello', 'Hi', 'Hello world']]);