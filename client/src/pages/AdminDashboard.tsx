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
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation, useSearch } from "wouter";
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

const ADMIN_SESSION_KEY = "rimtime_admin_demo_logged_in";
const ADMIN_TAB_KEY = "rimtime_admin_active_tab";

function getTabFromSearch(search: string): DashboardTab | null {
  const value = new URLSearchParams(search).get("tab");
  if (value === "dashboard" || value === "products" || value === "orders" || value === "promo") {
    return value;
  }
  return null;
}

type AdminOrder = {
  id: number | string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  totalPrice: number;
  status: string;
  paymentMethod?: "paypal" | "visa" | "klarna" | "vorkasse";
  paymentStatus?: "pending" | "paid" | "unpaid";
  createdAt: string | Date;
  source: "server" | "local";
};

type EditableOrderForm = {
  customerName: string;
  customerAddress: string;
  paymentMethod: "paypal" | "visa" | "klarna" | "vorkasse";
  paymentStatus: "pending" | "paid" | "unpaid";
  status: "pending" | "confirmed" | "shipped" | "delivered";
};

type PromoForm = {
  code: string;
  discountPercent: number;
  description: string;
  isActive: boolean;
  currentUses: number;
  maxUses: string;
  expiresAt: string;
};

type PromoFilter = "all" | "active" | "inactive" | "expired" | "limit_reached";

