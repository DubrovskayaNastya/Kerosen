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
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Функция для получения данных о продукте
function fetchProductDetails() {
    const productId = getProductId();
    fetch(`/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой: ' + response.status);
            }
            return response.json();
        })
        .then(products => {
            const productDetails = document.getElementById('product-details');
            productDetails.innerHTML = `
                <h1 class="product-p">${products.name}</h1>
                <img src="${products.image}" alt="${products.name}"class="products-image"">
                <p style="top:1139px;position:absolute;font-size: 1.2rem;left:75px"><b>1 мин. - ${products.price} BYN</b></p>
                <p style="top:514px;font-size: 1rem;left:873px;position: absolute;"> ${products.engine}</p>
                <p style="top:413px;font-size: 1rem;left:873px;position: absolute;"> ${products.overclocking}</p>
                <p style="top:140px;font-size: 1.4rem;left:778px;position: absolute; text-align: justify;">${products.about}</p>
                <p style="top:1139px;position:absolute;font-size: 1.2rem;left:525px"><b>30 мин. - ${(products.price/2*30).toFixed(2)} BYN</b></p>
                 <p style="top:1189px;position:absolute;font-size: 1.2rem;left:525px"><b>60 мин. - ${(products.price/2.5*60).toFixed(2)} BYN</b></p>
                 <p style="top:1239px;position:absolute;font-size: 1.2rem;left:525px"><b>120 мин. - ${(products.price/3*120).toFixed(2)} BYN</b></p>
                <p style="top:1530px;position:absolute;font-size: 0.9rem;left:450px">Каждый км по ${(products.price*0.92).toFixed(2)} BYN</p>
                <p style="top:1530px;position:absolute;font-size: 0.9rem;left:10px">Каждый км по ${(products.price*0.92).toFixed(2)} BYN</p>
                <p style="top:1530px;position:absolute;font-size: 0.9rem;left:890px">Каждый км по ${(products.price*0.92).toFixed(2)} BYN</p>
                <p style="top:1530px;position:absolute;font-size: 0.9rem;left:1340px">Каждый км по ${(products.price*0.92).toFixed(2)} BYN</p>
                <p style="top:1139px;position:absolute;font-size: 1.2rem;left:965px"><b>3 часа - ${(products.price/3*180).toFixed(2)} BYN</b></p>
                 <p style="top:1189px;position:absolute;font-size: 1.2rem;left:965px"><b>6 часов - ${(products.price/3.5*360).toFixed(2)} BYN</b></p>
                 <p style="top:1239px;position:absolute;font-size: 1.2rem;left:965px"><b>9 часов - ${(products.price/4*540).toFixed(2)} BYN</b></p>
                 <p style="top:1139px;position:absolute;font-size: 1.2rem;left:1405px"><b>1 сутки - ${(products.price/8.5*1440).toFixed(2)} BYN</b></p>
                 <p style="top:1189px;position:absolute;font-size: 1.2rem;left:1405px"><b>2 суток - ${(products.price/8*2880).toFixed(2)} BYN</b></p>
                 <p style="top:1239px;position:absolute;font-size: 1.2rem;left:1405px"><b>3 суток - ${(products.price/9*8640).toFixed(2)} BYN</b></p>
                 <p style="top:1289px;position:absolute;font-size: 1.2rem;left:1405px"><b>5 суток - ${(products.price/10*7200).toFixed(2)} BYN</b></p>
                 <p style="top:1339px;position:absolute;font-size: 1.2rem;left:1405px"><b>7 суток - ${(products.price/11*10080).toFixed(2)} BYN</b></p>
                 <p style="top:1389px;position:absolute;font-size: 1.2rem;left:1405px"><b>14 суток - ${(products.price/12*20160).toFixed(2)} BYN</b></p>
                 <p style="top:1439px;position:absolute;font-size: 1.2rem;left:1405px"><b>30 суток - ${(products.price/15*43200).toFixed(2)} BYN</b></p>
            `;
        })
        .catch(error => console.error('Ошибка:', error));
}

// Вызов функции для получения данных о продукте при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchProductDetails);


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
// Получаем токен из localStorage







function openModals() {
  document.getElementById("orderModals").style.display = "flex";
}

// Функция для закрытия модального окна
function closeModals() {
  document.getElementById("orderModals").style.display = "none";
}

// Закрытие модального окна при нажатии на затемненный фон
window.onclick = function(event) {
  const modal = document.getElementById("orderModals");
  if (event.target === modal) {
      closeModal();
  }
}

