# Budgetplaner

React + Vite App zum Tracken von Bau-Ausgaben (Kredite, Kategorien, Förderungen). Daten werden lokal im Browser gespeichert (`window.storage`), kein Backend.

## Arbeitsweise

- **Änderungen immer live stellen**: Nach Abschluss einer Aufgabe die Änderungen committen, pushen, einen PR nach `main` öffnen und direkt mergen. Der Merge auf `main` löst automatisch den GitHub-Pages-Deploy aus (`.github/workflows`). Nicht auf Rückfrage warten.
- Build prüfen mit `npm run build`, bevor gemergt wird.

## Struktur

- `src/App.jsx` – Hauptkomponente, State, Berechnungen (`calc`)
- `src/components/` – UI-Komponenten (Formular, Statistiken, Meter, Settings, Styles in `Style.jsx` als CSS-in-JS)
- `src/utils/` – Formatierung (de-DE, EUR), Persistenz, Datei-Anhänge
- `src/constants.js` – Default-State und Standard-Kategorien
