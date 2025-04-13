import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createYmaps } from 'vue-yandex-maps';
import App from './App.vue';


const pinia = createPinia()
  .use(piniaPluginPersistedstate);

const app = createApp(App)
  .use(pinia)
  .use(createYmaps({
    apikey: import.meta.env.VITE_API_KEY,
    lang: 'ru_RU',
    strictMode: true
  }));

app.mount('#app');
