/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                // We'll set the actual fonts after design direction is chosen
                sans: ['var(--font-sans)', 'system-ui'],
                display: ['var(--font-display)', 'system-ui'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            colors: {
                // Semantic tokens — all driven by CSS variables
                // so switching themes is one file change
                background: {
                    DEFAULT: 'var(--color-bg)',
                    secondary: 'var(--color-bg-secondary)',
                    tertiary: 'var(--color-bg-tertiary)',
                },
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    hover: 'var(--color-surface-hover)',
                    active: 'var(--color-surface-active)',
                },
                border: {
                    DEFAULT: 'var(--color-border)',
                    strong: 'var(--color-border-strong)',
                },
                text: {
                    DEFAULT: 'var(--color-text)',
                    secondary: 'var(--color-text-secondary)',
                    tertiary: 'var(--color-text-tertiary)',
                    inverse: 'var(--color-text-inverse)',
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    hover: 'var(--color-accent-hover)',
                    subtle: 'var(--color-accent-subtle)',
                    text: 'var(--color-accent-text)',
                },
                // Status colours — used on kanban badges
                status: {
                    wishlist: 'var(--color-status-wishlist)',
                    applied: 'var(--color-status-applied)',
                    phone: 'var(--color-status-phone)',
                    interview: 'var(--color-status-interview)',
                    offer: 'var(--color-status-offer)',
                    rejected: 'var(--color-status-rejected)',
                    withdrawn: 'var(--color-status-withdrawn)',
                    ghosted: 'var(--color-status-ghosted)',
                },
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
            },
            boxShadow: {
                card: 'var(--shadow-card)',
                elevated: 'var(--shadow-elevated)',
                glow: 'var(--shadow-glow)',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.25s ease-out',
            },
            keyframes: {
                fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
                slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
                slideInRight: { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
            },
        },
    },
    plugins: [],
};