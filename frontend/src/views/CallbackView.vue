<script lang="ts" setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    await auth.loginWithCode(code);
  }

  // Redirect after login attempt (success or fail)
  router.replace('/loot');
});
</script>

<template>
  <!-- nothing -->
</template>
