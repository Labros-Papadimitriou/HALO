<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const code = ref('')
const error = ref(false)
const showInput = ref(false)

const emit = defineEmits(['enter'])

function tryUnlock() {
  if (code.value.toLowerCase().trim() === 'isuckxepperballs') {
    const expiration = Date.now() + 1000 * 60 * 60 * 24
    localStorage.setItem('unlocked', JSON.stringify({ value: true, expiresAt: expiration }))
    error.value = false
    emit('enter')
    router.push('/loot')
  } else {
    error.value = true
  }
}
</script>

<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
    <!-- Background image -->
    <img
      src="/abso.jpg"
      alt="Background"
      class="absolute top-0 left-0 w-full h-full object-contain object-center z-0"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10"></div>

    <!-- Title and Input -->
    <div class="absolute top-10 z-20 text-center">
      <h1
        class="text-9xl font-black text-white drop-shadow-glow animate-fade-in mb-6 cursor-pointer hover:text-blue-500 transition"
        @click="showInput = true"
      >
        HALO
      </h1>

      <transition name="fade">
        <div v-if="showInput">
          <input
            v-model="code"
            @keyup.enter="tryUnlock"
            class="px-4 py-2 rounded text-center text-lg outline-none transition duration-300"
            :class="[
              error ? 'ring-2 ring-red-500' : '',
              'bg-[#1e1f22]/10 text-[#1e1f22]/50 border border-[#1e1f22]/20'
            ]"
          />

          <p v-if="error" class="text-red-400 mt-2 animate-fade-in"></p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fade-in 1s ease-out both;
}

.drop-shadow-glow {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
}
</style>
