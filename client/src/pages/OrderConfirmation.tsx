import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { CheckCircle, Copy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
}

export default function OrderConfirmation() {
  const params = useParams();
  const orderNumber = params.orderNumber || "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: orderData } = trpc.orders.getByNumber.useQuery({ orderNumber });

  useEffect(() => {
    if (orderData) {
      setOrder(orderData as Order);
      setLoading(false);
    }
  }, [orderData]);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Bestellnummer kopiert!");
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded w-1/2 mx-auto mb-4" />
          <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground mb-6">Bestellung nicht gefunden</p>
        <Link href="/" className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
          Zur Startseite
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container py-12">
        {/* Success Message */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Bestellung erfolgreich aufgegeben!
            </h1>
            <p className="text-lg text-muted-foreground">
              Vielen Dank für Ihren Einkauf bei RIMtime.
            </p>
          </div>

          {/* Order Details */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Bestelldetails</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Bestellnummer</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{orderNumber}</span>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    title="Kopieren"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Name</span>
                <span className="text-foreground">{order.customerName}</span>
              </div>

              <div className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">E-Mail</span>
                <span className="text-foreground">{order.customerEmail}</span>
              </div>

              <div className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Lieferadresse</span>
                <span className="text-foreground text-right">{order.customerAddress}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="font-semibold text-foreground">Gesamtbetrag</span>
                <span className="text-2xl font-bold text-accent">
                  €{(order.totalPrice / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="card mb-8 bg-accent/5 border-accent">
            <h2 className="text-xl font-semibold text-foreground mb-4">Zahlungsanweisung</h2>

            <div className="bg-background rounded-lg p-4 mb-4 border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Bitte überweisen Sie den Gesamtbetrag auf folgendes Konto:
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Kontoinhaber</p>
                  <p className="font-semibold text-foreground">RIMtime GmbH</p>
                </div>
                <div>
                  <p className="text-muted-foreground">IBAN</p>
                  <p className="font-semibold text-foreground">DE89 3704 0044 0532 0130 00</p>
                </div>
                <div>
                  <p className="text-muted-foreground">BIC</p>
                  <p className="font-semibold text-foreground">COBADEFFXXX</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verwendungszweck</p>
                  <p className="font-semibold text-foreground">{orderNumber}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Bitte nutzen Sie die Bestellnummer als Referenz. Sobald wir die Zahlung erhalten haben, wird Ihre Bestellung bearbeitet und versendet.
            </p>
          </div>

          {/* Next Steps */}
          <div className="card">
            <h2 className="text-xl font-semibold text-foreground mb-4">Nächste Schritte</h2>

            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                  1
                </span>
                <span className="text-foreground">
                  Überweisen Sie den Betrag auf das angegebene Konto
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                  2
                </span>
                <span className="text-foreground">
                  Wir bestätigen den Zahlungseingang per E-Mail
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                  3
                </span>
                <span className="text-foreground">
                  Ihre Bestellung wird verpackt und versendet
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                  4
                </span>
                <span className="text-foreground">
                  Sie erhalten eine Versandbestätigung mit Tracking-Nummer
                </span>
              </li>
            </ol>
          </div>

          {/* Continue Shopping */}
          <div className="mt-8 text-center">
            <Link href="/products" className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
              Weitere Produkte entdecken
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
