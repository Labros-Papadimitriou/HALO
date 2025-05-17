import { defineStore } from 'pinia';

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  canEdit: boolean;
  nick: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as DiscordUser | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async loginWithCode(code: string) {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch('http://localhost:3001/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) throw new Error('Failed to login');

        const data = await res.json();
        this.user = data;
        localStorage.setItem('authUser', JSON.stringify(data))
      } catch (err: any) {
        this.error = err.message || 'Login failed';
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    loadUserFromStorage() {
      const raw = localStorage.getItem('authUser')
      if (!raw) return
      try {
        const data = JSON.parse(raw)
        this.user = data
      } catch {
        this.user = null
        localStorage.removeItem('authUser')
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('authUser')
    }
  },
});
