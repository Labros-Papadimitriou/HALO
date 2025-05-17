<script setup lang="ts">
const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);

const loginWithDiscord = () => {
  const discordUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify%20guilds.members.read`;
  window.location.href = discordUrl;
};
</script>

<template>
  <div class="min-h-screen bg-[#1e1f22] text-white flex flex-col justify-center items-center px-4 animate-fade-in">
    <h1 class="text-5xl font-extrabold mb-8 drop-shadow-glow tracking-wide">HALO</h1>

    <button
      @click="loginWithDiscord"
      class="flex items-center gap-3 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-200 text-white font-semibold rounded-xl shadow-md hover:shadow-lg"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-white" viewBox="0 0 245 240">
        <path
          d="M104.4 104.3c-5.7 0-10.2 5-10.2 11.1s4.5 11.1 10.2 11.1 10.2-5 10.2-11.1c.1-6.1-4.5-11.1-10.2-11.1zm36.2 0c-5.7 0-10.2 5-10.2 11.1s4.5 11.1 10.2 11.1 10.2-5 10.2-11.1-4.5-11.1-10.2-11.1z"
        />
        <path
          d="M222.5 0H22.5C10.1 0 0 10.1 0 22.5v195c0 12.4 10.1 22.5 22.5 22.5h165.5l-7.8-27.2 18.8 17.4 17.9 16.6 31.8-22.5V22.5c.1-12.4-10-22.5-22.4-22.5zM163.8 172s-5.3-6.3-9.7-11.8c19.3-5.4 26.6-17.4 26.6-17.4-6 4-11.7 6.8-16.8 8.7-7.3 3.1-14.3 5.1-21.1 6.3-14 2.6-26.8 1.9-37.8-.1-8.3-1.6-15.4-3.9-21.3-6.3-3.3-1.3-6.9-3-10.5-5.2-.4-.2-.8-.4-1.2-.6-.3-.2-.4-.3-.6-.4-2.7-1.5-4.2-2.5-4.2-2.5s7.1 11.8 25.9 17.3c-4.4 5.6-9.8 12.1-9.8 12.1-32.4-1-44.7-22.3-44.7-22.3 0-47.2 21.1-85.5 21.1-85.5 21.1-15.8 41.1-15.3 41.1-15.3l1.5 1.8c-26.4 7.6-38.6 19.2-38.6 19.2s3.2-1.8 8.6-4.2c15.6-6.9 28-8.7 33.1-9.2.8-.1 1.5-.2 2.3-.2 8.2-1.1 17.4-1.4 27-.1 12.7 1.5 26.4 5.3 40.4 13.1 0 0-11.6-11-36.6-18.6l2.1-2.4s20-.5 41.1 15.3c0 0 21.1 38.3 21.1 85.5 0-.1-12.5 21.3-44.9 22.3z"
        />
      </svg>
      <span>Login with Discord</span>
    </button>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.drop-shadow-glow {
  text-shadow: 0 0 10px rgba(88, 101, 242, 0.8);
}
</style>
