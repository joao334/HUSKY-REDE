export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                husky: {
                    blue: '#3b6da6',
                    sky: '#577fac',
                    beige: '#edd8ab',
                    cream: '#f5f5f0',
                    brown: '#5f442e',
                    cocoa: '#332419',
                    blush: '#f7b7a3',
                    mint: '#8abf9f',
                },
            },
            boxShadow: {
                soft: '0 16px 50px rgba(59, 109, 166, 0.14)',
                card: '0 12px 30px rgba(51, 36, 25, 0.08)',
            },
            borderRadius: {
                brand: '8px',
            },
            animation: {
                floaty: 'floaty 5s ease-in-out infinite',
                paw: 'paw 360ms ease-out',
                shimmer: 'shimmer 1.5s linear infinite',
            },
            keyframes: {
                floaty: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                paw: {
                    '0%': { transform: 'scale(1) rotate(0deg)' },
                    '55%': { transform: 'scale(1.22) rotate(-8deg)' },
                    '100%': { transform: 'scale(1) rotate(0deg)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-500px 0' },
                    '100%': { backgroundPosition: '500px 0' },
                },
            },
        },
    },
    plugins: [],
};
