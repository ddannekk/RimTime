import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ADD_TO_CART_VISUAL_EVENT, AddToCartVisualDetail, triggerCartBump } from "@/lib/cartEffects";
import { withBasePath } from "@/lib/paths";

interface FlyingItem extends AddToCartVisualDetail {
  targetX: number;
  targetY: number;
}

export default function AddToCartAnimator() {
  const [items, setItems] = useState<FlyingItem[]>([]);

  useEffect(() => {
    const handleAdd = (event: Event) => {
      const detail = (event as CustomEvent<AddToCartVisualDetail>).detail;
      const target = document.querySelector("[data-cart-icon-target='true']") as HTMLElement | null;
      const targetRect = target?.getBoundingClientRect();

      setItems((current) => [
        ...current,
        {
          ...detail,
          targetX: targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 48,
          targetY: targetRect ? targetRect.top + targetRect.height / 2 : 48,
        },
      ]);
    };

    window.addEventListener(ADD_TO_CART_VISUAL_EVENT, handleAdd as EventListener);
    return () => window.removeEventListener(ADD_TO_CART_VISUAL_EVENT, handleAdd as EventListener);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX - 32,
              y: item.startY - 32,
              scale: 1,
              opacity: 0.96,
              rotate: 0,
            }}
            animate={{
              x: item.targetX - 16,
              y: item.targetY - 16,
              scale: 0.2,
              opacity: 0.18,
              rotate: 18,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => {
              setItems((current) => current.filter((entry) => entry.id !== item.id));
              triggerCartBump();
            }}
            className="absolute flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-card shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
          >
            {item.image ? (
              <img src={withBasePath(item.image)} alt="Added to cart" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-accent via-accent/80 to-accent/30" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
