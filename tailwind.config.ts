
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(240 3.7% 15.9%)',
        input: 'hsl(240 3.7% 15.9%)',
        ring: 'hsl(240 4.9% 83.9%)',
        background: '#0a0a0a',
        foreground: '#f5f5f5',
        primary: {
          DEFAULT: '#9b87f5',
          foreground: '#0a0a0a'
        },
        secondary: {
          DEFAULT: '#7E69AB',
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#6E59A5',
          foreground: '#ffffff'
        },
        destructive: {
          DEFAULT: 'hsl(0 62.8% 30.6%)',
          foreground: '#f5f5f5'
        },
        muted: {
          DEFAULT: '#222',
          foreground: '#8E9196'
        },
        popover: {
          DEFAULT: '#1A1F2C',
          foreground: '#f5f5f5'
        },
        card: {
          DEFAULT: '#1A1F2C',
          foreground: '#f5f5f5'
        },
        dark: {
          DEFAULT: '#0a0a0a',
          foreground: '#f5f5f5'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
