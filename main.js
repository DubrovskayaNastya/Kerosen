let item = document.querySelectorAll('.item');
const itemLength = item.length;
 console.log(itemLength);

const rightArrow = document.querySelector("#rightArrow");
const leftArrow = document.querySelector("#leftArrow");
let slider = [];
for (let i = 0; i<itemLength; i++) {
  slider[i] = item[i];
   console.log(slider[i]);
  item[i].remove();
}
let step = 0;
let offset = 0;

function burgerSlider() {
  let div = document.createElement('div');
  div = slider[slider.length-1];
  div.classList.add('item');
  div.style.left = -100 + 'px';
   console.log(div);
  document.querySelector('.items').appendChild(div); 
  
  div = slider[step];
  div.classList.add('item');
  div.style.left = offset*100 + 'px';
  console.log(div);
  document.querySelector('.items').appendChild(div); 
  div = slider[step+1];
  div.classList.add('item');
  div.style.left = offset*100 + 100 + 'px';
   console.log(div);
  document.querySelector('.items').appendChild(div); 
  offset = 1;
}

function burgerSliderL() {
  console.log(step);
  if (step == (slider.length-1)) {
    step = 1;
  } else {
    if (step == (slider.length-2)) {
      step = 0;
    } else {
      step = (step +2);
    }
  }

  console.log(step);
  let div = document.createElement('div');
  div = slider[step];
  div.classList.add('item');
  div.style.left = offset*100 + 'px';
   console.log(div);
  document.querySelector('.items').appendChild(div); 
    
  if (step == 0) {
    step = (slider.length-1);
  } else {
    step = (step - 1);
  }
  console.log(step);
  offset = 1;
}

function left() {
  leftArrow.onclick = null;
  let slider2 = document.querySelectorAll('.item');
  let offset2 = -1;
   console.log(slider2.length);
  for (let i = 0; i<slider2.length; i++) {
    slider2[i].style.left = offset2*100 - 100 + 'px';
    offset2 ++;
  }
  setTimeout(function() {
    slider2[0].remove();
    burgerSliderL();
    leftArrow.onclick = left;
  }, 600);
}

function burgerSliderR() {
  console.log(step);
  if (step == 0) {
    step = (slider.length-2);
  } else {
    if (step == 1) {
      step = (slider.length-1);
    } else {
      step = (step -2);
    }
  }
  console.log(step);
  let offset = -1;
  let div = document.createElement('div');
  div = slider[step];
  div.classList.add('item');
  div.style.left = offset*100 + 'px';
   console.log(div);
  document.querySelector('.items').insertBefore(div, items.firstElementChild);
  if (step == (slider.length-1)) {
      step = 0;
   } else {
     step = (step+1);
   }
  console.log(step);
  offset = 1;
}

function right() {
  rightArrow.onclick = null;
  let slider2 = document.querySelectorAll('.item');
  let offset2 = (slider2.length-1);
  for (let i = (slider2.length-1); i>=0; i--) {
    slider2[i].style.left = offset2*100 + 'px';
    offset2 --;
  }
  setTimeout(function() {
    slider2[(slider2.length-1)].remove();
     burgerSliderR();
    rightArrow.onclick = right;
  }, 600);
}
burgerSlider();
step = 0;
leftArrow.onclick = left;
rightArrow.onclick = right;

const burger = document.getElementById('burger');
const burger_close = document.getElementById('burger_button');
const nav = document.getElementById('nav');
const burgerIcon = document.getElementById('icon');
const overlay = document.getElementById('overlay');

burger.addEventListener('click', () => {
  nav.classList.toggle('show');
  overlay.style.display = nav.classList.contains('show') ? 'block' : 'none';
});

burger_close.addEventListener('click', () => {
  nav.classList.toggle('show');
  overlay.style.display = nav.classList.contains('show') ? 'block' : 'none';
});

overlay.addEventListener('click', () => {
  nav.classList.remove('show');
  overlay.style.display = 'none';
  burgerIcon.src = 'icon.png';
});


function openModal() {
  nav.classList.remove('show');
  overlay.style.display = 'none';
  burgerIcon.src = 'icon.png';
  const iframeContainer = document.getElementById('iframeContainer');
  iframeContainer.style.display = 'flex'; // Показываем iframe
}

function closeForm() {
  const iframeContainer = document.getElementById('iframeContainer');
  iframeContainer.style.display = 'none'; // Скрываем iframe
}

window.addEventListener('message', function(event) {
  if (event.data === 'closeForm') {
      closeForm(); // Закрываем модальное окно
  }
});







