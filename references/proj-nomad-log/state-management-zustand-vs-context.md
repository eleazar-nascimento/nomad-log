---
topic: "Análise Técnica — Zustand vs React Context em Aplicações Offline-First"
tags:
  - project/nomad-log
  - architecture/state
  - zustand
  - performance
verified_by_reviewer: true
last_updated: "2026-10-29T04:25:00Z"
---

# 🧠 Análise Técnica: Por que usar Zustand ao invés de Context no NomadLog?

> **Pergunta do Usuário:** *"Faz sentido usar o Zustand ao invés do Context?"*
> **Veredito:** **SIM, faz TOTAL sentido.** Para aplicações offline-first ricas com múltiplos domínios (viagens, gastos, waypoints, memórias, packing e fila de mutações), o Zustand resolve problemas estruturais graves do React Context.

---

## ⚖️ Comparativo Direto: React Context vs. Zustand

| Critério | React Context Padrão | Zustand (Implementado) | Vantagem NomadLog |
| :--- | :--- | :--- | :--- |
| **Comportamento de Re-render** | Se qualquer valor do objeto mudar, **todos os componentes** que usam o hook re-renderizam. | **Seletores atômicos**: `useNomadStore(s => s.expenses)`. Apenas o componente inscrito re-renderiza. | 🚀 **Zustand** (Vital para manter 60fps em celulares modestos). |
| **Persistência de Dados** | Requer `useEffect` manual, `useState` e serialização imperativa com risco de corrida. | Middleware nativo ou `saveToAsyncStorage` desacoplado da renderização. | 🚀 **Zustand** (Código limpo e previsível). |
| **Acesso Fora de Componentes** | **Impossível**. Não pode ser lido em funções puras, workers ou callbacks fora da árvore. | **Possível via `getState()`**: `useNomadStore.getState().addExpense(...)`. | 🚀 **Zustand** (Permite filas de sync em background). |
| **Complexidade e Boilerplate** | Alto: necessita de Provider, createContext, custom hooks e múltiplos arquivos se dividir em domínios. | Baixo: criação direta com `create()`, tipado e sem necessidade de nesting de Providers. | 🚀 **Zustand**. |
| **Tamanho da Biblioteca** | 0 KB adicionais (built-in no React). | ~1.2 KB (minificado/gzipped). | ⚖️ **Empate Técnico** (Zustand é minúsculo). |

---

## 🔍 O Problema do "Re-render Cascata" do Context

No modelo React Context tradicional:
```tsx
// ⚠️ No Context:
const { activeTripExpenses, togglePackingItem } = useAppStore();
// Quando o usuário marca 1 item no checklist de bagagem (togglePackingItem),
// o Context atualiza o objeto global.
// Resultado: A tela de Gastos (ExpensesScreen) e o Mapa Vetorial re-renderizam à toa!
```

Com **Zustand com Seletores Atômicos**:
```tsx
// ✅ Com Zustand:
const packingItems = useNomadStore((state) => state.packingItems);
const togglePackingItem = useNomadStore((state) => state.togglePackingItem);
// Se um gasto for lançado na aba de despesas, este componente de Bagagem
// NÃO sofre nenhum ciclo de re-renderização!
```

---

## 🚀 Acesso Fora da Árvore React (Background Sync Worker)

Em apps nômades offline, quando o aparelho reconecta à internet, um listener de rede (`NetInfo`) pode disparar a sincronização mesmo sem nenhum componente montado:

```typescript
// Executa em qualquer serviço ou tarefa em background:
export async function triggerBackgroundSync() {
  const queue = useNomadStore.getState().mutationQueue;
  if (queue.length === 0) return;

  await uploadQueueToCloud(queue);
  useNomadStore.getState().syncMutationQueue();
}
```
*Isso é inviável no React Context sem criar acoplamentos artificiais na raiz da UI.*

---

## 📦 Estrutura Implementada no NomadLog

Implementamos o store Zustand em [`src/store/useNomadStore.ts`](file:///Volumes/crucial-x9/ideias/nomad-log/src/store/useNomadStore.ts) com:
1. **Camada de Compatibilidade Retroativa:** Mantivemos o hook `useAppStore()` delegando diretamente para `useNomadStore()`, garantindo que **100% dos componentes existentes continuem funcionando perfeitamente** sem quebras.
2. **Seletores Granulares Prontos:** Qualquer novo componente pode consumir diretamente `useNomadStore(s => s.activeTrip)` para máxima performance.

---

## 🔗 Referências Cruzadas
- [[_project]] ➡️ MOC Geral.
- [[architecture-and-offline-sync]] ➡️ Fila de mutações e persistência.
- [[ui-components-and-reusables-analysis]] ➡️ Comparativo de componentes de interface.

