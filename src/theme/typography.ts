/**
 * Tipografia Oficial — NomadLog
 * Fonte: Space Grotesk
 */
export const fontFamilies = {
  regular: "SpaceGrotesk_400Regular",
  medium: "SpaceGrotesk_500Medium",
  semiBold: "SpaceGrotesk_600SemiBold",
  bold: "SpaceGrotesk_700Bold",
} as const;

export type TypographyVariant =
  | "largeTitle"
  | "title1"
  | "title2"
  | "title3"
  | "headline"
  | "subheadline"
  | "body"
  | "body2"
  | "callout"
  | "caption"
  | "footnote";

export interface TypographyStyle {
  fontFamily: string;
  fontWeight: "400" | "500" | "600" | "700";
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export const typography: Record<TypographyVariant, TypographyStyle> = {
  largeTitle: {
    fontFamily: fontFamilies.bold,
    fontWeight: "700",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  title1: {
    fontFamily: fontFamilies.bold,
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  title2: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  title3: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0,
  },
  headline: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  subheadline: {
    fontFamily: fontFamilies.medium,
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  body2: {
    fontFamily: fontFamilies.regular,
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  callout: {
    fontFamily: fontFamilies.medium,
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fontFamilies.medium,
    fontWeight: "500",
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.2,
  },
  footnote: {
    fontFamily: fontFamilies.regular,
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
};

