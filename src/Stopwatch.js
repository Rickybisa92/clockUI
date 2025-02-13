export default class Stopwatch extends HTMLElement {
  #intervalCallback;
  #intervalId = 0;

  constructor() {
    super();
    this.addEventListener("click", this);
    this.#intervalCallback = () => {
      const time = this.querySelector("time");
      const ms = new Date() - new Date(this.startTime);
      time.dateTime = `PT${ms / 1000}S`;
      time.textContent = new Date(ms).toISOString().slice(11, 22);
    };
    
    // Esperar a que el DOM cargue antes de agregar eventos
    setTimeout(() => {
      const toggleSwitch = this.querySelector("#toggleSwitch");
      const slider = this.querySelector(".slider");
      
      if (toggleSwitch) {
        toggleSwitch.addEventListener("change", (event) => {
          if (event.target.checked) {
            console.log("Cronómetro iniciado"); // Depuración
            this.start();
          } else {
            console.log("Cronómetro pausado"); // Depuración
            this.pause();
          }
        });

        // Habilitar accesibilidad con teclado en el slider
        if (slider) {
          slider.setAttribute("tabindex", "0");

          slider.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleSwitch.checked = !toggleSwitch.checked;
              toggleSwitch.dispatchEvent(new Event("change", { bubbles: true }));
            }
          });
        }
      }
    }, 0);
  }
  
  static get observedAttributes() {
    return ["paused", "start-time"];
  }

  get paused() {
    return this.hasAttribute("paused");
  }

  set paused(value) {
    this.toggleAttribute("paused", Boolean(value));
  }

  get startTime() {
    return this.getAttribute("start-time");
  }

  set startTime(value) {
    this.setAttribute("start-time", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (
      (name === "paused" && newValue != null) ||
      (name === "start-time" && !newValue)
    ) {
      clearInterval(this.#intervalId);
      this.#intervalId = 0;
    } else if (name === "start-time" && newValue && !this.#intervalId) {
      this.#intervalId = setInterval(this.#intervalCallback, 10);
    }
  }

  connectedCallback() {
    if (!this.paused && this.startTime && !this.#intervalId) {
      this.#intervalId = setInterval(this.#intervalCallback, 10);
    }
  }

  disconnectedCallback() {
    clearInterval(this.#intervalId);
  }

  handleEvent(event) {
    const { classList } = event.target;
    if (classList.contains("pause")) {
      this.pause();
    } else if (classList.contains("restart")) {
      this.restart();
    } else if (classList.contains("start")) {
      this.start();
    }
  }

  pause() {
    this.paused = true;
  }

  restart() {
    const time = this.querySelector("time");
    time.dateTime = "PT0S";
    time.textContent = "00:00:00.00";
    this.paused = false;
    this.startTime = "";
  }

  start() {
    const time = this.querySelector("time");
    time.dateTime = time.dateTime || "PT0S";
    this.paused = false;
    this.startTime = new Date(
      this.startTime
        ? new Date() - time.dateTime.match(/(\d+(:?\.\d+)?)S$/)[1] * 1000
        : new Date(),
    ).toISOString();
  }
}