function toTimestamp(value: string | Date) {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  });
  const [credentials, setCredentials] = useState<AdminUser>({
    username: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    if (typeof window === "undefined") return "dashboard";
    return getTabFromSearch(window.location.search) ?? (window.sessionStorage.getItem(ADMIN_TAB_KEY) as DashboardTab | null) ?? "dashboard";
  });
  const [products, setProducts] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [editableOrder, setEditableOrder] = useState<EditableOrderForm | null>(null);
  const [newPromoCode, setNewPromoCode] = useState<PromoForm>({
    code: "",
    discountPercent: 0,
    description: "",
    isActive: true,
    currentUses: 0,
    maxUses: "",
    expiresAt: "",
  });
  const [editingPromoId, setEditingPromoId] = useState<number | null>(null);
  const [promoFilter, setPromoFilter] = useState<PromoFilter>("all");
  const [localOrders, setLocalOrders] = useState<LocalOrderRecord[]>([]);
  const [funnelStats, setFunnelStats] = useState<FunnelStats>({
    started: 0,
    success: 0,
    abandon: 0,
    promoApplied: 0,
    conversionRate: 0,
  });
  const utils = trpc.useUtils();

  const productsQuery = trpc.products.getAll.useQuery(undefined, {
    enabled: isLoggedIn,
  });
  const ordersQuery = trpc.orders.getAll.useQuery(undefined, {
    enabled: isLoggedIn,
    retry: false,
  });
  const promoCodesQuery = trpc.promoCodes.getAll.useQuery(undefined, {
    enabled: isLoggedIn,
  });
  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: async () => {
      await utils.products.getAll.invalidate();
      toast.success("Produkt gelöscht");
    },
    onError: () => {
      toast.error("Produkt konnte nicht gelöscht werden");
    },
  });
  const updateOrderMutation = trpc.orders.update.useMutation({
    onSuccess: async () => {
      await utils.orders.getAll.invalidate();
      toast.success("Bestellung aktualisiert");
    },
    onError: () => {
      toast.error("Bestellung konnte nicht aktualisiert werden");
    },
  });
  const createPromoMutation = trpc.promoCodes.create.useMutation({
    onSuccess: async () => {
      await utils.promoCodes.getAll.invalidate();
      toast.success("Promo-Code erstellt");
      setNewPromoCode({
        code: "",
        discountPercent: 0,
        description: "",
        isActive: true,
        currentUses: 0,
        maxUses: "",
        expiresAt: "",
      });
    },
    onError: () => {
      toast.error("Promo-Code konnte nicht erstellt werden");
    },
  });
  const updatePromoMutation = trpc.promoCodes.update.useMutation({
    onSuccess: async () => {
      await utils.promoCodes.getAll.invalidate();
      toast.success("Promo-Code aktualisiert");
      setEditingPromoId(null);
      setNewPromoCode({
        code: "",
        discountPercent: 0,
        description: "",
        isActive: true,
        currentUses: 0,
        maxUses: "",
        expiresAt: "",
      });
    },
    onError: () => {
      toast.error("Promo-Code konnte nicht aktualisiert werden");
    },
  });
  const deletePromoMutation = trpc.promoCodes.delete.useMutation({
    onSuccess: async () => {
      await utils.promoCodes.getAll.invalidate();
      toast.success("Promo-Code gelöscht");
    },
    onError: () => {
      toast.error("Promo-Code konnte nicht gelöscht werden");
    },
  });

  const refreshLocalAnalytics = () => {
    setLocalOrders(getLocalOrders());
    setFunnelStats(getFunnelStats());
  };

  const setActiveTabAndUrl = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(ADMIN_TAB_KEY, tab);
    }
    navigate(`/admin-dashboard?tab=${tab}`);
  };

  useEffect(() => {
    const nextTab = getTabFromSearch(search);
    if (nextTab && nextTab !== activeTab) {
      setActiveTab(nextTab);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(ADMIN_TAB_KEY, nextTab);
      }
    }
  }, [activeTab, search]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoggedIn) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    } else {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [isLoggedIn]);

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
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
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
        paymentMethod: "vorkasse",
        paymentStatus: "pending",
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
      setActiveTabAndUrl(activeTab);
      toast.success("Admin-Login erfolgreich!");
      return;
    }
    toast.error("Ungültige Anmeldedaten");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCredentials({ username: "", password: "" });
    setSelectedOrder(null);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
    toast.success("Abgemeldet");
  };

  const handleResetLocalAnalytics = () => {
    resetLocalAnalytics();
    refreshLocalAnalytics();
    toast.success("Lokale Analytics wurden zurückgesetzt");
  };

  const handleSelectOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setEditableOrder({
      customerName: order.customerName,
      customerAddress: order.customerAddress ?? "",
      paymentMethod: order.paymentMethod ?? "vorkasse",
      paymentStatus: order.paymentStatus ?? "pending",
      status: (order.status === "confirmed" || order.status === "shipped" || order.status === "delivered"
        ? order.status
        : "pending"),
    });
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder || !editableOrder || selectedOrder.source !== "server" || typeof selectedOrder.id !== "number") {
      return;
    }

    await updateOrderMutation.mutateAsync({
      id: selectedOrder.id,
      customerName: editableOrder.customerName,
      customerAddress: editableOrder.customerAddress,
      paymentMethod: editableOrder.paymentMethod,
      paymentStatus: editableOrder.paymentStatus,
      status: editableOrder.status,
    });

    setSelectedOrder({
      ...selectedOrder,
      customerName: editableOrder.customerName,
      customerAddress: editableOrder.customerAddress,
      paymentMethod: editableOrder.paymentMethod,
      paymentStatus: editableOrder.paymentStatus,
      status: editableOrder.status,
    });
  };

  const handlePromoSubmit = async () => {
    if (!newPromoCode.code.trim() || newPromoCode.discountPercent <= 0) {
      toast.error("Code und Rabatt sind Pflichtfelder");
      return;
    }

    const payload = {
      code: newPromoCode.code.trim().toUpperCase(),
      discountPercent: newPromoCode.discountPercent,
      description: newPromoCode.description.trim() || undefined,
      isActive: newPromoCode.isActive,
      currentUses: newPromoCode.currentUses,
      maxUses: newPromoCode.maxUses.trim() ? parseInt(newPromoCode.maxUses, 10) : null,
      expiresAt: newPromoCode.expiresAt || null,
    };

    if (editingPromoId) {
      await updatePromoMutation.mutateAsync({ id: editingPromoId, ...payload });
      return;
    }

    await createPromoMutation.mutateAsync(payload);
  };

  const resetPromoForm = () => {
    setEditingPromoId(null);
    setNewPromoCode({
      code: "",
      discountPercent: 0,
      description: "",
      isActive: true,
      currentUses: 0,
      maxUses: "",
      expiresAt: "",
    });
  };

  const startEditingPromo = (promo: any) => {
    setEditingPromoId(promo.id);
    setNewPromoCode({
      code: promo.code,
      discountPercent: promo.discountPercent,
      description: promo.description ?? "",
      isActive: promo.isActive === 1,
      currentUses: promo.currentUses ?? 0,
      maxUses: promo.maxUses ? String(promo.maxUses) : "",
      expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().slice(0, 10) : "",
    });
  };

  const ordersLoading = ordersQuery.isLoading || ordersQuery.isFetching;
  const hasOrdersError = Boolean(ordersQuery.error);
  const promoCodes = ((promoCodesQuery.data as any[]) ?? []).slice().sort((a, b) => a.code.localeCompare(b.code));
  const getPromoState = (promo: any): Exclude<PromoFilter, "all"> => {
    const expired = promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now();
    const limitReached = promo.maxUses !== null && promo.maxUses !== undefined && promo.currentUses >= promo.maxUses;
    if (expired) return "expired";
    if (limitReached) return "limit_reached";
    if (promo.isActive !== 1) return "inactive";
    return "active";
  };
  const filteredPromoCodes = promoCodes.filter((promo) => {
    if (promoFilter === "all") return true;
    return getPromoState(promo) === promoFilter;
  });
  const promoOverview = {
    total: promoCodes.length,
    active: promoCodes.filter((promo) => promo.isActive === 1).length,
    totalUses: promoCodes.reduce((sum, promo) => sum + (promo.currentUses ?? 0), 0),
  };

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
                <strong>Testzugang für die Präsentation:</strong>
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
              onClick={() => setActiveTabAndUrl(tab)}
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
                Lokale Analytik zurücksetzen
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
                <p className="text-muted-foreground mb-2">Checkout-Konversion</p>
                <p className="text-4xl font-bold text-accent">{funnelStats.conversionRate}%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Start: {funnelStats.started} • Erfolgreich: {funnelStats.success} • Abgebrochen:{" "}
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
                onClick={() => navigate("/admin-dashboard/product/new?tab=products")}
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
                        onClick={() => navigate(`/admin-dashboard/product/${product.id}?tab=products`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Produkt wirklich löschen?")) {
                            deleteProductMutation.mutate(product.id);
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
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Bestellstatus</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Zahlung</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Datum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergedOrders.map(order => (
                      <tr
                        key={order.id}
                        className="border-b border-border hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => handleSelectOrder(order)}
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
                                : order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "confirmed"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.source === "local" ? "local" : order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.source === "local"
                                ? "bg-gray-100 text-gray-700"
                                : order.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : order.paymentStatus === "unpaid"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.source === "local" ? "local" : order.paymentStatus ?? "pending"}
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="card">
                <p className="text-sm text-muted-foreground">Alle Codes</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{promoOverview.total}</p>
              </div>
              <div className="card">
                <p className="text-sm text-muted-foreground">Aktiv</p>
                <p className="mt-2 text-3xl font-bold text-accent">{promoOverview.active}</p>
              </div>
              <div className="card">
                <p className="text-sm text-muted-foreground">Gesamte Nutzungen</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{promoOverview.totalUses}</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {editingPromoId ? "Promo-Code bearbeiten" : "Neuer Promo-Code"}
              </h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
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
                      placeholder="RIMTIME10"
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
                      placeholder="10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Beschreibung</label>
                  <input
                    type="text"
                    value={newPromoCode.description}
                    onChange={event =>
                      setNewPromoCode({
                        ...newPromoCode,
                        description: event.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="VIP-Aktion oder Launch-Rabatt"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bereits genutzt</label>
                    <input
                      type="number"
                      value={newPromoCode.currentUses}
                      onChange={event =>
                        setNewPromoCode({
                          ...newPromoCode,
                          currentUses: parseInt(event.target.value || "0", 10),
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Max. Nutzungen</label>
                    <input
                      type="number"
                      value={newPromoCode.maxUses}
                      onChange={event =>
                        setNewPromoCode({
                          ...newPromoCode,
                          maxUses: event.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="leer = unbegrenzt"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Läuft ab am</label>
                    <input
                      type="date"
                      value={newPromoCode.expiresAt}
                      onChange={event =>
                        setNewPromoCode({
                          ...newPromoCode,
                          expiresAt: event.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-3 rounded-lg border border-border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={newPromoCode.isActive}
                        onChange={event =>
                          setNewPromoCode({
                            ...newPromoCode,
                            isActive: event.target.checked,
                          })
                        }
                      />
                      <span className="text-sm font-medium text-foreground">Aktiv</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handlePromoSubmit}
                    disabled={createPromoMutation.isPending || updatePromoMutation.isPending}
                    className="flex-1 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60"
                  >
                    {editingPromoId ? "Änderungen speichern" : "Promo-Code erstellen"}
                  </button>
                  {editingPromoId && (
                    <button
                      onClick={resetPromoForm}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      Abbrechen
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Alle Promo-Codes</h3>
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  ["all", "Alle"],
                  ["active", "Aktiv"],
                  ["inactive", "Inaktiv"],
                  ["expired", "Ausgelaufen"],
                  ["limit_reached", "Limit erreicht"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setPromoFilter(value as PromoFilter)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      promoFilter === value
                        ? "bg-accent text-accent-foreground"
                        : "border border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {filteredPromoCodes.length === 0 ? (
                <p className="text-muted-foreground">Noch keine Promo-Codes vorhanden.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Code</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Rabatt</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nutzung</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Läuft ab</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Beschreibung</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPromoCodes.map((promo) => (
                        <tr key={promo.id} className="border-b border-border">
                          <td className="py-3 px-4 font-mono font-semibold text-accent">{promo.code}</td>
                          <td className="py-3 px-4 text-foreground">{promo.discountPercent}%</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                getPromoState(promo) === "active"
                                  ? "bg-green-100 text-green-700"
                                  : getPromoState(promo) === "inactive"
                                    ? "bg-gray-100 text-gray-700"
                                    : getPromoState(promo) === "expired"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {getPromoState(promo) === "active"
                                ? "aktiv"
                                : getPromoState(promo) === "inactive"
                                  ? "inaktiv"
                                  : getPromoState(promo) === "expired"
                                    ? "ausgelaufen"
                                    : "Limit erreicht"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground">
                            {promo.currentUses} / {promo.maxUses ?? "∞"}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString("de-DE") : "—"}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{promo.description || "—"}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditingPromo(promo)}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                Bearbeiten
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Promo-Code ${promo.code} wirklich löschen?`)) {
                                    deletePromoMutation.mutate(promo.id);
                                  }
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Löschen
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                <label className="block text-muted-foreground mb-2">Kunde</label>
                <input
                  type="text"
                  value={editableOrder?.customerName ?? ""}
                  onChange={(event) =>
                    setEditableOrder(current => current ? { ...current, customerName: event.target.value } : current)
                  }
                  disabled={selectedOrder.source !== "server"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                />
                {selectedOrder.customerEmail && (
                  <p className="mt-2 text-muted-foreground">{selectedOrder.customerEmail}</p>
                )}
              </div>

              <div className="pb-3 border-b border-border">
                <label className="block text-muted-foreground mb-2">Lieferadresse</label>
                <textarea
                  value={editableOrder?.customerAddress ?? ""}
                  onChange={(event) =>
                    setEditableOrder(current => current ? { ...current, customerAddress: event.target.value } : current)
                  }
                  disabled={selectedOrder.source !== "server"}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="pb-3 border-b border-border">
                <p className="text-muted-foreground">Betrag</p>
                <p className="text-lg font-bold text-accent">
                  €{(selectedOrder.totalPrice / 100).toFixed(2)}
                </p>
              </div>

              <div className="grid gap-3 pb-3 border-b border-border sm:grid-cols-2">
                <div>
                  <label className="block text-muted-foreground mb-2">Zahlungsart</label>
                  <select
                    value={editableOrder?.paymentMethod ?? "vorkasse"}
                    onChange={(event) =>
                      setEditableOrder(current =>
                        current ? { ...current, paymentMethod: event.target.value as EditableOrderForm["paymentMethod"] } : current
                      )
                    }
                    disabled={selectedOrder.source !== "server"}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="paypal">PayPal</option>
                    <option value="visa">Visa / Kreditkarte</option>
                    <option value="klarna">Klarna</option>
                    <option value="vorkasse">Vorkasse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2">Zahlungsstatus</label>
                  <select
                    value={editableOrder?.paymentStatus ?? "pending"}
                    onChange={(event) =>
                      setEditableOrder(current =>
                        current ? { ...current, paymentStatus: event.target.value as EditableOrderForm["paymentStatus"] } : current
                      )
                    }
                    disabled={selectedOrder.source !== "server"}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="pending">wartet</option>
                    <option value="paid">bezahlt</option>
                    <option value="unpaid">nicht bezahlt</option>
                  </select>
                </div>
              </div>

              <div className="pb-3 border-b border-border">
                <label className="block text-muted-foreground mb-2">Bestellstatus</label>
                <select
                  value={editableOrder?.status ?? "pending"}
                  onChange={(event) =>
                    setEditableOrder(current =>
                      current ? { ...current, status: event.target.value as EditableOrderForm["status"] } : current
                    )
                  }
                  disabled={selectedOrder.source !== "server"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                </select>
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

            {selectedOrder.source === "local" && (
              <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                Lokale Fallback-Bestellungen sind nur lesbar. Bearbeiten funktioniert für echte Server-Bestellungen.
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {selectedOrder.source === "server" && (
                <button
                  onClick={handleSaveOrder}
                  disabled={updateOrderMutation.isPending}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {updateOrderMutation.isPending ? "Speichert..." : "Speichern"}
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setEditableOrder(null);
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
