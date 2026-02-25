import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Clock, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  basePrice: number;
  image: string;
  size: string;
  style: string;
  upvotes: number;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, getTotalPrice, clearCart, addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerAddress: "",
  });

  const createOrderMutation = trpc.orders.create.useMutation();
  const { data: productsData } = trpc.products.getAll.useQuery();

  useEffect(() => {
    if (productsData) {
      const allProducts = productsData as Product[];
      const cartProductIds = items.map(item => item.productId);
      const recommended = allProducts
        .filter(p => !cartProductIds.includes(p.id))
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 3);
      setRecommendedProducts(recommended);
    }
  }, [productsData, items]);

  const totalPrice = getTotalPrice();
  const shippingCost = 500;
  const discountAmount = Math.round(totalPrice * (discount / 100));
  const tax = Math.round((totalPrice - discountAmount) * 0.19);
  const total = totalPrice - discountAmount + tax + shippingCost;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.customerAddress) {
      toast.error("Bitte füllen Sie alle Felder aus");
      return;
    }

    if (items.length === 0) {
      toast.error("Warenkorb ist leer");
      return;
    }

    setLoading(true);

    try {
      const result = await createOrderMutation.mutateAsync({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        totalPrice: total,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (result.success) {
        clearCart();
        navigate(`/order-confirmation/${result.orderNumber}`);
        toast.success("Bestellung erfolgreich aufgegeben!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Fehler beim Aufgeben der Bestellung");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground mb-6">Warenkorb ist leer</p>
        <Link href="/products" className="inline-flex items-center justify-center bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
          Zum Produktkatalog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity mb-4">
            <ArrowLeft className="w-5 h-5" />
            Zurück zum Warenkorb
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="card">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Persönliche Daten
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Max Mustermann"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="max@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Lieferadresse *
                    </label>
                    <textarea
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Straße 123, 12345 Stadt"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="card">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Zahlungsart
                </h2>

                <div className="p-4 bg-accent/10 border border-accent rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Vorkasse (Banküberweisung)</p>
                  <p className="text-sm text-muted-foreground">
                    Nach Aufgabe der Bestellung erhalten Sie eine Bestätigung mit den Bankdaten für die Überweisung.
                  </p>
                </div>
              </div>

              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Oft zusammen gekauft</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h3 className="font-semibold text-sm text-foreground mb-1">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{product.size} • {product.style}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-accent">€{(product.basePrice / 100).toFixed(2)}</span>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 fill-accent text-accent" />
                            <span>{product.upvotes}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            addItem({
                              productId: product.id,
                              quantity: 1,
                              price: product.basePrice,
                              name: product.name,
                              size: product.size,
                              style: product.style,
                            });
                            toast.success("Zu Warenkorb hinzugefügt!");
                          }}
                          className="w-full px-3 py-2 bg-accent/20 text-accent border border-accent rounded text-sm font-medium hover:bg-accent/30 transition-colors"
                        >
                          + Hinzufügen
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Wird verarbeitet..." : "Bestellung abschließen"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">Bestellübersicht</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-foreground">
                      €{((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

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
                    type="button"
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
                  <span className="text-foreground">€{(totalPrice / 100).toFixed(2)}</span>
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

              {/* Limited Time Offer Badge */}
              <div className="p-3 bg-accent/10 border border-accent rounded-lg flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-xs text-accent">
                  <p className="font-semibold">Limitiertes Angebot!</p>
                  <p>Nur noch 2 Tage zum Aktionspreis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
