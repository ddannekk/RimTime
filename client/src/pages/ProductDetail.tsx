import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Eye, Star, ThumbsUp, ShoppingCart, Heart, Share2, TrendingUp, ShieldCheck, Truck, TimerReset } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { triggerAddToCartVisual, triggerOpenCartPanel } from "@/lib/cartEffects";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS } from "@/lib/storePolicies";

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
    "Würde ich sofort wieder kaufen. Wirkt im Raum deutlich stärker als erwartet.",
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    productId,
    rating: ((productId + index) % 2) + 4,
    comment: comments[index % comments.length],
    author: authors[index % authors.length],
    createdAt: new Date(Date.now() - ((((productId * 7) + (index * 5)) % 28) + 2) * 24 * 60 * 60 * 1000),
  }));
};

function getReviewAgeInDays(createdAt: Date | string) {
  const timestamp = new Date(createdAt).getTime();
  if (!Number.isFinite(timestamp)) return 1;
  return Math.max(1, Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000)));
}

export default function ProductDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const productId = parseInt(params.id || "0", 10);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<"up" | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [personalizationText, setPersonalizationText] = useState("");
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const upvoteMutation = trpc.products.upvote.useMutation();

  const { data: productData } = trpc.products.getById.useQuery({ id: productId });
  const { data: reviewsData } = trpc.products.getReviews.useQuery({ productId });
  const { data: allProductsData } = trpc.products.getAll.useQuery();

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
    setPersonalizationText("");
    setQuantity(1);
  }, [productId]);

  const handleAddToCart = (sourceElement?: HTMLElement | null) => {
    if (!product) return;
    const personalization = personalizationText.trim() || undefined;

    addItem({
      productId: product.id,
      quantity,
      price: product.basePrice + (personalization ? 990 : 0),
      name: product.name,
      size: product.size,
      style: product.style,
      image: product.image,
      personalization,
    });

    triggerAddToCartVisual({ sourceElement, image: product.image });
    triggerOpenCartPanel();
    toast.success(
      personalization
        ? `${product.name} mit Personalisierung wurde zum Warenkorb hinzugefügt!`
        : `${product.name} wurde zum Warenkorb hinzugefügt!`
    );
  };

  const handleUpvote = async () => {
    if (!product) return;
    try {
      await upvoteMutation.mutateAsync({ productId: product.id });
      setProduct({
        ...product,
        upvotes: userVote === "up" ? product.upvotes - 1 : product.upvotes + 1,
      });
      setUserVote(userVote === "up" ? null : "up");
      toast.success("Danke für Ihre Bewertung!");
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
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
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
  const personalization = personalizationText.trim();
  const personalizationFee = personalization ? 990 : 0;
  const displayPrice = product.basePrice + personalizationFee;
  const sizeVariants = ((allProductsData as Product[] | undefined) ?? [])
    .filter((candidate) => candidate.style === product.style)
    .sort((left, right) => parseInt(left.size, 10) - parseInt(right.size, 10));

  return (
    <div className="w-full">
      <div className="container py-12">
        <div className="mb-16 grid grid-cols-1 gap-10 xl:grid-cols-2 xl:gap-12">
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Sichere Zahlung", copy: "PayPal, Visa, Klarna oder Vorkasse" },
                { icon: Truck, title: "Schneller Versand", copy: `Gratis ab €${(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)}` },
                { icon: TimerReset, title: "Rückgabe", copy: `${RETURN_DAYS} Tage Rückgaberecht` },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-2xl border border-border/70 bg-card/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <Icon className="mb-3 h-5 w-5 text-accent" />
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-accent/20 bg-accent/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Personalisierung</p>
              <h2 className="mt-3 text-xl font-semibold text-foreground">Individueller Wunschtext</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Wir bieten eine kurze Personalisierung für Ihr Produkt an, zum Beispiel Initialen, Fahrername, Teamname oder Startnummer.
                Maximal 12 Zeichen, gegen Aufpreis und ohne simulierte Vorschau direkt im Produktbild.
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Wunschtext</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={personalizationText}
                    onChange={(event) => setPersonalizationText(event.target.value.toUpperCase())}
                    placeholder="z.B. M3 CSL"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {personalizationText.length}/12 Zeichen
                  </p>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-background/70 px-4 py-3 text-sm dark:bg-black/20">
                  <p className="text-muted-foreground">Aufpreis</p>
                  <p className="mt-1 text-2xl font-bold text-accent">€9.90</p>
                  <p className="mt-2 max-w-[12rem] text-xs text-muted-foreground">Nur wenn Sie einen Wunschtext eingeben.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["AMG", "MAX", "M3 CSL", "No. 77"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPersonalizationText(preset.toUpperCase())}
                    className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">{product.name}</h1>

            <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <Star key={index} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviews.length} Bewertungen)</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground sm:ml-auto">
                <Eye className="h-4 w-4" />
                {viewCount} Aufrufe
              </span>
            </div>

            <p className="mb-6 text-lg text-muted-foreground">{product.description}</p>

            <div className="mb-6 rounded-[1.5rem] border border-border/70 bg-card/85 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            {sizeVariants.length > 1 && (
              <div className="mb-6 rounded-[1.5rem] border border-border/70 bg-card/85 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Variante wählen</p>
                    <h2 className="mt-2 text-xl font-semibold text-foreground">Gleicher Style, andere Größe</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Sie wechseln nur die Präsenz im Raum, nicht das Design.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 xl:grid-cols-2">
                  {sizeVariants.map((variant) => {
                    const active = variant.id === product.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => !active && navigate(`/products/${variant.id}`)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          active
                            ? "border-accent bg-accent/10 shadow-[0_16px_36px_rgba(234,88,12,0.12)]"
                            : "border-border/70 bg-background/70 hover:border-accent/40 hover:bg-accent/5"
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="min-w-0">
                            <p className="text-lg font-semibold text-foreground">{variant.size}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {variant.size === "30cm" ? "Ideal für Schreibtisch, Regal oder kleinere Wände." : "Stärker für große Wandflächen und eine bewusste Platzierung."}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-accent">€{(variant.basePrice / 100).toFixed(2)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-[1.5rem] border border-border/70 bg-background/92 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur xl:sticky xl:top-28 dark:border-white/10 dark:bg-slate-950/88">
              <div className="mb-6">
                <p className="mb-2 text-sm text-muted-foreground">Preis</p>
                <p className="text-3xl font-bold text-accent sm:text-4xl">€{(displayPrice / 100).toFixed(2)}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {personalization
                    ? `Inklusive €${(personalizationFee / 100).toFixed(2)} Personalisierung. Gratis Versand ab €${(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)}.`
                    : `Gratis Versand ab €${(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)}.`}
                </p>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">Menge</label>
                <div className="flex flex-wrap items-center gap-3">
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
                onClick={(event) => handleAddToCart(event.currentTarget)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <ShoppingCart className="h-5 w-5" />
                In den Warenkorb
              </button>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 rounded border px-4 py-2 transition-colors ${
                    userVote === "up" ? "border-accent bg-accent text-accent-foreground" : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span>{product.upvotes}</span>
                </button>
              </div>
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
                    <span className="text-xs text-muted-foreground">vor {getReviewAgeInDays(review.createdAt)} Tagen</span>
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

    </div>
  );
}
