import React, { createContext, useContext } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { colors } from "@/theme";
import { AppText } from "./Typography";

const DeviceChromeContext = createContext(false);
export const useDeviceChrome = () => useContext(DeviceChromeContext);

const FRAME_BREAKPOINT = 700;
const FRAME_WIDTH = 430;
const FRAME_MAX_HEIGHT = 932;

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
            {/* Dynamic Island / Notch do mockup */}
            <View style={styles.notchContainer}>
              <View style={styles.dynamicIsland} />
            </View>
            <View style={{ flex: 1 }}>{children}</View>
            {/* Home indicator */}
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
    borderRadius: 50,
    borderWidth: 10,
    borderColor: "#1E2532",
    overflow: "hidden",
    backgroundColor: colors.grayscale[700],
    boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
  },
  notchContainer: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.grayscale[700],
    zIndex: 100,
  },
  dynamicIsland: {
    width: 110,
    height: 18,
    borderRadius: 12,
    backgroundColor: "#000000",
  },
  homeIndicatorContainer: {
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.grayscale[700],
    zIndex: 100,
  },
  homeIndicator: {
    width: 130,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.grayscale[400],
  },
  sidePanel: {
    width: 340,
  },
});

