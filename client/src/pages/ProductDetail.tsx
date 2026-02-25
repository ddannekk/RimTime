import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Star, ThumbsUp, ThumbsDown, ShoppingCart, Heart, Share2, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

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
    "Beste Investition ever! Würde ich immer wieder kaufen."
  ];

  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: i + 1,
      productId,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      comment: comments[i % comments.length],
      author: authors[i % authors.length],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
  }
  return reviews;
};

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id || "0");
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const { addItem } = useCart();
  const upvoteMutation = trpc.products.upvote.useMutation();
  const downvoteMutation = trpc.products.downvote.useMutation();

  const { data: productData } = trpc.products.getById.useQuery({ id: productId });
  const { data: reviewsData } = trpc.products.getReviews.useQuery({ productId });

  useEffect(() => {
    if (productData) {
      setProduct(productData as Product);
      setLoading(false);
      // Generiere zufällige Bewertungen
      const randomReviews = generateRandomReviews(productId);
      setReviews(randomReviews);
      // Zufällige View-Anzahl
      setViewCount(Math.floor(Math.random() * 500) + 50);
    }
  }, [productData, productId]);

  useEffect(() => {
    if (reviewsData && reviewsData.length > 0) {
      setReviews(reviewsData as Review[]);
    }
  }, [reviewsData]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      quantity,
      price: product.basePrice,
      name: product.name,
      size: product.size,
      style: product.style,
    });

    toast.success(`${product.name} wurde zum Warenkorb hinzugefügt!`);
  };

  const handleUpvote = async () => {
    if (!product) return;
    try {
      await upvoteMutation.mutateAsync({ productId: product.id });
      setProduct({
        ...product,
        upvotes: userVote === 'up' ? product.upvotes - 1 : product.upvotes + 1,
        downvotes: userVote === 'down' ? product.downvotes - 1 : product.downvotes,
      });
      setUserVote(userVote === 'up' ? null : 'up');
      toast.success('Danke für deine Bewertung!');
    } catch (error) {
      toast.error('Fehler beim Abstimmen');
    }
  };

  const handleDownvote = async () => {
    if (!product) return;
    try {
      await downvoteMutation.mutateAsync({ productId: product.id });
      setProduct({
        ...product,
        downvotes: userVote === 'down' ? product.downvotes - 1 : product.downvotes + 1,
        upvotes: userVote === 'up' ? product.upvotes - 1 : product.upvotes,
      });
      setUserVote(userVote === 'down' ? null : 'down');
      toast.success('Danke für deine Bewertung!');
    } catch (error) {
      toast.error('Fehler beim Abstimmen');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Aus Favoriten entfernt' : 'Zu Favoriten hinzugefügt');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link kopiert!');
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-lg" />
            <div>
              <div className="h-8 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-8" />
              <div className="h-12 bg-muted rounded w-1/3 mb-8" />
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

  const rating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="w-full">
      <div className="container py-12">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden border border-border relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.upvotes > 100 && (
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  Bestseller
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleFavorite}
                className={`flex-1 flex items-center justify-center gap-2 py-2 border rounded transition-colors ${
                  isFavorite
                    ? 'bg-red-100 border-red-300 text-red-600'
                    : 'border-border hover:bg-muted text-foreground'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                Favorit
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded hover:bg-muted transition-colors text-foreground"
              >
                <Share2 className="w-5 h-5" />
                Teilen
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviews.length} Bewertungen)</span>
              <span className="text-sm text-muted-foreground ml-auto">👁️ {viewCount} Views</span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

            {/* Specs */}
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
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

            {/* Price */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Preis</p>
              <p className="text-4xl font-bold text-accent">
                €{(product.basePrice / 100).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">✓ Kostenloser Versand</p>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Menge
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border border-border rounded hover:bg-muted transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-3 py-2 border border-border rounded text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 border border-border rounded hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors mb-4 transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              In den Warenkorb
            </button>

            {/* Upvote/Downvote */}
            <div className="flex gap-4">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 px-4 py-2 border rounded transition-colors ${
                  userVote === 'up'
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{product.upvotes}</span>
              </button>
              <button
                onClick={handleDownvote}
                className={`flex items-center gap-2 px-4 py-2 border rounded transition-colors ${
                  userVote === 'down'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>{product.downvotes}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-border pt-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Bewertungen ({reviews.length})</h2>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{review.author}</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <= review.rating
                                ? "fill-accent text-accent"
                                : "text-muted-foreground"
                            }`}
                          />
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
    </div>
  );
}
