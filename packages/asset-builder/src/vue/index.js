import Vue from 'vue'
import App from './components/App.vue'

document.addEventListener('DOMContentLoaded', () => {
  /* eslint-disable-next-line no-new */
  new Vue({
    el: document.querySelector('.vue-app'),
    render: h => h(App)
  })
})
