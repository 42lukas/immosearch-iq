# Immosearch-IQ

Ein Next.js-Projekt, im Rahmen eines Uni-Projektes, zur automatisierten Wohnungssuche, das basierend auf deinen Präferenzen passende Wohnungsangebote analysiert, bewertet und Bewerbungen generiert.

🏙️ Ziel: Die mühsame Wohnungssuche durch automatisierte Suche, Scoring und Generierung von passenden Bewerbungen erleichtern.

## Funktionen

🛠️ Web-Crawler: Scraped Immobilien-Webseiten (bis jetzt nur immowelt.de) nach passenden Inseraten.

🧠 Scoring-System: Wohnungen werden anhand von Preis, Zimmerzahl, Größe und Lage bewertet.

📩 Automatische Bewerbungserstellung: Passende Bewerbungen werden automatisch generiert.

🌐 REST-API: Zur Kommunikation zwischen Frontend und Backend.


## Tech-Stack

- 🖥️ Frontend: Next.js (mit React & TypeScript)
- ⚙️ Backend: Node.js & Next.js API-Routen
- 🕷️ Web-Crawler: Cheerio & Axios
- 📡 REST-API: Next.js API-Routen
- 🎨 Styling: Tailwind CSS

## Installation

1. Projekt klonen
2. [Node.js](https://nodejs.org/en) installieren

überprüfen ob die installation geklappt hat:
```bash
node -v
npm -v
```
3. Abhängigkeiten installieren

Wichtig: Du musst im jeweiligen Projektordner sein! Sonst funktioniert es nicht.
```bash
npm install
```

4. framer-motion Modul installieren

Dieses Modul muss leider seperat installiert werden!
```bash
npm install framer-motion
```

## Projekt starten 🚀

```bash
npm run dev
```

## Nutzung

1. Öffne die App im Browser: http://localhost:3000
2. Von der Landing Page aus drückt man den Button in der Mitte
3. Auf der /home Page gibt es dann oben rechts die Möglichkeit die Pages zu wechseln.
4. Gehe zur /user Page und trage deine Persönlichen Daten ein. Nur so kann eine passende Bewerbung erstellt werden!
5. Oben Links bei Immosearch-IQ kommt man zurück zu /home Page
6. Trage deine Wohnungspräferenzen (Stadt, Preis, Zimmeranzahl, Größe) ein.
7. Starte die Suche mit dem Button.
8. Die Top-Wohnungen werden auf der Results-Seite angezeigt.
9. Lade die generierten Bewerbungen direkt herunter oder passe sie gegenbenfalls noch vorher selber an.
10. Gehe auf die Map, um eine Karten-Ansicht zu haben.

## 🐞 Fehlerbehebung

Bei bestimmten Browser-Erweiterungen kann es zu Fehlern kommen.
Ein Beispiel wäre der Fehler "**Hydration failed**".
- Ursache: Grammarly/LanguageTool-Erweiterung im Browser.
- Lösung: Deaktiviere die Grammatik-Erweiterung für localhost.

Bei der Verwendug von einem anderen Browser außer Chrome kann es außerdem zu verschiedenste Fehler durch den Webcrawler kommen, da die Webseiten-Struktur teilweise minimal abweicht. Für ein ideales Benutzererlebnis empfehlen wird deswegen ausdrücklich die Verwendung des Chrome-Browsers!

## 🛡️ Wichtige Hinweise

Das Projekt darf nur für private Zwecke genutzt werden. 
Das Scraping öffentlicher Websites kann gegen deren Nutzungsbedingungen verstoßen und rechtliche Folgen haben bei Kommerzialisierung.

## 🛠️ Credtis
Lukas & Nasser
