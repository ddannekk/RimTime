import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { Trash2, ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { toast } from "sonner";

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      quantity: 1,
      price: item.price,
      name: item.name,
      size: "30cm",
      style: "Motorsport",
    });
    toast.success("Zu Warenkorb hinzugefügt!");
  };

  if (items.length === 0) {
    return (
      <div className="container py-12 text-center">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Wishlist ist leer</h1>
        <p className="text-muted-foreground mb-6">Fügen Sie Produkte hinzu, um sie später zu kaufen</p>
        <Link href="/products" className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
          Zu Produkten
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link href="/products" className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity mb-4">
          <ArrowLeft className="w-5 h-5" />
          Zurück zu Produkten
        </Link>
        <h1 className="text-4xl font-bold text-foreground">Meine Wishlist</h1>
        <p className="text-muted-foreground mt-2">{items.length} Produkte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="card overflow-hidden hover:shadow-lg transition-shadow">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
              <p className="text-2xl font-bold text-accent mb-4">€{(item.price / 100).toFixed(2)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded font-semibold hover:bg-accent/90 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  In Warenkorb
                </button>
                <button
                  onClick={() => {
                    removeFromWishlist(item.productId);
                    toast.success("Aus Wishlist entfernt");
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/checkout" className="flex-1 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors text-center">
          Zur Kasse
        </Link>
        <button
          onClick={() => {
            clearWishlist();
            toast.success("Wishlist geleert");
          }}
          className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
        >
          Wishlist leeren
        </button>
      </div>
    </div>
  );
}
