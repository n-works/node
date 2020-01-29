import { addClass } from './common/plugins'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.color').forEach(el => {
    el.style.color = el.textContent
    addClass(el, 'icon-circle')
  })
})
