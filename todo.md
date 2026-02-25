# RIMtime Shop - TODO Liste

## Datenbankschema & Backend
- [x] Produkttabelle mit Varianten (Größe, Style, Preis)
- [x] Warenkorb-Tabelle
- [x] Bestellungs-Tabelle
- [x] Community-Galerie-Tabelle (Nutzer-Uploads)
- [x] Bewertungs-Tabelle
- [x] tRPC Procedures für Produkte, Warenkorb, Bestellungen, Galerie

## Frontend - Navigation & Layout
- [x] Header mit Logo, Suchbar, Warenkorb-Icon, Kategorien-Menu
- [x] Sidebar mit Filtern (Größe, Style, Preisbereich)
- [x] Footer mit Links und Kontakt
- [x] Reddit-Stil Design System (Farben, Typografie)

## Landingpage
- [x] Hero-Bereich mit Felgenuhr-Produktbild
- [x] Top-Bestseller Sektion (4-6 Produkte)
- [x] Kundenbewertungen Sektion
- [x] FAQ-Sektion (Montage, Größe, Batterie, Lieferzeit)
- [x] Call-to-Action Buttons

## Produktkatalog
- [x] Produktlisten-Ansicht mit Grid-Layout
- [x] Produktkarten mit Bild, Name, Preis, Rating
- [x] Sidebar-Filter (Größe, Style, Preis)
- [x] Sortierung (Beliebtheit, Preis, Neu)
- [x] Produktdetailseite mit großem Bild, Varianten-Auswahl
- [x] Upvote/Downvote System im Reddit-Stil
- [x] Kommentare/Bewertungen auf Produktseite

## Warenkorb & Checkout
- [x] Warenkorb-Seite mit Produktliste, Mengenauswahl
- [x] Preis-Berechnung mit Steuern/Versand
- [x] Checkout-Formular (Name, Email, Adresse)
- [x] Vorkasse-Bestätigung mit Bankdaten (simuliert)
- [x] Bestellbestätigung mit Bestellnummer

## Community-Galerie
- [x] Galerie-Seite mit Nutzer-Uploads
- [x] Upload-Formular für Nutzer
- [x] Bildgalerie mit Lightbox/Slider
- [x] Like/Kommentar-System für Galerien-Bilder

## Admin-Dashboard
- [x] Admin-Login/Authentifizierung
- [x] Bestellungs-Übersicht (Tabelle mit allen Test-Bestellungen)
- [x] Bestellungs-Details anschauen
- [x] Statistiken (Anzahl Bestellungen, Umsatz)

## Design & Styling
- [x] Reddit-Farbschema implementieren (#FF4500 Orange, cleanes Layout)
- [x] Responsive Design (Mobile, Tablet, Desktop)
- [x] Dark Mode Option (optional)
- [x] Tailwind CSS Konfiguration

## Testing & Optimierung
- [x] Vitest Unit Tests für kritische Funktionen
- [x] Responsive Design testen
- [x] Performance-Optimierung
- [x] Browser-Kompatibilität prüfen

## Deployment
- [ ] Finale Checkpoint erstellen
- [ ] Website für Lehrer-Präsentation bereit

## Neue Anforderungen - Produktbilder
- [x] Produktbilder für alle 6 Varianten generieren
- [x] Bilder hochladen und URLs in der Datenbank aktualisieren
- [x] Seed-Daten mit neuen Bild-URLs aktualisieren

## Bugfixes & Neue Features
- [x] Hero-Bild auf der Startseite anzeigen
- [x] Datenschutz-Seite erstellen
- [x] Impressum-Seite erstellen
- [x] AGB-Seite erstellen
- [x] Footer-Links für Datenschutz, Impressum, AGB hinzufügen

## Neue Features - Wow-Effekte für Präsentation
- [x] Zufällige Bewertungszahlen auf jeder PDS
- [x] Wishlist/Favoriten-System (Herz-Button)
- [x] Social Proof (View-Counter, Bestseller-Badge)
- [x] Share-Funktionalität (Link kopieren)
- [x] Hover-Effekte und Animationen
- [x] Kostenloser Versand-Badge
- [x] Zeitstempel bei Bewertungen


## Premium Features - Alle implementieren
- [x] Live-Benachrichtigungen (Social Proof Notifications)
- [x] Countdown-Timer für limitierte Angebote
- [x] Produktempfehlungen auf Checkout-Seite
- [x] Suchfunktion mit Live-Filter
- [ ] Bewertungsformular für Kunden (optional)
- [x] Dark Mode Toggle


## Neue Features - Admin & Marketing
- [ ] Promo-Codes und Rabatte (SCHOOL20 = 20% Rabatt)
- [ ] Google Maps Integration (Walter-Eucken-Gymnasium, Freiburg)
- [ ] Produktvergleich-Feature (bis zu 3 Produkte)
- [ ] Admin Dashboard mit Login (admin/admin)
- [ ] Verkaufsstatistiken nach Tagen
- [ ] Produktverwaltung (Bearbeitung, Bilder, Beschreibung)
- [ ] Benutzer- und Bestellungsverwaltung
- [ ] Lagerverwaltung
- [ ] Bewertungen moderieren


## Final Features - Letzte Upgrades
- [x] Google Maps Integration (Walter-Eucken-Gymnasium, Freiburg)
- [x] Produktvergleich-Feature (bis zu 3 Produkte)
- [x] Wishlist/Favoriten-System mit localStorage
- [x] Ratingfilter (4+, 5 Sterne)
- [x] Quick View Modal für Produkte
- [x] Animierter Statistik-Counter auf Startseite


## Bugfixes - Nutzer-Feedback (KRITISCH)
- [x] Notifications reduzieren (weniger häufig, realistischer)
- [ ] Admin-Panel: Produkte bearbeiten, löschen, hinzufügen - FUNKTIONIERT NICHT
- [x] Promo-Code-Eingabe in Warenkorb und Checkout
- [ ] Google Maps Koordinaten korrigieren - MARKER FALSCH POSITIONIERT
- [ ] Dark Mode Toggle reparieren - FUNKTIONIERT NICHT
- [ ] Kontakt-Nachrichten speichern und anzeigen - NICHT SICHTBAR


## Neue Anforderungen - Admin Produkt-Editor
- [ ] Separate Landing Page für Produkt-Bearbeitung/Hinzufügen
- [ ] Formular mit: Name, Foto, Preis, Beschreibung, Größe, Style
- [ ] Foto-Upload oder URL-Eingabe
- [ ] Speichern und Abbrechen Buttons
- [ ] Navigation vom Admin-Dashboard zur Edit-Page
