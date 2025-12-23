import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const backendURL = env.VITE_API_PROD_BACKEND;
  const frontendURL = env.VITE_API_LOCAL_FRONTEND;


  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,

          runtimeCaching: [
            {
              urlPattern: ({ request }) =>
                request.destination === "video",
              handler: "NetworkOnly",
            },
          ],
        },
        manifest: {
          name: "VRNexGen Learn",
          short_name: "VRX Learn",
          theme_color: "#840227",
          background_color: "#FFFBF0",
          display: "standalone",
          start_url: "/",
          scope: "/",
          description:
            "A smart online learning platform with daily learning reminders.",
          icons: [
            {
              src: "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      })
    ],
    resolve: {
      alias: {
        url: 'node:url',
      },
    },
    server: {
      allowedHosts: [backendURL, frontendURL],
      port: 5173,
      open: true,
      host: true,
    },

    preview: {
      host: true,
      port: 5173,
    }
  });
};
