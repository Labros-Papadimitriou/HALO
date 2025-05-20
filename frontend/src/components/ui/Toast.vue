<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const fading = ref(false)

function showToast(msg: string, timeout = 4000) {
  message.value = msg
  visible.value = true
  fading.value = false

  setTimeout(() => {
    fading.value = true
    setTimeout(() => {
      visible.value = false
    }, 500)
  }, timeout)
}

defineExpose({ showToast })
</script>

<template>
  <div
    v-show="visible"
    class="fixed bottom-6 left-6 z-50 px-4 py-2 rounded shadow-lg text-white text-sm bg-indigo-500 transition-opacity duration-500"
    :class="{
      'opacity-100': !fading,
      'opacity-0': fading
    }"
  >
    {{ message }}
  </div>
</template>
