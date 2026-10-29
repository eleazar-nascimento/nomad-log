import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import {
  X,
  Crown,
  Check,
  ShieldCheck,
  Cloud,
  FileSpreadsheet,
  Globe,
  Sparkles,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Card, Badge } from "@/components/ui";
import { useAppStore } from "@/store";

export const ProUpgradeModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { isPro, upgradeToPro, downgradeToFree } = useAppStore();
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
      title: "Viagens Ilimitadas Simultâneas",
      description: "Planeje quantos mochilões e expedições quiser sem limite de 1 viagem ativa.",
    },
    {
      icon: Cloud,
      title: "Backup Criptografado na Nuvem",
      description: "Suas memórias e gastos ficam protegidos no dispositivo e sincronizam quando encontrar Wi-Fi.",
    },
    {
      icon: Sparkles,
      title: "Conversor com Histórico Offline",
      description: "Acesse gráficos de flutuação e taxas congeladas de mais de 150 moedas internacionais.",
    },
    {
      icon: FileSpreadsheet,
      title: "Exportação em PDF e Planilha CSV",
      description: "Gere relatórios completos de despesas para dividir com amigos ou prestação de contas.",
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
                Pacote Mochileiro Pro
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
                Viaje para qualquer canto do planeta sem se preocupar.
              </AppText>
              <AppText variant="body2" color={colors.grayscale[300]}>
                Feito sob medida para quem pega estradas remotas, faz trilhas nas
                montanhas ou vive o estilo nômade internacional.
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
                      Acesso Vitalício
                    </AppText>
                    <Badge label="MELHOR VALOR" variant="amber" size="sm" />
                  </View>
                  <AppText variant="footnote" color={colors.grayscale[300]}>
                    Pague uma única vez. Atualizações para sempre.
                  </AppText>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <AppText
                    variant="title2"
                    color={colors.adventure.amber}
                    style={{ fontWeight: "700" }}
                  >
                    R$ 59,90
                  </AppText>
                  <AppText variant="caption" color={colors.grayscale[400]}>
                    pagamento único
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
                    Plano Anual
                  </AppText>
                  <AppText variant="footnote" color={colors.grayscale[300]}>
                    Equivalente a R$ 2,90 / mês
                  </AppText>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <AppText variant="title3" style={{ fontWeight: "700" }}>
                    R$ 34,90
                  </AppText>
                  <AppText variant="caption" color={colors.grayscale[400]}>
                    por ano
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
                    ✓ Você já possui o Mochileiro Pro Ativo!
                  </AppText>
                </View>
                <Button
                  title="Voltar ao Plano Gratuito (Teste)"
                  variant="secondary"
                  size="sm"
                  onPress={downgradeToFree}
                />
              </View>
            ) : (
              <Button
                title={
                  selectedPlan === "lifetime"
                    ? "Garantir Mochileiro Pro Vitalício (R$ 59,90)"
                    : "Assinar Plano Anual (R$ 34,90)"
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
                🎉 Parabéns! Recursos Pro Desbloqueados com Sucesso!
              </AppText>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

