import { LEGAL_STAND, getMerchantAddressLine, getMerchantDisplayName, merchantProfile } from "@/lib/legal";

export default function Privacy() {
  return (
    <div className="w-full">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Datenschutz</h1>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Verantwortlicher</h2>
              <p className="text-muted-foreground mb-4">
                Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:
              </p>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  {merchantProfile.brandName}<br />
                  {getMerchantDisplayName()}<br />
                  {getMerchantAddressLine()}<br />
                  {merchantProfile.country}<br />
                  E-Mail: {merchantProfile.email}<br />
                  Telefon: {merchantProfile.phone}
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Allgemeine Hinweise</h2>
              <p className="text-muted-foreground mb-4">
                Wir verarbeiten personenbezogene Daten nur, soweit dies für den Betrieb
                des Shops, die Bearbeitung von Bestellungen, die Beantwortung von
                Anfragen oder die Verbesserung der Website erforderlich ist. Maßgeblich
                sind insbesondere die Datenschutz-Grundverordnung (DSGVO) und das
                Bundesdatenschutzgesetz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Zugriffsdaten</h2>
              <p className="text-muted-foreground mb-4">
                Beim Aufruf der Website können technisch erforderliche Zugriffsdaten
                verarbeitet werden, etwa IP-Adresse, Datum und Uhrzeit des Zugriffs,
                Browsertyp, Betriebssystem und aufgerufene Seiten. Diese Verarbeitung
                dient der stabilen und sicheren Bereitstellung der Website. Rechtsgrundlage
                ist Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Bestellungen im Shop</h2>
              <p className="text-muted-foreground mb-4">
                Wenn Sie eine Bestellung aufgeben, verarbeiten wir die von Ihnen
                angegebenen Daten wie Name, E-Mail-Adresse, Lieferadresse, bestellte
                Produkte, Zahlungsart und Bestellnummer. Diese Daten werden zur
                Abwicklung des Kaufvertrags, zur Kommunikation über die Bestellung und
                zur Erfüllung gesetzlicher Aufbewahrungspflichten genutzt. Rechtsgrundlage
                ist Art. 6 Abs. 1 lit. b und lit. c DSGVO.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Kontaktformular</h2>
              <p className="text-muted-foreground mb-4">
                Bei Nutzung des Kontaktformulars verarbeiten wir Ihren Namen, Ihre
                E-Mail-Adresse, den Betreff, Ihre Nachricht und den Zeitpunkt der Anfrage.
                Die Daten werden verwendet, um Ihre Anfrage zu beantworten. Rechtsgrundlage
                ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um vorvertragliche oder
                vertragliche Fragen geht, im Übrigen Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Lokale Speicherung im Browser</h2>
              <p className="text-muted-foreground mb-4">
                Für Warenkorb, Merkliste, Kontaktformular-Vorschau und lokale
                Bestellübersichten nutzt diese Website den Speicher Ihres Browsers
                (localStorage). Diese Daten bleiben auf Ihrem Gerät gespeichert, bis Sie
                sie im Browser löschen oder die jeweilige Funktion zurücksetzen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Zahlungsarten</h2>
              <p className="text-muted-foreground mb-4">
                Im Checkout können Zahlungsarten wie PayPal, Kreditkarte, Klarna oder
                Vorkasse ausgewählt werden. In dieser Projektversion wird keine echte
                externe Zahlung ausgelöst. Bei einem produktiven Einsatz würden je nach
                gewählter Zahlungsart Daten an den jeweiligen Zahlungsdienstleister
                übermittelt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Speicherdauer</h2>
              <p className="text-muted-foreground mb-4">
                Personenbezogene Daten werden nur so lange gespeichert, wie dies für den
                jeweiligen Zweck erforderlich ist. Handels- und steuerrechtliche
                Aufbewahrungspflichten bleiben unberührt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Ihre Rechte</h2>
              <p className="text-muted-foreground mb-4">
                Sie haben nach Maßgabe der gesetzlichen Voraussetzungen das Recht auf
                Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
                Datenübertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen.
                Außerdem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde
                zu beschweren.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Kontakt zum Datenschutz</h2>
              <p className="text-muted-foreground mb-4">
                Bei Fragen zum Datenschutz erreichen Sie uns unter{" "}
                <a href={`mailto:${merchantProfile.email}`} className="text-accent hover:underline">
                  {merchantProfile.email}
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <p className="text-sm text-muted-foreground">Stand: {LEGAL_STAND}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
