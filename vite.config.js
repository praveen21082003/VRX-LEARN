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
        strategies: "injectManifest",
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        srcDir: "src",
        filename: "sw.js",
        manifest: {
          "name": "VRNexGen Learn",
          "short_name": "VRX learn",
          "theme_color": "#840227",
          "background_color": "#FFFBF0ff",
          "display": "standalone",
          "orientation": "any",
          "scope": "/",
          "start_url": "/",
          "description": "A smart and fast online learning platform designed to deliver courses, videos with a seamless app-like experience across all devices.",
          "icons": [
            {
              "src": "icons/icon-192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "icons/icon-512.png",
              "sizes": "512x512",
              "type": "image/png"
            }
          ]
        }
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
