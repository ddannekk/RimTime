import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Edit2, Trash2, Plus, LogOut, MapPin } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface AdminUser {
  username: string;
  password: string;
}

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  salesByDay: any[];
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState<AdminUser>({ username: "", password: "" });
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "promo">("dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    salesByDay: [],
  });
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newPromoCode, setNewPromoCode] = useState({ code: "", discountPercent: 0 });

  const { data: productsData } = trpc.products.getAll.useQuery();
  const { data: ordersData } = trpc.orders.getAll.useQuery();

  useEffect(() => {
    if (productsData) {
      setProducts(productsData as any[]);
    }
  }, [productsData]);

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData as any[]);
      calculateDashboardData(ordersData as any[]);
    }
  }, [ordersData]);

  const calculateDashboardData = (ordersList: any[]) => {
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalProducts = products.length;

    // Group orders by day
    const salesByDay: any = {};
    ordersList.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("de-DE");
      if (!salesByDay[date]) {
        salesByDay[date] = { date, orders: 0, revenue: 0 };
      }
      salesByDay[date].orders += 1;
      salesByDay[date].revenue += order.totalPrice / 100;
    });

    setDashboardData({
      totalOrders,
      totalRevenue,
      totalProducts,
      salesByDay: Object.values(salesByDay),
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === "admin" && credentials.password === "admin") {
      setIsLoggedIn(true);
      toast.success("Admin-Login erfolgreich!");
    } else {
      toast.error("Ungültige Anmeldedaten");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCredentials({ username: "", password: "" });
    toast.success("Abgemeldet");
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
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Passwort</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
                <strong>Demo-Anmeldedaten:</strong><br />
                Benutzername: admin<br />
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
      {/* Header */}
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
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {["dashboard", "products", "orders", "promo"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
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

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <p className="text-muted-foreground mb-2">Gesamtbestellungen</p>
                <p className="text-4xl font-bold text-accent">{dashboardData.totalOrders}</p>
              </div>
              <div className="card">
                <p className="text-muted-foreground mb-2">Gesamtumsatz</p>
                <p className="text-4xl font-bold text-accent">€{(dashboardData.totalRevenue / 100).toFixed(2)}</p>
              </div>
              <div className="card">
                <p className="text-muted-foreground mb-2">Produkte</p>
                <p className="text-4xl font-bold text-accent">{dashboardData.totalProducts}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="card">
              <h2 className="text-xl font-semibold text-foreground mb-6">Verkäufe nach Tag</h2>
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
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-foreground mb-6">Umsatz nach Tag</h2>
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
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Produktverwaltung</h2>
              <button
                onClick={() => navigate('/admin-dashboard/product/new')}
                className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent/90">
                <Plus className="w-5 h-5" />
                Neues Produkt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="card">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.size} • {product.style}</p>
                  <p className="text-lg font-bold text-accent mb-4">€{(product.basePrice / 100).toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/admin-dashboard/product/${product.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
                      <Edit2 className="w-4 h-4" />
                      Bearbeiten
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Produkt wirklich löschen?')) {
                          setProducts(products.filter(p => p.id !== product.id));
                          toast.success('Produkt gelöscht (Demo)');
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Bestellungen</h2>
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
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="py-3 px-4 text-foreground font-mono">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-foreground">{order.customerName}</td>
                      <td className="py-3 px-4 text-foreground font-bold text-accent">€{(order.totalPrice / 100).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
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
          </div>
        )}

        {/* Promo Codes Tab */}
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
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="SCHOOL20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rabatt (%)</label>
                  <input
                    type="number"
                    value={newPromoCode.discountPercent}
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, discountPercent: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="20"
                  />
                </div>
                <button className="w-full bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                  Promo-Code erstellen
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Aktive Codes</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-mono font-bold text-foreground">SCHOOL20</p>
                    <p className="text-sm text-muted-foreground">20% Rabatt</p>
                  </div>
                  <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors">Löschen</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
