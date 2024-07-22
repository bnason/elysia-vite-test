import { createSSRApp } from 'vue'

import App from './App.vue'

export function createApp() {
	// Create Vue App
	const app = createSSRApp(App)

	return { app }
}
