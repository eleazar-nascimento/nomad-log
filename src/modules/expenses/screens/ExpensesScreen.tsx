import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Plus, Receipt, Wallet, Filter, Coins } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Card, OfflineBanner, AnimatedContainer, AnimatedNumber } from "@/components/ui";
import { TopHeader } from "@/components/layout";
import { CurrencyConverterWidget } from "../components/CurrencyConverterWidget";
import { ExpenseCategoryBar } from "../components/ExpenseCategoryBar";
import { ExpenseItemRow } from "../components/ExpenseItemRow";
import { QuickExpenseModal } from "@/modules/dashboard/components/QuickExpenseModal";
import { useAppStore, formatMoney } from "@/store";

export const ExpensesScreen: React.FC<{
  onOpenTripModal: () => void;
  onOpenProModal: () => void;
}> = ({ onOpenTripModal, onOpenProModal }) => {
  const { activeTrip, activeTripExpenses, totalSpentBase, remainingBudgetBase } =
    useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  if (!activeTrip) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.grayscale[700] }}>
      <TopHeader
        onOpenTripManager={onOpenTripModal}
        onOpenProModal={onOpenProModal}
      />
      <OfflineBanner onPress={onOpenProModal} />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de Orçamento Resumido */}
        <AnimatedContainer delay={40}>
          <Card
            variant="highlight"
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
            }}
          >
            <View style={{ gap: 2 }}>
              <AppText variant="caption" color={colors.adventure.amber}>
                Total Gasto na Viagem
              </AppText>
              <AnimatedNumber
                value={totalSpentBase}
                prefix={activeTrip.baseCurrency === "BRL" ? "R$ " : "$ "}
                variant="title1"
                style={{ fontWeight: "700" }}
              />
              <AppText variant="footnote" color={colors.grayscale[300]}>
                Saldo restante: {formatMoney(remainingBudgetBase, activeTrip.baseCurrency)}
              </AppText>
            </View>

            <Button
              title="Lançar Gasto"
              variant="primary"
              size="sm"
              onPress={() => setModalOpen(true)}
              icon={<Plus size={14} color={colors.grayscale[100]} />}
            />
          </Card>
        </AnimatedContainer>

        {/* Conversor de Câmbio em Tempo Real sem Internet */}
        <AnimatedContainer delay={110}>
          <CurrencyConverterWidget />
        </AnimatedContainer>

        {/* Distribuição por Categoria */}
        <AnimatedContainer delay={180}>
          <ExpenseCategoryBar expenses={activeTripExpenses} />
        </AnimatedContainer>

        {/* Extrato de Despesas */}
        <AnimatedContainer delay={250}>
          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Receipt size={16} color={colors.primary[100]} />
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  Histórico de Gastos ({activeTripExpenses.length})
                </AppText>
              </View>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Armazenado localmente
              </AppText>
            </View>

            {activeTripExpenses.length === 0 ? (
              <Card variant="surface" style={{ padding: 24, alignItems: "center", gap: 6 }}>
                <Coins size={24} color={colors.grayscale[400]} />
                <AppText variant="subheadline" color={colors.grayscale[300]}>
                  Nenhum gasto registrado nesta viagem.
                </AppText>
              </Card>
            ) : (
              <View style={{ gap: 8 }}>
                {activeTripExpenses.map((exp, index) => (
                  <AnimatedContainer key={exp.id} delay={index * 30}>
                    <ExpenseItemRow expense={exp} />
                  </AnimatedContainer>
                ))}
              </View>
            )}
          </View>
        </AnimatedContainer>
      </ScrollView>

      {/* Modal de Lançamento */}
      <QuickExpenseModal visible={modalOpen} onClose={() => setModalOpen(false)} />
    </View>
  );
};

