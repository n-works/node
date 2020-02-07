<template>
  <div class="app">
    <btn label="Check User Agent" @click="checkUserAgent"></btn>
    <p class="user-agent">
      {{ userAgent }}
    </p>
    <div class="wordpress"></div>
  </div>
</template>

<script>
import Btn from './Btn.vue'

module.exports = {
  components: {
    Btn
  },
  data () {
    return {
      userAgent: null
    }
  },
  methods: {
    checkUserAgent () {
      this.userAgent = navigator.userAgent
    }
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
}

.user-agent {
  min-height: 2em;
  color: var(--green-dark);
  font-size: var(--small);
}
</style>
