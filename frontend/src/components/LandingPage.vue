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

    <!-- Title (top center) -->
    <div class="absolute top-10 z-20 text-center">
      <h1
        class="text-9xl font-black text-white drop-shadow-glow animate-fade-in cursor-pointer hover:text-blue-500 transition"
        @click="$emit('enter')"
      >
        HALO
      </h1>
      <h2 class="text-4xl mt-2 font-semibold text-gray-200 drop-shadow-md animate-fade-in delay-200">
        Loot Council
      </h2>
    </div>
  </div>
</template>

  
<script setup lang="ts">
// Emits 'enter' to parent
</script>

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

.animate-fade-in {
  animation: fade-in 1s ease-out both;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-500 {
  animation-delay: 0.5s;
}

.drop-shadow-glow {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
}
</style>
