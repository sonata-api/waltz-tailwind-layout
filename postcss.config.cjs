module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: {
      config: {
        prefix: 'tw-',
        darkMode: 'class',
        content: ['./**/*.vue'],
      },
    },
  },
}
