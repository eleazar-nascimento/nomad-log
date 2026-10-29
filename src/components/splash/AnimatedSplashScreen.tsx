import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Compass, WifiOff, ShieldCheck, Sparkles } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText } from "@/components/ui/Typography";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface AnimatedSplashScreenProps {
  onFinish?: () => void;
  minDuration?: number; // Tempo mínimo para animação brilhar (padrão 2000ms)
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onFinish,
  minDuration = 2000,
}) => {
  // Animações de entrada do Ícone
  const iconScale = useSharedValue(0.4);
  const iconOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(-14);

  // Efeito de respiração e brilho radial (Aura)
  const glowScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0.2);

  // Animações de texto (Título e Subtítulo)
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(24);

  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(16);

  // Barra de progresso do motor offline
  const progressBarWidth = useSharedValue(0);

  // Animação de saída de cena (Fade out + Slight Zoom)
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  // Estado textual das etapas de inicialização offline
  const [loadingStep, setLoadingStep] = useState(0);

  const STEPS = [
    { label: "Inicializando motor offline...", icon: WifiOff },
    { label: "Restaurando taxas de câmbio...", icon: Compass },
    { label: "Carregando roteiros & memórias...", icon: Sparkles },
    { label: "100% pronto para a jornada!", icon: ShieldCheck },
  ];

  useEffect(() => {
    // 1. Ícone Entra com Spring & Rotação como agulha magnética
    iconScale.value = withSpring(1, {
      damping: 13,
      stiffness: 110,
      mass: 0.9,
    });
    iconOpacity.value = withTiming(1, { duration: 400 });

    // A agulha oscila como se estivesse buscando o Norte Verdadeiro
    iconRotation.value = withSequence(
      withTiming(10, { duration: 380, easing: Easing.out(Easing.quad) }),
      withTiming(-6, { duration: 320, easing: Easing.inOut(Easing.quad) }),
      withTiming(3, { duration: 260, easing: Easing.inOut(Easing.quad) }),
      withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) })
    );

    // 2. Aura brilhante pulsante ao fundo
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 1200 }),
        withTiming(0.2, { duration: 1200 })
      ),
      -1,
      true
    );

    // 3. Título e Subtítulo entram escalonados
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(
      400,
      withSpring(0, { damping: 16, stiffness: 120 })
    );

    subtitleOpacity.value = withDelay(650, withTiming(1, { duration: 500 }));
    subtitleTranslateY.value = withDelay(
      650,
      withSpring(0, { damping: 16, stiffness: 120 })
    );

    // 4. Barra de Progresso enche fluidamente até 100%
    progressBarWidth.value = withDelay(
      300,
      withTiming(1, {
        duration: minDuration - 400,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Atualização dos textos de etapas
    const t1 = setTimeout(() => setLoadingStep(1), 500);
    const t2 = setTimeout(() => setLoadingStep(2), 1100);
    const t3 = setTimeout(() => setLoadingStep(3), 1650);

    // 5. Saída de cena suave após minDuration
    const finishTimer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 380, easing: Easing.inOut(Easing.ease) });
      containerScale.value = withTiming(1.05, { duration: 380, easing: Easing.out(Easing.quad) });

      setTimeout(() => {
        if (onFinish) {
          onFinish();
        }
      }, 400);
    }, minDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(finishTimer);
    };
  }, []);

  // Estilos animados
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value * 100}%`,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const CurrentStepIcon = STEPS[loadingStep].icon;

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Background radial glow */}
      <View style={styles.ambientBackdrop}>
        <Animated.View style={[styles.glowRing, glowAnimatedStyle]} />
        <View style={styles.glowRingOuter} />
      </View>

      {/* Centro: Ícone Hero & Logomarca */}
      <View style={styles.contentCenter}>
        {/* Glow atrás do ícone */}
        <Animated.View style={[styles.iconGlowAura, glowAnimatedStyle]} />

        {/* Ícone 3D da Aplicação */}
        <Animated.View style={[styles.iconWrapper, iconAnimatedStyle]}>
          <Image
            source={require("../../../assets/app-icon.png")}
            style={styles.iconImage}
            resizeMode="cover"
          />
          {/* Brilho da borda do squircle */}
          <View style={styles.iconBorderShine} />
        </Animated.View>

        {/* Título & Marca */}
        <Animated.View style={[styles.brandContainer, titleAnimatedStyle]}>
          <View style={styles.titleRow}>
            <AppText
              variant="title1"
              color={colors.grayscale[100]}
              style={styles.titleText}
            >
              Nomad<AppText variant="title1" color={colors.primary[100]} style={styles.titleHighlight}>Log</AppText>
            </AppText>
          </View>

          <View style={styles.badgePill}>
            <View style={styles.badgeDot} />
            <AppText variant="caption" color={colors.adventure.amber} style={styles.badgeText}>
              OFFLINE-FIRST TRAVEL
            </AppText>
          </View>
        </Animated.View>

        {/* Subtítulo Inspiracional */}
        <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
          <AppText variant="footnote" color={colors.grayscale[300]} align="center" style={styles.subtitleText}>
            Diário de Bordo, Roteiros & Câmbio sem Sinal
          </AppText>
        </Animated.View>
      </View>

      {/* Rodapé: Barra de Progresso e Etapa */}
      <View style={styles.footerContainer}>
        {/* Indicador de Status com Ícone da Etapa */}
        <View style={styles.statusRow}>
          <CurrentStepIcon size={13} color={colors.adventure.sky} />
          <AppText variant="caption" color={colors.grayscale[300]} style={styles.statusText}>
            {STEPS[loadingStep].label}
          </AppText>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, progressAnimatedStyle]} />
        </View>

        {/* Versão e Proteção Criptográfica */}
        <View style={styles.specsRow}>
          <AppText variant="caption" color={colors.grayscale[400]} style={styles.specsText}>
            v1.0.0 • Cache Local Ativo
          </AppText>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0A0D14",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 56,
    zIndex: 9999,
  },
  ambientBackdrop: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glowRing: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255, 104, 56, 0.18)",
    filter: Platform.OS === "web" ? "blur(70px)" : undefined,
  },
  glowRingOuter: {
    position: "absolute",
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    filter: Platform.OS === "web" ? "blur(90px)" : undefined,
  },
  contentCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  iconGlowAura: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(255, 104, 56, 0.35)",
    filter: Platform.OS === "web" ? "blur(40px)" : undefined,
  },
  iconWrapper: {
    width: 136,
    height: 136,
    borderRadius: 34,
    overflow: "hidden",
    shadowColor: "#FF6838",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.18)",
    backgroundColor: "#111622",
  },
  iconImage: {
    width: "100%",
    height: "100%",
  },
  iconBorderShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  brandContainer: {
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  titleHighlight: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.adventure.amber,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  subtitleContainer: {
    paddingHorizontal: 32,
    maxWidth: 320,
  },
  subtitleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerContainer: {
    width: "100%",
    maxWidth: 290,
    alignItems: "center",
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressBarTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.grayscale[600],
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary[100],
    borderRadius: 2,
  },
  specsRow: {
    alignItems: "center",
  },
  specsText: {
    fontSize: 11,
    opacity: 0.7,
  },
});
