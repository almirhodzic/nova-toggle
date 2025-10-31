import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
            entry: 'resources/js/field.js',
            name: 'field',
            formats: ['iife'],
            fileName: () => 'js/field.js',
        },
        rollupOptions: {
            external: [
                'vue',
                '@/mixins', // <- NEU
                'laravel-nova-ui', // <- NEU
            ],
            output: {
                globals: {
                    vue: 'Vue',
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'css/field.css';
                    return assetInfo.name;
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(
                __dirname,
                '../../vendor/laravel/nova/resources/js',
            ),
        },
    },
});
