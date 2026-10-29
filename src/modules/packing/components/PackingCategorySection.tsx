import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
  FileText,
  Wrench,
  Shirt,
  ShieldAlert,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Trash2,
  Scale,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge } from "@/components/ui";
import {
  PackingCategory,
  PackingItem,
  useAppStore,
} from "@/store";

const CATEGORY_META: Record<
  PackingCategory,
  { label: string; icon: any; color: string }
> = {
  documentos: {
    label: "Documentos & Vistos",
    icon: FileText,
    color: colors.adventure.amber,
  },
  equipamentos: {
    label: "Equipamentos & Tech",
    icon: Wrench,
    color: colors.adventure.sky,
  },
  roupas: {
    label: "Vestuário & Calçados",
    icon: Shirt,
    color: colors.primary[100],
  },
  farmacia: {
    label: "Saúde & Farmácia",
    icon: ShieldAlert,
    color: colors.adventure.emerald,
  },
  outros: {
    label: "Outros Itens",
    icon: MoreHorizontal,
    color: colors.grayscale[300],
  },
};

export const PackingCategorySection: React.FC<{
  category: PackingCategory;
  items: PackingItem[];
}> = ({ category, items }) => {
  const { togglePackingItem, deletePackingItem } = useAppStore();
  const meta = CATEGORY_META[category] || CATEGORY_META.outros;
  const Icon = meta.icon;

  const packedCount = items.filter((i) => i.packed).length;

  return (
    <Card variant="surface" style={{ gap: 12, padding: 16 }}>
      {/* Cabeçalho da Categoria */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: colors.grayscale[500],
          paddingBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: colors.grayscale[700],
              borderWidth: 1,
              borderColor: meta.color,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={15} color={meta.color} />
          </View>
          <AppText variant="headline" style={{ fontWeight: "700" }}>
            {meta.label}
          </AppText>
        </View>

        <Badge
          label={`${packedCount}/${items.length}`}
          variant={packedCount === items.length && items.length > 0 ? "emerald" : "neutral"}
          size="sm"
        />
      </View>

      {/* Lista de Itens */}
      <View style={{ gap: 10 }}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => togglePackingItem(item.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.grayscale[700],
              borderRadius: radii.md,
              padding: 12,
              borderWidth: 1,
              borderColor: item.packed
                ? "rgba(16, 185, 129, 0.3)"
                : colors.grayscale[500],
              gap: 10,
            }}
          >
            {/* Checkbox */}
            <View style={{ marginTop: 1 }}>
              {item.packed ? (
                <CheckCircle2 size={18} color={colors.adventure.emerald} />
              ) : (
                <Circle size={18} color={colors.grayscale[400]} />
              )}
            </View>

            <View style={{ flex: 1, gap: 2 }}>
              <AppText
                variant="subheadline"
                color={
                  item.packed ? colors.grayscale[300] : colors.grayscale[100]
                }
                style={{
                  fontWeight: "600",
                  textDecorationLine: item.packed ? "line-through" : "none",
                }}
              >
                {item.name}
              </AppText>

              {item.notes && (
                <AppText variant="footnote" color={colors.grayscale[400]}>
                  {item.notes}
                </AppText>
              )}
            </View>

            {/* Peso e Remoção */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {item.weightGrams ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Scale size={11} color={colors.grayscale[400]} />
                  <AppText variant="caption" color={colors.grayscale[300]}>
                    {item.weightGrams}g
                  </AppText>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => deletePackingItem(item.id)}
                style={{ padding: 4 }}
              >
                <Trash2 size={13} color={colors.grayscale[400]} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

