import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Plus, Scale, Backpack } from "lucide-react-native";
import { colors } from "@/theme";
import { AppText, Button, Card, CircularProgress, OfflineBanner, AnimatedContainer } from "@/components/ui";
import { TopHeader } from "@/components/layout";
import { PackingCategorySection } from "../components/PackingCategorySection";
import { AddItemModal } from "../components/AddItemModal";
import { useAppStore, PackingCategory } from "@/store";
import { useTranslation } from "@/i18n";

const CATEGORIES_ORDER: PackingCategory[] = [
  "documentos",
  "equipamentos",
  "roupas",
  "farmacia",
  "outros",
];

export const PackingScreen: React.FC<{
  onOpenTripModal: () => void;
  onOpenProModal: () => void;
}> = ({ onOpenTripModal, onOpenProModal }) => {
  const { activeTrip, activeTripPacking, packingProgress } = useAppStore();
  const { t, isPt } = useTranslation();
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
        {/* Banner com Anel de Progresso Circular */}
        <AnimatedContainer delay={40}>
          <Card
            variant="surface"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 18,
              borderColor: colors.grayscale[500],
            }}
          >
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Backpack size={16} color={colors.primary[100]} />
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  {t.packing.backpackStatus}
                </AppText>
              </View>
              <AppText variant="title3" style={{ fontWeight: "700" }}>
                {isPt
                  ? `${packingProgress.packed} de ${packingProgress.total} ${t.packing.itemsCount}`
                  : `${packingProgress.packed} of ${packingProgress.total} ${t.packing.itemsCount}`}
              </AppText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Scale size={13} color={colors.adventure.sky} />
                <AppText
                  variant="caption"
                  color={colors.adventure.sky}
                  style={{ fontWeight: "600" }}
                >
                  {t.packing.packedWeight}: {packingProgress.totalWeightKg} kg
                </AppText>
              </View>
            </View>

            <CircularProgress
              size={90}
              strokeWidth={8}
              progress={packingProgress.percentage}
              color={colors.adventure.emerald}
              trackColor={colors.grayscale[500]}
            />
          </Card>
        </AnimatedContainer>

        {/* Botão de Adicionar Item */}
        <AnimatedContainer delay={110}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AppText variant="headline" style={{ fontWeight: "700" }}>
              {t.packing.categoryLists}
            </AppText>
            <Button
              title={t.packing.newItem}
              variant="primary"
              size="sm"
              onPress={() => setModalOpen(true)}
              icon={<Plus size={13} color={colors.grayscale[100]} />}
            />
          </View>
        </AnimatedContainer>

        {/* Seções por categoria */}
        <View style={{ gap: 14 }}>
          {CATEGORIES_ORDER.map((cat, idx) => {
            const catItems = activeTripPacking.filter((i) => i.category === cat);
            if (catItems.length === 0 && cat === "outros") return null;
            return (
              <AnimatedContainer key={cat} delay={160 + idx * 50}>
                <PackingCategorySection
                  category={cat}
                  items={catItems}
                />
              </AnimatedContainer>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Adicionar Item */}
      <AddItemModal visible={modalOpen} onClose={() => setModalOpen(false)} />
    </View>
  );
};

