import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import typescript2 from 'rollup-plugin-typescript2'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    }),
    typescript2({
      check: false,
      exclude: [
        'vite.config.ts'
      ]
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'waltz-tailwind-layout',
      formats: [
        'es'
      ]
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.ts')
      },
      output: {
        exports: 'named'
      },
      external: [
        'vue',
        'vue-router',
        /@waltz-ui\/ui/,
        /@waltz-ui\/web/
      ]
    },
  },
})
