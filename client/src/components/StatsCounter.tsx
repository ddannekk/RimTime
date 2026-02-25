import { useEffect, useState, useRef } from "react";
import { Star, ShoppingCart, Users } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}

export default function StatsCounter() {
  const [stats, setStats] = useState<StatItem[]>([
    { icon: <Users className="w-8 h-8" />, label: "Zufriedene Kunden", value: 0, suffix: "" },
    { icon: <ShoppingCart className="w-8 h-8" />, label: "Verkaufte Uhren", value: 0, suffix: "" },
    { icon: <Star className="w-8 h-8" />, label: "Durchschnittliche Bewertung", value: 0, suffix: "★" },
  ]);

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targets = [5234, 12456, 4.9];
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setStats((prev) =>
        prev.map((stat, idx) => ({
          ...stat,
          value: Math.floor(targets[idx] * progress * 100) / 100,
        }))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible]);

  return (
    <div ref={ref} className="py-16 bg-gradient-to-r from-accent/5 to-accent/10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="flex justify-center mb-4 text-accent">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                {stat.value.toLocaleString("de-DE", {
                  maximumFractionDigits: stat.suffix === "★" ? 1 : 0,
                })}
                {stat.suffix}
              </div>
              <p className="text-muted-foreground text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
