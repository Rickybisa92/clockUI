import Alarm from "./Alarm.js";
import Clock from "./Clock.js";
import Stopwatch from "./Stopwatch.js";
import Timer from "./Timer.js";

customElements.define("x-alarm", Alarm);
customElements.define("x-clock", Clock);
customElements.define("x-stopwatch", Stopwatch);
customElements.define("x-timer", Timer);


const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.querySelector(".theme-toggle label");

// Modo oscuro predeterminado
if (localStorage.getItem("theme") === "light") {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
  themeToggle.checked = false;
  themeLabel.textContent = "🌙";  // Luna para el modo claro
} else {
  document.body.classList.add("dark-mode");
  themeToggle.checked = true;
  themeLabel.textContent = "☀️";  // Sol para el modo oscuro
}

// Cambiar tema al hacer clic
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    themeLabel.textContent = "☀️";  // Sol en el modo oscuro
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
    themeLabel.textContent = "🌙";  // Luna en el modo claro
    localStorage.setItem("theme", "light");
  }
});



// Solicita permiso para enviar notificaciones cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

// Función para comprobar la alarma
function checkAlarms() {
  const alarms = document.querySelectorAll(".alarms input[type='time']");
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Formato HH:MM

  alarms.forEach((alarm) => {
    if (alarm.value === currentTime) {
      showNotification("¡Alarma activada!", "Es hora de tu alarma 🎶");
      playAlarmSound();
    }
  });
}

// Función para mostrar una notificación
function showNotification(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else {
    alert(message); // Como alternativa si las notificaciones están bloqueadas
  }
}

// Función para reproducir sonido
function playAlarmSound() {
  const alarmSound = new Audio("alarm.mp3"); // Asegúrate de tener un archivo de sonido
  alarmSound.play();
}

// Revisar alarmas cada segundo
setInterval(checkAlarms, 1000);


