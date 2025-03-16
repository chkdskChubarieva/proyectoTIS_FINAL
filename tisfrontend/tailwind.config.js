/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
    "./storage/framework/views/*.php",
    "./src/**/*.blade.php",
    "./src/**/*.js",
    "./src/**/*.jsx",
    "./src/**/*.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        NunitoSans: ["NunitoSans", "sans-serif"],
      },

      colors: {
        primary: {
          100: "#ccd4db",
          200: "#99aab7",
          300: "#667f94",
          400: "#335570",
          500: "#002a4c",
          600: "#00223d",
          700: "#00192e",
          800: "#00111e",
          900: "#00080f",
        },
      },
      width: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
        176: "44rem",
        192: "48rem",
        208: "52rem",
        224: "56rem",
        240: "60rem",
        256: "64rem",
        288: "72rem",
        320: "80rem",
        384: "96rem",
      },
    },
  },
  plugins: [],
};
