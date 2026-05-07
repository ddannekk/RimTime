import { Link } from "wouter";
import { Trash2, ArrowLeft, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { withBasePath } from "@/lib/paths";
import {
  FREE_SHIPPING_THRESHOLD,
  RETURN_DAYS,
  getIncludedVat,
  getRemainingForFreeShipping,
  getShippingCost,
} from "@/lib/storePolicies";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const utils = trpc.useUtils();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const totalPrice = getTotalPrice();
  const shippingCost = getShippingCost(totalPrice);
  const subtotal = totalPrice;
  const amountUntilFreeShipping = getRemainingForFreeShipping(subtotal);
  const discountAmount = Math.round(subtotal * (discount / 100));
  const total = subtotal - discountAmount + shippingCost;
  const includedVat = getIncludedVat(total);

  const handlePromoCode = () => {
    const applyPromo = async () => {
      const normalizedCode = promoCode.trim().toUpperCase();
      if (!normalizedCode) {
        setDiscount(0);
        toast.error("Bitte Promo-Code eingeben");
        return;
      }

      const result = await utils.promoCodes.validate.fetch({ code: normalizedCode });
      if (!result.valid) {
        setDiscount(0);
        toast.error("Ungültiger Promo-Code");
        return;
      }

      setDiscount(result.discount);
      toast.success(`${result.discount}% Rabatt angewendet.`);
    };

    applyPromo().catch(() => {
      setDiscount(0);
      toast.error("Ungültiger Promo-Code");
    });
  };

  return (
    <div className="w-full">
      <div className="container py-12">
        <div className="mb-8 rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.38))] p-8 shadow-sm dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.74),rgba(15,23,42,0.32))]">
          <Link href="/products" className="mb-4 flex items-center gap-2 text-accent transition-opacity hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            Zurück zu Produkten
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Warenkorb</h1>
          <p className="mt-2 text-muted-foreground">Prüfen Sie Ihre Auswahl und gehen Sie ohne Umwege zur Kasse.</p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div key={item.cartKey} className="rounded-[1.75rem] border border-border/70 bg-card/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-muted sm:h-28 sm:w-28">
                        {item.image ? (
                          <img src={withBasePath(item.image)} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            RIM
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-accent/80">Artikel</p>
                      <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.size} • {item.style}</p>
                      {item.personalization && (
                        <p className="mt-2 text-sm text-accent">Personalisierung: {item.personalization}</p>
                      )}
                      <p className="mt-4 text-2xl font-bold text-accent">€{(item.price / 100).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-2 py-1 dark:bg-black/20">
                        <button
                          onClick={() => updateQuantity(item.cartKey!, item.quantity - 1)}
                          className="rounded-full px-2 py-1 transition-colors hover:bg-muted"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) => updateQuantity(item.cartKey!, Math.max(1, parseInt(event.target.value, 10) || 1))}
                          className="w-12 bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.cartKey!, item.quantity + 1)}
                          className="rounded-full px-2 py-1 transition-colors hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartKey!)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200/80 px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Entfernen
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Summe</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">€{((item.price * item.quantity) / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-[1.75rem] border border-border/70 bg-card/88 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.03]">
                <h2 className="mb-6 text-xl font-semibold text-foreground">Zusammenfassung</h2>

                <div className="mb-6 rounded-[1.5rem] border border-accent/20 bg-accent/5 p-4">
                  <label className="mb-2 block text-sm font-medium text-foreground">Promo-Code</label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                      placeholder="z.B. RIMTIME10"
                      className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button onClick={handlePromoCode} className="shrink-0 rounded-xl bg-accent/10 px-4 py-2 font-medium text-accent transition-colors hover:bg-accent/20">
                      Anwenden
                    </button>
                  </div>
                  {discount > 0 && <p className="mt-2 text-sm text-green-600">{discount}% Rabatt angewendet</p>}
                </div>

                <div className="mb-6 space-y-3 border-b border-border pb-6 text-sm">
                  <div className="rounded-2xl border border-accent/15 bg-accent/5 px-4 py-3 text-sm">
                    {subtotal > 0 && amountUntilFreeShipping > 0 ? (
                      <p className="text-muted-foreground">
                        Noch <span className="font-semibold text-accent">€{(amountUntilFreeShipping / 100).toFixed(2)}</span> bis zum gratis Versand.
                      </p>
                    ) : (
                      <p className="font-medium text-accent">Gratis Versand ist für diese Bestellung aktiviert.</p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span className="text-foreground">€{(subtotal / 100).toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Rabatt ({discount}%)</span>
                      <span>-€{(discountAmount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Versand</span>
                    <span className="text-foreground">
                      {shippingCost === 0 ? "Gratis" : `€${(shippingCost / 100).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">inkl. 19% MwSt.</span>
                    <span className="text-foreground">€{(includedVat / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6 flex justify-between">
                  <span className="font-semibold text-foreground">Gesamt</span>
                  <span className="text-2xl font-bold text-accent">€{(total / 100).toFixed(2)}</span>
                </div>

                <div className="mb-6 grid gap-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 dark:bg-black/20">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Sichere Zahlung</p>
                      <p className="text-sm text-muted-foreground">PayPal, Visa, Klarna oder Vorkasse im Checkout wählbar.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 dark:bg-black/20">
                    <Truck className="mt-0.5 h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Schneller Versand</p>
                      <p className="text-sm text-muted-foreground">Gratis ab €{(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)}, Versand aus Deutschland.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 dark:bg-black/20">
                    <CreditCard className="mt-0.5 h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{RETURN_DAYS} Tage Rückgabe</p>
                      <p className="text-sm text-muted-foreground">Mehr Sicherheit für Ihre Bestellung auch nach der Lieferung.</p>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="mb-3 inline-flex w-full items-center justify-center rounded-2xl bg-accent px-6 py-3 text-center font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
                  Zur Kasse
                </Link>

                <button
                  onClick={() => {
                    clearCart();
                    toast.success("Warenkorb geleert");
                  }}
                  className="w-full rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Warenkorb leeren
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-border/70 bg-card/85 px-8 py-16 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-lg text-muted-foreground">Dein Warenkorb ist leer</p>
            <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              Zum Produktkatalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
