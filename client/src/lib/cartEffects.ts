export const ADD_TO_CART_VISUAL_EVENT = "rimtime:add-to-cart-visual";
export const CART_BUMP_EVENT = "rimtime:cart-bump";
export const OPEN_CART_PANEL_EVENT = "rimtime:open-cart-panel";

export interface AddToCartVisualDetail {
  id: string;
  startX: number;
  startY: number;
  image?: string;
}

export function triggerAddToCartVisual(options: {
  sourceElement?: HTMLElement | null;
  image?: string;
}) {
  if (typeof window === "undefined") return;

  const rect = options.sourceElement?.getBoundingClientRect();
  const detail: AddToCartVisualDetail = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    startX: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
    startY: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
    image: options.image,
  };

  window.dispatchEvent(new CustomEvent<AddToCartVisualDetail>(ADD_TO_CART_VISUAL_EVENT, { detail }));
}

export function triggerCartBump() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_BUMP_EVENT));
}

export function triggerOpenCartPanel() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CART_PANEL_EVENT));
}
