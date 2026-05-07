import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { withBasePath } from "@/lib/paths";
import { saveLocalOrder, trackFunnelEvent } from "@/lib/localAnalytics";
import { toast } from "sonner";
import { ArrowLeft, Clock, Star } from "lucide-react";
import {
  FREE_SHIPPING_THRESHOLD,
  getIncludedVat,
  getRemainingForFreeShipping,
  getShippingCost,
} from "@/lib/storePolicies";

interface Product {
  id: number;
  name: string;
  basePrice: number;
  image: string;
  size: string;
  style: string;
  upvotes: number;
}

type PaymentMethod = "paypal" | "visa" | "klarna" | "vorkasse";

const PAYMENT_METHODS: Array<{
  id: PaymentMethod;
  title: string;
  copy: string;
  badge: string;
}> = [
  { id: "paypal", title: "PayPal", copy: "Schnelle Zahlung mit Ihrem PayPal-Konto.", badge: "Sofort" },
  { id: "visa", title: "Visa / Kreditkarte", copy: "Klassische Kartenzahlung direkt an der Kasse.", badge: "Karte" },
  { id: "klarna", title: "Klarna", copy: "Später bezahlen oder flexibel aufteilen, wenn verfügbar.", badge: "Flexibel" },
  { id: "vorkasse", title: "Vorkasse", copy: "Banküberweisung nach Bestellbestätigung.", badge: "Überweisung" },
];

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, getTotalPrice, clearCart, addItem } = useCart();
  const utils = trpc.useUtils();
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerAddress: "",
  });
  const checkoutStartedRef = useRef(false);
  const orderCompletedRef = useRef(false);
  const latestItemsCountRef = useRef(0);

  const createOrderMutation = trpc.orders.create.useMutation();
  const { data: productsData } = trpc.products.getAll.useQuery();

  useEffect(() => {
    latestItemsCountRef.current = items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  useEffect(() => {
    if (items.length > 0 && !checkoutStartedRef.current) {
      trackFunnelEvent({
        type: "checkout_start",
        payload: {
          itemsCount: latestItemsCountRef.current,
          cartValue: getTotalPrice(),
        },
      });
      checkoutStartedRef.current = true;
    }
  }, [items.length, getTotalPrice]);

  useEffect(() => {
    return () => {
      if (checkoutStartedRef.current && !orderCompletedRef.current) {
        trackFunnelEvent({
          type: "checkout_abandon",
          payload: {
            itemsCount: latestItemsCountRef.current,
          },
        });
      }
    };
  }, []);

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
  const shippingCost = getShippingCost(totalPrice);
  const amountUntilFreeShipping = getRemainingForFreeShipping(totalPrice);
  const discountAmount = Math.round(totalPrice * (discount / 100));
  const total = totalPrice - discountAmount + shippingCost;
  const includedVat = getIncludedVat(total);

  const handlePromoCode = () => {
    const applyPromo = async () => {
      const normalizedCode = promoCode.trim().toUpperCase();
      if (!normalizedCode) {
        setDiscount(0);
        toast.error("Bitte Promo-Code eingeben");
        return;
      }

      const result = await utils.promoCodes.validate.fetch({ code: normalizedCode });
      if (!result.valid) {
        setDiscount(0);
        toast.error("Ungültiger Promo-Code");
        return;
      }

      setDiscount(result.discount);
      trackFunnelEvent({
        type: "promo_applied",
        payload: {
          code: normalizedCode,
          discountPercent: result.discount,
        },
      });
      toast.success(`${result.discount}% Rabatt angewendet.`);
    };

    applyPromo().catch(() => {
      setDiscount(0);
      toast.error("Ungültiger Promo-Code");
    });
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
        paymentMethod,
        promoCode: discount > 0 ? promoCode.trim().toUpperCase() : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          personalization: item.personalization,
        })),
      });

      if (result.success) {
        const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
        saveLocalOrder({
          orderNumber: result.orderNumber,
          totalPrice: total,
          createdAt: new Date().toISOString(),
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerAddress: formData.customerAddress,
          itemsCount,
          promoCode: discount > 0 ? promoCode : undefined,
          discountPercent: discount > 0 ? discount : undefined,
          source: "checkout",
        });
        trackFunnelEvent({
          type: "order_success",
          payload: {
            orderNumber: result.orderNumber,
            totalPrice: total,
            itemsCount,
          },
        });
        orderCompletedRef.current = true;
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
          <h1 className="text-4xl font-bold text-foreground">Kasse</h1>
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
                      placeholder="max@rimtime-shop.de"
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

                <div className="grid gap-3 md:grid-cols-2">
                  {PAYMENT_METHODS.map((method) => {
                    const active = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          active
                            ? "border-accent bg-accent/10 shadow-[0_16px_32px_rgba(234,88,12,0.12)]"
                            : "border-border bg-background hover:border-accent/40 hover:bg-accent/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">{method.title}</p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{method.copy}</p>
                          </div>
                          <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                            {method.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
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
                          src={withBasePath(product.image)}
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
                              image: product.image,
                            });
                            toast.success("Zum Warenkorb hinzugefügt!");
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
              <p className="text-sm text-muted-foreground">
                Mit Klick auf
                {" "}
                „zahlungspflichtig bestellen“
                {" "}
                geben Sie eine verbindliche Bestellung ab. Es gelten unsere
                {" "}
                <Link href="/terms" className="text-accent hover:underline">
                  AGB
                </Link>
                {" "}
                und
                {" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  Datenschutzhinweise
                </Link>
                .
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Wird verarbeitet..." : "Zahlungspflichtig bestellen"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">Bestellübersicht</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {items.map((item) => (
                  <div key={item.cartKey} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                      <span className="block text-xs text-accent/80">{item.size} • {item.style}</span>
                      {item.personalization && (
                        <span className="block text-xs text-accent">Personalisierung: {item.personalization}</span>
                      )}
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
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="z.B. SCHOOL20"
                    className="min-w-0 flex-1 px-3 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={handlePromoCode}
                    className="shrink-0 px-4 py-2 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors font-medium"
                  >
                    Anwenden
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 mt-2">{discount}% Rabatt angewendet</p>
                )}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="rounded-2xl border border-accent/15 bg-accent/5 px-4 py-3 text-sm">
                  {amountUntilFreeShipping > 0 ? (
                    <p className="text-muted-foreground">
                      Noch <span className="font-semibold text-accent">€{(amountUntilFreeShipping / 100).toFixed(2)}</span> bis zum gratis Versand.
                    </p>
                  ) : (
                    <p className="font-medium text-accent">Gratis Versand ab €{(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)} ist aktiviert.</p>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zahlungsart</span>
                  <span className="text-foreground">{PAYMENT_METHODS.find((method) => method.id === paymentMethod)?.title}</span>
                </div>
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
                  <span className="text-foreground">
                    {shippingCost === 0 ? "Gratis" : `€${(shippingCost / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">inkl. 19% MwSt.</span>
                  <span className="text-foreground">€{(includedVat / 100).toFixed(2)}</span>
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
                  <p className="font-semibold">Versandvorteil aktiv</p>
                  <p>Ab €{(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)} versenden wir kostenlos innerhalb Deutschlands.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
