import config from './common/config.js'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.heading').textContent = config.title
})
