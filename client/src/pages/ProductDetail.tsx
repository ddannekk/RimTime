import { useEffect, useRef, useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, ShoppingCart, Heart, Share2, TrendingUp, ShieldCheck, Truck, TimerReset } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { triggerAddToCartVisual, triggerOpenCartPanel } from "@/lib/cartEffects";

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  size: string;
  style: string;
  personalization?: string;
  upvotes: number;
  downvotes: number;
}

interface Review {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  author: string;
  createdAt: Date;
}

const generateRandomReviews = (productId: number, count: number = 8): Review[] => {
  const authors = ["Max M.", "Sarah K.", "Thomas B.", "Lisa H.", "Michael S.", "Anna W.", "David L.", "Julia P."];
  const comments = [
    "Absolut genial! Die Uhr sieht in meiner Garage fantastisch aus.",
    "Top Qualität und super schnelle Lieferung!",
    "Meine Freunde sind begeistert von der Uhr!",
    "Perfekt für jeden Auto-Fan. Sehr empfehlenswert!",
    "Die Verarbeitung ist wirklich hochwertig.",
    "Genau wie beschrieben. Sehr zufrieden!",
    "Ein echter Hingucker in meinem Zimmer!",
    "Beste Investition ever! Würde ich immer wieder kaufen.",
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    productId,
    rating: Math.floor(Math.random() * 2) + 4,
    comment: comments[index % comments.length],
    author: authors[index % authors.length],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }));
};

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id || "0", 10);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const primaryActionRef = useRef<HTMLButtonElement | null>(null);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const upvoteMutation = trpc.products.upvote.useMutation();
  const downvoteMutation = trpc.products.downvote.useMutation();

  const { data: productData } = trpc.products.getById.useQuery({ id: productId });
  const { data: reviewsData } = trpc.products.getReviews.useQuery({ productId });

  useEffect(() => {
    if (productData) {
      setProduct(productData as Product);
      setLoading(false);
      setReviews(generateRandomReviews(productId));
      setViewCount(Math.floor(Math.random() * 500) + 50);
    }
  }, [productData, productId]);

  useEffect(() => {
    if (reviewsData && reviewsData.length > 0) {
      setReviews(reviewsData as Review[]);
    }
  }, [reviewsData]);

  useEffect(() => {
    if (!primaryActionRef.current) return;

    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), {
      threshold: 0.8,
    });

    observer.observe(primaryActionRef.current);
    return () => observer.disconnect();
  }, [product?.id]);

  const handleAddToCart = (sourceElement?: HTMLElement | null) => {
    if (!product) return;

    addItem({
      productId: product.id,
      quantity,
      price: product.basePrice,
      name: product.name,
      size: product.size,
      style: product.style,
    });

    triggerAddToCartVisual({ sourceElement, image: product.image });
    triggerOpenCartPanel();
    toast.success(`${product.name} wurde zum Warenkorb hinzugefügt!`);
  };

  const handleUpvote = async () => {
    if (!product) return;
    try {
      await upvoteMutation.mutateAsync({ productId: product.id });
      setProduct({
        ...product,
        upvotes: userVote === "up" ? product.upvotes - 1 : product.upvotes + 1,
        downvotes: userVote === "down" ? product.downvotes - 1 : product.downvotes,
      });
      setUserVote(userVote === "up" ? null : "up");
      toast.success("Danke für deine Bewertung!");
    } catch {
      toast.error("Fehler beim Abstimmen");
    }
  };

  const handleDownvote = async () => {
    if (!product) return;
    try {
      await downvoteMutation.mutateAsync({ productId: product.id });
      setProduct({
        ...product,
        downvotes: userVote === "down" ? product.downvotes - 1 : product.downvotes + 1,
        upvotes: userVote === "up" ? product.upvotes - 1 : product.upvotes,
      });
      setUserVote(userVote === "down" ? null : "down");
      toast.success("Danke für deine Bewertung!");
    } catch {
      toast.error("Fehler beim Abstimmen");
    }
  };

  const handleFavorite = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Aus Favoriten entfernt");
      return;
    }

    addToWishlist({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      image: product.image,
    });
    toast.success("Zu Favoriten hinzugefügt");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link kopiert!");
    } catch {
      toast.error("Link konnte nicht kopiert werden");
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="aspect-square rounded-lg bg-muted" />
            <div>
              <div className="mb-4 h-8 w-3/4 rounded bg-muted" />
              <div className="mb-8 h-4 w-1/2 rounded bg-muted" />
              <div className="mb-8 h-12 w-1/3 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Produkt nicht gefunden</p>
      </div>
    );
  }

  const rating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "5.0";
  const isFavorite = isInWishlist(product.id);

  return (
    <div className="w-full">
      <div className="container py-12">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div className="group relative aspect-square overflow-hidden rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),rgba(255,255,255,0)_42%),linear-gradient(145deg,rgba(255,255,255,0.18),rgba(15,23,42,0.1))] shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%),linear-gradient(145deg,rgba(255,255,255,0.06),rgba(15,23,42,0.45))]">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-x-10 bottom-5 h-10 rounded-full bg-black/20 blur-2xl dark:bg-accent/12" />
              {product.upvotes > 100 && (
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Bestseller
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleFavorite}
                className={`flex-1 rounded-xl border py-2 transition-colors ${
                  isFavorite ? "border-red-300 bg-red-100 text-red-600" : "border-border text-foreground hover:bg-muted"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  Favorit
                </span>
              </button>
              <button
                onClick={handleShare}
                className="flex-1 rounded-xl border border-border py-2 text-foreground transition-colors hover:bg-muted"
              >
                <span className="flex items-center justify-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Teilen
                </span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="mb-2 text-4xl font-bold text-foreground">{product.name}</h1>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <Star key={index} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviews.length} Bewertungen)</span>
              <span className="ml-auto text-sm text-muted-foreground">👁️ {viewCount} Views</span>
            </div>

            <p className="mb-6 text-lg text-muted-foreground">{product.description}</p>

            <div className="mb-6 rounded-[1.5rem] border border-border/70 bg-card/85 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Größe</p>
                  <p className="font-semibold text-foreground">{product.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Style</p>
                  <p className="font-semibold text-foreground">{product.style}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm text-muted-foreground">Preis</p>
              <p className="text-4xl font-bold text-accent">€{(product.basePrice / 100).toFixed(2)}</p>
              <p className="mt-2 text-sm text-muted-foreground">✓ Kostenloser Versand</p>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Sichere Zahlung", copy: "PayPal, Visa, Klarna" },
                { icon: Truck, title: "Schneller Versand", copy: "Versand aus Deutschland" },
                { icon: TimerReset, title: "Silent Movement", copy: "Kein Tick-Geräusch" },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-2xl border border-border/70 bg-card/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <Icon className="mb-3 h-5 w-5 text-accent" />
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-[1.5rem] border border-accent/20 bg-accent/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Sizing guide</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-lg font-semibold text-foreground">30 cm</p>
                  <p className="mt-1 text-sm text-muted-foreground">Für Desk-Setups, Regale oder kleinere Wandflächen mit klarer Form.</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">45 cm</p>
                  <p className="mt-1 text-sm text-muted-foreground">Für große Wände, Garage-Spaces und dominante Platzierung.</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">Menge</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded border border-border px-3 py-2 transition-colors hover:bg-muted">
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, parseInt(event.target.value, 10) || 1))}
                  className="w-16 rounded border border-border px-3 py-2 text-center"
                />
                <button onClick={() => setQuantity(quantity + 1)} className="rounded border border-border px-3 py-2 transition-colors hover:bg-muted">
                  +
                </button>
              </div>
            </div>

            <button
              ref={primaryActionRef}
              onClick={(event) => handleAddToCart(event.currentTarget)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <ShoppingCart className="h-5 w-5" />
              In den Warenkorb
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 rounded border px-4 py-2 transition-colors ${
                  userVote === "up" ? "border-accent bg-accent text-accent-foreground" : "border-border text-foreground hover:bg-muted"
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{product.upvotes}</span>
              </button>
              <button
                onClick={handleDownvote}
                className={`flex items-center gap-2 rounded border px-4 py-2 transition-colors ${
                  userVote === "down" ? "border-red-600 bg-red-600 text-white" : "border-border text-foreground hover:bg-muted"
                }`}
              >
                <ThumbsDown className="h-5 w-5" />
                <span>{product.downvotes}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-12">
          <h2 className="mb-8 text-3xl font-bold text-foreground">Bewertungen ({reviews.length})</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="card transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{review.author}</p>
                      <div className="mt-1 flex gap-1">
                        {[1, 2, 3, 4, 5].map((index) => (
                          <Star key={index} className={`h-4 w-4 ${index <= review.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">vor {Math.floor(Math.random() * 30)} Tagen</span>
                  </div>
                  <p className="text-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Noch keine Bewertungen vorhanden</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showStickyBar && product && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-4 z-40 px-4"
          >
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/88 px-5 py-4 text-white shadow-[0_24px_60px_rgba(15,23,42,0.42)] backdrop-blur-xl">
              <div className="min-w-0">
                <p className="truncate text-sm uppercase tracking-[0.22em] text-orange-300/80">{product.style}</p>
                <p className="truncate text-lg font-semibold">{product.name}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">ab</p>
                <p className="text-2xl font-bold text-orange-300">€{(product.basePrice / 100).toFixed(2)}</p>
              </div>
              <button
                onClick={(event) => handleAddToCart(event.currentTarget)}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-accent px-5 py-3 font-semibold text-accent-foreground shadow-[0_16px_28px_rgba(234,88,12,0.28)] hover:bg-accent/90"
              >
                <ShoppingCart className="h-4 w-4" />
                Jetzt kaufen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
