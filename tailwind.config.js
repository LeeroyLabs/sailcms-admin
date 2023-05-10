/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,vue}'
    ],
    prefix: 'tw-',
    theme: {
        fontFamily: {
            'body': ['Roboto', 'Sans-Serif']
        },
        extend: {
            colors: {
                primary: '#52688F',
                secondary: '#7391C8'
            }
        }
    },
    plugins: []
};

