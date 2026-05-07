import { MouseEvent } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { ArrowLeft, Heart, ShoppingCart, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { triggerAddToCartVisual, triggerOpenCartPanel } from "@/lib/cartEffects";
import { withBasePath } from "@/lib/paths";

interface WishlistItem {
  productId: number;
  name: string;
  price: number;
  image: string;
}

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>, item: WishlistItem) => {
    addItem({
      productId: item.productId,
      quantity: 1,
      price: item.price,
      name: item.name,
      size: "30cm",
      style: "Motorsport",
      image: item.image,
    });
    triggerAddToCartVisual({ sourceElement: event.currentTarget, image: item.image });
    triggerOpenCartPanel();
    toast.success("Zum Warenkorb hinzugefügt!");
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-border/70 bg-card/85 px-8 py-14 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-accent/12 text-accent">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Merkliste ist leer</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Markieren Sie Produkte, die Sie später vergleichen oder in einem zweiten Schritt kaufen möchten. Sie bleiben hier gesammelt, bis Sie bereit sind.</p>
          <Link href="/products" className="mt-8 inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
            Zu Produkten
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8 rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.38))] p-8 shadow-sm dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.74),rgba(15,23,42,0.32))]">
        <Link href="/products" className="mb-4 flex items-center gap-2 text-accent transition-opacity hover:opacity-80">
          <ArrowLeft className="h-5 w-5" />
          Zurück zu Produkten
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent">Gespeicherte Favoriten</p>
            <h1 className="text-4xl font-bold text-foreground">Meine Merkliste</h1>
            <p className="mt-2 text-muted-foreground">{items.length} Produkt{items.length !== 1 ? "e" : ""} gespeichert für später.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-background/70 px-4 py-2 text-sm font-semibold text-accent shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Bereit für den nächsten Kaufmoment
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.productId} className="group overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/88 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_24px_55px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="relative overflow-hidden p-4 pb-0">
              <div className="absolute right-7 top-7 z-10 rounded-full border border-white/40 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                Gespeichert
              </div>
              <div className="relative overflow-hidden rounded-[1.35rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.6),rgba(15,23,42,0.06))] dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(15,23,42,0.45))]">
                <div className="absolute inset-x-10 bottom-3 h-8 rounded-full bg-black/15 blur-xl dark:bg-accent/10" />
                <img src={withBasePath(item.image)} alt={item.name} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.32),transparent_45%),linear-gradient(to_top,rgba(15,23,42,0.25),transparent_40%)] opacity-80" />
              </div>
            </div>

            <div className="space-y-4 p-5 pt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-accent/80">Merkliste</p>
                  <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                </div>
                <div className="rounded-full bg-accent/10 px-2.5 py-1 text-sm font-semibold text-accent">€{(item.price / 100).toFixed(2)}</div>
              </div>

              <p className="text-sm leading-6 text-muted-foreground">Behalten Sie dieses Modell griffbereit und legen Sie es mit einem Klick zurück in den Kaufprozess.</p>

              <div className="flex gap-2">
                <button
                  onClick={(event) => handleAddToCart(event, item)}
                  className="flex-1 rounded-2xl bg-accent px-4 py-3 font-semibold text-accent-foreground shadow-[0_16px_28px_rgba(234,88,12,0.22)] transition-colors hover:bg-accent/90"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    In Warenkorb
                  </span>
                </button>
                <button
                  onClick={() => {
                    removeFromWishlist(item.productId);
                    toast.success("Aus der Merkliste entfernt");
                  }}
                  className="rounded-2xl border border-red-200/80 px-4 py-3 text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-card/88 p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">Bereit für die Kasse?</p>
          <p className="mt-1 text-sm text-muted-foreground">Überführen Sie Ihre gespeicherten Favoriten direkt in den Kaufprozess oder bereinigen Sie die Liste.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/checkout" className="inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-3 text-center font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
            Zur Kasse
          </Link>
          <button
            onClick={() => {
              clearWishlist();
              toast.success("Merkliste geleert");
            }}
            className="rounded-2xl border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Merkliste leeren
          </button>
        </div>
      </div>
    </div>
  );
}
