import { createApp } from 'vue'
import App from '@/App.vue'
import '@/assets/main.css'
import router from '@/router'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import clickOutside from '@/directives/clickOutside'
import 'vue-multiselect/dist/vue-multiselect.css'

const app = createApp(App)

app.directive('click-outside', clickOutside)

const pinia = createPinia()

app.use(pinia)
app.use(router)

const auth = useAuthStore()
auth.loadUserFromStorage()

app.mount('#app')
