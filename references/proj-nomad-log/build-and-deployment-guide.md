---
topic: "Guia de Compilação e Geração de APK (Android) e IPA (iOS)"
tags:
  - project/nomad-log
  - build
  - android/apk
  - ios/ipa
  - expo/eas
verified_by_reviewer: true
last_updated: "2026-10-29T13:45:00Z"
---

# 📦 Guia Oficial de Geração de Builds: Android (APK/AAB) e iOS (IPA)

> **Diferença Fundamental de Formatos:**
> - **Android:** O arquivo instalável direto no celular é o **`.apk`**. Para a Google Play Store, utiliza-se o **`.aab`** (Android App Bundle).
> - **iOS:** A Apple **não utiliza APK**, o formato equivalente é o **`.ipa`** (ou builds de simulador `.app`). A Apple exige assinatura com certificados Apple Developer para instalação física (via TestFlight ou Ad-Hoc).

---

## 🚀 Método Recomendado: EAS Build (Nuvem Expo)

O **EAS (Expo Application Services)** compila seu aplicativo em servidores na nuvem otimizados (Linux para Android e macOS para iOS), sem exigir que você configure gigabytes de dependências locais (Android Studio, Java JDK, Xcode, CocoaPods).

O arquivo [`eas.json`](file:///Volumes/crucial-x9/ideias/nomad-log/eas.json) já está configurado na raiz do projeto com o pacote `com.nomadlog.app`.

### 1. Pré-requisitos (Única vez)

Gere o lockfile de dependências (`package-lock.json`):
```bash
cd nomad-log
npm install
```

Crie uma conta gratuita em [expo.dev](https://expo.dev) e faça login no terminal:
```bash
npx eas-cli login
```

Vincule o projeto ao seu painel Expo:
```bash
npx eas-cli project:init
```

---

## 🤖 1. Gerando o APK para Android

### Opção A: Gerar APK Instalável Direto (Para testar no celular ou mandar para amigos)
Este comando gera um arquivo **`.apk`** pronto. Ao terminar, a Expo fornece um link e um QR Code para você baixar e instalar diretamente no Android:
```bash
# Via script npm configurado no package.json:
npm run build:apk

# Ou comando direto do EAS:
EAS_BUILD_SKIP_LOCKFILE_CHECK=1 npx eas-cli build --platform android --profile preview
```

> **Dica (Lockfile):** Se você ainda não gerou o `package-lock.json`, a flag `EAS_BUILD_SKIP_LOCKFILE_CHECK=1` acima pula essa verificação e compila imediatamente.

### Opção B: Gerar AAB (Para publicar na Google Play Console)
```bash
npm run build:aab
# ou
npx eas-cli build --platform android --profile production
```

---

## 🍏 2. Gerando o Pacote para iOS (IPA / Simulador)

A Apple possui políticas rígidas de assinatura criptográfica. Você tem duas opções:

### Opção A: Gerar Build para Simulador iOS (Sem precisar de Conta Apple Paga)
Se você tem um Mac e quer testar no Simulador de iPhone do Xcode:
```bash
npx eas-cli build --platform ios --profile preview
```
*O EAS gerará um arquivo `.tar.gz` que você pode arrastar e soltar diretamente dentro do simulador do Mac.*

### Opção B: Gerar `.ipa` para iPhone Físico / TestFlight / App Store
Para instalar em iPhones físicos, você precisa de uma conta **Apple Developer** (anual de \$99 da Apple):
```bash
npx eas-cli build --platform ios --profile production
```
O EAS cuidará automaticamente do gerenciamento de certificados, Provisioning Profiles e Bundle Identifiers na sua conta Apple.

---

## 💻 3. Compilação Local (Sem Nuvem, na sua Máquina)

Se você preferir compilar diretamente no seu macOS usando suas próprias ferramentas instaladas:

### Para Android:
*Requisitos: Android Studio, Android SDK e Java JDK 17 configurados no PATH.*
```bash
# Executa no emulador ou aparelho conectado via USB com depuração ativada:
npx expo run:android

# Ou compilar o APK localmente via EAS:
npx eas-cli build --platform android --profile preview --local
```

### Para iOS:
*Requisitos: Xcode instalado no Mac e CocoaPods.*
```bash
# Executa no simulador do Xcode ou iPhone conectado via cabo:
npx expo run:ios
```

