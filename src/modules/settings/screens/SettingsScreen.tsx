import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert, Platform, Modal, Share } from "react-native";
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
  Share2,
  Download,
  Eye,
  X,
  Check,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge, Button, AnimatedContainer } from "@/components/ui";
import { useDeviceChrome } from "@/components/ui/DeviceChrome";
import { AnimatedSplashScreen } from "@/components/splash";
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
  const [showSplashPreview, setShowSplashPreview] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportContent, setReportContent] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportCSV = async () => {
    if (!activeTrip) return;
    const csv = generateExpensesCSV(activeTripExpenses, activeTrip.baseCurrency);
    const safeTripName = (activeTrip.destination || "viagem")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
    const filename = `despesas_${safeTripName}.csv`;
    const success = await triggerFileExport(
      csv,
      filename,
      "text/csv"
    );
    showToast(
      success
        ? (isPt ? "✓ Arquivo CSV exportado com sucesso!" : "✓ CSV file exported successfully!")
        : t.settings.copiedToast
    );
  };

  const handleExportJSON = async () => {
    if (!activeTrip) return;
    const json = generateTripJSON(
      activeTrip,
      activeTripExpenses,
      activeTripWaypoints,
      activeTripJournal,
      activeTripPacking
    );
    const safeTripName = (activeTrip.destination || "viagem")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
    const filename = `backup_nomadlog_${safeTripName}.json`;
    const success = await triggerFileExport(
      json,
      filename,
      "application/json"
    );
    showToast(
      success
        ? (isPt ? "✓ Backup completo exportado com sucesso!" : "✓ Complete backup exported successfully!")
        : t.settings.copiedToast
    );
  };

  const handleOpenReport = () => {
    if (!activeTrip) return;
    const report = generateTripMarkdownReport(
      activeTrip,
      activeTripExpenses,
      activeTripWaypoints,
      activeTripJournal,
      activeTripPacking,
      locale
    );
    setReportContent(report);
    setReportModalVisible(true);
  };

  const handleShareReportFile = async () => {
    if (!activeTrip || !reportContent) return;
    const safeTripName = (activeTrip.destination || "viagem")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
    const filename = `relatorio_${safeTripName}.md`;
    const success = await triggerFileExport(
      reportContent,
      filename,
      "text/markdown"
    );
    showToast(
      success
        ? (isPt ? "✓ Relatório exportado com sucesso!" : "✓ Report exported successfully!")
        : t.settings.copiedToast
    );
  };

  const handleShareReportText = async () => {
    if (!reportContent) return;
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(reportContent);
        showToast(isPt ? "✓ Relatório copiado para a área de transferência!" : "✓ Report copied to clipboard!");
        return;
      }
      await Share.share({
        message: reportContent,
        title: activeTrip?.title || "NomadLog Report",
      });
    } catch (e) {
      console.warn("Erro ao compartilhar texto:", e);
    }
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
                gap: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                <Crown
                  size={18}
                  color={isPro ? colors.adventure.amber : colors.primary[100]}
                  style={{ flexShrink: 0 }}
                />
                <AppText variant="headline" style={{ fontWeight: "700", flex: 1, minWidth: 0 }} numberOfLines={1}>
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

        {/* 3. CENTRAL DE EXPORTAÇÃO DE DADOS (Recurso Pro Exibido - 100% Responsivo) */}
        <AnimatedContainer delay={140}>
          <Card variant="surface" style={{ gap: 14, padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: radii.md,
                    backgroundColor: "rgba(255, 104, 56, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <FileSpreadsheet size={18} color={colors.primary[100]} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText variant="headline" style={{ fontWeight: "700" }}>
                    {t.settings.dataExportSection}
                  </AppText>
                  <AppText variant="caption" color={colors.grayscale[300]} style={{ marginTop: 2 }}>
                    {t.settings.dataExportDesc}
                  </AppText>
                </View>
              </View>

              <View style={{ flexShrink: 0, marginTop: 2 }}>
                {!isPro ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: radii.pill,
                      borderWidth: 1,
                      borderColor: "rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    <Lock size={11} color={colors.adventure.amber} />
                    <AppText
                      variant="caption"
                      color={colors.adventure.amber}
                      style={{ fontWeight: "700" }}
                    >
                      PRO
                    </AppText>
                  </View>
                ) : (
                  <Badge label="DESBLOQUEADO" variant="emerald" size="sm" />
                )}
              </View>
            </View>

            {/* Opções de Exportação em Cards Ajustáveis */}
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
                  gap: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radii.md,
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileSpreadsheet size={18} color={colors.adventure.emerald} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <AppText variant="subheadline" style={{ fontWeight: "700" }} numberOfLines={1}>
                      {t.settings.exportCsv}
                    </AppText>
                    <AppText variant="caption" color={colors.grayscale[300]} numberOfLines={2}>
                      {t.settings.exportCsvSub}
                    </AppText>
                  </View>
                </View>

                <View style={{ flexShrink: 0, paddingLeft: 4 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: radii.pill,
                      borderWidth: 1,
                      borderColor: "rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    <Download size={13} color={colors.adventure.emerald} />
                    <AppText
                      variant="caption"
                      color={colors.adventure.emerald}
                      style={{ fontWeight: "700" }}
                    >
                      CSV
                    </AppText>
                  </View>
                </View>
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
                  gap: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radii.md,
                      backgroundColor: "rgba(56, 189, 248, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileCode size={18} color={colors.adventure.sky} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <AppText variant="subheadline" style={{ fontWeight: "700" }} numberOfLines={1}>
                      {t.settings.exportJson}
                    </AppText>
                    <AppText variant="caption" color={colors.grayscale[300]} numberOfLines={2}>
                      {t.settings.exportJsonSub}
                    </AppText>
                  </View>
                </View>

                <View style={{ flexShrink: 0, paddingLeft: 4 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "rgba(56, 189, 248, 0.15)",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: radii.pill,
                      borderWidth: 1,
                      borderColor: "rgba(56, 189, 248, 0.3)",
                    }}
                  >
                    <Download size={13} color={colors.adventure.sky} />
                    <AppText
                      variant="caption"
                      color={colors.adventure.sky}
                      style={{ fontWeight: "700" }}
                    >
                      JSON
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Exportar Relatório Formatado */}
              <TouchableOpacity
                onPress={handleOpenReport}
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
                  gap: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radii.md,
                      backgroundColor: "rgba(168, 85, 247, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={18} color={colors.adventure.purple} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <AppText variant="subheadline" style={{ fontWeight: "700" }} numberOfLines={1}>
                      {t.settings.exportReport}
                    </AppText>
                    <AppText variant="caption" color={colors.grayscale[300]} numberOfLines={2}>
                      {t.settings.exportReportSub}
                    </AppText>
                  </View>
                </View>

                <View style={{ flexShrink: 0, paddingLeft: 4 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "rgba(168, 85, 247, 0.15)",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: radii.pill,
                      borderWidth: 1,
                      borderColor: "rgba(168, 85, 247, 0.3)",
                    }}
                  >
                    <Eye size={13} color={colors.adventure.purple} />
                    <AppText
                      variant="caption"
                      color={colors.adventure.purple}
                      style={{ fontWeight: "700" }}
                    >
                      {isPt ? "Ver" : "View"}
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        </AnimatedContainer>

        {/* 4. BACKUP NA NUVEM & FILA OFFLINE (100% Responsivo) */}
        <AnimatedContainer delay={190}>
          <Card variant="surface" style={{ gap: 14, padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: radii.md,
                    backgroundColor: "rgba(56, 189, 248, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Cloud size={18} color={colors.adventure.sky} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText variant="headline" style={{ fontWeight: "700" }}>
                    {t.settings.cloudSyncSection}
                  </AppText>
                  <AppText variant="caption" color={colors.grayscale[300]} style={{ marginTop: 2 }}>
                    {t.settings.cloudSyncDesc}
                  </AppText>
                </View>
              </View>

              <View style={{ flexShrink: 0, marginTop: 2 }}>
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
            </View>

            {/* Selo Criptografia AES-256 Responsivo */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
                backgroundColor: colors.grayscale[700],
                padding: 10,
                borderRadius: radii.sm,
                borderWidth: 1,
                borderColor: colors.grayscale[600],
              }}
            >
              <ShieldCheck
                size={15}
                color={colors.adventure.emerald}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <AppText
                variant="footnote"
                color={colors.grayscale[200]}
                style={{ flex: 1, minWidth: 0, lineHeight: 18 }}
              >
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
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: radii.md,
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Coins size={18} color={colors.adventure.amber} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  {t.settings.offlineEngineSection}
                </AppText>
                <AppText variant="caption" color={colors.grayscale[300]} style={{ marginTop: 2 }}>
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
          <Card variant="surface" style={{ gap: 14, padding: 16, alignItems: "center" }}>
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() => setShowSplashPreview(true)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: "rgba(255, 104, 56, 0.12)",
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: radii.pill,
                  borderWidth: 1,
                  borderColor: "rgba(255, 104, 56, 0.3)",
                }}
              >
                <Sparkles size={13} color={colors.primary[100]} />
                <AppText variant="footnote" color={colors.primary[100]} style={{ fontWeight: "700" }}>
                  {isPt ? "Reproduzir Splash Art" : "Play Splash Art"}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResetData}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                }}
              >
                <RotateCcw size={14} color={colors.grayscale[300]} />
                <AppText variant="footnote" color={colors.grayscale[300]}>
                  {t.settings.resetDemoBtn}
                </AppText>
              </TouchableOpacity>
            </View>

            <AppText variant="caption" color={colors.grayscale[400]}>
              NomadLog v1.0.0 • Mobile-First Offline Architecture
            </AppText>
          </Card>
        </AnimatedContainer>
      </ScrollView>

      {/* Modal do Relatório Formatado da Viagem */}
      <Modal
        visible={reportModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(3, 4, 6, 0.75)",
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
              maxHeight: "90%",
              paddingBottom: 24,
            }}
          >
            {/* Header do Modal */}
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
              <View style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  {isPt ? "Relatório Formatado da Viagem" : "Trip Summary Report"}
                </AppText>
                <AppText variant="caption" color={colors.primary[100]}>
                  {activeTrip?.title} • {isPt ? "100% Offline" : "100% Offline"}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setReportModalVisible(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.grayscale[600],
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <X size={18} color={colors.grayscale[200]} />
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Relatório */}
            <ScrollView
              contentContainerStyle={{ padding: 20, gap: 14 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  backgroundColor: "rgba(10, 13, 20, 0.95)",
                  borderRadius: radii.md,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.grayscale[600],
                }}
              >
                <AppText
                  variant="footnote"
                  color={colors.grayscale[200]}
                  style={{
                    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                    lineHeight: 20,
                  }}
                >
                  {reportContent}
                </AppText>
              </View>

              {/* Botões de Ação do Relatório */}
              <View style={{ gap: 10 }}>
                <Button
                  title={isPt ? "Compartilhar Arquivo (.md)" : "Share File (.md)"}
                  variant="primary"
                  size="md"
                  onPress={handleShareReportFile}
                  icon={<Share2 size={16} color={colors.grayscale[100]} />}
                />
                <Button
                  title={isPt ? "Copiar Texto / Compartilhar" : "Copy / Share Text"}
                  variant="secondary"
                  size="md"
                  onPress={handleShareReportText}
                  icon={<Copy size={16} color={colors.grayscale[100]} />}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Preview Interativo da Splash Art */}
      {showSplashPreview && (
        <AnimatedSplashScreen
          onFinish={() => setShowSplashPreview(false)}
          minDuration={2200}
        />
      )}
    </View>
  );
};

