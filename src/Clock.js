export default class Clock extends HTMLElement {
  #intervalCallback;
  #intervalId = 0;

  constructor() {
    super();
    this.#intervalCallback = () => {
      const time = this.querySelector("time");
      const date = new Date();
      time.dateTime = date.toISOString();
      time.textContent = date.toISOString().slice(11, 19);
    };
  }

  connectedCallback() {
    if (!this.#intervalId) {
      this.#intervalCallback();
      this.#intervalId = setInterval(this.#intervalCallback, 1000);
    }
  }

  disconnectedCallback() {
    clearInterval(this.#intervalId);
  }
}
