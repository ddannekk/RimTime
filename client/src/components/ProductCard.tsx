import { MouseEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { triggerAddToCartVisual, triggerOpenCartPanel } from "@/lib/cartEffects";
import { withBasePath } from "@/lib/paths";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description?: string | null;
    basePrice: number;
    image: string;
    size: string;
    style: string;
    upvotes: number;
  };
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    addItem({
      productId: product.id,
      quantity: 1,
      price: product.basePrice,
      name: product.name,
      size: product.size,
      style: product.style,
      image: product.image,
    });
    triggerAddToCartVisual({ sourceElement: event.currentTarget, image: product.image });
    triggerOpenCartPanel();
    toast.success(`${product.name} wurde zum Warenkorb hinzugefügt.`);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/90 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_24px_55px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/20 to-transparent opacity-70 dark:from-white/8" />
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden p-4 pb-0">
          <div className="absolute right-7 top-7 z-10 rounded-full border border-white/40 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
            {product.size}
          </div>
          <div className="relative overflow-hidden rounded-[1.35rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.6),rgba(15,23,42,0.06))] dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(15,23,42,0.45))]">
            <div className="absolute inset-x-10 bottom-3 h-8 rounded-full bg-black/15 blur-xl dark:bg-accent/10" />
            <img
              src={withBasePath(product.image)}
              alt={product.name}
              className={`${compact ? "h-52 md:h-56" : "h-60 md:h-64"} w-full object-cover transition-transform duration-500 group-hover:scale-110`}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.32),transparent_45%),linear-gradient(to_top,rgba(15,23,42,0.25),transparent_40%)] opacity-80" />
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-accent/80">{product.style}</p>
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-accent">{product.name}</h3>
            </Link>
          </div>
          <div className="inline-flex shrink-0 self-start rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent" title={`${product.upvotes} Bewertungen`}>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Star className="h-4 w-4 fill-current" />
              <span>{product.upvotes}</span>
            </span>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {product.description || "Motorsport-inspirierte Felgenuhr mit ruhigem Lauf und markanter Präsenz an der Wand."}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">ab</p>
            <p className="text-2xl font-bold text-foreground">€{(product.basePrice / 100).toFixed(2)}</p>
          </div>
          <Link href={`/products/${product.id}`} className="hidden items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-accent lg:flex">
            Details <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-accent/20 bg-accent px-4 py-3 font-semibold text-accent-foreground shadow-[0_16px_28px_rgba(234,88,12,0.22)] transition-all md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-accent/90"
        >
          <ShoppingCart className="h-4 w-4" />
          In den Warenkorb
        </button>
      </div>
    </motion.div>
  );
}
