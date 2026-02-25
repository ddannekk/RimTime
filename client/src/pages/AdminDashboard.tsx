import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Edit2,
  Trash2,
  Plus,
  LogOut,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  getFunnelStats,
  getLocalOrders,
  resetLocalAnalytics,
  type FunnelStats,
  type LocalOrderRecord,
} from "@/lib/localAnalytics";

interface AdminUser {
  username: string;
  password: string;
}

type DashboardTab = "dashboard" | "products" | "orders" | "promo";

type AdminOrder = {
  id: number | string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  totalPrice: number;
  status: string;
  createdAt: string | Date;
  source: "server" | "local";
};

function toTimestamp(value: string | Date) {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState<AdminUser>({
    username: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    discountPercent: 0,
  });
  const [localOrders, setLocalOrders] = useState<LocalOrderRecord[]>([]);
  const [funnelStats, setFunnelStats] = useState<FunnelStats>({
    started: 0,
    success: 0,
    abandon: 0,
    promoApplied: 0,
    conversionRate: 0,
  });

  const productsQuery = trpc.products.getAll.useQuery(undefined, {
    enabled: isLoggedIn,
  });
  const ordersQuery = trpc.orders.getAll.useQuery(undefined, {
    enabled: isLoggedIn,
    retry: false,
  });

  const refreshLocalAnalytics = () => {
    setLocalOrders(getLocalOrders());
    setFunnelStats(getFunnelStats());
  };

  useEffect(() => {
    if (productsQuery.data) {
      setProducts(productsQuery.data as any[]);
    }
  }, [productsQuery.data]);

  useEffect(() => {
    if (!isLoggedIn) return;
    refreshLocalAnalytics();
  }, [isLoggedIn]);

  const serverOrders = useMemo<AdminOrder[]>(
    () =>
      ((ordersQuery.data as any[]) ?? []).map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerAddress: order.customerAddress,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        source: "server" as const,
      })),
    [ordersQuery.data]
  );

  const localOrdersMapped = useMemo<AdminOrder[]>(
    () =>
      localOrders.map(order => ({
        id: `local-${order.orderNumber}`,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerAddress: order.customerAddress,
        totalPrice: order.totalPrice,
        status: "local",
        createdAt: order.createdAt,
        source: "local" as const,
      })),
    [localOrders]
  );

  const mergedOrders = useMemo<AdminOrder[]>(() => {
    const byOrderNumber = new Map<string, AdminOrder>();

    for (const order of localOrdersMapped) {
      byOrderNumber.set(order.orderNumber, order);
    }
    for (const order of serverOrders) {
      // Server data has priority over local fallback records.
      byOrderNumber.set(order.orderNumber, order);
    }

    return Array.from(byOrderNumber.values()).sort(
      (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
    );
  }, [localOrdersMapped, serverOrders]);

  const salesByDay = useMemo(() => {
    const grouped = new Map<string, { date: string; orders: number; revenue: number }>();

    for (const order of mergedOrders) {
      const date = new Date(order.createdAt).toLocaleDateString("de-DE");
      const current = grouped.get(date) ?? { date, orders: 0, revenue: 0 };
      current.orders += 1;
      current.revenue += order.totalPrice / 100;
      grouped.set(date, current);
    }

    return Array.from(grouped.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [mergedOrders]);

  const dashboardData = useMemo(
    () => ({
      totalOrders: mergedOrders.length,
      totalRevenue: mergedOrders.reduce((sum, order) => sum + order.totalPrice, 0),
      totalProducts: products.length,
      salesByDay,
    }),
    [mergedOrders, products.length, salesByDay]
  );

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (credentials.username === "admin" && credentials.password === "admin") {
      setIsLoggedIn(true);
      toast.success("Admin-Login erfolgreich!");
      return;
    }
    toast.error("Ungültige Anmeldedaten");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCredentials({ username: "", password: "" });
    setSelectedOrder(null);
    toast.success("Abgemeldet");
  };

  const handleResetLocalAnalytics = () => {
    resetLocalAnalytics();
    refreshLocalAnalytics();
    toast.success("Lokale Analytics wurden zurückgesetzt");
  };

  const ordersLoading = ordersQuery.isLoading || ordersQuery.isFetching;
  const hasOrdersError = Boolean(ordersQuery.error);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Admin Panel</h1>
            <p className="text-muted-foreground text-center mb-8">RIMtime Shop Management</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Benutzername</label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={event =>
                    setCredentials({ ...credentials, username: event.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Passwort</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={event =>
                    setCredentials({ ...credentials, password: event.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="admin"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent text-accent-foreground px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                Anmelden
              </button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Demo-Anmeldedaten:</strong>
                <br />
                Benutzername: admin
                <br />
                Passwort: admin
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-foreground">RIMtime Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Abmelden
          </button>
        </div>
      </header>

      <div className="container py-8">
        {hasOrdersError && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-yellow-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              Server orders unavailable, showing local data where possible.
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8 border-b border-border">
          {(["dashboard", "products", "orders", "promo"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "dashboard" && "Dashboard"}
              {tab === "products" && "Produkte"}
              {tab === "orders" && "Bestellungen"}
              {tab === "promo" && "Promo-Codes"}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <button
                onClick={handleResetLocalAnalytics}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset local analytics
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-muted-foreground mb-2">Gesamtbestellungen</p>
                <p className="text-4xl font-bold text-accent">{dashboardData.totalOrders}</p>
              </div>
              <div className="card">
                <p className="text-muted-foreground mb-2">Gesamtumsatz</p>
                <p className="text-4xl font-bold text-accent">
                  €{(dashboardData.totalRevenue / 100).toFixed(2)}
                </p>
              </div>
              <div className="card">
                <p className="text-muted-foreground mb-2">Produkte</p>
                <p className="text-4xl font-bold text-accent">{dashboardData.totalProducts}</p>
              </div>
              <div className="card">
                <p className="text-muted-foreground mb-2">Checkout Conversion</p>
                <p className="text-4xl font-bold text-accent">{funnelStats.conversionRate}%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Start: {funnelStats.started} • Success: {funnelStats.success} • Abandon:{" "}
                  {funnelStats.abandon}
                </p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-foreground mb-6">Verkäufe nach Tag</h2>
              {dashboardData.salesByDay.length === 0 ? (
                <p className="text-muted-foreground">Noch keine Bestellungen vorhanden.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#FF4500" name="Bestellungen" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-foreground mb-6">Umsatz nach Tag</h2>
              {dashboardData.salesByDay.length === 0 ? (
                <p className="text-muted-foreground">Noch keine Umsätze vorhanden.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#FF4500" name="Umsatz (€)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Produktverwaltung</h2>
              <button
                onClick={() => navigate("/admin-dashboard/product/new")}
                className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent/90"
              >
                <Plus className="w-5 h-5" />
                Neues Produkt
              </button>
            </div>

            {productsQuery.isLoading ? (
              <div className="card">
                <p className="text-muted-foreground">Produkte werden geladen...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="card">
                <p className="text-muted-foreground">Keine Produkte gefunden.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="card">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                    <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.size} • {product.style}
                    </p>
                    <p className="text-lg font-bold text-accent mb-4">
                      €{(product.basePrice / 100).toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin-dashboard/product/${product.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Produkt wirklich löschen?")) {
                            setProducts(products.filter((p: any) => p.id !== product.id));
                            toast.success("Produkt gelöscht (Demo)");
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Bestellungen</h2>

            {ordersLoading && mergedOrders.length === 0 ? (
              <div className="card">
                <p className="text-muted-foreground">Bestellungen werden geladen...</p>
              </div>
            ) : mergedOrders.length === 0 ? (
              <div className="card">
                <p className="text-muted-foreground">Keine Bestellungen vorhanden.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Bestellnummer</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Kunde</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Betrag</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Datum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergedOrders.map(order => (
                      <tr
                        key={order.id}
                        className="border-b border-border hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="py-3 px-4 text-foreground font-mono">{order.orderNumber}</td>
                        <td className="py-3 px-4 text-foreground">{order.customerName}</td>
                        <td className="py-3 px-4 text-foreground font-bold text-accent">
                          €{(order.totalPrice / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "local"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("de-DE")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "promo" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Promo-Codes</h2>

            <div className="card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Neuer Promo-Code</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Code</label>
                  <input
                    type="text"
                    value={newPromoCode.code}
                    onChange={event =>
                      setNewPromoCode({
                        ...newPromoCode,
                        code: event.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="SCHOOL20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rabatt (%)</label>
                  <input
                    type="number"
                    value={newPromoCode.discountPercent}
                    onChange={event =>
                      setNewPromoCode({
                        ...newPromoCode,
                        discountPercent: parseInt(event.target.value || "0", 10),
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="20"
                  />
                </div>
                <button
                  onClick={() => toast.success("Promo-Code erstellt (Demo)")}
                  className="w-full bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  Promo-Code erstellen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Bestelldetails</h2>
            <div className="space-y-3 text-sm">
              <div className="pb-3 border-b border-border">
                <p className="text-muted-foreground">Bestellnummer</p>
                <p className="font-mono font-semibold text-accent">{selectedOrder.orderNumber}</p>
              </div>

              <div className="pb-3 border-b border-border">
                <p className="text-muted-foreground">Kunde</p>
                <p className="font-semibold text-foreground">{selectedOrder.customerName}</p>
                {selectedOrder.customerEmail && (
                  <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                )}
              </div>

              {selectedOrder.customerAddress && (
                <div className="pb-3 border-b border-border">
                  <p className="text-muted-foreground">Lieferadresse</p>
                  <p className="text-foreground">{selectedOrder.customerAddress}</p>
                </div>
              )}

              <div className="pb-3 border-b border-border">
                <p className="text-muted-foreground">Betrag</p>
                <p className="text-lg font-bold text-accent">
                  €{(selectedOrder.totalPrice / 100).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Datum</p>
                <p className="font-semibold text-foreground">
                  {new Date(selectedOrder.createdAt).toLocaleDateString("de-DE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
