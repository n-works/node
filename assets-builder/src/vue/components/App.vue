<template>
  <div class="app">
    <btn
      label="Check my UserAgent"
      @click="checkUserAgent"
    ></btn>
    <p class="user-agent">
      {{ userAgent }}
    </p>
  </div>
</template>

<script>
import Btn from './Btn'

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
  padding: 30px;
}

.userAgent {

}
</style>
