/**
 * Componente Toast accesible y ligero para notificaciones de interacción
 */
class ToastManager {
  constructor() {
    this.container = null;
    this.timeoutId = null;
  }

  ensureContainer() {
    if (!this.container && typeof document !== 'undefined') {
      this.container = document.getElementById('toastNotification');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toastNotification';
        this.container.className = 'toast-notification d-none';
        this.container.setAttribute('role', 'status');
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
      }
    }
    return this.container;
  }

  show(message, duration = 3000) {
    const el = this.ensureContainer();
    if (!el) return;

    clearTimeout(this.timeoutId);
    el.textContent = message;
    el.classList.remove('d-none');
    el.classList.add('show');

    this.timeoutId = setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.classList.add('d-none'), 300);
    }, duration);
  }
}

export const toast = new ToastManager();
