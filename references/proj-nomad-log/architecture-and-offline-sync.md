---
topic: "Arquitetura Offline-First, Persistência e Fila de Sincronização"
tags:
  - project/nomad-log
  - architecture/offline-first
  - storage/async-storage
  - sync/mutation-queue
verified_by_reviewer: true
last_updated: "2026-10-29T04:25:00Z"
---

# 💾 Arquitetura Offline-First e Fila de Sincronização

> O **NomadLog** segue a premissa de que a rede é um aprimoramento passageiro, e não um pré-requisito de funcionamento. Todas as ações gravam primeiro no armazenamento local do dispositivo.

---

## 🏗️ Fluxo de Leitura e Escrita Local

```mermaid
sequenceDiagram
    autonumber
    actor User as Viajante (Sem Sinal)
    participant UI as Interface React Native
    participant Store as Zustand Store
    participant Storage as AsyncStorage / SQLite
    participant Queue as Fila de Mutações

    User->>UI: Registra Despesa (ex: 450 Baht)
    UI->>Store: addExpense(payload)
    Store->>Store: Calcula conversão offline (BRL)
    Store->>Queue: Enfileira mutação ({ id, action, entity, data })
    Store->>Storage: Grava estado completo no disco
    UI-->>User: Feedback visual com AnimatedNumber (60fps)

    Note over User,Queue: Dias depois... Viajante conecta no Wi-Fi do Hostel
    User->>UI: Dispara Sincronização
    UI->>Store: syncMutationQueue()
    Store->>Cloud: POST /sync/batch (envia fila criptografada)
    Cloud-->>Store: 200 OK (Mutações reconciliadas)
    Store->>Queue: Limpa fila pendente
    Store->>Storage: Atualiza timestamp de sync
```

---

## 📦 Estrutura da Fila de Mutações (`MutationItem`)

Cada alteração em modo offline gera um item de mutação padronizado:

```typescript
export interface MutationItem {
  id: string; // Ex: "mut_1730164800000_a8bc1"
  timestamp: number; // Timestamp Unix da criação
  action: "create" | "update" | "delete";
  entity: "expense" | "waypoint" | "journal" | "packing" | "trip";
  data: any; // Dados serializados para reconciliação
}
```

---

## 🛣️ Evolução Futura: Suporte a WatermelonDB / SQLite
Atualmente o app utiliza `AsyncStorage` com serialização rápida em JSON. A arquitetura foi desenhada de forma desacoplada para permitir fácil substituição por:
1. **`react-native-mmkv`:** Substituição drop-in que opera de forma síncrona com velocidade até 30x superior.
2. **`WatermelonDB`:** Para viagens gigantescas com mais de 10.000 fotos, trilhas GPS completas e waypoints densos.

---

## 🔗 Referências Cruzadas
- [[_project]] ➡️ MOC Geral.
- [[state-management-zustand-vs-context]] ➡️ Zustand Store com persistência.
- [[domain-multi-currency-and-fx]] ➡️ Motor de taxas de câmbio offline.

