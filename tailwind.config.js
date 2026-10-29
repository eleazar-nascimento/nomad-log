/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#FF6838",
          DEFAULT: "#FF6838",
          dark: "#E65325",
        },
        adventure: {
          orange: "#FF6838",
          amber: "#F59E0B",
          emerald: "#10B981",
          sky: "#38BDF8",
          indigo: "#6366F1",
          purple: "#A855F7",
        },
        message: {
          green: "#10B981",
          red: "#EF4444",
          yellow: "#F59E0B",
        },
        grayscale: {
          100: "#FFFFFF",
          200: "#E2E8F0",
          300: "#94A3B8",
          400: "#475569",
          500: "#242B38", // Borda e cards secundários
          600: "#161B26", // Superfície de card
          700: "#0F121A", // Fundo da aplicação
          800: "#080A0F", // Fundo profundo / bottom-sheets
        },
      },
      fontFamily: {
        sans: ["SpaceGrotesk_400Regular", "sans-serif"],
        regular: ["SpaceGrotesk_400Regular", "sans-serif"],
        medium: ["SpaceGrotesk_500Medium", "sans-serif"],
        semibold: ["SpaceGrotesk_600SemiBold", "sans-serif"],
        bold: ["SpaceGrotesk_700Bold", "sans-serif"],
      },
      fontSize: {
        "large-title": ["34px", { lineHeight: "48px", fontWeight: "700" }],
        "title-1": ["28px", { lineHeight: "38px", fontWeight: "700" }],
        "title-2": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "title-3": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        headline: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        subheadline: ["15px", { lineHeight: "22px", fontWeight: "500" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-2": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        callout: ["15px", { lineHeight: "21px", fontWeight: "500" }],
        footnote: ["13px", { lineHeight: "18px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        pill: "32px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

