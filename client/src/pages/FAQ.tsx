import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "Welche Größen sind verfügbar?",
    answer:
      "RIMtime Felgenuhren sind in zwei Größen erhältlich: 30cm und 45cm Durchmesser. Die 30cm Variante eignet sich perfekt für kleinere Räume oder als Schreibtisch-Deko, während die 45cm Variante ein echtes Statement-Piece für große Wände ist.",
  },
  {
    id: "2",
    question: "Welche Styles gibt es?",
    answer:
      "Wir bieten drei verschiedene Styles an: Motorsport (sportlich, aggressive Speichen), Classic (zeitlos, elegante Linien) und Black/Chrome (modernes Design mit Chrom-Akzenten). Alle Styles sind in verschiedenen Farben erhältlich.",
  },
  {
    id: "3",
    question: "Wie wird die Uhr montiert?",
    answer:
      "Die Montage ist einfach und unkompliziert. Die Uhr wird mit einem Wandhalter geliefert, der mit zwei Dübeln und Schrauben an der Wand befestigt wird. Eine Anleitung mit Bildern liegt bei. Die Montage dauert ca. 5-10 Minuten.",
  },
  {
    id: "4",
    question: "Wie lange hält die Batterie?",
    answer:
      "Die Uhr wird mit einer AA-Batterie betrieben und hat eine durchschnittliche Laufzeit von 12-18 Monaten, je nach Batterie-Qualität. Der Stromverbrauch ist minimal, da wir ein Silent-Clock Mechanismus verwenden.",
  },
  {
    id: "5",
    question: "Ist die Uhr wirklich leise?",
    answer:
      "Ja! Unsere RIMtime Uhren verwenden ein spezielles Silent-Clock Uhrwerk, das völlig geräuschlos läuft. Es gibt kein störendes Ticken wie bei normalen Uhren. Perfekt für Schlafzimmer, Büro oder Gaming-Setup.",
  },
  {
    id: "6",
    question: "Kann ich die Uhr personalisieren?",
    answer:
      "Ja, wir bieten Personalisierungsoptionen an. Sie können z.B. Ihren Namen, ein Logo oder einen Text in der Mitte der Uhr anbringen lassen. Dies ist gegen einen kleinen Aufpreis möglich.",
  },
  {
    id: "7",
    question: "Wie lange dauert der Versand?",
    answer:
      "Nach Zahlungseingang dauert die Bearbeitung 2-3 Werktage. Der Versand erfolgt dann per DHL und dauert in Deutschland 2-3 Werktage. Insgesamt sollten Sie mit 5-7 Werktagen rechnen.",
  },
  {
    id: "8",
    question: "Gibt es eine Garantie?",
    answer:
      "Ja, alle RIMtime Uhren haben eine 2-Jahres-Garantie auf das Uhrwerk und die Verarbeitung. Bei Mängeln oder Defekten können Sie die Uhr kostenlos reparieren oder austauschen lassen.",
  },
  {
    id: "9",
    question: "Kann ich die Uhr zurückgeben?",
    answer:
      "Ja, wir bieten ein 30-Tage-Rückgaberecht. Wenn Sie mit Ihrer Uhr nicht zufrieden sind, können Sie diese innerhalb von 30 Tagen nach Erhalt zurückgeben und erhalten Ihr Geld zurück.",
  },
  {
    id: "10",
    question: "Wie kann ich eine Bestellung aufgeben?",
    answer:
      "Wählen Sie einfach das gewünschte Produkt aus unserem Katalog, legen Sie es in den Warenkorb und gehen Sie zur Kasse. Geben Sie Ihre Daten ein und wählen Sie Vorkasse als Zahlungsart. Nach der Bestellung erhalten Sie eine Bestätigung mit Bankdaten.",
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

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item) => (
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

        {/* Contact Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="card bg-accent/5 border-accent">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Hast du eine andere Frage?
            </h2>
            <p className="text-muted-foreground mb-6">
              Wenn du deine Frage hier nicht beantwortet findest, kontaktiere uns gerne direkt.
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-foreground">Email:</span>{" "}
                <a href="mailto:support@rimtime.de" className="text-accent hover:underline">
                  support@rimtime.de
                </a>
              </div>
              <div>
                <span className="font-semibold text-foreground">Telefon:</span>{" "}
                <a href="tel:+491234567890" className="text-accent hover:underline">
                  +49 (0) 123 456789
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
