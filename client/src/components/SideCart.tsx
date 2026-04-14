import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { OPEN_CART_PANEL_EVENT } from "@/lib/cartEffects";

export default function SideCart() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(OPEN_CART_PANEL_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_CART_PANEL_EVENT, handleOpen);
  }, []);

  const subtotal = getTotalPrice();
  const shipping = items.length > 0 ? 500 : 0;
  const total = subtotal + shipping;
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full border-l border-white/10 bg-slate-950/95 text-white sm:max-w-md">
        <SheetHeader className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-lg text-white">Warenkorb</SheetTitle>
              <SheetDescription className="text-slate-400">
                {totalItems} Artikel bereit für den Checkout.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {items.length === 0 ? (
            <div className="flex h-full min-h-[18rem] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/6 text-slate-300">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <p className="text-lg font-semibold text-white">Dein Warenkorb ist leer</p>
              <p className="mt-2 max-w-xs text-sm text-slate-400">Füge Produkte hinzu, um hier direkt weiter zum Checkout zu gehen.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {items.map((item) => (
                <div key={item.productId} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.18)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">{item.size} • {item.style}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="rounded-full p-1 text-slate-300 transition-colors hover:bg-white/8 hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="rounded-full p-1 text-slate-300 transition-colors hover:bg-white/8 hover:text-white"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Summe</p>
                      <p className="text-lg font-bold text-orange-300">€{((item.price * item.quantity) / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Zwischensumme</span>
              <span>€{(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Versand</span>
              <span>€{(shipping / 100).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
              <span>Gesamt</span>
              <span>€{(total / 100).toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-accent px-5 py-3 text-center font-semibold text-accent-foreground shadow-[0_16px_28px_rgba(234,88,12,0.28)] transition-colors hover:bg-accent/90"
            >
              Weiter zur Kasse
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-white/6"
            >
              Vollen Warenkorb ansehen
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
