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


