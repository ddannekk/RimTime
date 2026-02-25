export default function Privacy() {
  return (
    <div className="w-full">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Datenschutz</h1>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Datenschutzerklärung</h2>
              <p className="text-muted-foreground mb-4">
                Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und den Zweck der Verarbeitung von personenbezogenen Daten auf unserer Website auf.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Verantwortlicher</h2>
              <p className="text-muted-foreground mb-4">
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              </p>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  RIMtime Shop<br />
                  Schulprojekt<br />
                  Deutschland
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Erfassung von Daten</h2>
              <p className="text-muted-foreground mb-4">
                Wir erfassen personenbezogene Daten nur, wenn Sie diese uns freiwillig zur Verfügung stellen, beispielsweise bei:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Bestellungen im Shop</li>
                <li>Kontaktformularen</li>
                <li>Newsletter-Anmeldungen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Verwendung von Daten</h2>
              <p className="text-muted-foreground mb-4">
                Ihre Daten werden verwendet für:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Bestellungsabwicklung</li>
                <li>Kundenservice</li>
                <li>Marketing und Werbung (mit Ihrer Zustimmung)</li>
                <li>Verbesserung unserer Services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Datensicherheit</h2>
              <p className="text-muted-foreground mb-4">
                Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor unbefugtem Zugriff zu schützen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Ihre Rechte</h2>
              <p className="text-muted-foreground mb-4">
                Sie haben das Recht auf:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Auskunft über Ihre Daten</li>
                <li>Berichtigung unrichtiger Daten</li>
                <li>Löschung Ihrer Daten</li>
                <li>Einschränkung der Verarbeitung</li>
                <li>Datenportabilität</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Kontakt</h2>
              <p className="text-muted-foreground mb-4">
                Bei Fragen zum Datenschutz kontaktieren Sie uns bitte unter:
              </p>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  RIMtime Shop<br />
                  E-Mail: info@rimtime-shop.de
                </p>
              </div>
            </section>

            <section className="mb-8">
              <p className="text-sm text-muted-foreground">
                Stand: Februar 2026
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
