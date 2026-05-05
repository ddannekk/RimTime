import { Link } from "wouter";

import { LEGAL_STAND, getMerchantDisplayName, merchantProfile } from "@/lib/legal";
import {
  FREE_SHIPPING_THRESHOLD,
  RETURN_DAYS,
  STANDARD_SHIPPING_COST,
} from "@/lib/storePolicies";

export default function Terms() {
  return (
    <div className="w-full">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Geltungsbereich</h2>
              <p className="text-muted-foreground mb-4">
                Diese Allgemeinen Geschäftsbedingungen gelten für Bestellungen über den
                Onlineshop {merchantProfile.brandName} zwischen uns,
                {" "}
                {getMerchantDisplayName()},
                {" "}
                und unseren Kundinnen und Kunden in der zum Zeitpunkt der Bestellung
                jeweils aktuellen Fassung.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Vertragsabschluss</h2>
              <p className="text-muted-foreground mb-4">
                Die Darstellung der Produkte im Onlineshop stellt kein rechtlich
                bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur
                Bestellung. Mit dem Absenden der Bestellung über den Button
                {" "}
                „zahlungspflichtig bestellen“
                {" "}
                geben Sie ein verbindliches Angebot zum Abschluss eines Kaufvertrags ab.
                Der Vertrag kommt zustande, wenn wir die Bestellung durch eine
                Bestellbestätigung im Shop, per E-Mail oder durch Auslieferung der Ware
                annehmen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Preise und Zahlungsbedingungen</h2>
              <p className="text-muted-foreground mb-4">
                Alle Preise sind in Euro angegeben und verstehen sich einschließlich der
                gesetzlichen Umsatzsteuer. Zusätzlich anfallende Versandkosten werden im
                Bestellprozess gesondert ausgewiesen. Als Zahlungsarten stehen im
                Checkout derzeit PayPal, Visa/Kreditkarte, Klarna und Vorkasse zur
                Verfügung. Der Versand ist innerhalb Deutschlands ab einem Warenwert von
                {" "}
                €{(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)}
                {" "}
                kostenlos; darunter beträgt die Versandpauschale
                {" "}
                €{(STANDARD_SHIPPING_COST / 100).toFixed(2)}.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Lieferung</h2>
              <p className="text-muted-foreground mb-4">
                Angaben zu Lieferzeiten, Lieferbeschränkungen und verfügbaren
                Zahlungsmitteln werden spätestens zu Beginn des Bestellvorgangs
                angezeigt. Soweit beim jeweiligen Produkt nichts anderes angegeben ist,
                beträgt die reguläre Lieferzeit innerhalb Deutschlands in der Regel fünf
                bis sieben Werktage ab Vertragsschluss beziehungsweise bei Vorkasse ab
                Zahlungseingang.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Eigentumsvorbehalt
              </h2>
              <p className="text-muted-foreground mb-4">
                Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Widerrufsrecht für Verbraucherinnen und Verbraucher
              </h2>
              <p className="text-muted-foreground mb-4">
                Verbraucherinnen und Verbraucher haben bei Fernabsatzverträgen das
                gesetzliche Widerrufsrecht. Die Widerrufsfrist beträgt grundsätzlich
                14 Tage ab Erhalt der Ware. Ergänzend kann unser Shop freiwillig
                erweiterte Rückgabefristen anbieten; maßgeblich sind die jeweils im
                Bestellprozess kommunizierten Bedingungen.
              </p>
              <p className="text-muted-foreground mb-4">
                Kein gesetzliches Widerrufsrecht besteht insbesondere bei Waren, die
                nicht vorgefertigt sind und für deren Herstellung eine individuelle
                Auswahl oder Bestimmung durch den Kunden maßgeblich ist oder die
                eindeutig auf persönliche Bedürfnisse zugeschnitten sind. Das betrifft
                insbesondere personalisierte Produkte.
              </p>
              <p className="text-muted-foreground mb-4">
                Sofern wir im Shop mit einer freiwilligen Rückgabe von bis zu
                {" "}
                {RETURN_DAYS}
                {" "}
                Tagen werben, gilt diese freiwillige Kulanz nur nach Maßgabe der im Shop
                kommunizierten Rückgabebedingungen und lässt gesetzliche Rechte
                unberührt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Mängelhaftung
              </h2>
              <p className="text-muted-foreground mb-4">
                Es gilt das gesetzliche Mängelhaftungsrecht. Etwaige zusätzlich von uns
                angebotene Garantien gelten nur, wenn sie ausdrücklich beim jeweiligen
                Produkt ausgewiesen werden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Haftung</h2>
              <p className="text-muted-foreground mb-4">
                Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei
                schuldhafter Verletzung von Leben, Körper oder Gesundheit. Bei leicht
                fahrlässiger Verletzung wesentlicher Vertragspflichten haften wir nur
                auf den vertragstypischen, vorhersehbaren Schaden. Die Haftung nach dem
                Produkthaftungsgesetz bleibt unberührt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Vertragssprache</h2>
              <p className="text-muted-foreground mb-4">
                Vertragssprache ist Deutsch.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Datenschutz</h2>
              <p className="text-muted-foreground mb-4">
                Informationen zur Verarbeitung personenbezogener Daten finden Sie in
                unserer
                {" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Verbraucherstreitbeilegung
              </h2>
              <p className="text-muted-foreground mb-4">
                Wir sind nicht verpflichtet und nicht bereit, an einem
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                teilzunehmen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                12. Anwendbares Recht
              </h2>
              <p className="text-muted-foreground mb-4">
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Wenn Sie
                Verbraucher sind und Ihren gewöhnlichen Aufenthalt in einem anderen Staat
                haben, bleiben zwingende Verbraucherschutzvorschriften dieses Staates
                unberührt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Kontakt</h2>
              <p className="text-muted-foreground mb-4">
                Bei Fragen zu diesen AGB kontaktieren Sie uns unter
                {" "}
                <a
                  href={`mailto:${merchantProfile.email}`}
                  className="text-accent hover:underline"
                >
                  {merchantProfile.email}
                </a>
                .
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
