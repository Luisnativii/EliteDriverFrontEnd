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
          light: "#FFFFFF",        // Blanco (para hover en botón)
          DEFAULT: "#FF0202",      // Rojo botón
          dark: "#C10000",         // Opcional: rojo más oscuro si necesitas
        },
        secondary: {
          light: "#E0E0E0",        // Opcional: gris claro  para secciones 
          DEFAULT: "#4E504D",      // Fondo gris para secciones (usa este es el principal)
          dark: "#2B2C2B",         // Gris más oscuro si necesitas
        },
        accent: {
          light: "#FFB6B6", // Rosa claro estos por si lo usas
          DEFAULT: "#FF0202", // Rojo brillante para el boton
          dark: "#B20000",  // Rojo oscuro estos por si lo usas
        },
        neutral: {
          light: "#FFFFFF",        // Texto blanco (para seccion con gris)
          DEFAULT: "#000000",      // Texto negro (para seccion con imagen y con blanco)
          dark: "#4E504D",         //  gris si quieres usarlo
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