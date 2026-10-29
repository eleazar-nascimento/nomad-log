import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  X,
  Crown,
  Cloud,
  FileSpreadsheet,
  Globe,
  Sparkles,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Badge } from "@/components/ui";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export const ProUpgradeModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { isPro, upgradeToPro, downgradeToFree } = useAppStore();
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<"lifetime" | "annual">(
    "lifetime"
  );
  const [successToast, setSuccessToast] = useState(false);

  const handleUpgrade = () => {
    upgradeToPro();
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  const PRO_BENEFITS = [
    {
      icon: Globe,
      title: t.pro.unlimitedTripsTitle,
      description: t.pro.unlimitedTripsDesc,
    },
    {
      icon: Cloud,
      title: t.pro.cloudBackupTitle,
      description: t.pro.cloudBackupDesc,
    },
    {
      icon: Sparkles,
      title: t.pro.fxHistoryTitle,
      description: t.pro.fxHistoryDesc,
    },
    {
      icon: FileSpreadsheet,
      title: t.pro.exportReportsTitle,
      description: t.pro.exportReportsDesc,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(3, 4, 6, 0.8)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.grayscale[700],
            borderTopLeftRadius: radii["2xl"],
            borderTopRightRadius: radii["2xl"],
            borderWidth: 1,
            borderColor: colors.grayscale[500],
            maxHeight: "92%",
            paddingBottom: 30,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderColor: colors.grayscale[600],
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Crown size={20} color={colors.adventure.amber} />
              <AppText variant="headline" style={{ fontWeight: "700" }}>
                {t.pro.title}
              </AppText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.grayscale[600],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} color={colors.grayscale[200]} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 20, gap: 18 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Tagline */}
            <View style={{ gap: 4 }}>
              <AppText variant="title2" style={{ fontWeight: "700" }}>
                {t.pro.tagline}
              </AppText>
              <AppText variant="body2" color={colors.grayscale[300]}>
                {t.pro.subtagline}
              </AppText>
            </View>

            {/* Lista de Vantagens */}
            <View style={{ gap: 12 }}>
              {PRO_BENEFITS.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 12,
                      backgroundColor: colors.grayscale[600],
                      borderRadius: radii.md,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: colors.grayscale[500],
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: "rgba(245, 158, 11, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={16} color={colors.adventure.amber} />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <AppText variant="subheadline" style={{ fontWeight: "700" }}>
                        {b.title}
                      </AppText>
                      <AppText variant="footnote" color={colors.grayscale[300]}>
                        {b.description}
                      </AppText>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Opções de Preço */}
            <View style={{ gap: 10 }}>
              {/* Opção Vitalícia */}
              <TouchableOpacity
                onPress={() => setSelectedPlan("lifetime")}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 14,
                  borderRadius: radii.lg,
                  backgroundColor:
                    selectedPlan === "lifetime"
                      ? "rgba(245, 158, 11, 0.12)"
                      : colors.grayscale[600],
                  borderWidth: 2,
                  borderColor:
                    selectedPlan === "lifetime"
                      ? colors.adventure.amber
                      : colors.grayscale[500],
                }}
              >
                <View style={{ gap: 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <AppText variant="subheadline" style={{ fontWeight: "700" }}>
                      {t.pro.lifetimeOption}
                    </AppText>
                    <Badge label={t.pro.bestValueBadge} variant="amber" size="sm" />
                  </View>
                  <AppText variant="footnote" color={colors.grayscale[300]}>
                    {t.pro.lifetimeDesc}
                  </AppText>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <AppText
                    variant="title2"
                    color={colors.adventure.amber}
                    style={{ fontWeight: "700" }}
                  >
                    {t.pro.lifetimePrice}
                  </AppText>
                  <AppText variant="caption" color={colors.grayscale[400]}>
                    {t.pro.oneTimePayment}
                  </AppText>
                </View>
              </TouchableOpacity>

              {/* Opção Anual */}
              <TouchableOpacity
                onPress={() => setSelectedPlan("annual")}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 14,
                  borderRadius: radii.lg,
                  backgroundColor:
                    selectedPlan === "annual"
                      ? "rgba(245, 158, 11, 0.12)"
                      : colors.grayscale[600],
                  borderWidth: 2,
                  borderColor:
                    selectedPlan === "annual"
                      ? colors.adventure.amber
                      : colors.grayscale[500],
                }}
              >
                <View style={{ gap: 2 }}>
                  <AppText variant="subheadline" style={{ fontWeight: "700" }}>
                    {t.pro.annualOption}
                  </AppText>
                  <AppText variant="footnote" color={colors.grayscale[300]}>
                    {t.pro.annualDesc}
                  </AppText>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <AppText variant="title3" style={{ fontWeight: "700" }}>
                    {t.pro.annualPrice}
                  </AppText>
                  <AppText variant="caption" color={colors.grayscale[400]}>
                    {t.pro.perYear}
                  </AppText>
                </View>
              </TouchableOpacity>
            </View>

            {/* Botão de Upgrade */}
            {isPro ? (
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    padding: 12,
                    borderRadius: radii.md,
                    alignItems: "center",
                  }}
                >
                  <AppText variant="subheadline" color={colors.adventure.emerald} style={{ fontWeight: "700" }}>
                    ✓ {t.pro.proActiveNotice}
                  </AppText>
                </View>
                <Button
                  title={t.pro.backToFreeTest}
                  variant="secondary"
                  size="sm"
                  onPress={downgradeToFree}
                />
              </View>
            ) : (
              <Button
                title={
                  selectedPlan === "lifetime"
                    ? t.pro.upgradeLifetimeBtn
                    : t.pro.upgradeAnnualBtn
                }
                variant="primary"
                size="lg"
                onPress={handleUpgrade}
                icon={<Crown size={18} color={colors.grayscale[100]} />}
              />
            )}

            {successToast && (
              <AppText
                variant="subheadline"
                color={colors.adventure.emerald}
                align="center"
                style={{ fontWeight: "700" }}
              >
                {t.pro.successToast}
              </AppText>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

