import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  RotateCcw,
  Crown,
  Database,
  Coins,
  Compass,
  ArrowRight,
  PlusCircle,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge, Button } from "@/components/ui";
import { useAppStore } from "@/store";

export const SideControlPanel: React.FC<{
  onOpenTripModal?: () => void;
  onOpenProModal?: () => void;
}> = ({ onOpenTripModal, onOpenProModal }) => {
  const {
    state,
    isPro,
    toggleOfflineMode,
    syncMutationQueue,
    refreshFxRates,
    resetToSeed,
    upgradeToPro,
    downgradeToFree,
  } = useAppStore();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [refreshingRates, setRefreshingRates] = useState(false);
  const [ratesMsg, setRatesMsg] = useState<string | null>(null);

  const handleRefreshFx = async () => {
    setRefreshingRates(true);
    setRatesMsg(null);
    try {
      await refreshFxRates();
      setRatesMsg("Cotações atualizadas com sucesso!");
    } finally {
      setRefreshingRates(false);
      setTimeout(() => setRatesMsg(null), 3000);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const count = await syncMutationQueue();
      setSyncMessage(`${count} alterações sincronizadas com a nuvem!`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 3000);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.grayscale[800],
        borderRadius: radii.xl,
        borderWidth: 1,
        borderColor: colors.grayscale[500],
        padding: 20,
        gap: 16,
      }}
    >
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Compass size={18} color={colors.primary[100]} />
          <AppText variant="headline" style={{ fontWeight: "700" }}>
            Painel do Mochileiro
          </AppText>
        </View>
        <AppText variant="caption" color={colors.grayscale[300]}>
          Simule condições de viagem remota e sincronização offline-first
        </AppText>
      </View>

      {/* Status da Conexão */}
      <Card variant="surface" style={{ gap: 10, padding: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {state.isOfflineMode ? (
              <WifiOff size={16} color={colors.adventure.amber} />
            ) : (
              <Wifi size={16} color={colors.adventure.emerald} />
            )}
            <AppText variant="subheadline" style={{ fontWeight: "600" }}>
              {state.isOfflineMode ? "Modo Offline (Trilha/Voo)" : "Conexão Ativa"}
            </AppText>
          </View>
          <Badge
            label={state.isOfflineMode ? "SEM SINAL" : "ONLINE"}
            variant={state.isOfflineMode ? "amber" : "emerald"}
            size="sm"
          />
        </View>

        <TouchableOpacity
          onPress={toggleOfflineMode}
          activeOpacity={0.8}
          style={{
            backgroundColor: state.isOfflineMode
              ? "rgba(245, 158, 11, 0.15)"
              : "rgba(16, 185, 129, 0.15)",
            borderWidth: 1,
            borderColor: state.isOfflineMode
              ? colors.adventure.amber
              : colors.adventure.emerald,
            paddingVertical: 8,
            borderRadius: radii.sm,
            alignItems: "center",
          }}
        >
          <AppText
            variant="caption"
            color={
              state.isOfflineMode
                ? colors.adventure.amber
                : colors.adventure.emerald
            }
            style={{ fontWeight: "600" }}
          >
            {state.isOfflineMode
              ? "Ativar Conexão (Chegou no Wi-Fi)"
              : "Entrar em Modo Sem Sinal"}
          </AppText>
        </TouchableOpacity>
      </Card>

      {/* Fila de Mutações Offline */}
      <Card variant="surface" style={{ gap: 8, padding: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Database size={15} color={colors.adventure.sky} />
            <AppText variant="subheadline" style={{ fontWeight: "600" }}>
              Fila de Mutações
            </AppText>
          </View>
          <Badge
            label={`${state.mutationQueue.length} pendentes`}
            variant={state.mutationQueue.length > 0 ? "primary" : "neutral"}
            size="sm"
          />
        </View>
        <AppText variant="footnote" color={colors.grayscale[300]}>
          Operações gravadas no SQLite/AsyncStorage aguardando sincronização segura.
        </AppText>

        <Button
          title={syncing ? "Sincronizando..." : "Sincronizar com Nuvem"}
          variant="secondary"
          size="sm"
          disabled={state.mutationQueue.length === 0 || syncing}
          loading={syncing}
          icon={<RefreshCw size={13} color={colors.grayscale[100]} />}
          onPress={handleSync}
        />
        {syncMessage && (
          <AppText variant="footnote" color={colors.adventure.emerald}>
            ✓ {syncMessage}
          </AppText>
        )}
      </Card>

      {/* Snapshot de Taxas de Câmbio */}
      <Card variant="surface" style={{ gap: 8, padding: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Coins size={15} color={colors.adventure.amber} />
            <AppText variant="subheadline" style={{ fontWeight: "600" }}>
              Câmbio em Cache
            </AppText>
          </View>
          <Badge label="OFFLINE" variant="amber" size="sm" />
        </View>
        <AppText variant="footnote" color={colors.grayscale[300]}>
          1 USD = R$ {state.rates.BRL.toFixed(2)} | ฿ {state.rates.THB.toFixed(1)} | € {state.rates.EUR.toFixed(2)}
        </AppText>

        <TouchableOpacity
          onPress={handleRefreshFx}
          activeOpacity={0.8}
          disabled={refreshingRates}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            backgroundColor: colors.grayscale[600],
            paddingVertical: 7,
            borderRadius: radii.sm,
            borderWidth: 1,
            borderColor: colors.grayscale[500],
          }}
        >
          <RefreshCw
            size={12}
            color={colors.adventure.amber}
          />
          <AppText variant="caption" color={colors.adventure.amber}>
            {refreshingRates
              ? "Buscando da API de Câmbio..."
              : "Atualizar Snapshot de Cotações"}
          </AppText>
        </TouchableOpacity>
        {ratesMsg && (
          <AppText variant="footnote" color={colors.adventure.emerald}>
            ✓ {ratesMsg}
          </AppText>
        )}
      </Card>

      {/* Plano Freemium vs Mochileiro Pro */}
      <Card
        variant="surface"
        style={{
          gap: 8,
          padding: 12,
          borderColor: isPro ? colors.adventure.amber : colors.grayscale[500],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Crown
              size={15}
              color={isPro ? colors.adventure.amber : colors.primary[100]}
            />
            <AppText variant="subheadline" style={{ fontWeight: "600" }}>
              Plano Atual
            </AppText>
          </View>
          <Badge
            label={isPro ? "MOCHILEIRO PRO" : "GRATUITO (1 Viagem)"}
            variant={isPro ? "amber" : "neutral"}
            size="sm"
          />
        </View>

        <TouchableOpacity
          onPress={isPro ? downgradeToFree : upgradeToPro}
          activeOpacity={0.8}
          style={{
            backgroundColor: isPro
              ? colors.grayscale[600]
              : colors.primary[100],
            paddingVertical: 8,
            borderRadius: radii.sm,
            alignItems: "center",
          }}
        >
          <AppText
            variant="caption"
            color={colors.grayscale[100]}
            style={{ fontWeight: "700" }}
          >
            {isPro ? "Alternar para Plano Gratuito" : "Desbloquear Mochileiro Pro"}
          </AppText>
        </TouchableOpacity>
      </Card>

      {/* Resetar Demo */}
      <TouchableOpacity
        onPress={resetToSeed}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingVertical: 6,
        }}
      >
        <RotateCcw size={13} color={colors.grayscale[300]} />
        <AppText variant="footnote" color={colors.grayscale[300]}>
          Restaurar Dados Iniciais da Viagem
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

