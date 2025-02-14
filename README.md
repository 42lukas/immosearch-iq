## Immosearch-IQ

Ein Next.js-Projekt, im Rahmen eines Uni-Projektes, zur automatisierten Wohnungssuche, das basierend auf deinen Präferenzen passende Wohnungsangebote analysiert, bewertet und Bewerbungen generiert.
🏙️ Ziel: Die mühsame Wohnungssuche durch automatisierte Suche, Scoring und Benachrichtigungen erleichtern.

## Funktionen

🛠️ Web-Crawler: Scraped Immobilien-Webseiten nach passenden Inseraten.

🧠 Scoring-System: Wohnungen werden anhand von Preis, Zimmerzahl, Lage, ÖPNV-Anbindung etc. bewertet.

📩 Automatische Bewerbungserstellung: Passende Bewerbungen werden automatisch generiert.

🔔 Push-Benachrichtigungen: Benachrichtigungen für Wohnungen mit einem Score > 8.5.

📍 Stadt-Kiez-Filter: Suche nach Wohnungen in bestimmten Kiezen (z.B. Bergmannkiez Berlin).

🌐 REST-API: Zur Kommunikation zwischen Frontend und Backend.


## Tech-Stack

- 🖥️ Frontend: Next.js (mit React & TypeScript)
- ⚙️ Backend: Node.js & Next.js API-Routen
- 🕷️ Web-Crawler: Cheerio & Axios
- 📡 REST-API: Next.js API-Routen
- 🎨 Styling: Tailwind CSS

## Installation

1. Projekt klonen
2. [Node.js](https://nodejs.org/en) und npm installieren
überprüfen ob die installation geklappt hat:
```bash
node -v
npm -v
```
3. Abhängigkeiten installieren
```bash
npm install
```

## Projekt starten 🚀
**Entwicklungsmodus**
```bash
npm run dev
```

**Build erstellen**
```bash
npm run build
```

**Produktion starten**
```bash
npm start
```

## Nutzung

1. Öffne die App im Browser: http://localhost:3000
2. Trage deine Wohnungspräferenzen (Stadt, Preis, Zimmeranzahl, Größe) ein.
3. Starte die Suche mit dem Button.
4. Die Top-Wohnungen werden auf der Results-Seite angezeigt.
5. Lade die generierten Bewerbungen direkt herunter oder sende sie per E-Mail.

## 🐞 Fehlerbehebung

1. Bei bestimmten Browser-Erweiterungen kann es zu Fehlern kommen.
Ein Beispiel wäre der Fehler **Hydration failed**
- Ursache: Grammarly/LanguageTool-Erweiterung im Browser.
- Lösung: Deaktiviere die Grammatik-Erweiterung für localhost.

## 🛡️ Wichtige Hinweise

Das Projekt darf nur für private Zwecke genutzt werden. 
Das Scraping öffentlicher Websites kann gegen deren Nutzungsbedingungen verstoßen und rechtliche Folgen haben bei Kommerzialisierung.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🛠️ Credtis
Nasser
Lukas
