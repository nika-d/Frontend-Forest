import path from 'path'
import vue from '@vitejs/plugin-vue'

export default {
    plugins: [vue()],
    test: {
        globals: true,
    },
    resolve: {
        alias: {
            $src: path.resolve(__dirname, './src'),
            $test: path.resolve(__dirname, './test'),
        },
    },
}
