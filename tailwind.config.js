// tailwind.config.js
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    corePlugins: {
        preflight: false, // disables Tailwind base resets
    },
    theme: {
        extend: {},
    },
    plugins: [],
};
