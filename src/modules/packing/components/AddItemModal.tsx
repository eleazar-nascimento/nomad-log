import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X, Check } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Input } from "@/components/ui";
import { useAppStore, PackingCategory } from "@/store";

const CATEGORIES: { id: PackingCategory; label: string }[] = [
  { id: "documentos", label: "Documentos" },
  { id: "equipamentos", label: "Equipamentos" },
  { id: "roupas", label: "Roupas" },
  { id: "farmacia", label: "Farmácia" },
  { id: "outros", label: "Outros" },
];

export const AddItemModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { addPackingItem } = useAppStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<PackingCategory>("equipamentos");
  const [weightGrams, setWeightGrams] = useState("");
  const [notes, setNotes] = useState("");
  const [essential, setEssential] = useState(true);

  const handleSave = () => {
    if (!name.trim()) return;

    addPackingItem({
      name: name.trim(),
      category,
      essential,
      weightGrams: weightGrams ? parseInt(weightGrams, 10) : undefined,
      notes: notes.trim() || undefined,
    });

    setName("");
    setWeightGrams("");
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
              Adicionar Item à Mochila
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

          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
            {/* Categoria */}
            <View style={{ gap: 8 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Categoria
              </AppText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      activeOpacity={0.8}
                      style={{
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
                      <AppText
                        variant="caption"
                        color={
                          isSelected
                            ? colors.primary[100]
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

            <Input
              label="Nome do Item"
              placeholder="Ex: Canivete suíço / Meias térmicas"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Peso aproximado (em gramas)"
              placeholder="Ex: 250"
              keyboardType="numeric"
              value={weightGrams}
              onChangeText={setWeightGrams}
            />

            <Input
              label="Observação ou Dica"
              placeholder="Ex: Guardar no bolso de fácil acesso"
              value={notes}
              onChangeText={setNotes}
            />

            <Button
              title="Incluir na Lista de Bagagem"
              variant="primary"
              size="lg"
              disabled={!name.trim()}
              onPress={handleSave}
              icon={<Check size={18} color={colors.grayscale[100]} />}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

