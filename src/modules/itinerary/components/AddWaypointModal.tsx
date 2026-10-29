import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X, Check, Plane, Bus, Train, Mountain, Bed, Compass, Utensils } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Input } from "@/components/ui";
import { useAppStore, WaypointType } from "@/store";

const WAYPOINT_TYPES: { id: WaypointType; label: string; icon: any }[] = [
  { id: "trek", label: "Trilha", icon: Mountain },
  { id: "sight", label: "Passeio", icon: Compass },
  { id: "hostel", label: "Hospedagem", icon: Bed },
  { id: "bus", label: "Ônibus", icon: Bus },
  { id: "train", label: "Trem", icon: Train },
  { id: "flight", label: "Voo", icon: Plane },
  { id: "food", label: "Refeição", icon: Utensils },
];

export const AddWaypointModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  defaultDayIndex?: number;
}> = ({ visible, onClose, defaultDayIndex = 1 }) => {
  const { addWaypoint } = useAppStore();

  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [dayIndex, setDayIndex] = useState(defaultDayIndex);
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState<WaypointType>("trek");
  const [elevationMeters, setElevationMeters] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!title.trim() || !locationName.trim()) return;

    addWaypoint({
      dayIndex,
      date: `Dia ${dayIndex}`,
      time: time.trim() || "10:00",
      title: title.trim(),
      type,
      locationName: locationName.trim(),
      elevationMeters: elevationMeters ? parseInt(elevationMeters, 10) : undefined,
      distanceKm: distanceKm ? parseFloat(distanceKm.replace(",", ".")) : undefined,
      notes: notes.trim() || undefined,
    });

    // Reset e fecha
    setTitle("");
    setLocationName("");
    setElevationMeters("");
    setDistanceKm("");
    setNotes("");
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
            <AppText variant="headline" style={{ fontWeight: "700" }}>
              Adicionar Parada ao Roteiro
            </AppText>
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
            contentContainerStyle={{ padding: 20, gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Seletor de Tipo */}
            <View style={{ gap: 8 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Tipo de Atividade / Transporte
              </AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {WAYPOINT_TYPES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = type === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => setType(t.id)}
                      activeOpacity={0.8}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: radii.md,
                        backgroundColor: isSelected
                          ? "rgba(56, 189, 248, 0.2)"
                          : colors.grayscale[600],
                        borderWidth: 1,
                        borderColor: isSelected
                          ? colors.adventure.sky
                          : colors.grayscale[500],
                      }}
                    >
                      <Icon
                        size={14}
                        color={
                          isSelected
                            ? colors.adventure.sky
                            : colors.grayscale[300]
                        }
                      />
                      <AppText
                        variant="caption"
                        color={
                          isSelected
                            ? colors.adventure.sky
                            : colors.grayscale[200]
                        }
                        style={{ fontWeight: "700" }}
                      >
                        {t.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Título */}
            <Input
              label="Nome da Atividade ou Destino"
              placeholder="Ex: Trilha das 7 Quedas / Check-in Hostel"
              value={title}
              onChangeText={setTitle}
            />

            {/* Localização */}
            <Input
              label="Local / Ponto de Referência"
              placeholder="Ex: Chiang Mai Old City / Parque Nacional"
              value={locationName}
              onChangeText={setLocationName}
            />

            {/* Dia e Horário */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Dia da Viagem (Número)"
                  placeholder="1"
                  keyboardType="numeric"
                  value={String(dayIndex)}
                  onChangeText={(val) => setDayIndex(parseInt(val, 10) || 1)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Horário (HH:MM)"
                  placeholder="09:30"
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>

            {/* Altimetria e Distância (Opcionais) */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Altitude Estimada (m)"
                  placeholder="Ex: 1850"
                  keyboardType="numeric"
                  value={elevationMeters}
                  onChangeText={setElevationMeters}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Distância (km)"
                  placeholder="Ex: 12.5"
                  keyboardType="numeric"
                  value={distanceKm}
                  onChangeText={setDistanceKm}
                />
              </View>
            </View>

            <Input
              label="Notas para o Roteiro Offline"
              placeholder="Ex: Levar lanterna de cabeça e 2L de água"
              value={notes}
              onChangeText={setNotes}
            />

            <Button
              title="Salvar Parada no Roteiro"
              variant="primary"
              size="lg"
              disabled={!title.trim() || !locationName.trim()}
              onPress={handleSave}
              icon={<Check size={18} color={colors.grayscale[100]} />}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

