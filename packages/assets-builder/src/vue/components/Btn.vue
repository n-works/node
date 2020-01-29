<template>
  <button
    class="btn"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<script>
module.exports = {
  props: {
    label: {
      type: String,
      default: 'Label'
    }
  }
}
</script>

<style scoped>
.btn {
  display: inline-block;
  padding: 15px 30px;
  color: var(--green-dark);
  font-weight: var(--bold);
  font-size: var(--medium);
  background-color: var(--green);
  border: none;
  border-radius: 30px;
}
</style>
