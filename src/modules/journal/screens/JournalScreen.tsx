import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Plus, BookOpen, Camera } from "lucide-react-native";
import { colors } from "@/theme";
import { AppText, Button, Card, OfflineBanner, AnimatedContainer } from "@/components/ui";
import { TopHeader } from "@/components/layout";
import { JournalCard } from "../components/JournalCard";
import { NewJournalModal } from "../components/NewJournalModal";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export const JournalScreen: React.FC<{
  onOpenTripModal: () => void;
  onOpenProModal: () => void;
}> = ({ onOpenTripModal, onOpenProModal }) => {
  const { activeTrip, activeTripJournal } = useAppStore();
  const { t } = useTranslation();
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
        {/* Banner do Diário */}
        <AnimatedContainer delay={40}>
          <Card
            variant="surface"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderColor: colors.grayscale[500],
            }}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <BookOpen size={16} color={colors.primary[100]} />
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  {t.journal.bannerTitle}
                </AppText>
              </View>
              <AppText variant="caption" color={colors.grayscale[300]}>
                {activeTripJournal.length} {t.journal.offlineMemories}
              </AppText>
            </View>

            <Button
              title={t.journal.newNote}
              variant="primary"
              size="sm"
              onPress={() => setModalOpen(true)}
              icon={<Plus size={14} color={colors.grayscale[100]} />}
            />
          </Card>
        </AnimatedContainer>

        {/* Lista de Memórias */}
        {activeTripJournal.length === 0 ? (
          <Card
            variant="surface"
            style={{ padding: 30, alignItems: "center", gap: 8 }}
          >
            <Camera size={32} color={colors.grayscale[400]} />
            <AppText variant="subheadline" style={{ fontWeight: "600" }}>
              {t.journal.noMemories}
            </AppText>
            <AppText
              variant="footnote"
              color={colors.grayscale[300]}
              align="center"
            >
              {t.journal.noMemoriesDesc}
            </AppText>
          </Card>
        ) : (
          <View style={{ gap: 16 }}>
            {activeTripJournal.map((entry, idx) => (
              <AnimatedContainer key={entry.id} delay={100 + idx * 60}>
                <JournalCard entry={entry} />
              </AnimatedContainer>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal Nova Memória */}
      <NewJournalModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </View>
  );
};

