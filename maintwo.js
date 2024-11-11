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

function fetchProducts() {
    fetch('/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const productList = document.getElementById('product-list');
            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}"class="product-image" onerror="this.onerror=null; this.src='path/to/placeholder-image.jpg';">
                    <h2 style="color:black">${product.name}</h2>
                    <p>Цена за минуту: ${product.price} BYN</p>
                `;
                productDiv.onclick = () => {
                   window.location.href = `kerosenethree.html?id=${product.id}`;
                  };
                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Ошибка:', error));
  }
  
  // Вызов функции для получения данных при загрузке страницы
  document.addEventListener('DOMContentLoaded', fetchProducts);
  



  

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






