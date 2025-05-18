import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode';

export interface DiscordUser {
  id: string
  username: string
  nick?: string
  avatar: string | null
  canEdit: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as DiscordUser | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async loginWithCode(code: string) {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        })

        if (!res.ok) throw new Error('Failed to login')

        const data = await res.json()
        this.token = data.token
        this.user = jwtDecode<DiscordUser>(data.token);


        localStorage.setItem('authToken', this.token ?? '')
      } catch (err: any) {
        this.error = err.message || 'Login failed'
        this.user = null
        this.token = null
        localStorage.removeItem('authToken')
      } finally {
        this.loading = false
      }
    },

    loadUserFromStorage() {
      const stored = localStorage.getItem('authToken')
      if (!stored) return
      try {
        this.token = stored
        this.user = jwtDecode<DiscordUser>(stored)

      } catch {
        this.token = null
        this.user = null
        localStorage.removeItem('authToken')
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('authToken')
    }
  }
})
