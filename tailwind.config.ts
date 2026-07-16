import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@uploadthing/react/dist/**/*.js'
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "surface-container": "#f9eaf1",
        "secondary": "#5b5d73",
        "on-background": "#21191e",
        "on-secondary-container": "#616379",
        "on-tertiary-fixed-variant": "#404c14",
        "inverse-primary": "#ffabed",
        "background": "#fff7f9",
        "on-surface": "#21191e",
        "primary": "#3a0036",
        "tertiary": "#171f00",
        "inverse-surface": "#362e33",
        "surface-variant": "#eddfe6",
        "surface-container-low": "#fef0f7",
        "surface-bright": "#fff7f9",
        "tertiary-fixed": "#daeaa1",
        "surface-container-lowest": "#ffffff",
        "error-container": "#ffdad6",
        "surface": "#fff7f9",
        "outline": "#83727d",
        "primary-fixed-dim": "#ffabed",
        "surface-tint": "#933d87",
        "on-tertiary-fixed": "#171e00",
        "primary-fixed": "#ffd7f2",
        "inverse-on-surface": "#fcedf4",
        "on-error-container": "#93000a",
        "surface-container-highest": "#eddfe6",
        "on-primary-fixed": "#390035",
        "secondary-container": "#e0e0fb",
        "secondary-fixed": "#e0e0fb",
        "on-error": "#ffffff",
        "primary-container": "#5c0656",
        "on-tertiary": "#ffffff",
        "surface-dim": "#e4d6dd",
        "secondary-fixed-dim": "#c4c4de",
        "tertiary-fixed-dim": "#bece88",
        "on-primary-container": "#d778c6",
        "on-surface-variant": "#51434c",
        "on-secondary-fixed": "#181a2d",
        "on-secondary": "#ffffff",
        "tertiary-container": "#2a3500",
        "error": "#ba1a1a",
        "on-tertiary-container": "#919f5e",
        "on-primary-fixed-variant": "#76246e",
        "surface-container-high": "#f3e4eb",
        "on-secondary-fixed-variant": "#44455b",
        "outline-variant": "#d5c1cd",
        "on-primary": "#ffffff",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
