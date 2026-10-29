---
topic: "Domínio Financeiro — Motor Multimoedas e Snapshot de Câmbio Offline"
tags:
  - project/nomad-log
  - finance/fx
  - domain/currency
  - offline-calculation
verified_by_reviewer: true
last_updated: "2026-10-29T04:25:00Z"
---

# 💱 Domínio Financeiro: Motor de Câmbio Multimoedas Offline

> Viajantes internacionais enfrentam constantes trocas de moedas e perdem a noção exata de quanto estão gastando. O NomadLog congela uma tabela de referência na última conexão para garantir conversões precisas mesmo no alto de uma montanha.

---

## 🧮 Fórmula de Conversão Bidirecional

Todas as moedas utilizam o **USD (Dólar Americano)** como pivô base universal:

$$\text{Valor em USD} = \frac{\text{Valor Origem}}{\text{Taxa para USD}_{\text{Origem}}}$$

$$\text{Valor Destino} = \text{Valor em USD} \times \text{Taxa para USD}_{\text{Destino}}$$

### Exemplo Prático de Conversão Offline:
- Moeda de Origem: Baht Tailandês ($\text{THB}$, taxa = $34.50$)
- Moeda Destino: Real Brasileiro ($\text{BRL}$, taxa = $5.85$)
- Valor da Refeição: $350 \text{ THB}$
- Cálculo:
  $$\text{USD} = \frac{350}{34.50} \approx 10.1449 \text{ USD}$$
  $$\text{BRL} = 10.1449 \times 5.85 \approx \mathbf{R\$\ 59,35}$$

O viajante sabe em milissegundos que um almoço de 350 Baht custou R$ 59,35.

---

## 🪙 Catálogo de Moedas Pré-configuradas

Localizado em [`src/store/currencies.ts`](file:///Volumes/crucial-x9/ideias/nomad-log/src/store/currencies.ts):

| Código | Símbolo | Nome | Bandeira | Taxa Padrão USD |
| :--- | :---: | :--- | :---: | :---: |
| **BRL** | R$ | Real Brasileiro | 🇧🇷 | 5.85 |
| **USD** | $ | Dólar Americano | 🇺🇸 | 1.00 |
| **EUR** | € | Euro | 🇪🇺 | 0.92 |
| **GBP** | £ | Libra Esterlina | 🇬🇧 | 0.77 |
| **THB** | ฿ | Baht Tailandês | 🇹🇭 | 34.50 |
| **VND** | ₫ | Dong Vietnamita | 🇻🇳 | 25.400,00 |
| **JPY** | ¥ | Iene Japonês | 🇯🇵 | 152.40 |
| **ARS** | $ | Peso Argentino | 🇦🇷 | 1.045,00 |
| **CLP** | $ | Peso Chileno | 🇨🇱 | 965.00 |
| **COP** | $ | Peso Colombiano | 🇨🇴 | 4.220,00 |

---

## 🌐 Integração com API Pública de Câmbio (Stale-While-Revalidate)

Quando o usuário está conectado à internet, o app executa em segundo plano a sincronização através do serviço [`src/services/fxApi.ts`](file:///Volumes/crucial-x9/ideias/nomad-log/src/services/fxApi.ts):
- **Endpoint:** `https://open.er-api.com/v6/latest/USD`
- **Timeout Proativo:** 4.000ms com `AbortController` para evitar que conexões fracas de roaming travem a UI.
- **Resiliência Offline:** Se houver erro de rede, queda de DNS ou modo avião, a função intercepta a falha graciosamente e continua operando com o cache congelado sem lançar erros não tratados.

## ⚙️ Tratamento de Moedas de Alta Denominação
Moedas como **Dong Vietnamita (VND)** e **Peso Chileno (CLP)** não usam casas decimais fracionárias no cotidiano. O utilitário `formatMoney()` detecta automaticamente a moeda e formata sem centavos espúrios para maior legibilidade.

---

## 🔗 Referências Cruzadas
- [[_project]] ➡️ MOC do Projeto.
- [[architecture-and-offline-sync]] ➡️ Como as despesas são persistidas.
- [[monetization-and-freemium]] ➡️ Histórico de câmbio avançado no plano Pro.

