import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS } from "@/lib/storePolicies";
import { merchantProfile } from "@/lib/legal";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSection {
  id: string;
  title: string;
  description: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    id: "design",
    title: "Produkt & Design",
    description: "Alles zu Größen, Stilrichtungen, Personalisierung und Montage.",
    items: [
      {
        id: "1",
        question: "Welche Größen sind verfügbar?",
        answer:
          "RIMtime Felgenuhren sind in zwei Größen erhältlich: 30 cm und 45 cm Durchmesser. 30 cm passt ideal zu Schreibtisch-Setups, Regalen oder kleineren Wandflächen. 45 cm ist die markante Wahl für größere Wände, Garagen oder Büros.",
      },
      {
        id: "2",
        question: "Welche Styles gibt es?",
        answer:
          "Wir bieten mehrere Stilrichtungen wie Motorsport, Classic und Black/Chrome. Je nach Modell unterscheiden sich Speichendesign, Finish und Gesamtwirkung. Die Varianten sehen Sie direkt auf der jeweiligen Produktseite.",
      },
      {
        id: "3",
        question: "Kann ich die Uhr personalisieren?",
        answer:
          "Ja. Auf der Produktseite können Sie einen kurzen Wunschtext angeben, zum Beispiel Initialen, Fahrernamen, Teamnamen oder eine Startnummer. Die Personalisierung wird als Sonderwunsch mit einem kleinen Aufpreis gefertigt.",
      },
      {
        id: "4",
        question: "Kann ich ein komplett individuelles Design entwickeln lassen?",
        answer:
          "Ja. Auf Anfrage entwickeln wir auch komplett individuelle Designs, zum Beispiel auf Basis einer bestimmten Felge, Farbkombination oder Markenidee. Schreiben Sie uns dazu direkt mit Ihrer Vorstellung, Referenzen und gewünschter Stückzahl.",
      },
      {
        id: "5",
        question: "Wie wird die Uhr montiert?",
        answer:
          "Die Montage ist bewusst einfach gehalten. Die Uhr wird mit passendem Wandhalter geliefert und kann mit Schrauben und Dübeln sicher montiert werden. Eine Anleitung liegt bei, der Aufbau dauert in der Regel nur wenige Minuten.",
      },
      {
        id: "6",
        question: "Ist die Uhr wirklich leise?",
        answer:
          "Ja. Unsere Modelle verwenden ein leises Uhrwerk ohne störendes Ticken. Dadurch funktionieren sie auch in Schlafzimmern, Büros oder Gaming-Setups ohne akustische Unruhe.",
      },
      {
        id: "7",
        question: "Wie lange hält die Batterie?",
        answer:
          "Die Uhr läuft mit einer AA-Batterie. Je nach Qualität und Nutzungsdauer liegt die typische Laufzeit bei etwa 12 bis 18 Monaten.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Bestellung & Versand",
    description: "Zahlungsarten, Lieferzeiten und Versandkonditionen auf einen Blick.",
    items: [
      {
        id: "8",
        question: "Wie kann ich eine Bestellung aufgeben?",
        answer:
          "Wählen Sie Ihr Wunschprodukt, legen Sie es in den Warenkorb und gehen Sie zur Kasse. Dort geben Sie Ihre Lieferdaten ein und wählen Ihre bevorzugte Zahlungsart wie PayPal, Visa/Kreditkarte, Klarna oder Vorkasse.",
      },
      {
        id: "9",
        question: "Welche Zahlungsarten bietet ihr an?",
        answer:
          "Im Checkout stehen PayPal, Visa/Kreditkarte, Klarna und Vorkasse zur Auswahl. Welche Methode Sie nutzen, entscheiden Sie direkt im letzten Schritt der Bestellung.",
      },
      {
        id: "10",
        question: "Wie lange dauert der Versand?",
        answer:
          "Die Bearbeitung dauert in der Regel 2 bis 3 Werktage. Danach erfolgt der Versand aus Deutschland. Insgesamt sollten Sie mit etwa 5 bis 7 Werktagen rechnen.",
      },
      {
        id: "11",
        question: "Wann ist der Versand kostenlos?",
        answer:
          `Ab einem Bestellwert von €${(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)} ist der Versand kostenlos. Darunter berechnen wir eine transparente Versandpauschale.`,
      },
    ],
  },
  {
    id: "service",
    title: "Service & Rückgabe",
    description: "Garantie, Rückgabe und Support nach dem Kauf.",
    items: [
      {
        id: "12",
        question: "Gibt es eine Garantie?",
        answer:
          "Ja. Wir bieten 2 Jahre Gewährleistung auf Uhrwerk und Verarbeitung. Bei Material- oder Verarbeitungsfehlern unterstützen wir Sie schnell und unkompliziert.",
      },
      {
        id: "13",
        question: "Kann ich die Uhr zurückgeben?",
        answer:
          `Ja. Sie haben ${RETURN_DAYS} Tage Rückgaberecht ab Erhalt der Ware. Wenn etwas nicht passt, melden Sie sich einfach bei uns und wir begleiten die Rücksendung sauber und transparent.`,
      },
      {
        id: "14",
        question: "Wie erreiche ich den Support?",
        answer:
          "Wenn Sie vor oder nach dem Kauf Fragen haben, erreichen Sie uns per E-Mail oder telefonisch. Wir helfen bei Auswahl, Sonderwünschen und Reklamationen direkt weiter.",
      },
    ],
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Häufig gestellte Fragen</h1>
          <p className="text-lg text-muted-foreground">
            Finde Antworten auf die wichtigsten Fragen zu RIMtime Felgenuhren
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {faqSections.map((section) => (
            <section key={section.id}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
                  {section.title}
                </p>
                <p className="mt-2 text-muted-foreground">{section.description}</p>
              </div>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="card cursor-pointer hover:border-accent transition-colors"
                    onClick={() => toggleFAQ(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground pr-4">
                        {item.question}
                      </h3>
                      <ChevronDown
                        className={`w-6 h-6 text-accent flex-shrink-0 transition-transform ${
                          openId === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {openId === item.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-muted-foreground">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="card bg-accent/5 border-accent">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Haben Sie eine andere Frage?
            </h2>
            <p className="text-muted-foreground mb-6">
              Wenn Sie Ihre Frage hier nicht beantwortet finden, kontaktieren Sie uns gerne direkt.
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-foreground">E-Mail:</span>{" "}
                <a href={`mailto:${merchantProfile.email}`} className="text-accent hover:underline">
                  {merchantProfile.email}
                </a>
              </div>
              <div>
                <span className="font-semibold text-foreground">Telefon:</span>{" "}
                <a href="tel:+497614589120" className="text-accent hover:underline">
                  {merchantProfile.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
