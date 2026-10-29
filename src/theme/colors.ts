/**
 * Paleta de Cores Oficial — NomadLog
 * Tema Dark Moderno com Acentos de Aventura, Trilhas e Câmbio Nômade
 */
export const colors = {
  primary: {
    100: "#FF6838", // Laranja Aventura
    DEFAULT: "#FF6838",
    dark: "#E65325",
    light: "#FF8C66",
    glow: "rgba(255, 104, 56, 0.25)",
  },
  adventure: {
    orange: "#FF6838", // Mochila / Aventura
    amber: "#F59E0B",  // Moedas / Cotação de Câmbio / Gastos
    emerald: "#10B981",// Trilhas / Sucesso / Dentro do Orçamento
    sky: "#38BDF8",    // Bússola / Coordenadas / Altitude
    indigo: "#6366F1", // Noite / Transporte / Voos
    purple: "#A855F7", // Diário / Memórias
    rose: "#F43F5E",   // Alertas / Fronteiras / Atenção
  },
  message: {
    green: "#10B981",
    red: "#EF4444",
    yellow: "#F59E0B",
    blue: "#38BDF8",
  },
  grayscale: {
    100: "#FFFFFF", // Branco Puro / Títulos
    200: "#E2E8F0", // Texto Secundário Claro
    300: "#94A3B8", // Texto Muted / Legendas / Ícones inativos
    400: "#475569", // Bordas sutis
    500: "#242B38", // Bordas de cards e divisores
    600: "#161B26", // Superfície de Cards elevados
    700: "#0F121A", // Fundo do App (Dark Slate)
    800: "#080A0F", // Fundo Profundo / Overlays / Modais
    900: "#030406", // Preto absoluto
  },
  system: {
    overlay: "rgba(8, 10, 15, 0.85)",
    cardGlass: "rgba(22, 27, 38, 0.8)",
    highlight: "rgba(255, 104, 56, 0.12)",
    emeraldGlass: "rgba(16, 185, 129, 0.12)",
    amberGlass: "rgba(245, 158, 11, 0.12)",
    skyGlass: "rgba(56, 189, 248, 0.12)",
  },
} as const;

export type ColorPalette = typeof colors;

