import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Svg, {
  Path,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Rect,
} from "react-native-svg";
import {
  Compass,
  Mountain,
  Navigation,
  Layers,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  Circle as CircleIcon,
  Clock,
  MapPin,
  Plane,
  Bus,
  Train,
  Bed,
  Utensils,
  Sparkles,
  ArrowRight,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge } from "@/components/ui";
import { Waypoint, WaypointType, WaypointStatus, useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

const CANVAS_WIDTH = 356;
const CANVAS_HEIGHT = 175;

export interface VectorRouteMapProps {
  waypoints: Waypoint[];
}

export const VectorRouteMap: React.FC<VectorRouteMapProps> = ({ waypoints }) => {
  const { t, isPt } = useTranslation();
  const { toggleWaypointStatus } = useAppStore();

  // Modo de visualização: "map" (Trilha 2D) ou "elevation" (Perfil Altimétrico)
  const [viewMode, setViewMode] = useState<"map" | "elevation">("map");
  const [selectedId, setSelectedId] = useState<string | null>(
    waypoints[0]?.id || null
  );

  // Garante que se waypoints mudarem, o item selecionado seja válido
  const activeWaypoint = useMemo(() => {
    if (!waypoints || waypoints.length === 0) return null;
    return waypoints.find((w) => w.id === selectedId) || waypoints[0];
  }, [waypoints, selectedId]);

  const activeIndex = useMemo(() => {
    if (!activeWaypoint || !waypoints) return 0;
    const idx = waypoints.findIndex((w) => w.id === activeWaypoint.id);
    return idx >= 0 ? idx : 0;
  }, [waypoints, activeWaypoint]);

  // Cálculos dinâmicos de Altimetria e Métricas de Trilha
  const metrics = useMemo(() => {
    if (!waypoints || waypoints.length === 0) {
      return {
        totalDistanceKm: 0,
        maxElevationM: 0,
        minElevationM: 0,
        elevationGainM: 0,
        completedCount: 0,
        progressPercent: 0,
      };
    }

    const totalDistance = waypoints.reduce(
      (sum, w) => sum + (w.distanceKm || 0),
      0
    );

    const elevs = waypoints
      .map((w) => w.elevationMeters)
      .filter((e): e is number => typeof e === "number" && !isNaN(e));

    const maxElev = elevs.length > 0 ? Math.max(...elevs) : 0;
    const minElev = elevs.length > 0 ? Math.min(...elevs) : 0;

    let totalGain = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const prev = waypoints[i - 1].elevationMeters || 0;
      const curr = waypoints[i].elevationMeters || 0;
      if (curr > prev) {
        totalGain += curr - prev;
      }
    }

    const doneCount = waypoints.filter((w) => w.status === "done").length;
    const progress = Math.round((doneCount / waypoints.length) * 100);

    return {
      totalDistanceKm: Number(totalDistance.toFixed(1)),
      maxElevationM: maxElev,
      minElevationM: minElev,
      elevationGainM: totalGain,
      completedCount: doneCount,
      progressPercent: progress,
    };
  }, [waypoints]);

  // Projeção dinâmica dos nós no espaço (X, Y) do canvas SVG
  const projectedNodes = useMemo(() => {
    const n = waypoints.length;
    if (n === 0) return [];

    const padX = 36;
    const usableW = CANVAS_WIDTH - padX * 2;
    const stepX = n > 1 ? usableW / (n - 1) : 0;

    const minEl = metrics.minElevationM;
    const maxEl = Math.max(metrics.maxElevationM, minEl + 100);
    const rangeEl = maxEl - minEl || 100;

    return waypoints.map((wp, idx) => {
      const x = n === 1 ? CANVAS_WIDTH / 2 : padX + idx * stepX;

      // 1. Coordenada Y no Modo Mapa de Trilha (Curva topográfica ondulada e natural)
      const elevNormalized = ((wp.elevationMeters || minEl) - minEl) / rangeEl;
      const wave = Math.sin((idx / Math.max(1, n - 1)) * Math.PI * 1.8) * 24;
      const baseY = 86;
      const mapY = Math.min(
        Math.max(baseY - elevNormalized * 34 + wave + (idx % 2 === 0 ? -12 : 12), 26),
        CANVAS_HEIGHT - 38
      );

      // 2. Coordenada Y no Modo Altimetria (Gráfico de elevação fiel)
      const graphTop = 28;
      const graphBottom = CANVAS_HEIGHT - 28;
      const elevY = graphBottom - elevNormalized * (graphBottom - graphTop);

      return {
        wp,
        index: idx,
        x,
        mapY,
        elevY,
      };
    });
  }, [waypoints, metrics]);

  // Geração de Caminho Bézier Suave para o SVG
  const mapPathD = useMemo(() => {
    if (projectedNodes.length < 2) return "";
    let d = `M ${projectedNodes[0].x} ${projectedNodes[0].mapY}`;
    for (let i = 0; i < projectedNodes.length - 1; i++) {
      const p1 = projectedNodes[i];
      const p2 = projectedNodes[i + 1];
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.mapY + p2.mapY) / 2;
      d += ` Q ${p1.x} ${p1.mapY}, ${cx} ${cy}`;
    }
    const last = projectedNodes[projectedNodes.length - 1];
    d += ` T ${last.x} ${last.mapY}`;
    return d;
  }, [projectedNodes]);

  const elevLineD = useMemo(() => {
    if (projectedNodes.length < 2) return "";
    let d = `M ${projectedNodes[0].x} ${projectedNodes[0].elevY}`;
    for (let i = 0; i < projectedNodes.length - 1; i++) {
      const p1 = projectedNodes[i];
      const p2 = projectedNodes[i + 1];
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.elevY + p2.elevY) / 2;
      d += ` Q ${p1.x} ${p1.elevY}, ${cx} ${cy}`;
    }
    const last = projectedNodes[projectedNodes.length - 1];
    d += ` T ${last.x} ${last.elevY}`;
    return d;
  }, [projectedNodes]);

  const elevAreaD = useMemo(() => {
    if (projectedNodes.length < 2) return "";
    const bottomY = CANVAS_HEIGHT - 12;
    const firstX = projectedNodes[0].x;
    const lastX = projectedNodes[projectedNodes.length - 1].x;
    return `${elevLineD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [elevLineD, projectedNodes]);

  const getTypeIcon = (type: WaypointType) => {
    switch (type) {
      case "flight":
        return <Plane size={14} color={colors.adventure.sky} />;
      case "train":
        return <Train size={14} color={colors.primary[100]} />;
      case "bus":
        return <Bus size={14} color={colors.adventure.amber} />;
      case "hostel":
        return <Bed size={14} color={colors.adventure.purple} />;
      case "food":
        return <Utensils size={14} color={colors.adventure.amber} />;
      case "sight":
        return <Compass size={14} color={colors.adventure.sky} />;
      case "trek":
      default:
        return <Mountain size={14} color={colors.adventure.emerald} />;
    }
  };

  const getStatusColor = (status: WaypointStatus) => {
    switch (status) {
      case "done":
        return colors.adventure.emerald;
      case "in_progress":
        return colors.primary[100];
      case "pending":
      default:
        return colors.grayscale[400];
    }
  };

  const getStatusBadge = (status: WaypointStatus) => {
    switch (status) {
      case "done":
        return (
          <Badge
            label={isPt ? "CONCLUÍDO" : "DONE"}
            variant="emerald"
            size="sm"
            icon={<CheckCircle2 size={11} color={colors.adventure.emerald} />}
          />
        );
      case "in_progress":
        return (
          <Badge
            label={isPt ? "EM ANDAMENTO" : "IN TRANSIT"}
            variant="primary"
            size="sm"
            icon={<PlayCircle size={11} color={colors.primary[100]} />}
          />
        );
      case "pending":
      default:
        return (
          <Badge
            label={isPt ? "PLANEJADO" : "PENDING"}
            variant="neutral"
            size="sm"
            icon={<CircleIcon size={11} color={colors.grayscale[400]} />}
          />
        );
    }
  };

  return (
    <Card
      variant="surface"
      style={{
        padding: 0,
        overflow: "hidden",
        borderColor: colors.grayscale[500],
      }}
    >
      {/* 1. Header do Mapa: Alternador de Modo (Trilha 2D vs Altimetria) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: colors.grayscale[600],
          borderBottomWidth: 1,
          borderColor: colors.grayscale[500],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flex: 1,
            minWidth: 0,
            marginRight: 12,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: radii.md,
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              borderWidth: 1,
              borderColor: "rgba(56, 189, 248, 0.3)",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Compass size={16} color={colors.adventure.sky} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <AppText
              variant="headline"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontWeight: "700" }}
            >
              {t.itinerary.vectorMapTitle}
            </AppText>
            <AppText
              variant="footnote"
              numberOfLines={1}
              ellipsizeMode="tail"
              color={colors.adventure.emerald}
            >
              ● {t.itinerary.vectorMapSubtitle}
            </AppText>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 0 }}>
          {/* Seletor de visualização */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.grayscale[700],
              borderRadius: radii.pill,
              padding: 3,
              borderWidth: 1,
              borderColor: colors.grayscale[500],
            }}
          >
            <TouchableOpacity
              onPress={() => setViewMode("map")}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: radii.pill,
                backgroundColor:
                  viewMode === "map" ? colors.primary[100] : "transparent",
              }}
            >
              <Navigation
                size={12}
                color={
                  viewMode === "map"
                    ? colors.grayscale[100]
                    : colors.grayscale[300]
                }
              />
              <AppText
                variant="caption"
                color={
                  viewMode === "map"
                    ? colors.grayscale[100]
                    : colors.grayscale[300]
                }
                style={{ fontWeight: "700" }}
              >
                {isPt ? "Rota" : "Trail"}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode("elevation")}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: radii.pill,
                backgroundColor:
                  viewMode === "elevation"
                    ? colors.adventure.sky
                    : "transparent",
              }}
            >
              <TrendingUp
                size={12}
                color={
                  viewMode === "elevation"
                    ? colors.grayscale[900]
                    : colors.grayscale[300]
                }
              />
              <AppText
                variant="caption"
                color={
                  viewMode === "elevation"
                    ? colors.grayscale[900]
                    : colors.grayscale[300]
                }
                style={{ fontWeight: "700" }}
              >
                {isPt ? "Altitude" : "Elev"}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. SVG Canvas Dinâmico */}
      <View
        style={{
          height: CANVAS_HEIGHT,
          backgroundColor: "#080B11",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {waypoints.length === 0 ? (
          <View style={{ alignItems: "center", gap: 8, paddingHorizontal: 24 }}>
            <Compass size={28} color={colors.grayscale[400]} />
            <AppText variant="subheadline" color={colors.grayscale[200]} style={{ fontWeight: "600" }}>
              {isPt ? "Nenhuma parada cadastrada na rota" : "No stops added to route"}
            </AppText>
            <AppText variant="caption" color={colors.grayscale[400]} align="center">
              {isPt
                ? "Adicione paradas no itinerário para traçar a rota vetorial offline."
                : "Add stops to plot the dynamic offline vector trail."}
            </AppText>
          </View>
        ) : (
          <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            <Defs>
              {/* Gradiente da linha de rota */}
              <LinearGradient id="trailLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.primary[100]} />
                <Stop offset="50%" stopColor={colors.adventure.sky} />
                <Stop offset="100%" stopColor={colors.adventure.emerald} />
              </LinearGradient>

              {/* Gradiente de preenchimento do relevo altimétrico */}
              <LinearGradient id="elevationAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={colors.adventure.sky} stopOpacity="0.45" />
                <Stop offset="70%" stopColor={colors.adventure.emerald} stopOpacity="0.12" />
                <Stop offset="100%" stopColor="#080B11" stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* Linhas de grade topográfica de fundo */}
            <Line x1="16" y1="45" x2="340" y2="45" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 6" />
            <Line x1="16" y1="90" x2="340" y2="90" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 6" />
            <Line x1="16" y1="135" x2="340" y2="135" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 6" />

            {/* Curvas isolinhas de relevo */}
            <Path
              d="M 10 145 Q 90 110 180 135 T 350 120"
              stroke="rgba(56, 189, 248, 0.08)"
              strokeWidth="1.5"
              fill="none"
            />
            <Path
              d="M 20 65 Q 120 30 220 55 T 340 45"
              stroke="rgba(245, 158, 11, 0.06)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* MODO 1: ROTA VETORIAL 2D */}
            {viewMode === "map" && (
              <>
                {/* Linha da Rota conectando os pontos dinâmicos */}
                {projectedNodes.length > 1 && (
                  <Path
                    d={mapPathD}
                    stroke="url(#trailLineGradient)"
                    strokeWidth="3.5"
                    strokeDasharray="6,4"
                    fill="none"
                  />
                )}

                {/* Nós da Rota Dinâmicos */}
                {projectedNodes.map((node) => {
                  const isSelected = activeWaypoint?.id === node.wp.id;
                  const statusColor = getStatusColor(node.wp.status);

                  return (
                    <React.Fragment key={node.wp.id}>
                      {/* Aura pulsante ao redor do nó selecionado */}
                      {isSelected && (
                        <Circle
                          cx={node.x}
                          cy={node.mapY}
                          r="15"
                          fill="rgba(56, 189, 248, 0.22)"
                          stroke={colors.adventure.sky}
                          strokeWidth="1.5"
                        />
                      )}

                      {/* Nó principal */}
                      <Circle
                        cx={node.x}
                        cy={node.mapY}
                        r={isSelected ? "7" : "5"}
                        fill={statusColor}
                        stroke="#080B11"
                        strokeWidth="2.5"
                      />

                      {/* Rótulo da parada */}
                      <SvgText
                        x={node.x}
                        y={node.mapY > 120 ? node.mapY - 14 : node.mapY + 16}
                        fill={isSelected ? colors.grayscale[100] : colors.grayscale[300]}
                        fontSize={isSelected ? "11" : "10"}
                        fontWeight={isSelected ? "bold" : "600"}
                        textAnchor="middle"
                      >
                        {node.wp.locationName.split(",")[0].slice(0, 10)}
                      </SvgText>
                    </React.Fragment>
                  );
                })}
              </>
            )}

            {/* MODO 2: PERFIL DE ALTIMETRIA */}
            {viewMode === "elevation" && (
              <>
                {/* Área preenchida sob a curva de altitude */}
                {projectedNodes.length > 1 && (
                  <Path d={elevAreaD} fill="url(#elevationAreaGradient)" />
                )}

                {/* Linha de crista do relevo */}
                {projectedNodes.length > 1 && (
                  <Path
                    d={elevLineD}
                    stroke={colors.adventure.sky}
                    strokeWidth="3"
                    fill="none"
                  />
                )}

                {/* Pontos altimétricos */}
                {projectedNodes.map((node) => {
                  const isSelected = activeWaypoint?.id === node.wp.id;
                  const elev = node.wp.elevationMeters || 0;

                  return (
                    <React.Fragment key={node.wp.id}>
                      {isSelected && (
                        <>
                          <Line
                            x1={node.x}
                            y1={node.elevY}
                            x2={node.x}
                            y2={CANVAS_HEIGHT - 12}
                            stroke={colors.adventure.sky}
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                          <Circle
                            cx={node.x}
                            cy={node.elevY}
                            r="13"
                            fill="rgba(56, 189, 248, 0.25)"
                          />
                        </>
                      )}

                      <Circle
                        cx={node.x}
                        cy={node.elevY}
                        r={isSelected ? "6.5" : "4.5"}
                        fill={isSelected ? colors.adventure.sky : colors.adventure.emerald}
                        stroke="#080B11"
                        strokeWidth="2"
                      />

                      {/* Rótulo de altitude em metros */}
                      <SvgText
                        x={node.x}
                        y={node.elevY - 10}
                        fill={isSelected ? colors.adventure.amber : colors.grayscale[300]}
                        fontSize="9"
                        fontWeight={isSelected ? "bold" : "normal"}
                        textAnchor="middle"
                      >
                        {elev > 0 ? `${elev}m` : "-"}
                      </SvgText>
                    </React.Fragment>
                  );
                })}
              </>
            )}

            {/* Marca de Norte Bússola no Canto Superior Esquerdo */}
            <SvgText
              x="22"
              y="22"
              fill={colors.adventure.amber}
              fontSize="10"
              fontWeight="bold"
            >
              ▲ N
            </SvgText>
          </Svg>
        )}
      </View>

      {/* 3. Barra de Métricas da Rota (4 Estatísticas Rápidas) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: colors.grayscale[700],
          borderBottomWidth: 1,
          borderColor: colors.grayscale[500],
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MapPin size={12} color={colors.primary[100]} />
          <AppText variant="caption" color={colors.grayscale[200]} style={{ fontWeight: "600" }}>
            {waypoints.length} {t.itinerary.stopsCount}
          </AppText>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Mountain size={12} color={colors.adventure.sky} />
          <AppText variant="caption" color={colors.grayscale[200]} style={{ fontWeight: "600" }}>
            {metrics.maxElevationM > 0 ? `Pico: ${metrics.maxElevationM}m` : "-"}
          </AppText>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Navigation size={12} color={colors.adventure.amber} />
          <AppText variant="caption" color={colors.grayscale[200]} style={{ fontWeight: "600" }}>
            {metrics.totalDistanceKm > 0 ? `${metrics.totalDistanceKm} km` : "-"}
          </AppText>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <CheckCircle2 size={12} color={colors.adventure.emerald} />
          <AppText variant="caption" color={colors.adventure.emerald} style={{ fontWeight: "700" }}>
            {metrics.progressPercent}%
          </AppText>
        </View>
      </View>

      {/* 4. Trilho Horizontal de Seleção Rápida de Paradas */}
      {waypoints.length > 0 && (
        <View style={{ paddingVertical: 8, backgroundColor: colors.grayscale[600] }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {projectedNodes.map((node) => {
              const isSelected = activeWaypoint?.id === node.wp.id;
              const statusColor = getStatusColor(node.wp.status);

              return (
                <TouchableOpacity
                  key={node.wp.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedId(node.wp.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: radii.pill,
                    backgroundColor: isSelected
                      ? "rgba(56, 189, 248, 0.2)"
                      : colors.grayscale[700],
                    borderWidth: 1.5,
                    borderColor: isSelected
                      ? colors.adventure.sky
                      : colors.grayscale[500],
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: statusColor,
                    }}
                  />
                  <AppText
                    variant="caption"
                    color={
                      isSelected
                        ? colors.adventure.sky
                        : colors.grayscale[200]
                    }
                    style={{ fontWeight: isSelected ? "700" : "500" }}
                  >
                    #{node.index + 1} {node.wp.locationName.split(",")[0]}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* 5. Painel de Inspeção do Waypoint Selecionado */}
      {activeWaypoint && (
        <View
          style={{
            padding: 14,
            backgroundColor: colors.grayscale[600],
            borderTopWidth: 1,
            borderColor: colors.grayscale[500],
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
                flex: 1,
                minWidth: 0,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radii.md,
                  backgroundColor: colors.grayscale[700],
                  borderWidth: 1,
                  borderColor: colors.grayscale[500],
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {getTypeIcon(activeWaypoint.type)}
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <AppText
                    variant="subheadline"
                    style={{ fontWeight: "700", flexShrink: 1 }}
                    numberOfLines={1}
                  >
                    {activeWaypoint.title}
                  </AppText>
                  <AppText variant="caption" color={colors.adventure.amber} style={{ fontWeight: "700" }}>
                    #{activeIndex + 1}
                  </AppText>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 2,
                  }}
                >
                  <MapPin size={11} color={colors.grayscale[400]} />
                  <AppText variant="caption" color={colors.grayscale[300]} numberOfLines={1}>
                    {activeWaypoint.locationName}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={{ flexShrink: 0 }}>
              {getStatusBadge(activeWaypoint.status)}
            </View>
          </View>

          {/* Badges de Altitude, Distância e Horário */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: colors.grayscale[700],
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: radii.sm,
              }}
            >
              <Clock size={11} color={colors.adventure.sky} />
              <AppText variant="caption" color={colors.grayscale[200]}>
                {t.itinerary.dayPrefix} {activeWaypoint.dayIndex} • {activeWaypoint.time}
              </AppText>
            </View>

            {typeof activeWaypoint.elevationMeters === "number" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: colors.grayscale[700],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: radii.sm,
                }}
              >
                <Mountain size={11} color={colors.adventure.amber} />
                <AppText variant="caption" color={colors.adventure.amber}>
                  {activeWaypoint.elevationMeters}m {t.itinerary.elevation.toLowerCase()}
                </AppText>
              </View>
            )}

            {typeof activeWaypoint.distanceKm === "number" && activeWaypoint.distanceKm > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: colors.grayscale[700],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: radii.sm,
                }}
              >
                <Navigation size={11} color={colors.primary[100]} />
                <AppText variant="caption" color={colors.primary[100]}>
                  {activeWaypoint.distanceKm} km
                </AppText>
              </View>
            )}
          </View>

          {/* Notas / Dicas da Parada */}
          {activeWaypoint.notes ? (
            <View
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                padding: 8,
                borderRadius: radii.sm,
                borderLeftWidth: 2,
                borderLeftColor: colors.adventure.sky,
              }}
            >
              <AppText variant="footnote" color={colors.grayscale[300]}>
                💡 {activeWaypoint.notes}
              </AppText>
            </View>
          ) : null}

          {/* Botão de Alternar Status do Trecho Selecionado */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleWaypointStatus(activeWaypoint.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              paddingVertical: 8,
              borderRadius: radii.md,
              backgroundColor:
                activeWaypoint.status === "done"
                  ? "rgba(16, 185, 129, 0.15)"
                  : activeWaypoint.status === "in_progress"
                  ? colors.adventure.emerald
                  : colors.primary[100],
              borderWidth: 1,
              borderColor:
                activeWaypoint.status === "done"
                  ? colors.adventure.emerald
                  : "transparent",
              marginTop: 2,
            }}
          >
            {activeWaypoint.status === "done" ? (
              <>
                <CheckCircle2 size={13} color={colors.adventure.emerald} />
                <AppText
                  variant="caption"
                  color={colors.adventure.emerald}
                  style={{ fontWeight: "700" }}
                >
                  {isPt ? "Concluído (Toque para reabrir)" : "Completed (Tap to reopen)"}
                </AppText>
              </>
            ) : activeWaypoint.status === "in_progress" ? (
              <>
                <CheckCircle2 size={13} color={colors.grayscale[100]} />
                <AppText
                  variant="caption"
                  color={colors.grayscale[100]}
                  style={{ fontWeight: "700" }}
                >
                  {isPt ? "Marcar Parada como Concluída" : "Mark Stop as Done"}
                </AppText>
              </>
            ) : (
              <>
                <PlayCircle size={13} color={colors.grayscale[100]} />
                <AppText
                  variant="caption"
                  color={colors.grayscale[100]}
                  style={{ fontWeight: "700" }}
                >
                  {isPt ? "Iniciar este Trecho Agora" : "Start this Leg Now"}
                </AppText>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};
