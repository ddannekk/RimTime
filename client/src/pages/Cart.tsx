import { Link } from "wouter";
import { Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const totalPrice = getTotalPrice();
  const shippingCost = 500; // €5.00
  const taxRate = 0.19;
  const subtotal = totalPrice;
  const discountAmount = Math.round(subtotal * (discount / 100));
  const tax = Math.round((subtotal - discountAmount) * taxRate);
  const total = subtotal - discountAmount + tax + shippingCost;

  const handlePromoCode = () => {
    if (promoCode === "SCHOOL20") {
      setDiscount(20);
    } else if (promoCode === "RIMTIME10") {
      setDiscount(10);
    } else {
      setDiscount(0);
      alert("Ungültiger Promo-Code!");
    }
  };

  return (
    <div className="w-full">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity mb-4">
            <ArrowLeft className="w-5 h-5" />
            Zurück zu Produkten
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Warenkorb</h1>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="card flex flex-col sm:flex-row gap-4">
                    {/* Item Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.size} • {item.style}
                      </p>
                      <p className="text-lg font-bold text-accent">
                        €{(item.price / 100).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-1 border border-border rounded hover:bg-muted transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-12 px-2 py-1 border border-border rounded text-center"
                        />
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 border border-border rounded hover:bg-muted transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Entfernen
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-2">Summe</p>
                      <p className="text-xl font-bold text-foreground">
                        €{((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-6">Zusammenfassung</h2>

                {/* Promo Code */}
                <div className="mb-6 pb-6 border-b border-border">
                  <label className="block text-sm font-medium text-foreground mb-2">Promo-Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="z.B. SCHOOL20"
                      className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button
                      onClick={handlePromoCode}
                      className="px-3 py-2 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors font-medium"
                    >
                      Anwenden
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-2">✓ {discount}% Rabatt angewendet!</p>
                  )}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span className="text-foreground">€{(subtotal / 100).toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Rabatt ({discount}%)</span>
                      <span>-€{(discountAmount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Versand</span>
                    <span className="text-foreground">€{(shippingCost / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Steuern (19%)</span>
                    <span className="text-foreground">€{(tax / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-semibold text-foreground">Gesamt</span>
                  <span className="text-2xl font-bold text-accent">
                    €{(total / 100).toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout" className="block w-full text-center bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors mb-3">
                  Zur Kasse
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full px-6 py-2 border border-border rounded text-foreground hover:bg-muted transition-colors text-sm"
                >
                  Warenkorb leeren
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-6">Dein Warenkorb ist leer</p>
            <Link href="/products" className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
              Zum Produktkatalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
