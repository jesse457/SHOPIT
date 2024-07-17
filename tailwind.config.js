/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        "node_modules/preline/dist/*.js",
    ],
    darkMode: ['selector', '[data-mode="dark"]'],
    theme: {
        fontFamily: {
            inter: ["Inter", "sans-serif"],
            sans: ['Poppins', 'sans-serif'],
        },
        fontWeight: {
            inter: 500, // Set the default font weight for the Inter font family to 500
        },
    },
    plugins: [require("preline/plugin")],
};
