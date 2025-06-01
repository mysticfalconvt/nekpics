/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {},
    },
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                autumn: {
                    "primary": "#f97316",
                    "secondary": "#f59e0b",
                    "accent": "#37cdbe",
                    "neutral": "#3d4451",
                    "base-100": "#ffffff",
                    "base-200": "#f3f4f6",
                    "base-300": "#e5e7eb",
                    "info": "#3abff8",
                    "success": "#36d399",
                    "warning": "#fbbd23",
                    "error": "#f87272",
                },
                sunset: {
                    "primary": "#f97316",
                    "secondary": "#f59e0b",
                    "accent": "#37cdbe",
                    "neutral": "#1f2937",
                    "base-100": "#111827",
                    "base-200": "#1f2937",
                    "base-300": "#374151",
                    "info": "#3abff8",
                    "success": "#36d399",
                    "warning": "#fbbd23",
                    "error": "#f87272",
                }
            }
        ],
        base: true,
        styled: true,
        utils: true,
        prefix: "",
        logs: true,
        themeRoot: ":root",
    },
} 
