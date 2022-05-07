const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const main = $('#toast')

const toast = {
  show: function({
    title = '',
    body = '',
    type = 'info',
    duration = 3000
  }) {
    if (main) {
      const toast = document.createElement('div')
      const typeClass = `toast--${type}`
      const icons = {
        success: 'fa-solid fa-circle-check',
        info: 'fa-solid fa-circle-info',
        warning: 'fa-solid fa-circle-exclamation'
      }
      const icon = icons[type]
      const time = duration / 1000
      const timeOut = 1
      
      toast.classList.add('toast')
      toast.classList.add(typeClass)
      toast.style.animation = `slideInLeft ease .3s, fadeOut linear ${timeOut}s ${time}s forwards`
      toast.innerHTML = `
        <div class="toast__icon">
          <i class="${icon}"></i>
        </div>
        <div class="toast__body">
          <h3 class="toast__title">${title}</h3>
          <p class="toast__msg">${body}</p>
        </div>
        <div class="toast__close">
          <i class="fa-solid fa-xmark"></i>
        </div>
      `
      const timeoutId = this.autoRemove(toast, duration + timeOut * 1000)
      this.handleEvent(toast, timeoutId)

      main.appendChild(toast)
    }
  },
  autoRemove: function(toast, duration) {
    return setTimeout(() => {
      main.removeChild(toast)
    }, duration)
  },
  handleEvent: function(toast, id) {
    toast.onclick = function(e) {
      const close = e.target.closest('.toast__close')
      if (close) {
        main.removeChild(toast)
        clearTimeout(id)
      }
    }
  }
}