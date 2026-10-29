import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Globe,
  Crown,
  FileSpreadsheet,
  FileCode,
  FileText,
  Cloud,
  RefreshCw,
  Lock,
  CheckCircle2,
  Copy,
  RotateCcw,
  ShieldCheck,
  Coins,
  Sparkles,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge, Button, AnimatedContainer } from "@/components/ui";
import { useDeviceChrome } from "@/components/ui/DeviceChrome";
import { useTranslation } from "@/i18n";
import { useAppStore } from "@/store";
import {
  generateExpensesCSV,
  generateTripJSON,
  generateTripMarkdownReport,
  triggerFileExport,
} from "@/services/exportService";

export const SettingsScreen: React.FC<{
  onOpenProModal: () => void;
}> = ({ onOpenProModal }) => {
  const router = useRouter();
  const { t, locale, setLocale, isPt, isEn } = useTranslation();
  const insets = useSafeAreaInsets();
  const isFramedWeb = useDeviceChrome();

  const isIOS =
    Platform.OS === "ios" ||
    (Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod/.test(navigator.userAgent));

  // No modo mockup desktop web (largura >= 700px), a moldura DeviceFrame já renderiza
  // a barra de status simulada de 48px com a Dynamic Island. Em celulares reais (iOS/Android/Web mobile),
  // respeitamos a Safe Area nativa para que a Dynamic Island ou o notch não fiquem sobre o header.
  const safeTopPadding = isFramedWeb
    ? 12
    : Math.max(
        insets.top > 0 ? insets.top + 6 : (isIOS ? 56 : 36),
        16
      );

  const {
    state,
    activeTrip,
    activeTripExpenses,
    activeTripWaypoints,
    activeTripJournal,
    activeTripPacking,
    isPro,
    syncMutationQueue,
    refreshFxRates,
    resetToSeed,
  } = useAppStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [refreshingFx, setRefreshingFx] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportCSV = async () => {
    if (!isPro) {
      onOpenProModal();
      return;
    }
    if (!activeTrip) return;
    const csv = generateExpensesCSV(activeTripExpenses, activeTrip.baseCurrency);
    const success = await triggerFileExport(
      csv,
      `despesas_${activeTrip.id}.csv`,
      "text/csv"
    );
    showToast(
      success
        ? t.settings.exportSuccessToast
        : t.settings.copiedToast
    );
  };

  const handleExportJSON = async () => {
    if (!isPro) {
      onOpenProModal();
      return;
    }
    if (!activeTrip) return;
    const json = generateTripJSON(
      activeTrip,
      activeTripExpenses,
      activeTripWaypoints,
      activeTripJournal,
      activeTripPacking
    );
    const success = await triggerFileExport(
      json,
      `backup_${activeTrip.id}.json`,
      "application/json"
    );
    showToast(
      success
        ? t.settings.exportSuccessToast
        : t.settings.copiedToast
    );
  };

  const handleExportReport = async () => {
    if (!isPro) {
      onOpenProModal();
      return;
    }
    if (!activeTrip) return;
    const report = generateTripMarkdownReport(
      activeTrip,
      activeTripExpenses,
      activeTripWaypoints,
      activeTripJournal,
      activeTripPacking,
      locale
    );
    const success = await triggerFileExport(
      report,
      `relatorio_${activeTrip.id}.md`,
      "text/markdown"
    );
    showToast(
      success
        ? t.settings.exportSuccessToast
        : t.settings.copiedToast
    );
  };

  const handleSyncCloud = async () => {
    setSyncing(true);
    try {
      const count = await syncMutationQueue();
      showToast(
        isPt
          ? `✓ ${count} alterações sincronizadas com a nuvem!`
          : `✓ ${count} mutations synced with cloud!`
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleRefreshFx = async () => {
    setRefreshingFx(true);
    try {
      await refreshFxRates();
      showToast(
        isPt
          ? "✓ Cotações de câmbio atualizadas!"
          : "✓ Exchange rates refreshed!"
      );
    } finally {
      setRefreshingFx(false);
    }
  };

  const handleResetData = async () => {
    await resetToSeed();
    showToast(
      isPt
        ? "✓ Dados da viagem restaurados!"
        : "✓ Demo trip data restored!"
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.grayscale[700] }}>
      {/* Top Header com Botão Voltar (com safe area para Dynamic Island / Notch) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: safeTopPadding,
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderColor: colors.grayscale[500],
          backgroundColor: colors.grayscale[700],
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingVertical: 6,
            paddingHorizontal: 4,
            minWidth: 70,
          }}
        >
          <ArrowLeft size={18} color={colors.grayscale[200]} />
          <AppText variant="subheadline" color={colors.grayscale[200]}>
            {isPt ? "Voltar" : "Back"}
          </AppText>
        </TouchableOpacity>

        <AppText variant="headline" style={{ fontWeight: "700" }}>
          {t.settings.title}
        </AppText>

        <View style={{ width: 70 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 18,
          paddingBottom: Math.max(insets.bottom + 32, 50),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Toast Informativo */}
        {toastMessage && (
          <AnimatedContainer delay={0}>
            <View
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                borderWidth: 1,
                borderColor: colors.adventure.emerald,
                borderRadius: radii.md,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CheckCircle2 size={16} color={colors.adventure.emerald} />
              <AppText
                variant="subheadline"
                color={colors.adventure.emerald}
                style={{ fontWeight: "700" }}
              >
                {toastMessage}
              </AppText>
            </View>
          </AnimatedContainer>
        )}

        {/* 1. SELETOR DE IDIOMA (i18n) */}
        <AnimatedContainer delay={40}>
          <Card variant="surface" style={{ gap: 12, padding: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Globe size={18} color={colors.adventure.sky} />
              <View>
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  {t.settings.languageSection}
                </AppText>
                <AppText variant="caption" color={colors.grayscale[300]}>
                  {t.settings.languageDesc}
                </AppText>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
              {/* Opção Português */}
              <TouchableOpacity
                onPress={() => setLocale("pt")}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 12,
                  borderRadius: radii.md,
                  backgroundColor: isPt
                    ? "rgba(255, 104, 56, 0.2)"
                    : colors.grayscale[600],
                  borderWidth: 2,
                  borderColor: isPt
                    ? colors.primary[100]
                    : colors.grayscale[500],
                }}
              >
                <AppText style={{ fontSize: 18 }}>🇧🇷</AppText>
                <AppText
                  variant="subheadline"
                  color={isPt ? colors.primary[100] : colors.grayscale[200]}
                  style={{ fontWeight: isPt ? "700" : "500" }}
                >
                  Português
                </AppText>
              </TouchableOpacity>

              {/* Opção English */}
              <TouchableOpacity
                onPress={() => setLocale("en")}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  paddingVertical: 12,
                  borderRadius: radii.md,
                  backgroundColor: isEn
                    ? "rgba(255, 104, 56, 0.2)"
                    : colors.grayscale[600],
                  borderWidth: 2,
                  borderColor: isEn
                    ? colors.primary[100]
                    : colors.grayscale[500],
                }}
              >
                <AppText style={{ fontSize: 18 }}>🇺🇸</AppText>
                <AppText
                  variant="subheadline"
                  color={isEn ? colors.primary[100] : colors.grayscale[200]}
                  style={{ fontWeight: isEn ? "700" : "500" }}
                >
                  English
                </AppText>
              </TouchableOpacity>
            </View>
          </Card>
        </AnimatedContainer>

        {/* 2. STATUS DO PLANO PRO */}
        <AnimatedContainer delay={90}>
          <Card
            variant={isPro ? "highlight" : "surface"}
            style={{
              gap: 12,
              padding: 16,
              borderColor: isPro
                ? colors.adventure.amber
                : colors.grayscale[500],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Crown
                  size={18}
                  color={isPro ? colors.adventure.amber : colors.primary[100]}
                />
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  {t.settings.proStatusSection}
                </AppText>
              </View>

              <Badge
                label={isPro ? "PRO ATIVO" : "FREE"}
                variant={isPro ? "amber" : "neutral"}
                size="sm"
              />
            </View>

            <AppText variant="footnote" color={colors.grayscale[200]}>
              {isPro ? t.settings.proPlanDesc : t.settings.freePlanDesc}
            </AppText>

            <Button
              title={
                isPro
                  ? (isPt ? "Gerenciar / Detalhes Pro" : "Manage / Pro Details")
                  : t.settings.upgradeToProBtn
              }
              variant={isPro ? "secondary" : "primary"}
              size="md"
              onPress={onOpenProModal}
              icon={<Crown size={15} color={colors.grayscale[100]} />}
            />
          </Card>
        </AnimatedContainer>

        {/* 3. CENTRAL DE EXPORTAÇÃO DE DADOS (Recurso Pro Exibido) */}
        <AnimatedContainer delay={140}>
          <Card variant="surface" style={{ gap: 14, padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <FileSpreadsheet size={18} color={colors.primary[100]} />
                <View>
                  <AppText variant="headline" style={{ fontWeight: "700" }}>
                    {t.settings.dataExportSection}
                  </AppText>
                  <AppText variant="caption" color={colors.grayscale[300]}>
                    {t.settings.dataExportDesc}
                  </AppText>
                </View>
              </View>
              {!isPro && <Lock size={15} color={colors.adventure.amber} />}
            </View>

            {/* Opções de Exportação */}
            <View style={{ gap: 10 }}>
              {/* Exportar CSV */}
              <TouchableOpacity
                onPress={handleExportCSV}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: colors.grayscale[700],
                  borderRadius: radii.md,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.grayscale[500],
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                  <FileSpreadsheet size={20} color={colors.adventure.emerald} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="subheadline" style={{ fontWeight: "700" }}>
                      {t.settings.exportCsv}
                    </AppText>
                    <AppText variant="caption" color={colors.grayscale[300]}>
                      {t.settings.exportCsvSub}
                    </AppText>
                  </View>
                </View>

                {isPro ? (
                  <Copy size={16} color={colors.grayscale[300]} />
                ) : (
                  <Badge label="PRO" variant="amber" size="sm" />
                )}
              </TouchableOpacity>

              {/* Exportar JSON */}
              <TouchableOpacity
                onPress={handleExportJSON}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: colors.grayscale[700],
                  borderRadius: radii.md,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.grayscale[500],
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                  <FileCode size={20} color={colors.adventure.sky} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="subheadline" style={{ fontWeight: "700" }}>
                      {t.settings.exportJson}
                    </AppText>
                    <AppText variant="caption" color={colors.grayscale[300]}>
                      {t.settings.exportJsonSub}
                    </AppText>
                  </View>
                </View>

                {isPro ? (
                  <Copy size={16} color={colors.grayscale[300]} />
                ) : (
                  <Badge label="PRO" variant="amber" size="sm" />
                )}
              </TouchableOpacity>

              {/* Exportar Relatório Formatado */}
              <TouchableOpacity
                onPress={handleExportReport}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: colors.grayscale[700],
                  borderRadius: radii.md,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.grayscale[500],
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                  <FileText size={20} color={colors.adventure.purple} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="subheadline" style={{ fontWeight: "700" }}>
                      {t.settings.exportReport}
                    </AppText>
                    <AppText variant="caption" color={colors.grayscale[300]}>
                      {t.settings.exportReportSub}
                    </AppText>
                  </View>
                </View>

                {isPro ? (
                  <Copy size={16} color={colors.grayscale[300]} />
                ) : (
                  <Badge label="PRO" variant="amber" size="sm" />
                )}
              </TouchableOpacity>
            </View>
          </Card>
        </AnimatedContainer>

        {/* 4. BACKUP NA NUVEM & FILA OFFLINE */}
        <AnimatedContainer delay={190}>
          <Card variant="surface" style={{ gap: 12, padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Cloud size={18} color={colors.adventure.sky} />
                <View>
                  <AppText variant="headline" style={{ fontWeight: "700" }}>
                    {t.settings.cloudSyncSection}
                  </AppText>
                  <AppText variant="caption" color={colors.grayscale[300]}>
                    {t.settings.cloudSyncDesc}
                  </AppText>
                </View>
              </View>

              <Badge
                label={
                  state.mutationQueue.length > 0
                    ? `${state.mutationQueue.length} ${t.header.queuePending}`
                    : t.header.savedLocally
                }
                variant={state.mutationQueue.length > 0 ? "primary" : "emerald"}
                size="sm"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: colors.grayscale[700],
                padding: 10,
                borderRadius: radii.sm,
              }}
            >
              <ShieldCheck size={14} color={colors.adventure.emerald} />
              <AppText variant="footnote" color={colors.grayscale[200]}>
                {t.settings.encryptionBadge}
              </AppText>
            </View>

            <Button
              title={syncing ? t.settings.syncingBtn : t.settings.syncNowBtn}
              variant="secondary"
              size="md"
              disabled={state.mutationQueue.length === 0 || syncing}
              loading={syncing}
              icon={<RefreshCw size={14} color={colors.grayscale[100]} />}
              onPress={handleSyncCloud}
            />
          </Card>
        </AnimatedContainer>

        {/* 5. MOTOR DE CÂMBIO OFFLINE */}
        <AnimatedContainer delay={240}>
          <Card variant="surface" style={{ gap: 12, padding: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Coins size={18} color={colors.adventure.amber} />
              <View>
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  {t.settings.offlineEngineSection}
                </AppText>
                <AppText variant="caption" color={colors.grayscale[300]}>
                  {t.settings.offlineEngineDesc}
                </AppText>
              </View>
            </View>

            <View
              style={{
                backgroundColor: colors.grayscale[700],
                padding: 10,
                borderRadius: radii.sm,
                gap: 4,
              }}
            >
              <AppText variant="footnote" color={colors.grayscale[300]}>
                1 USD = R$ {state.rates.BRL.toFixed(2)} | ฿ {state.rates.THB.toFixed(1)} | € {state.rates.EUR.toFixed(2)}
              </AppText>
            </View>

            <Button
              title={
                refreshingFx
                  ? (isPt ? "Buscando taxas online..." : "Fetching rates...")
                  : t.settings.refreshFxBtn
              }
              variant="secondary"
              size="sm"
              loading={refreshingFx}
              disabled={refreshingFx}
              onPress={handleRefreshFx}
              icon={<RefreshCw size={13} color={colors.adventure.amber} />}
            />
          </Card>
        </AnimatedContainer>

        {/* 6. RESTAURAR DEMO & VERSÃO */}
        <AnimatedContainer delay={280}>
          <Card variant="surface" style={{ gap: 12, padding: 16, alignItems: "center" }}>
            <TouchableOpacity
              onPress={handleResetData}
              activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <RotateCcw size={14} color={colors.grayscale[300]} />
              <AppText variant="footnote" color={colors.grayscale[300]}>
                {t.settings.resetDemoBtn}
              </AppText>
            </TouchableOpacity>

            <AppText variant="caption" color={colors.grayscale[400]}>
              NomadLog v1.0.0 • Mobile-First Offline Architecture
            </AppText>
          </Card>
        </AnimatedContainer>
      </ScrollView>
    </View>
  );
};

