import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * В widget-режиме инлайнит собранный CSS прямо в IIFE-бандл (post-process),
 * чтобы виджет распространялся одним JS-файлом.
 */
function inlineWidgetCss(): Plugin {
  return {
    name: 'padlhub-inline-widget-css',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist');
      const cssPath = resolve(outDir, 'trial-schedule.css');
      const jsPath = resolve(outDir, 'trial-schedule.js');
      if (!existsSync(cssPath) || !existsSync(jsPath)) return;

      const css = readFileSync(cssPath, 'utf8');
      const js = readFileSync(jsPath, 'utf8');
      const injector = `try{var s=document.createElement('style');s.id='padlhub-trial-schedule-css';s.textContent=${JSON.stringify(
        css,
      )};(document.head||document.documentElement).appendChild(s);}catch(e){}\n`;

      // Убираем дублирующую вставку, если пересобираем.
      const cleaned = js.replace(
        /^try\{var s=document\.createElement\('style'\);s\.id='padlhub-trial-schedule-css'[\s\S]*?\}catch\(e\)\{\}\n/,
        '',
      );
      writeFileSync(jsPath, injector + cleaned, 'utf8');
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isWidget = mode === 'widget';

  return {
    plugins: [react(), ...(isWidget ? [inlineWidgetCss()] : [])],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: process.env.VITE_API_PROXY || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    // Standalone-сборка встраиваемого виджета: один IIFE-бандл с инлайн-CSS.
    build: isWidget
      ? {
          lib: {
            entry: resolve(__dirname, 'src/widget-entry.ts'),
            name: 'PadlhubTrialScheduleWidget',
            fileName: () => 'trial-schedule.js',
            formats: ['iife'],
          },
          cssCodeSplit: false,
          rollupOptions: {
            output: {
              assetFileNames: 'trial-schedule[extname]',
            },
          },
        }
      : undefined,
  };
});
