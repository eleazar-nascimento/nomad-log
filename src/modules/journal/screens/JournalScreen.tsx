import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Plus, BookOpen, Sparkles, Camera } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Card, OfflineBanner } from "@/components/ui";
import { TopHeader } from "@/components/layout";
import { JournalCard } from "../components/JournalCard";
import { NewJournalModal } from "../components/NewJournalModal";
import { useAppStore } from "@/store";

export const JournalScreen: React.FC<{
  onOpenTripModal: () => void;
  onOpenProModal: () => void;
}> = ({ onOpenTripModal, onOpenProModal }) => {
  const { activeTrip, activeTripJournal } = useAppStore();
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
                Diário de Bordo & Histórias
              </AppText>
            </View>
            <AppText variant="caption" color={colors.grayscale[300]}>
              {activeTripJournal.length} memórias registradas 100% offline
            </AppText>
          </View>

          <Button
            title="Nova Nota"
            variant="primary"
            size="sm"
            onPress={() => setModalOpen(true)}
            icon={<Plus size={14} color={colors.grayscale[100]} />}
          />
        </Card>

        {/* Lista de Memórias */}
        {activeTripJournal.length === 0 ? (
          <Card
            variant="surface"
            style={{ padding: 30, alignItems: "center", gap: 8 }}
          >
            <Camera size={32} color={colors.grayscale[400]} />
            <AppText variant="subheadline" style={{ fontWeight: "600" }}>
              Nenhuma memória escrita ainda
            </AppText>
            <AppText
              variant="footnote"
              color={colors.grayscale[300]}
              align="center"
            >
              Guarde os momentos mais marcantes da sua jornada sem precisar de
              conexão com a internet.
            </AppText>
          </Card>
        ) : (
          <View style={{ gap: 16 }}>
            {activeTripJournal.map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
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

