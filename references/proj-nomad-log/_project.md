---
topic: "NomadLog — Mapa de Conteúdo e Visão Geral do Projeto"
tags:
  - project/nomad-log
  - meta/moc
  - offline-first
  - mobile/react-native
sources:
  - "https://github.com/anomalyco/opencode"
  - "Figma Daily Routine Planner App"
verified_by_reviewer: true
last_updated: "2026-10-29T04:25:00Z"
token_density:
  line_count: 95
  character_count: 3600
---

# 🧭 NomadLog — Base de Conhecimento (MOC)

> **NomadLog** é um aplicativo mobile Offline-First construído em **React Native (0.88), Expo SDK 58, Expo Router, NativeWind v4, Zustand e Reanimated 4**. Foi concebido para resolver os problemas críticos de viajantes nômades e mochileiros em áreas remotas ou em roaming internacional sem sinal de celular.

---

## 📌 Mapa de Conteúdo (MOC)

| Área de Conhecimento | Documento Obsidian | Foco Principal |
| :--- | :--- | :--- |
| **Arquitetura & Dados** | [[architecture-and-offline-sync]] | Armazenamento local, Fila de Mutações e Sync |
| **Gerenciamento de Estado** | [[state-management-zustand-vs-context]] | Análise técnica: Por que Zustand supera o Context |
| **Design System & UI** | [[ui-components-and-reusables-analysis]] | Gluestack vs React Native Reusables vs NativeWind |
| **Motor de Animações** | [[animations-and-microinteractions]] | Reanimated 4, física de molas e contadores |
| **Domínio Financeiro** | [[domain-multi-currency-and-fx]] | Conversor multimoedas offline e snapshot de câmbio |
| **Monetização & Negócio**| [[monetization-and-freemium]] | Modelo Freemium e pacote Mochileiro Pro |
| **Marketing & Go-To-Market**| [[marketing-and-go-to-market]] | Estratégia de aquisição, TikTok/Reels e PLG |
| **Geração de Builds (APK/IPA)**| [[build-and-deployment-guide]] | Guia passo a passo de compilação EAS & Local |
| **Status & Roadmap** | [[status-and-roadmap]] | Entregas concluídas e próximos passos |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão / Detalhes | Justificativa |
| :--- | :--- | :--- | :--- |
| **Framework Base** | Expo / React Native | Expo 58 / RN 0.88 | Suporte multiplataforma (iOS, Android, Web) e New Architecture |
| **Roteamento** | Expo Router | 58.0.26 | Roteamento baseado em arquivos com Tabs e Stack modais |
| **Estado Global** | Zustand | 5.0.x | Seletores atômicos, 0 re-renders desnecessários e persistência |
| **Estilização** | NativeWind / Tailwind | NativeWind v4 | Design system consistente com dark mode moderno estilo `nutri-ai` |
| **Animações** | React Native Reanimated | 4.7.1 | Micro-interações táteis a 60fps na thread UI nativa |
| **Gráficos & Mapas** | React Native SVG | 15.16.0 | Mapas vetoriais leves sem dependência de tiles online |
| **Persistência Local** | AsyncStorage / MMKV | v2.2.0 | Cache local resiliente pronto para adapters WatermelonDB |

---

## 👥 Personas do Usuário

1. **O Mochileiro de Trilha Remota:** Faz trekkings de dias sem sinal (Doi Inthanon, Patagônia, Chapada). Precisa ver o itinerário, altimetria da trilha e checar itens da mochila.
2. **O Nômade Digital Internacional:** Cruza fronteiras com frequência (ex: Tailândia ➡️ Vietnã ➡️ Indonésia) e desativa roaming móvel para evitar faturas abusivas. Precisa saber instantaneamente quanto custa um prato ou transporte na moeda local.
3. **O Viajante Organizado:** Gosta de registrar fotos, pensamentos e notas do dia sem depender de sinal ou nuvem aberta.

---

## 🔗 Relações e Referências Cruzadas
- [[architecture-and-offline-sync]] ➡️ Descreve como o estado local persiste no disco.
- [[state-management-zustand-vs-context]] ➡️ Explica o ganho de 60fps usando Zustand.
- [[ui-components-and-reusables-analysis]] ➡️ Responde sobre o uso de Gluestack vs Reusables.
- [[animations-and-microinteractions]] ➡️ Detalha a implementação do Reanimated 4.

