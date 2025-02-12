export default class Alarm extends HTMLElement {
  #intervalCallback;
  #intervalId = 0;
  alarmSound = new Audio("alarm.mp3"); // Asegúrate de tener el archivo "alarm.mp3" en la carpeta adecuada

  constructor() {
    super();
    this.addEventListener("click", this);
    this.duration = 60 * 1000;

    // Solicitar permiso para las notificaciones
    document.addEventListener("DOMContentLoaded", () => {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission !== "granted") {
            alert("No tienes permiso para recibir notificaciones.");
          }
        });
      }
    });

    this.#intervalCallback = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 8); // HH:MM

      console.log(`🕒 Comprobando hora: ${currentTime}`);

      this.alarms.forEach((alarm) => {
        if (!alarm.hasAttribute("active")) return; // Solo revisar alarmas activas

        const input = alarm.querySelector("input");
        const alarmTime = input.value; // HH:MM, cortamos los segundos

        console.log(`⏰ Alarma programada para: ${alarmTime}, Estado: ${alarm.hasAttribute("active") ? 'Activa' : 'Inactiva'}`);

        if (alarmTime === currentTime && !alarm.hasAttribute("ringing")) {
          alarm.setAttribute("ringing", ""); // Marcar como sonando
          console.log("🚀 La alarma está SONANDO");
          this.showNotification("⏰ ¡RING RING RING!", "Es hora de tu alarma 🎶");
          this.playAlarmSound(); // Reproducir sonido de alarma
        }
      });
    };
  }

  get alarms() {
    return [...this.querySelector(".items").children];
  }

  add() {
    const alarm = this.querySelector("template").content.cloneNode(true);
    this.querySelector(".items").appendChild(alarm);
  }

  connectedCallback() {
    if (!this.#intervalId) {
      this.#intervalId = setInterval(this.#intervalCallback, 1000);
    }
  }

  delete(alarm) {
    this.querySelector(".items").removeChild(alarm);
  }

  disconnectedCallback() {
    clearInterval(this.#intervalId);
  }

  handleEvent(event) {
    const { target } = event;
    const { classList } = target;

    if (classList.contains("add")) {
      this.add();
    } else if (classList.contains("delete")) {
      this.delete(this.alarms.find((alarm) => alarm.contains(target)));
    } else if (classList.contains("pause")) {
      this.pause(this.alarms.find((alarm) => alarm.contains(target)));
    } else if (classList.contains("start")) {
      this.start(this.alarms.find((alarm) => alarm.contains(target)));
    }
  }

  start(alarm) {
    if (this.alarms.includes(alarm)) {
      alarm.setAttribute("active", ""); // Activar alarma
      alarm.querySelector(".start").classList.add("active"); // Cambia el botón visualmente

      alert("⏰ Alarma activada"); // Muestra la alerta cuando se activa
    }
  }

  pause(alarm) {
    if (this.alarms.includes(alarm)) {
      alarm.removeAttribute("active"); // Desactivar alarma
      alarm.removeAttribute("ringing"); // Si estaba sonando, dejar de sonar
      alarm.querySelector(".start").classList.remove("active"); // Reset botón
      this.stopAlarmSound(); // Detener el sonido de la alarma
    }
  }

  showNotification(title, message) {
    // Verifica si las notificaciones están permitidas
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else {
      alert("Notificación bloqueada o no permitida."); // Alternativa si las notificaciones están bloqueadas
    }
  }

  playAlarmSound() {
    // Iniciar el sonido y hacerlo en bucle
    this.alarmSound.loop = true;
    this.alarmSound.play().catch((error) => {
      console.error("Error al reproducir el sonido de la alarma:", error);
    });
  }

  stopAlarmSound() {
    // Detener el sonido de la alarma
    this.alarmSound.pause();
    this.alarmSound.currentTime = 0;
  }
}
