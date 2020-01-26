import { addClass } from './common/plugins'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.color').forEach(el => {
    el.style.backgroundColor = el.textContent
    addClass(el, 'rounded')
  })
})
