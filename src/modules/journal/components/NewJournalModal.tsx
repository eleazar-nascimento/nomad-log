import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  X,
  Check,
  Camera,
  Sun,
  CloudRain,
  CloudFog,
  Snowflake,
  Zap,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Button, Input } from "@/components/ui";
import { useAppStore, JournalMood, WeatherTag } from "@/store";

const MOODS: { id: JournalMood; label: string }[] = [
  { id: "amazed", label: "✨ Maravilhado" },
  { id: "adventurous", label: "🧗 Aventureiro" },
  { id: "peaceful", label: "🧘 Em Paz" },
  { id: "tired_happy", label: "😴 Cansado & Feliz" },
  { id: "challenged", label: "⚡ Desafiado" },
];

const WEATHERS: { id: WeatherTag; label: string; icon: any }[] = [
  { id: "sunny", label: "Ensolarado", icon: Sun },
  { id: "rainy", label: "Chuvoso", icon: CloudRain },
  { id: "foggy", label: "Neblina", icon: CloudFog },
  { id: "cold", label: "Frio", icon: Snowflake },
  { id: "stormy", label: "Tempestade", icon: Zap },
];

const SAMPLE_PHOTO_PRESETS = [
  "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512553353614-82a7370096dc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
];

export const NewJournalModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { addJournalEntry } = useAppStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [altitudeMeters, setAltitudeMeters] = useState("");
  const [mood, setMood] = useState<JournalMood>("adventurous");
  const [weather, setWeather] = useState<WeatherTag>("sunny");
  const [tagsStr, setTagsStr] = useState("#mochilao, #trilha");
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    SAMPLE_PHOTO_PRESETS[0]
  );

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    addJournalEntry({
      title: title.trim(),
      content: content.trim(),
      location: location.trim() || "Local da trilha",
      altitudeMeters: altitudeMeters ? parseInt(altitudeMeters, 10) : undefined,
      mood,
      weather,
      photos: selectedPhoto ? [selectedPhoto] : [],
      tags,
    });

    setTitle("");
    setContent("");
    setLocation("");
    setAltitudeMeters("");
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
            maxHeight: "92%",
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
                Nova Memória de Bordo
              </AppText>
              <AppText variant="caption" color={colors.primary[100]}>
                Gravada offline no armazenamento local
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
            contentContainerStyle={{ padding: 20, gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Escolha do Humor */}
            <View style={{ gap: 8 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Como você se sentiu hoje?
              </AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {MOODS.map((m) => {
                  const isSelected = mood === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => setMood(m.id)}
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
                        {m.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Clima do Momento */}
            <View style={{ gap: 8 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Clima da Região
              </AppText>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {WEATHERS.map((w) => {
                  const Icon = w.icon;
                  const isSelected = weather === w.id;
                  return (
                    <TouchableOpacity
                      key={w.id}
                      onPress={() => setWeather(w.id)}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        alignItems: "center",
                        gap: 4,
                        borderRadius: radii.sm,
                        backgroundColor: isSelected
                          ? "rgba(245, 158, 11, 0.2)"
                          : colors.grayscale[600],
                        borderWidth: 1,
                        borderColor: isSelected
                          ? colors.adventure.amber
                          : colors.grayscale[500],
                      }}
                    >
                      <Icon
                        size={16}
                        color={
                          isSelected
                            ? colors.adventure.amber
                            : colors.grayscale[300]
                        }
                      />
                      <AppText
                        variant="caption"
                        color={
                          isSelected
                            ? colors.adventure.amber
                            : colors.grayscale[300]
                        }
                      >
                        {w.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Título e Local */}
            <Input
              label="Título do Momento"
              placeholder="Ex: Subida ao topo do mirante ao pôr do sol"
              value={title}
              onChangeText={setTitle}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 2 }}>
                <Input
                  label="Localização / Cidade"
                  placeholder="Ex: Parque Doi Inthanon"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Altitude (m)"
                  placeholder="1850"
                  keyboardType="numeric"
                  value={altitudeMeters}
                  onChangeText={setAltitudeMeters}
                />
              </View>
            </View>

            {/* Narrativa */}
            <View style={{ gap: 6 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Relato da Experiência
              </AppText>
              <Input
                placeholder="Escreva tudo o que viveu, sentiu e descobriu hoje..."
                multiline
                numberOfLines={4}
                value={content}
                onChangeText={setContent}
                style={{
                  height: 100,
                  textAlignVertical: "top",
                  paddingTop: 10,
                }}
              />
            </View>

            {/* Foto Preset Local */}
            <View style={{ gap: 8 }}>
              <AppText variant="caption" color={colors.grayscale[300]}>
                Foto da Memória (Armazenada Offline)
              </AppText>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {SAMPLE_PHOTO_PRESETS.map((photoUri, idx) => {
                  const isSelected = selectedPhoto === photoUri;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setSelectedPhoto(photoUri)}
                      style={{
                        flex: 1,
                        height: 54,
                        borderRadius: radii.sm,
                        overflow: "hidden",
                        borderWidth: 2,
                        borderColor: isSelected
                          ? colors.primary[100]
                          : "transparent",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: colors.grayscale[500],
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Camera
                          size={18}
                          color={
                            isSelected
                              ? colors.primary[100]
                              : colors.grayscale[300]
                          }
                        />
                        <AppText
                          variant="caption"
                          color={
                            isSelected
                              ? colors.primary[100]
                              : colors.grayscale[300]
                          }
                        >
                          Foto {idx + 1}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Input
              label="Tags (separadas por vírgula)"
              placeholder="#mochilao, #trilha, #templos"
              value={tagsStr}
              onChangeText={setTagsStr}
            />

            <Button
              title="Salvar Memória no Diário"
              variant="primary"
              size="lg"
              disabled={!title.trim() || !content.trim()}
              onPress={handleSave}
              icon={<Check size={18} color={colors.grayscale[100]} />}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

