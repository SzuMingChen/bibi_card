import { createPinia } from 'pinia'
import { createApp } from 'vue'
import FailPopUp from '../src/components/FailPopUp.vue'

import App from './App.vue'
import './assets/base.scss'
import router from './router'


const app = createApp(App)
app.component('FailPopUp', FailPopUp);
app.use(createPinia())
app.use(router)
app.mount('#app')
