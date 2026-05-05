import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  cartKey?: string;
  productId: number;
  quantity: number;
  price: number;
  name: string;
  size: string;
  style: string;
  image?: string;
  personalization?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function getCartItemKey(item: Pick<CartItem, "productId" | "size" | "style" | "personalization">) {
  return [
    item.productId,
    item.size,
    item.style,
    (item.personalization ?? "").trim().toLowerCase(),
  ].join("::");
}

function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    cartKey: item.cartKey ?? getCartItemKey(item),
    personalization: item.personalization?.trim() || undefined,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("rimtime_cart");
    if (savedCart) {
      try {
        setItems((JSON.parse(savedCart) as CartItem[]).map(normalizeCartItem));
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rimtime_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    const normalizedNewItem = normalizeCartItem(newItem);
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.cartKey === normalizedNewItem.cartKey);
      if (existingItem) {
        return prevItems.map((item) =>
          item.cartKey === normalizedNewItem.cartKey
            ? { ...item, quantity: item.quantity + normalizedNewItem.quantity }
            : item
        );
      }
      return [...prevItems, normalizedNewItem];
    });
  };

  const removeItem = (cartKey: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartKey);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
