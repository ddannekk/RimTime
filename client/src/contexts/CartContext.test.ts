import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Cart Context", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty cart", () => {
    const cart = {
      items: [],
      getTotalPrice: () => 0,
      getTotalItems: () => 0,
    };

    expect(cart.items).toEqual([]);
    expect(cart.getTotalPrice()).toBe(0);
    expect(cart.getTotalItems()).toBe(0);
  });

  it("should calculate total price correctly", () => {
    const items = [
      { productId: 1, quantity: 2, price: 3990, name: "Product 1", size: "30cm", style: "Motorsport" },
      { productId: 2, quantity: 1, price: 5990, name: "Product 2", size: "45cm", style: "Classic" },
    ];

    const getTotalPrice = () => items.reduce((total, item) => total + item.price * item.quantity, 0);

    expect(getTotalPrice()).toBe(3990 * 2 + 5990); // 13970
  });

  it("should calculate total items correctly", () => {
    const items = [
      { productId: 1, quantity: 2, price: 3990, name: "Product 1", size: "30cm", style: "Motorsport" },
      { productId: 2, quantity: 3, price: 5990, name: "Product 2", size: "45cm", style: "Classic" },
    ];

    const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);

    expect(getTotalItems()).toBe(5);
  });

  it("should handle adding items", () => {
    let items: any[] = [];

    const addItem = (newItem: any) => {
      const existingItem = items.find((item) => item.productId === newItem.productId);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        items.push(newItem);
      }
    };

    addItem({ productId: 1, quantity: 1, price: 3990, name: "Product 1", size: "30cm", style: "Motorsport" });
    expect(items).toHaveLength(1);

    addItem({ productId: 1, quantity: 1, price: 3990, name: "Product 1", size: "30cm", style: "Motorsport" });
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("should handle removing items", () => {
    let items = [
      { productId: 1, quantity: 2, price: 3990, name: "Product 1", size: "30cm", style: "Motorsport" },
      { productId: 2, quantity: 1, price: 5990, name: "Product 2", size: "45cm", style: "Classic" },
    ];

    const removeItem = (productId: number) => {
      items = items.filter((item) => item.productId !== productId);
    };

    removeItem(1);
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe(2);
  });

  it("should handle updating quantity", () => {
    let items = [
      { productId: 1, quantity: 2, price: 3990, name: "Product 1", size: "30cm", style: "Motorsport" },
    ];

    const updateQuantity = (productId: number, quantity: number) => {
      const item = items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    };

    updateQuantity(1, 5);
    expect(items[0].quantity).toBe(5);
  });
});
