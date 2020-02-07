<template>
  <button class="btn" @click="$emit('click')">
    {{ label }}
  </button>
</template>

<script>
module.exports = {
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.btn {
  display: inline-block;
  padding: 20px 40px;
  color: white;
  font-weight: var(--bold);
  font-size: var(--medium);
  line-height: 1;
  background-color: var(--green);
  border: none;
  border-radius: 30px;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.btn:hover {
  background-color: var(--green-dark);
}

@media (560px <= width < 960px) {
  .btn {
    background-color: var(--green-dark);
  }
}
</style>
