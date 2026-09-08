import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        agri: {
          50: "#f2f8f4",
          100: "#e1efe6",
          200: "#c4decb",
          300: "#99c4a6",
          400: "#69a37c",
          500: "#44855a",
          600: "#2f6b43",
          700: "#265436",
          800: "#20432c",
          900: "#1b3726",
          950: "#0e1f14",
        },
        harvest: {
          50: "#fdf8ee",
          100: "#faefd5",
          200: "#f4dcab",
          300: "#edc476",
          400: "#e4a73e",
          500: "#dc8d1e",
          600: "#c06e15",
          700: "#984e14",
          800: "#7c3e17",
          900: "#673417",
        },
        earth: {
          50: "#faf8f5",
          100: "#f4f0e9",
          200: "#e8dfd2",
          300: "#d7c7b2",
          400: "#c1aa8e",
          500: "#ad9070",
          600: "#9a7c5c",
          700: "#80634c",
          800: "#685141",
          900: "#554337",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
      }
    },
  },
  plugins: [],
};
export default config;
