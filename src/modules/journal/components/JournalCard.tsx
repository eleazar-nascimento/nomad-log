import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import {
  MapPin,
  Calendar,
  Mountain,
  Sun,
  CloudRain,
  CloudFog,
  Snowflake,
  Zap,
  Trash2,
  Sparkles,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge } from "@/components/ui";
import { JournalEntry, JournalMood, WeatherTag, useAppStore } from "@/store";

const MOOD_CONFIG: Record<
  JournalMood,
  { label: string; variant: "primary" | "emerald" | "amber" | "sky" | "purple" }
> = {
  amazed: { label: "✨ Maravilhado", variant: "amber" },
  tired_happy: { label: "😴 Cansado & Feliz", variant: "emerald" },
  adventurous: { label: "🧗 Aventureiro", variant: "primary" },
  peaceful: { label: "🧘 Em Paz", variant: "sky" },
  challenged: { label: "⚡ Desafiado", variant: "purple" },
};

const WEATHER_ICONS: Record<WeatherTag, any> = {
  sunny: Sun,
  rainy: CloudRain,
  foggy: CloudFog,
  cold: Snowflake,
  stormy: Zap,
};

export const JournalCard: React.FC<{
  entry: JournalEntry;
}> = ({ entry }) => {
  const { deleteJournalEntry } = useAppStore();
  const moodCfg = MOOD_CONFIG[entry.mood] || {
    label: entry.mood,
    variant: "neutral",
  };
  const WeatherIcon = WEATHER_ICONS[entry.weather] || Sun;

  return (
    <Card
      variant="surface"
      style={{
        gap: 12,
        padding: 0,
        overflow: "hidden",
        borderColor: colors.grayscale[500],
      }}
    >
      {/* Imagem de Capa se houver fotos */}
      {entry.photos && entry.photos.length > 0 && (
        <View style={{ height: 180, position: "relative" }}>
          <Image
            source={{ uri: entry.photos[0] }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(10, 13, 20, 0.4)",
            }}
          />

          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Badge label={moodCfg.label} variant={moodCfg.variant} size="sm" />
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "rgba(15, 18, 26, 0.75)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WeatherIcon size={14} color={colors.grayscale[100]} />
            </View>
          </View>
        </View>
      )}

      {/* Conteúdo da memória */}
      <View style={{ padding: 16, gap: 10 }}>
        {!entry.photos?.length && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Badge label={moodCfg.label} variant={moodCfg.variant} size="sm" />
            <WeatherIcon size={16} color={colors.adventure.amber} />
          </View>
        )}

        <View style={{ gap: 4 }}>
          <AppText variant="headline" style={{ fontWeight: "700" }}>
            {entry.title}
          </AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <MapPin size={12} color={colors.adventure.amber} />
              <AppText variant="caption" color={colors.grayscale[300]}>
                {entry.location}
              </AppText>
            </View>

            {entry.altitudeMeters ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Mountain size={12} color={colors.adventure.sky} />
                <AppText
                  variant="caption"
                  color={colors.adventure.sky}
                  style={{ fontWeight: "600" }}
                >
                  {entry.altitudeMeters}m altitude
                </AppText>
              </View>
            ) : null}
          </View>
        </View>

        {/* Texto do diário */}
        <AppText
          variant="body"
          color={colors.grayscale[200]}
          style={{ lineHeight: 22 }}
        >
          {entry.content}
        </AppText>

        {/* Tags e Rodapé com data */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopWidth: 1,
            borderColor: colors.grayscale[500],
            paddingTop: 10,
            marginTop: 4,
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 }}>
            {entry.tags.map((t) => (
              <AppText
                key={t}
                variant="footnote"
                color={colors.primary[100]}
                style={{ fontWeight: "600" }}
              >
                {t}
              </AppText>
            ))}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <AppText variant="footnote" color={colors.grayscale[400]}>
              {entry.date} às {entry.time}
            </AppText>
            <TouchableOpacity
              onPress={() => deleteJournalEntry(entry.id)}
              style={{ padding: 4 }}
            >
              <Trash2 size={13} color={colors.grayscale[400]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

