import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import {
  X,
  Compass,
  Plus,
  Check,
  Lock,
  Crown,
  Calendar,
  Trash2,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Card, Badge, Input } from "@/components/ui";
import { useAppStore, CurrencyCode, Trip } from "@/store";

export const TripManagerModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onOpenProModal: () => void;
}> = ({ visible, onClose, onOpenProModal }) => {
  const {
    state,
    activeTrip,
    setActiveTrip,
    createTrip,
    deleteTrip,
    isPro,
  } = useAppStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newBaseCurrency, setNewBaseCurrency] = useState<CurrencyCode>("BRL");
  const [newBudget, setNewBudget] = useState("3000");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateTrip = () => {
    if (!newTitle.trim() || !newDestination.trim()) return;

    const res = createTrip({
      title: newTitle.trim(),
      destination: newDestination.trim(),
      countries: [newDestination.split(",")[0].trim()],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 86400000 * 15).toISOString().split("T")[0],
      coverImage:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      baseCurrency: newBaseCurrency,
      localCurrencies: ["USD", newBaseCurrency],
      dailyBudgetBase: Math.round(Number(newBudget) / 15) || 200,
      totalBudgetBase: Number(newBudget) || 3000,
      status: "active",
      notes: "Criada offline.",
    });

    if (!res.success) {
      setErrorMessage(res.message || "Limite do plano gratuito atingido.");
      return;
    }

    // Sucesso
    setIsCreating(false);
    setNewTitle("");
    setNewDestination("");
    setErrorMessage(null);
    onClose();
  };

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
                Minhas Viagens
              </AppText>
              <AppText variant="caption" color={colors.grayscale[300]}>
                {state.trips.length} viagem(ns) cadastradas no aparelho
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
            contentContainerStyle={{ padding: 20, gap: 14 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Lista de Viagens Existentes */}
            {!isCreating && (
              <View style={{ gap: 12 }}>
                {state.trips.map((trip) => {
                  const isActive = trip.id === activeTrip?.id;
                  return (
                    <TouchableOpacity
                      key={trip.id}
                      activeOpacity={0.85}
                      onPress={() => {
                        setActiveTrip(trip.id);
                        onClose();
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.grayscale[600],
                        borderRadius: radii.lg,
                        padding: 12,
                        borderWidth: 2,
                        borderColor: isActive
                          ? colors.primary[100]
                          : colors.grayscale[500],
                        gap: 12,
                      }}
                    >
                      <Image
                        source={{ uri: trip.coverImage }}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: radii.md,
                        }}
                      />

                      <View style={{ flex: 1, gap: 2 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <AppText
                            variant="subheadline"
                            style={{ fontWeight: "700" }}
                            numberOfLines={1}
                          >
                            {trip.title}
                          </AppText>
                          {isActive && (
                            <Badge label="ATIVA" variant="primary" size="sm" />
                          )}
                        </View>
                        <AppText variant="caption" color={colors.grayscale[300]}>
                          {trip.destination}
                        </AppText>
                        <AppText variant="caption" color={colors.adventure.amber}>
                          Base: {trip.baseCurrency} • Orçamento: R$ {trip.totalBudgetBase}
                        </AppText>
                      </View>

                      {state.trips.length > 1 && !isActive && (
                        <TouchableOpacity
                          onPress={() => deleteTrip(trip.id)}
                          style={{ padding: 6 }}
                        >
                          <Trash2 size={16} color={colors.grayscale[400]} />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  );
                })}

                {/* Botão de Nova Viagem */}
                <Button
                  title="+ Planejar Nova Viagem"
                  variant="primary"
                  size="md"
                  onPress={() => {
                    if (!isPro && state.trips.length >= 1) {
                      setErrorMessage(
                        "O plano gratuito permite 1 viagem ativa. Faça upgrade para o Mochileiro Pro para criar múltiplas viagens simultâneas!"
                      );
                    } else {
                      setIsCreating(true);
                      setErrorMessage(null);
                    }
                  }}
                  icon={<Plus size={16} color={colors.grayscale[100]} />}
                />
              </View>
            )}

            {/* Alerta de Cota Freemium */}
            {errorMessage && (
              <Card
                variant="accent"
                style={{ gap: 8, borderColor: colors.primary[100] }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Lock size={15} color={colors.primary[100]} />
                  <AppText variant="subheadline" style={{ fontWeight: "700" }}>
                    Cota do Plano Gratuito
                  </AppText>
                </View>
                <AppText variant="footnote" color={colors.grayscale[200]}>
                  {errorMessage}
                </AppText>
                <Button
                  title="Conhecer o Mochileiro Pro"
                  variant="primary"
                  size="sm"
                  onPress={() => {
                    onClose();
                    onOpenProModal();
                  }}
                  icon={<Crown size={14} color={colors.grayscale[100]} />}
                />
              </Card>
            )}

            {/* Formulário de Criação de Viagem */}
            {isCreating && (
              <View style={{ gap: 14 }}>
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  Planejar Nova Aventura
                </AppText>

                <Input
                  label="Nome da Viagem"
                  placeholder="Ex: Travessia Patagônia 2027"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />

                <Input
                  label="Destino / Países"
                  placeholder="Ex: Chile & Argentina"
                  value={newDestination}
                  onChangeText={setNewDestination}
                />

                <Input
                  label="Orçamento Total Estimado (R$)"
                  placeholder="Ex: 5000"
                  keyboardType="numeric"
                  value={newBudget}
                  onChangeText={setNewBudget}
                />

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Button
                    title="Cancelar"
                    variant="secondary"
                    size="md"
                    style={{ flex: 1 }}
                    onPress={() => {
                      setIsCreating(false);
                      setErrorMessage(null);
                    }}
                  />
                  <Button
                    title="Salvar Viagem"
                    variant="primary"
                    size="md"
                    style={{ flex: 1 }}
                    disabled={!newTitle.trim() || !newDestination.trim()}
                    onPress={handleCreateTrip}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

