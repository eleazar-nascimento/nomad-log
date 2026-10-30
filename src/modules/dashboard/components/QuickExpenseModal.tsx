import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X, Check, Utensils, Bus, Bed, Compass, Wrench, AlertTriangle, MoreHorizontal } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Input } from "@/components/ui";
import {
  useAppStore,
  CurrencyCode,
  ExpenseCategory,
  PaymentMethod,
  DEFAULT_CURRENCIES,
  convertCurrency,
  formatMoney,
} from "@/store";

const CATEGORIES: { id: ExpenseCategory; label: string; icon: any }[] = [
  { id: "food", label: "Comida", icon: Utensils },
  { id: "transport", label: "Transporte", icon: Bus },
  { id: "stay", label: "Hospedagem", icon: Bed },
  { id: "activity", label: "Passeio", icon: Compass },
  { id: "gear", label: "Equipamento", icon: Wrench },
  { id: "emergency", label: "Emergência", icon: AlertTriangle },
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "cash", label: "💵 Dinheiro Vivo" },
  { id: "wise", label: "💳 Wise / Nomad" },
  { id: "card", label: "💳 Cartão Crédito" },
];

export const QuickExpenseModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  initialDescription?: string;
  initialLocation?: string;
  initialAmount?: string;
  initialCurrency?: CurrencyCode;
  initialCategory?: ExpenseCategory;
  onExpenseCreated?: (expenseId: string) => void;
}> = ({
  visible,
  onClose,
  initialDescription,
  initialLocation,
  initialAmount,
  initialCurrency,
  initialCategory,
  onExpenseCreated,
}) => {
  const { activeTrip, addExpense, state } = useAppStore();

  const [amount, setAmount] = useState(initialAmount || "");
  const [currency, setCurrency] = useState<CurrencyCode>(
    initialCurrency || activeTrip?.localCurrencies[0] || "THB"
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    initialCategory || "food"
  );
  const [description, setDescription] = useState(initialDescription || "");
  const [locationName, setLocationName] = useState(initialLocation || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  // Atualiza os campos sempre que o modal abre com dados iniciais
  React.useEffect(() => {
    if (visible) {
      if (initialAmount !== undefined) setAmount(initialAmount);
      if (initialDescription !== undefined) setDescription(initialDescription);
      if (initialLocation !== undefined) setLocationName(initialLocation);
      if (initialCurrency) setCurrency(initialCurrency);
      if (initialCategory) setCategory(initialCategory);
    }
  }, [visible, initialAmount, initialDescription, initialLocation, initialCurrency, initialCategory]);

  const parsedAmount = parseFloat(amount.replace(",", ".")) || 0;
  const convertedBase = activeTrip
    ? convertCurrency(parsedAmount, currency, activeTrip.baseCurrency, state.rates)
    : 0;

  const handleSave = () => {
    if (parsedAmount <= 0) return;

    const generatedId = `exp_${Date.now()}`;
    addExpense({
      amount: parsedAmount,
      currency,
      category,
      description: description.trim() || `${category.toUpperCase()} em viagem`,
      locationName: locationName.trim() || "Parada offline",
      paymentMethod,
    });

    onExpenseCreated?.(generatedId);

    // Limpa campos e fecha
    setAmount("");
    setDescription("");
    setLocationName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <View>
              <AppText variant="headline" style={{ fontWeight: "700" }}>
                Novo Gasto Offline
              </AppText>
              <AppText variant="caption" color={colors.adventure.amber}>
                Conversão em tempo real sem internet
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
            {/* Seletor de Moeda */}
            <View style={{ gap: 8 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Moeda do Pagamento
              </AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {(activeTrip?.localCurrencies || ["THB", "VND", "USD", "BRL"]).map(
                  (cur) => {
                    const info = DEFAULT_CURRENCIES[cur];
                    const isSelected = currency === cur;
                    return (
                      <TouchableOpacity
                        key={cur}
                        onPress={() => setCurrency(cur)}
                        activeOpacity={0.8}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: radii.md,
                          backgroundColor: isSelected
                            ? "rgba(255, 104, 56, 0.2)"
                            : colors.grayscale[600],
                          borderWidth: 1,
                          borderColor: isSelected
                            ? colors.primary[100]
                            : colors.grayscale[500],
                        }}
                      >
                        <AppText variant="body">{info?.flag || "🌐"}</AppText>
                        <AppText
                          variant="caption"
                          color={
                            isSelected
                              ? colors.primary[100]
                              : colors.grayscale[200]
                          }
                          style={{ fontWeight: "700" }}
                        >
                          {cur} ({info?.symbol || ""})
                        </AppText>
                      </TouchableOpacity>
                    );
                  }
                )}
              </ScrollView>
            </View>

            {/* Valor */}
            <View style={{ gap: 6 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Valor na Moeda Local ({currency})
              </AppText>
              <Input
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={{ fontSize: 22, fontWeight: "700" }}
              />
              {parsedAmount > 0 && activeTrip && (
                <View
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    padding: 8,
                    borderRadius: radii.sm,
                    borderWidth: 1,
                    borderColor: "rgba(245, 158, 11, 0.25)",
                  }}
                >
                  <AppText variant="footnote" color={colors.adventure.amber}>
                    ≈ {formatMoney(convertedBase, activeTrip.baseCurrency)} convertido na taxa offline (1 {currency} = R$ {(convertedBase / (parsedAmount || 1)).toFixed(4)})
                  </AppText>
                </View>
              )}
            </View>

            {/* Categorias */}
            <View style={{ gap: 8 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Categoria
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      activeOpacity={0.8}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: radii.md,
                        backgroundColor: isSelected
                          ? "rgba(16, 185, 129, 0.2)"
                          : colors.grayscale[600],
                        borderWidth: 1,
                        borderColor: isSelected
                          ? colors.adventure.emerald
                          : colors.grayscale[500],
                      }}
                    >
                      <Icon
                        size={14}
                        color={
                          isSelected
                            ? colors.adventure.emerald
                            : colors.grayscale[300]
                        }
                      />
                      <AppText
                        variant="caption"
                        color={
                          isSelected
                            ? colors.adventure.emerald
                            : colors.grayscale[200]
                        }
                        style={{ fontWeight: "600" }}
                      >
                        {cat.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Descrição e Localização */}
            <Input
              label="Descrição do Gasto"
              placeholder="Ex: Pad Thai no mercado de rua"
              value={description}
              onChangeText={setDescription}
            />

            <Input
              label="Local da Despesa"
              placeholder="Ex: Chiang Mai Old City"
              value={locationName}
              onChangeText={setLocationName}
            />

            {/* Forma de Pagamento */}
            <View style={{ gap: 8 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Forma de Pagamento
              </AppText>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      onPress={() => setPaymentMethod(method.id)}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 6,
                        borderRadius: radii.sm,
                        backgroundColor: isSelected
                          ? colors.grayscale[500]
                          : colors.grayscale[600],
                        borderWidth: 1,
                        borderColor: isSelected
                          ? colors.grayscale[200]
                          : colors.grayscale[500],
                        alignItems: "center",
                      }}
                    >
                      <AppText
                        variant="footnote"
                        color={
                          isSelected
                            ? colors.grayscale[100]
                            : colors.grayscale[300]
                        }
                        style={{ fontWeight: "600" }}
                      >
                        {method.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Botão de Salvar */}
            <Button
              title="Salvar Despesa no Diário"
              variant="primary"
              size="lg"
              disabled={parsedAmount <= 0}
              onPress={handleSave}
              icon={<Check size={18} color={colors.grayscale[100]} />}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

