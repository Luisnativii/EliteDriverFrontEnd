/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './index.html',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"], 
      },
       fontSize: {
        h1: "var(--h1)",
        h2: "var(--h2)",
        h3: "var(--h3)",
        h4: "var(--h4)",
        txt: "var(--txt)",
        "txt-sm": "var(--txt-sm)",
      },
      borderRadius: {
        sm: "var(--border-radius-sm)",
        md: "var(--border-radius-md)",
        lg: "var(--border-radius-lg)",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 10px rgba(0,0,0,0.5)", // Color muy marcado de prueba
      },
      spacing: {
        "sidebar-width": "var(--sidebar-width)",
        "header-height": "var(--header-height)",
        "card-padding": "var(--card-padding)",
      },
      colors: {
        primary: {
          light: "#f3eee8",  // Crema
          DEFAULT: "#dcac38", // Mostaza
          dark: "#b96c38",    // Naranja quemado
        },
        secondary: {
          light: "#ac989f",  // Malva
          DEFAULT: "#7a4a29", // Marrón oscuro
          dark: "#3a3331",   // Marrón muy oscuro
        },
        accent: {
          light: "#44436c",  // Azul marino claro
          DEFAULT: "#393e5a", // Azul profundo
          dark: "#595858",   // Gris oscuro
        },
        neutral: {
          light: "#f3eee8", // Crema claro
          DEFAULT: "#89786e", // Taupe
          dark: "#3a3331",  // Marrón oscuro
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
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
    },
  },
  plugins: [],
}