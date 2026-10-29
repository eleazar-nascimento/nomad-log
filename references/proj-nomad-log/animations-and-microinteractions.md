---
topic: "Motor de Animações e Micro-interações com Reanimated 4"
tags:
  - project/nomad-log
  - animations
  - reanimated
  - ux
verified_by_reviewer: true
last_updated: "2026-10-29T04:25:00Z"
---

# ⚡ Animações e Micro-interações Táteis (Reanimated 4)

> **Necessidade do Usuário:** *"Gostaria também que o app tivesse animações."*
> **Implementação:** O **NomadLog** agora conta com um motor completo de micro-interações construído em cima do **React Native Reanimated 4.7.1**, operando diretamente na UI thread nativa a 60fps.

---

## 🎭 Padrões de Animação Implementados

### 1. Entrada Escalonada de Cards (`AnimatedContainer`)
Localizado em [`src/components/ui/AnimatedContainer.tsx`](file:///Volumes/crucial-x9/ideias/nomad-log/src/components/ui/AnimatedContainer.tsx):
- Ao trocar de abas ou carregar a tela, os cartões não surgem bruscamente.
- Utilizam `FadeInDown.duration(450).delay(index * 60).springify().damping(16)` para criar um efeito cascata fluido e elegante.
- Possui transição de layout (`LinearTransition.springify().damping(18)`) para reorganizar suavemente a lista quando itens são adicionados ou removidos.

### 2. Contador Numérico Animado (`AnimatedNumber`)
Localizado em [`src/components/ui/AnimatedNumber.tsx`](file:///Volumes/crucial-x9/ideias/nomad-log/src/components/ui/AnimatedNumber.tsx):
- Utilizado no valor de **Total Gasto** e **Orçamento Restante**.
- Ao registrar uma nova despesa (ex: Pad Thai de 120 THB ➡️ R$ 20,35), o número sobe com interpolação contínua (*Cubic Ease-Out*) via `requestAnimationFrame` sem travamentos.

### 3. Anel de Progresso Circular em SVG Dinâmico
Localizado em [`src/components/ui/CircularProgress.tsx`](file:///Volumes/crucial-x9/ideias/nomad-log/src/components/ui/CircularProgress.tsx):
- O arco de progresso da mochila calcula o deslocamento da linha de contorno (`strokeDashoffset`) em tempo real com base nos itens marcados no checklist.
- Ao clicar no checkbox, o círculo e a porcentagem central reagem imediatamente.

### 4. Transições de Status Táteis
- Nos botões de status do roteiro (*Pendente* ➡️ *Em Trânsito* ➡️ *Feito*) e nos checkboxes da bagagem, as mudanças visuais contam com feedback visual claro e suave.

---

## 💻 Exemplo de Código do `AnimatedContainer`

```tsx
import { AnimatedContainer } from "@/components/ui";

export function ExemploLista() {
  return (
    <View style={{ gap: 12 }}>
      {itens.map((item, index) => (
        <AnimatedContainer key={item.id} delay={index * 50}>
          <MeuCard item={item} />
        </AnimatedContainer>
      ))}
    </View>
  );
}
```

---

## 🔗 Referências Cruzadas
- [[_project]] ➡️ MOC do Projeto.
- [[ui-components-and-reusables-analysis]] ➡️ Componentes do Design System.
- [[architecture-and-offline-sync]] ➡️ Desempenho e persistência.

