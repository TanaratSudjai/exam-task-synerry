/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                kanit: ['var(--font-kanit)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}