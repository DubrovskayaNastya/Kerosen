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
  



const token = localStorage.getItem('authToken');  // Получаем токен из localStorage

if (token) {
    // Отправляем запрос с токеном в заголовке Authorization
    fetch('/protected-data', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Полученные данные:', data);
        if (data.user) {
          const usernameInput = document.getElementById('namerev');

          if (usernameInput) {
              usernameInput.value = data.user.name ; // Заполняем имя пользователя
          }
      }
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
} else {
    console.log('Токен не найден, пользователь не авторизован');
}






async function submitReview() {
    const name = document.getElementById('namerev').value;
    const reviews = document.getElementById('reviewText').value;

    if (!name || !reviews) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    try {
        const response = await fetch('/add-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, reviews }) // Передаем данные в формате JSON
        });
        
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            fetchReviews(); // Обновляем список отзывов
            // document.getElementById('namerev').value = '';
            // document.getElementById('reviewText').value = '';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error);
    }
}

// Функция для получения и отображения всех отзывов
async function fetchReviews() {
    try {
        const response = await fetch('/get-reviews');
        const reviews = await response.json();

        const reviewsList = document.getElementById('reviews-list');

        // Добавляем новые отзывы в начало списка
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <h4>${review.name}</h4>
                <p>${review.reviews}</p>
            `;

            // Добавляем новый отзыв в начало списка
            reviewsList.insertBefore(reviewItem, reviewsList.firstChild);
        });
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
    }
}


// Загружаем отзывы при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchReviews);