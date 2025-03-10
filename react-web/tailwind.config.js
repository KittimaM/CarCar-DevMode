/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
  'node_modules/flowbite-react/lib/esm/**/*.js'
],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'),
  require('flowbite/plugin')
  ],
  daisyui: {
    themes: ["light"], // Set light theme globally
  },
};
