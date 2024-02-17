/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  daisyui: {
    themes: [
      {
        light: {
          ...require("./node_modules/daisyui/src/theming/themes")[
            "[data-theme=light]"
          ],
          accent: "green",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
