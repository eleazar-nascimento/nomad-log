---
topic: "Análise Técnica — Gluestack vs React Native Reusables vs NativeWind Custom"
tags:
  - project/nomad-log
  - ui/components
  - design-system
  - nativewind
verified_by_reviewer: true
last_updated: "2026-10-29T04:25:00Z"
---

# 🎨 Análise de UI: Faz sentido usar Gluestack ou React Native Reusables?

> **Pergunta do Usuário:** *"Faz sentido usar o Gluestack ou Reusables?"*
> **Veredito:**
> 1. **Gluestack UI:** **NÃO recomendamos** para este app. Traz peso de runtime, convenções opinativas e costuma apresentar atritos no React 19 / Expo SDK 58.
> 2. **React Native Reusables (RNR - shadcn do React Native):** **FAZ MUITO SENTIDO pontualmente**, especialmente se você precisar de primitivos complexos de acessibilidade como *Bottom Sheets*, *Dialogs nativos*, *Dropdowns* e *Tooltips*.
> 3. **Design System Nativo em NativeWind v4 (Nossa abordagem atual):** É a opção **mais leve, rápida e moderna**, inspirada fielmente no padrão que fizemos no `nutri-ai`.

---

## 📊 Matriz Comparativa

| Dimensão | Gluestack UI (v2) | React Native Reusables (RNR) | NativeWind v4 Custom (Atual) |
| :--- | :--- | :--- | :--- |
| **Filosofia** | Framework de componentes encapsulados (npm package fechado). | "Copy & Paste" estilo shadcn/ui. O código do componente vive dentro do seu projeto. | Componentes atômicos e modulares escritos diretamente para a sua regra de negócio. |
| **Estilização** | Baseado em Tailwind com abstrações próprias. | Tailwind / NativeWind v4 puro com `@rn-primitives` para acessibilidade. | Tailwind / NativeWind v4 puro com tokens de tema tipados (`src/theme/*`). |
| **Peso no Bundle** | Mais pesado (~30-50 KB adicionais + dependências de styled system). | Levíssimo (apenas os componentes que você copia para a pasta). | **Zero overhead** (usa as classes Tailwind já presentes). |
| **Compatibilidade React 19 / Expo 58** | Histórico de atrasos em grandes upgrades do React. | **100% compatível** com Expo 58 e React 19. | **100% compatível e testado** (sem warnings). |
| **Manutenibilidade** | Sujeito a breaking changes de releases externas. | Total controle do código-fonte (você edita o JSX direto). | **Total controle e independência.** |

---

## 💡 Por que o Gluestack perde tração no ecossistema atual?

O Gluestack v1 nasceu tentando substituir o NativeBase, mas enfrentou críticas por lentidão de renderização inicial na Web e complexidade de configuração. No v2, eles migraram para NativeWind, mas ainda mantêm camadas de abstração que dificultam a customização fina de micro-interações que apps premium de viagem exigem.

---

## 🏆 A Vantagem do React Native Reusables (RNR)

Se o projeto no futuro demandar componentes headless de alta complexidade acessível (WAI-ARIA no mobile), o RNR é o caminho ideal:
- Usa os primitivos `@rn-primitives/dialog`, `@rn-primitives/dropdown-menu`, `@rn-primitives/popover`.
- O código fica dentro de `src/components/ui/` exatamente como nossos componentes atuais (`Button.tsx`, `Card.tsx`, `Input.tsx`).
- Você não fica preso a nenhuma biblioteca proprietária.

---

## 🎯 Recomendação Estratégica para o NomadLog

1. **Mantenha a base atual:** Nossos componentes (`Button`, `Card`, `Badge`, `CircularProgress`, `OfflineBanner`, `DeviceFrame`, `AnimatedContainer`) já utilizam NativeWind v4 com máxima fidelidade ao design moderno do `nutri-ai` e zero erros de tipo.
2. **Adote Reusables sob demanda:** Se quisermos adicionar um *ActionSheet* ou *Dialog com foco acessível*, adicionamos o primitivo do React Native Reusables pontualmente sem poluir o projeto com o Gluestack.

---

## 🏝️ Resolução de Safe Areas e Dynamic Island (iPhone 14/15/16 Pro)

Para evitar sobreposição entre o entalhe físico do aparelho (Dynamic Island) e o cabeçalho:
1. **Em Dispositivos Reais:** O componente [`TopHeader.tsx`](file:///Volumes/crucial-x9/ideias/nomad-log/src/components/layout/TopHeader.tsx) consome `useSafeAreaInsets()` do `react-native-safe-area-context`, aplicando `paddingTop: Math.max(insets.top + 4, 16)`. No iPhone 15/16 Pro com Dynamic Island, `insets.top` é 54px, garantindo que o título e os botões iniciem estritamente abaixo da cápsula.
2. **Na Moldura Web Desktop (`DeviceFrame`):** A barra de status simulada possui `height: 48` fixa com relógio, cápsula e ícones de sinal/bateria, empurrando o conteúdo para baixo e eliminando qualquer corte visual.
3. **Truncamento de Texto:** O título da viagem possui `numberOfLines={1}` e `ellipsizeMode="tail"` com `flexShrink: 1` para não disputar espaço com o botão Pro.

## 🔗 Referências Cruzadas
- [[_project]] ➡️ MOC do Projeto.
- [[animations-and-microinteractions]] ➡️ Integração com animações Reanimated.
- [[state-management-zustand-vs-context]] ➡️ Gestão de estado atômico.

