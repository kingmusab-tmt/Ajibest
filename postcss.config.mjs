/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // ✅ new Tailwind v4 plugin
    autoprefixer: {},
  },
};

export default config;
