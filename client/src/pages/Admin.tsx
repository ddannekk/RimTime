import { useState, useEffect } from "react";
import { Eye, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
}

export default function Admin() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: ordersData } = trpc.orders.getAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData as Order[]);
      setLoading(false);
    }
  }, [ordersData]);

  if (!user || user.role !== "admin") {
    return (
      <div className="container py-12 text-center">
        <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Zugriff verweigert</h1>
        <p className="text-muted-foreground">
          Du hast keine Berechtigung, diese Seite zu sehen.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Verwaltung von Bestellungen und Statistiken
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <p className="text-sm text-muted-foreground mb-2">Gesamtbestellungen</p>
            <p className="text-3xl font-bold text-accent">{orders.length}</p>
          </div>

          <div className="card">
            <p className="text-sm text-muted-foreground mb-2">Ausstehend</p>
            <p className="text-3xl font-bold text-foreground">
              {orders.filter((o) => o.status === "pending").length}
            </p>
          </div>

          <div className="card">
            <p className="text-sm text-muted-foreground mb-2">Gesamtumsatz</p>
            <p className="text-3xl font-bold text-accent">
              €{(orders.reduce((sum, o) => sum + o.totalPrice, 0) / 100).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Bestellungen</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Laden...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Bestellnummer
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Kunde
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Betrag
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Datum
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Aktion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm text-accent">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-foreground">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-accent">
                        €{(order.totalPrice / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status === "pending"
                            ? "Ausstehend"
                            : order.status === "confirmed"
                            ? "Bestätigt"
                            : order.status === "shipped"
                            ? "Versendet"
                            : "Geliefert"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("de-DE")}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-3 py-1 text-sm text-accent hover:bg-accent/10 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Keine Bestellungen vorhanden</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Bestelldetails
              </h2>

              <div className="space-y-3 text-sm">
                <div className="pb-3 border-b border-border">
                  <p className="text-muted-foreground">Bestellnummer</p>
                  <p className="font-mono font-semibold text-accent">{selectedOrder.orderNumber}</p>
                </div>

                <div className="pb-3 border-b border-border">
                  <p className="text-muted-foreground">Kunde</p>
                  <p className="font-semibold text-foreground">{selectedOrder.customerName}</p>
                  <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>

                <div className="pb-3 border-b border-border">
                  <p className="text-muted-foreground">Lieferadresse</p>
                  <p className="text-foreground">{selectedOrder.customerAddress}</p>
                </div>

                <div className="pb-3 border-b border-border">
                  <p className="text-muted-foreground">Betrag</p>
                  <p className="text-lg font-bold text-accent">
                    €{(selectedOrder.totalPrice / 100).toFixed(2)}
                  </p>
                </div>

                <div className="pb-3 border-b border-border">
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-semibold text-foreground">
                    {selectedOrder.status === "pending"
                      ? "Ausstehend"
                      : selectedOrder.status === "confirmed"
                      ? "Bestätigt"
                      : selectedOrder.status === "shipped"
                      ? "Versendet"
                      : "Geliefert"}
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
    </div>
  );
}
