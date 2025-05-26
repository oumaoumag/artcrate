module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          900: '#581c87',
          800: '#7c3aed',
        },
        orange: {
          900: '#9a3412',
          800: '#ea580c',
          500: '#f97316',
          400: '#fb923c',
          300: '#fdba74',
          200: '#fed7aa',
        },
        yellow: {
          500: '#eab308',
          400: '#facc15',
          300: '#fde047',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
