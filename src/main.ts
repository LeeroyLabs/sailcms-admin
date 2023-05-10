/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Components
import App from './App.vue';

// Composable
import { createApp } from 'vue';

// Style
import './css/main.scss'

// Plugins
import { registerPlugins } from '@/plugins';

// Event Bus
import mitt from 'mitt';
const emitter = mitt();

const app = createApp(App);

app.provide('emitter', emitter);

registerPlugins(app);
app.mount('#app');
