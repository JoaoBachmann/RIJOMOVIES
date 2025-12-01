import './assets/main.css';
import '@mdi/font/css/materialdesignicons.css';
import '@fortawesome/fontawesome-free/css/all.css'
import 'vue-loading-overlay/dist/css/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App) 
app.use(router) 
app.mount('#app') 
