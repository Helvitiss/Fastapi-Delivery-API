import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#F59E0B', // amber-500
                    dark: '#D97706',    // amber-600
                    light: '#FCD34D',   // amber-300
                },
                sidebar: {
                    bg: '#1C1C2E',
                    text: '#9CA3AF',
                    active: '#FFFFFF',
                }
            },
            backgroundColor: {
                page: '#F9FAFB',
                card: '#FFFFFF',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

export default config
