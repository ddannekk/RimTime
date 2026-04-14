import { Link } from "wouter";
import { Trash2, ArrowLeft, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const totalPrice = getTotalPrice();
  const shippingCost = items.length > 0 ? 500 : 0;
  const taxRate = 0.19;
  const subtotal = totalPrice;
  const discountAmount = Math.round(subtotal * (discount / 100));
  const tax = Math.round((subtotal - discountAmount) * taxRate);
  const total = subtotal - discountAmount + tax + shippingCost;

  const handlePromoCode = () => {
    if (promoCode === "SCHOOL20") {
      setDiscount(20);
      toast.success("20% Rabatt angewendet.");
    } else if (promoCode === "RIMTIME10") {
      setDiscount(10);
      toast.success("10% Rabatt angewendet.");
    } else {
      setDiscount(0);
      toast.error("Ungültiger Promo-Code");
    }
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
          <p className="mt-2 text-muted-foreground">Prüfe deine Auswahl und gehe ohne Umwege zur Kasse.</p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div key={item.productId} className="rounded-[1.75rem] border border-border/70 bg-card/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-accent/80">Cart Item</p>
                      <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.size} • {item.style}</p>
                      <p className="mt-4 text-2xl font-bold text-accent">€{(item.price / 100).toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-2 py-1 dark:bg-black/20">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="rounded-full px-2 py-1 transition-colors hover:bg-muted"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) => updateQuantity(item.productId, Math.max(1, parseInt(event.target.value, 10) || 1))}
                          className="w-12 bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="rounded-full px-2 py-1 transition-colors hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                      placeholder="z.B. RIMTIME10"
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button onClick={handlePromoCode} className="rounded-xl bg-accent/10 px-3 py-2 font-medium text-accent transition-colors hover:bg-accent/20">
                      Anwenden
                    </button>
                  </div>
                  {discount > 0 && <p className="mt-2 text-sm text-green-600">✓ {discount}% Rabatt angewendet</p>}
                </div>

                <div className="mb-6 space-y-3 border-b border-border pb-6 text-sm">
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
                    <span className="text-foreground">€{(shippingCost / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Steuern (19%)</span>
                    <span className="text-foreground">€{(tax / 100).toFixed(2)}</span>
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
                      <p className="text-sm text-muted-foreground">Visa, PayPal und moderne Checkout-Flows.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 dark:bg-black/20">
                    <Truck className="mt-0.5 h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Schneller Versand</p>
                      <p className="text-sm text-muted-foreground">Direkt aus Deutschland mit transparenter Lieferung.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 dark:bg-black/20">
                    <CreditCard className="mt-0.5 h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Checkout ohne Umwege</p>
                      <p className="text-sm text-muted-foreground">Du bist nur einen Schritt vom Kaufabschluss entfernt.</p>
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
