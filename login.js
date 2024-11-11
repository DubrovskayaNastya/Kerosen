const container = document.querySelector(".container"),
      pwShowHide = document.querySelectorAll(".showHidePw"),
      pwFields = document.querySelectorAll(".password"),
      signUp = document.querySelector(".signup-link"),
      login = document.querySelector(".login-link");

// js code to show/hide password and change icon
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === "password") {
        pwField.type = "text";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye-slash", "uil-eye");
        });
      } else {
        pwField.type = "password";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye", "uil-eye-slash");
        });
      }
    });
  });
});

// js code to appear signup and login form
signUp.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("active");
});
login.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.remove("active");
});

function closeForm() {
  window.parent.postMessage('closeForm', '*');
}

document.getElementById('checkButton').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;

  const resultsDiv = document.getElementById('result');
  resultsDiv.innerHTML = ''; // Очистка предыдущих результатов
  if (!name || !password) {
    document.getElementById("result").innerText = "Введите логин и пароль.";
    return;
}
  try {
      const response = await fetch('/check-credentials', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, password }), // Отправляем данные на сервер
      });

      const data = await response.json(); // Изменено с result на data
      console.log("Ответ от сервера:", data); 

      // Обработка ответа от сервера
      if (data.success) { 
        localStorage.setItem('authToken', data.token); 
        localStorage.setItem('authUsername', data.name); // Сохраняем имя пользователя
        localStorage.setItem('authPassword', data.password); // Сохраняем пароль
        console.log('Токен сохранен:', data.token);
        console.log('Имя пользователя сохранено:', data.name);
        console.log('Пароль сохранен:', data.password);
          document.getElementById("result").innerText = "Успешный вход!";
window.parent.postMessage( 'closeForm' , '*');

      } else {
          document.getElementById("result").innerText = "Неправильный логин или пароль.";
      }

  } catch (error) {
      console.error("Ошибка:", error);
      document.getElementById("result").innerText = "Ошибка при выполнении запроса: "+error.message;
  }
});








document.addEventListener('DOMContentLoaded', () => {
  const checkButton = document.getElementById('check');

  if (checkButton) {
      checkButton.addEventListener('click', async () => {
          const username = document.getElementById("username").value;
          const password = document.getElementById("passwords").value;
          const car = document.getElementById("car").value;
          const phone = document.getElementById("phone").value;
          const passport = document.getElementById("passport").value;

          if (!username || !password || !car || !phone || !passport) {
              document.getElementById("errorMessage").innerText = "Пожалуйста, заполните все поля.";
              document.getElementById("successMessage").innerText = "";
              return;
          }
          const phonePattern = /^\+375(25|29|33|44)\d{7}$/;
          if (!phonePattern.test(phone)) {
            document.getElementById("errorMessage").innerText = "Неверный формат!";
            document.getElementById("successMessage").innerText = "";
            return;
        }
        const pattern = /^[A-Z]{2}\d{7}$/;
        if (!pattern.test(passport)) {
          document.getElementById("errorMessage").innerText = "Неверный формат!";
          document.getElementById("successMessage").innerText = "";
          return;
      }
      const patterncar = /^[1-7][A-Z]{2}\d{7}$/;
      if (!patterncar.test(car)) {
        document.getElementById("errorMessage").innerText = "Неверный формат!";
        document.getElementById("successMessage").innerText = "";
        return;
    }

          try {
              const response = await fetch('/register', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, phone, car, passport, password }),
              });

              const result = await response.json();

              if (response.ok) {
                  window.parent.postMessage('closeForm', '*');
                  localStorage.setItem('authToken', data.token); 
                  localStorage.setItem('authUsername', data.name); // Сохраняем имя пользователя
                  localStorage.setItem('authPassword', data.password); // Сохраняем пароль
                  console.log('Токен сохранен:', data.token);
                  console.log('Имя пользователя сохранено:', data.name);
                  console.log('Пароль сохранен:', data.password);
                  document.getElementById("successMessage").innerText = result.message || "Регистрация успешна!";
                  document.getElementById("errorMessage").innerText = "";
              } else {
                  document.getElementById("errorMessage").innerText = result.error || "Ошибка регистрации.";
                  document.getElementById("successMessage").innerText = "";
              }
          } catch (error) {
              console.error('Ошибка:', error);
              document.getElementById("errorMessage").innerText = 'Ошибка при подключении к серверу';
              document.getElementById("successMessage").innerText = "";
          }
      });
  } else {
      console.error("Кнопка с ID 'check' не найдена в DOM.");
  }
});







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
          const usernameInput = document.getElementById('name');
          const passwordInput = document.getElementById('password');

          if (usernameInput) {
              usernameInput.value = data.user.name ; // Заполняем имя пользователя
          }
          if (passwordInput) {
              passwordInput.value = data.user.password ; // Заполняем пароль (если передаётся)
          }
      }
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
} else {
    console.log('Токен не найден, пользователь не авторизован');
}