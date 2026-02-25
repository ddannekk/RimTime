export const LOCAL_ORDERS_KEY = "rimtime_local_orders_v1";
export const LOCAL_FUNNEL_KEY = "rimtime_local_funnel_v1";
const DEFAULT_RETENTION_DAYS = 30;

export type FunnelEventType =
  | "checkout_start"
  | "promo_applied"
  | "order_success"
  | "checkout_abandon";

export type FunnelEvent = {
  type: FunnelEventType;
  timestamp: string;
  payload?: Record<string, unknown>;
};

export type LocalOrderRecord = {
  orderNumber: string;
  totalPrice: number;
  createdAt: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  itemsCount: number;
  promoCode?: string;
  discountPercent?: number;
  source: "checkout";
};

export type FunnelStats = {
  started: number;
  success: number;
  abandon: number;
  promoApplied: number;
  conversionRate: number;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readArray<T>(key: string): T[] {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, data: T[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(data));
}

function isWithinRetention(isoDate: string, retentionDays: number) {
  const ts = Date.parse(isoDate);
  if (Number.isNaN(ts)) return false;
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  return ts >= cutoff;
}

export function pruneOlderThanDays(days: number = DEFAULT_RETENTION_DAYS) {
  const orders = readArray<LocalOrderRecord>(LOCAL_ORDERS_KEY).filter(order =>
    isWithinRetention(order.createdAt, days)
  );
  const funnel = readArray<FunnelEvent>(LOCAL_FUNNEL_KEY).filter(event =>
    isWithinRetention(event.timestamp, days)
  );

  writeArray(LOCAL_ORDERS_KEY, orders);
  writeArray(LOCAL_FUNNEL_KEY, funnel);
}

export function saveLocalOrder(record: LocalOrderRecord) {
  pruneOlderThanDays();

  const orders = readArray<LocalOrderRecord>(LOCAL_ORDERS_KEY);
  const deduped = orders.filter(order => order.orderNumber !== record.orderNumber);
  deduped.push(record);
  writeArray(LOCAL_ORDERS_KEY, deduped);
}

export function trackFunnelEvent(event: Omit<FunnelEvent, "timestamp"> & { timestamp?: string }) {
  pruneOlderThanDays();

  const funnel = readArray<FunnelEvent>(LOCAL_FUNNEL_KEY);
  funnel.push({
    ...event,
    timestamp: event.timestamp ?? new Date().toISOString(),
  });
  writeArray(LOCAL_FUNNEL_KEY, funnel);
}

export function getLocalOrders() {
  pruneOlderThanDays();
  return readArray<LocalOrderRecord>(LOCAL_ORDERS_KEY).sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );
}

export function getFunnelStats(): FunnelStats {
  pruneOlderThanDays();
  const events = readArray<FunnelEvent>(LOCAL_FUNNEL_KEY);

  const started = events.filter(event => event.type === "checkout_start").length;
  const success = events.filter(event => event.type === "order_success").length;
  const abandon = events.filter(event => event.type === "checkout_abandon").length;
  const promoApplied = events.filter(event => event.type === "promo_applied").length;
  const conversionRate = started > 0 ? Number(((success / started) * 100).toFixed(1)) : 0;

  return {
    started,
    success,
    abandon,
    promoApplied,
    conversionRate,
  };
}

export function resetLocalAnalytics() {
  if (!canUseStorage()) return;
  localStorage.removeItem(LOCAL_ORDERS_KEY);
  localStorage.removeItem(LOCAL_FUNNEL_KEY);
}
