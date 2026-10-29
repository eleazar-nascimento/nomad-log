import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Svg, { Path, Circle, Text as SvgText, Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { Map, Mountain, Navigation, Compass, Layers } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge } from "@/components/ui";
import { Waypoint } from "@/store";
import { useTranslation } from "@/i18n";

export const VectorRouteMap: React.FC<{
  waypoints: Waypoint[];
}> = ({ waypoints }) => {
  const { t } = useTranslation();
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState(0);

  // SVG canvas dimensions
  const width = 356;
  const height = 150;

  // Nós da rota vetorial em cache
  const nodes = [
    { name: "Bangkok", x: 45, y: 110, elev: 15, tag: "Chegada" },
    { name: "Ayutthaya", x: 115, y: 80, elev: 22, tag: "Templos" },
    { name: "Chiang Mai", x: 190, y: 45, elev: 310, tag: "Montanhas" },
    { name: "Doi Inthanon", x: 260, y: 25, elev: 1850, tag: "Pico 1.850m" },
    { name: "Hanói", x: 315, y: 85, elev: 20, tag: "Vietnã" },
  ];

  const activeNode = nodes[selectedWaypointIndex] || nodes[0];

  return (
    <Card
      variant="surface"
      style={{
        padding: 0,
        overflow: "hidden",
        borderColor: colors.grayscale[500],
      }}
    >
      {/* Topo do Mapa */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          backgroundColor: colors.grayscale[600],
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Compass size={15} color={colors.adventure.sky} />
          <AppText variant="subheadline" style={{ fontWeight: "700" }}>
            {t.itinerary.vectorMapTitle}
          </AppText>
        </View>
        <Badge label={t.itinerary.vectorMapBadge} variant="sky" size="sm" />
      </View>

      {/* SVG Canvas da Trilha */}
      <View
        style={{
          height: height,
          backgroundColor: "#0A0D14",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={colors.primary[100]} />
              <Stop offset="60%" stopColor={colors.adventure.sky} />
              <Stop offset="100%" stopColor={colors.adventure.emerald} />
            </LinearGradient>
          </Defs>

          {/* Linhas de contorno geográfico / grade topográfica simulada */}
          <Path
            d="M 10 130 Q 90 90 180 120 T 350 110"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d="M 20 60 Q 140 20 220 50 T 340 40"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Rota conectando os waypoints */}
          <Path
            d={`M ${nodes[0].x} ${nodes[0].y} 
                Q ${nodes[1].x} ${nodes[1].y - 15} ${nodes[2].x} ${nodes[2].y} 
                T ${nodes[3].x} ${nodes[3].y} 
                T ${nodes[4].x} ${nodes[4].y}`}
            stroke="url(#routeGradient)"
            strokeWidth="3.5"
            strokeDasharray="5,4"
            fill="none"
          />

          {/* Círculos e Rótulos dos nós */}
          {nodes.map((node, idx) => {
            const isSelected = idx === selectedWaypointIndex;
            return (
              <React.Fragment key={node.name}>
                {isSelected && (
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r="12"
                    fill="rgba(56, 189, 248, 0.25)"
                  />
                )}
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? "6" : "4.5"}
                  fill={isSelected ? colors.adventure.sky : colors.primary[100]}
                  stroke="#0A0D14"
                  strokeWidth="2"
                />
                <SvgText
                  x={node.x}
                  y={node.y + 16}
                  fill={isSelected ? colors.grayscale[100] : colors.grayscale[300]}
                  fontSize="10"
                  fontWeight={isSelected ? "bold" : "normal"}
                  textAnchor="middle"
                >
                  {node.name}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Info do Waypoint Selecionado */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: colors.grayscale[600],
          borderTopWidth: 1,
          borderColor: colors.grayscale[500],
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mountain size={16} color={colors.adventure.sky} />
          </View>
          <View>
            <AppText variant="subheadline" style={{ fontWeight: "700" }}>
              {activeNode.name}
            </AppText>
            <AppText variant="caption" color={colors.grayscale[300]}>
              Elevação: {activeNode.elev}m • {activeNode.tag}
            </AppText>
          </View>
        </View>

        {/* Seletor de nós da rota */}
        <View style={{ flexDirection: "row", gap: 4 }}>
          {nodes.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedWaypointIndex(idx)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor:
                  idx === selectedWaypointIndex
                    ? colors.adventure.sky
                    : colors.grayscale[500],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText
                variant="caption"
                color={
                  idx === selectedWaypointIndex
                    ? colors.grayscale[900]
                    : colors.grayscale[200]
                }
                style={{ fontWeight: "700" }}
              >
                {idx + 1}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Card>
  );
};

