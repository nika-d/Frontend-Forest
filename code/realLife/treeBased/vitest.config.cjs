import path from 'path'
import vue from '@vitejs/plugin-vue'
import { quasar } from '@quasar/vite-plugin'

export default {
    plugins: [
        vue(),
        quasar({
            sassVariables: 'src/css/quasar.variables.scss',
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'setupQuasarPluginForVueTestUtils.ts',
        include: ['./test/vitest/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
            './test/vitest-original/**',
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            './src/config/**',
        ],
    },
    resolve: {
        alias: {
            $src: path.resolve(__dirname, './src'),
            $test: path.resolve(__dirname, './test'),
        },
    },
}
