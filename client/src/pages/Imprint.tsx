import {
  LEGAL_STAND,
  getMerchantAddressLine,
  getMerchantDisplayName,
  merchantProfile,
} from "@/lib/legal";

export default function Imprint() {
  const hasRegisterData = Boolean(
    merchantProfile.registerCourt.trim() && merchantProfile.registerNumber.trim()
  );
  const hasVatId = Boolean(merchantProfile.vatId.trim());

  return (
    <div className="w-full">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Impressum</h1>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Angaben gemäß § 5 DDG
              </h2>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-muted-foreground mb-4">
                  <strong>{merchantProfile.brandName}</strong>
                  <br />
                  {getMerchantDisplayName()}
                  <br />
                  {getMerchantAddressLine()}
                  <br />
                  {merchantProfile.country}
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Kontakt</h2>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  E-Mail: {merchantProfile.email}
                  <br />
                  Telefon: {merchantProfile.phone}
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Vertretungsberechtigte Person
              </h2>
              <p className="text-muted-foreground mb-4">
                {merchantProfile.representative}
              </p>
            </section>

            {hasRegisterData && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Registereintrag</h2>
                <p className="text-muted-foreground mb-4">
                  Eingetragen im Handelsregister.
                  <br />
                  Registergericht: {merchantProfile.registerCourt}
                  <br />
                  Registernummer: {merchantProfile.registerNumber}
                </p>
              </section>
            )}

            {hasVatId && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Umsatzsteuer-Identifikationsnummer
                </h2>
                <p className="text-muted-foreground mb-4">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:
                  <br />
                  {merchantProfile.vatId}
                </p>
              </section>
            )}

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Verbraucherstreitbeilegung
              </h2>
              <p className="text-muted-foreground mb-4">
                Wir sind nicht verpflichtet und nicht bereit, an einem
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                teilzunehmen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Haftung für Inhalte</h2>
              <p className="text-muted-foreground mb-4">
                Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt.
                Für Richtigkeit, Vollständigkeit und Aktualität übernehmen wir jedoch
                keine Gewähr. Als Diensteanbieter sind wir nach den allgemeinen Gesetzen
                für eigene Inhalte verantwortlich. Gesetzliche Verpflichtungen zur
                Entfernung oder Sperrung der Nutzung von Informationen bleiben hiervon
                unberührt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Haftung für Links</h2>
              <p className="text-muted-foreground mb-4">
                Diese Website enthält Verlinkungen zu externen Seiten Dritter. Auf deren
                Inhalte haben wir keinen Einfluss und übernehmen dafür keine Gewähr. Für
                die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
                Betreiber verantwortlich. Bei Bekanntwerden konkreter Rechtsverletzungen
                werden wir entsprechende Links unverzüglich entfernen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Urheberrecht</h2>
              <p className="text-muted-foreground mb-4">
                Die auf dieser Website erstellten Inhalte und Werke unterliegen dem
                deutschen Urheberrecht. Jede Verwertung außerhalb der gesetzlichen
                Grenzen bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.
              </p>
            </section>

            <section className="mb-8">
              <p className="text-sm text-muted-foreground">
                Stand: {LEGAL_STAND}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
