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
function init() {
  fetch('/data') // Fetch data from the server
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the response as JSON
      })
      .then(data => { // Use 'data' instead of 'result'
          console.log(data); // Log the parsed JSON data
          var myMap = new ymaps.Map('map', {
              center: [55.184220, 30.202880], // Center of the map
              zoom: 10, // Zoom level
              controls: ['zoomControl'] // Controls to display
          });

          // Adding markers to the map
          data.forEach(car => { // Use 'car' instead of 'result'
              var x = getRandomFloat(55.152610, 55.236919);
              var y = getRandomFloat(30.151679, 30.277329);
              var markerCoordinates = [x, y];
              var myPlacemark = new ymaps.Placemark(markerCoordinates, {
                  balloonContent: `${car.name}`
              }, {
                  preset: 'islands#icon', // Marker style
                  iconColor: '#ff0000' // Marker color
              });

              myMap.geoObjects.add(myPlacemark);
          });
      })
      .catch(error => console.error('Error fetching car data:', error));
}

function getRandomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(6));
}

ymaps.ready(init);
// script.js


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


