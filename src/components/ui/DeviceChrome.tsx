import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { Wifi, BatteryMedium, Signal } from "lucide-react-native";
import { colors } from "@/theme";
import { AppText } from "./Typography";

const DeviceChromeContext = createContext(false);
export const useDeviceChrome = () => useContext(DeviceChromeContext);

const FRAME_BREAKPOINT = 700;
const FRAME_WIDTH = 430;
const FRAME_MAX_HEIGHT = 932;

/**
 * Barra de Status realista simulando o iPhone 16 Pro com Dynamic Island
 */
const SimulatedIPhoneStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState("09:41");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.statusBarContainer}>
      {/* Relógio do Sistema (Esquerda) */}
      <View style={styles.statusBarLeft}>
        <AppText
          variant="footnote"
          color={colors.grayscale[100]}
          style={{ fontWeight: "700", letterSpacing: -0.2 }}
        >
          {timeStr}
        </AppText>
      </View>

      {/* Dynamic Island Fiel (Centro) */}
      <View style={styles.dynamicIslandWrapper}>
        <View style={styles.dynamicIsland}>
          {/* Câmera e Sensores */}
          <View style={styles.sensorDot} />
          <View style={styles.cameraDot} />
        </View>
      </View>

      {/* Ícones de Conexão e Bateria (Direita) */}
      <View style={styles.statusBarRight}>
        <Signal size={13} color={colors.grayscale[100]} strokeWidth={2.5} />
        <Wifi size={13} color={colors.grayscale[100]} strokeWidth={2.5} />
        <View style={styles.batteryPill}>
          <View style={styles.batteryFill} />
        </View>
      </View>
    </View>
  );
};

export const DeviceFrame: React.FC<{
  children: React.ReactNode;
  sidePanel?: React.ReactNode;
}> = ({ children, sidePanel }) => {
  const { width, height } = useWindowDimensions();
  const framed = Platform.OS === "web" && width >= FRAME_BREAKPOINT;

  if (!framed) {
    return (
      <DeviceChromeContext.Provider value={false}>
        <View style={styles.fluid}>{children}</View>
      </DeviceChromeContext.Provider>
    );
  }

  const frameHeight = Math.min(FRAME_MAX_HEIGHT, height - 48);
  const showSide = Boolean(sidePanel) && width >= 1100;

  return (
    <DeviceChromeContext.Provider value={true}>
      <View style={styles.desktopBackdrop}>
        {showSide && <View style={styles.sidePanel}>{sidePanel}</View>}
        <View style={{ alignItems: "center", gap: 12 }}>
          <View style={[styles.phone, { height: frameHeight }]}>
            {/* Barra de Status com Dynamic Island Separada da UI */}
            <SimulatedIPhoneStatusBar />

            {/* Conteúdo da Aplicação */}
            <View style={{ flex: 1, backgroundColor: colors.grayscale[700] }}>
              {children}
            </View>

            {/* Home Indicator */}
            <View style={styles.homeIndicatorContainer}>
              <View style={styles.homeIndicator} />
            </View>
          </View>

          {!showSide && sidePanel ? (
            <View style={{ maxWidth: FRAME_WIDTH }}>{sidePanel}</View>
          ) : (
            <AppText variant="footnote" color={colors.grayscale[300]}>
              NomadLog Mobile-First • 430 × {Math.round(frameHeight)} px
            </AppText>
          )}
        </View>
      </View>
    </DeviceChromeContext.Provider>
  );
};

const styles = StyleSheet.create({
  fluid: {
    flex: 1,
    backgroundColor: colors.grayscale[700],
  },
  desktopBackdrop: {
    flex: 1,
    backgroundColor: colors.grayscale[900],
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 40,
    padding: 20,
  },
  phone: {
    width: FRAME_WIDTH,
    borderRadius: 52,
    borderWidth: 10,
    borderColor: "#1E2532",
    overflow: "hidden",
    backgroundColor: colors.grayscale[700],
    boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.75)",
  },
  statusBarContainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    backgroundColor: colors.grayscale[700],
    zIndex: 100,
  },
  statusBarLeft: {
    width: 60,
    justifyContent: "center",
  },
  dynamicIslandWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dynamicIsland: {
    width: 124,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 12,
    gap: 6,
  },
  sensorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#161922",
  },
  cameraDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0A0D14",
    borderWidth: 1,
    borderColor: "#1A202C",
  },
  statusBarRight: {
    width: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  batteryPill: {
    width: 22,
    height: 11,
    borderRadius: 3.5,
    borderWidth: 1.5,
    borderColor: colors.grayscale[100],
    padding: 1.5,
    justifyContent: "center",
  },
  batteryFill: {
    width: "75%",
    height: "100%",
    borderRadius: 1.5,
    backgroundColor: colors.grayscale[100],
  },
  homeIndicatorContainer: {
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.grayscale[700],
    zIndex: 100,
  },
  homeIndicator: {
    width: 136,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: colors.grayscale[400],
  },
  sidePanel: {
    width: 340,
  },
});
