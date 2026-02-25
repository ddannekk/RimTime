import { useState } from "react";
import { X, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  basePrice: number;
  image: string;
  size: string;
  style: string;
  upvotes: number;
  description: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      quantity,
      price: product.basePrice,
      name: product.name,
      size: product.size,
      style: product.style,
    });
    toast.success("Zu Warenkorb hinzugefügt!");
    onClose();
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      image: product.image,
    });
    toast.success("Zu Wishlist hinzugefügt!");
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-foreground">Schnellansicht</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div>
              <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.size} • {product.style}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-accent">€{(product.basePrice / 100).toFixed(2)}</span>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-foreground font-semibold">{product.upvotes} Bewertungen</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Menge</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 border border-border rounded hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-foreground w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border border-border rounded hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  In Warenkorb
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    inWishlist
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
