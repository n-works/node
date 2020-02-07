import config from './common/config.js'
import { addClass } from './common/plugins.js'

document.addEventListener('DOMContentLoaded', () => {
  document.title = config.title
  document.querySelectorAll('.color').forEach(el => {
    el.style.color = el.textContent
    addClass(el, 'circle')
  })
})
