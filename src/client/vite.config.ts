import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
            },
        }),
    ],
	server: {
		proxy: {
			"/api": {
				target: "http://192.168.1.9:8080",
			},
		},
	},
});
