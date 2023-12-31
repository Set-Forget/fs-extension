/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.html', './src/**/*.{js,ts,jsx,tsx}'],
    safelist: [/^CodeMirror/],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                oceanBlue: {
                    50: '#EBEFFF',
                    100: '#D6DFFF',
                    200: '#B3C3FF',
                    300: '#8AA3FF',
                    400: '#6687FF',
                    500: '#3E68FF',
                    600: '#0037FF',
                    700: '#0029BD',
                    800: '#001C80',
                    900: '#000D3D'
                },
                emeraldGreen: {
                    50: '#EDFDF5',
                    100: '#DAFBEB',
                    200: '#BAF8DA',
                    300: '#95F4C6',
                    400: '#70F0B2',
                    500: '#4DEC9F',
                    600: '#18E280',
                    700: '#12AA61',
                    800: '#0C7341',
                    900: '#06371F'
                },
                simplyRed: {
                    50: '#FEECEC',
                    100: '#FDD8D8',
                    200: '#FBB6B6',
                    300: '#F99090',
                    400: '#F76E6E',
                    500: '#F54848',
                    600: '#F20D0D',
                    700: '#B30A0A',
                    800: '#790707',
                    900: '#3A0303'
                },
                gothamBlack: {
                    50: '#E8E8E8',
                    100: '#D1D1D1',
                    200: '#A3A3A3',
                    300: '#787878',
                    400: '#4A4A4A',
                    500: '#1C1C1C',
                    600: '#171717',
                    700: '#121212',
                    800: '#0A0A0A',
                    900: '#050505'
                },
                fsblack: '#0E100F',
                fswhite: '#FFFCF3',
                fsgreen: '#3F9E53',
                fsapple: '#ABFF84',
                backgroundImage: {
                    'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                    'gradient-conic':
                        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                    'green-gradient': 'linear-gradient(45deg, #3F9E53 40%, #ABFF84 60%)'
                },
                backgroundClip: {
                    text: 'text'
                },
                keyframes: {
                    grow: {
                        '0%': { transform: 'scale(0)' },
                        '100%': { transform: 'scale(1)' },
                    },
                },
                animation: {
                    grow: 'grow 1s cubic-bezier(0.25, 0.1, 0.25, 1) 1s forwards',
                },
            }
        }
    },
    plugins: []
}
