import { ShieldCheck, Star, Truck } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS } from "@/lib/storePolicies";

export default function StatsCounter() {
  const stats = [
    {
      icon: <Star className="h-7 w-7" />,
      eyebrow: "Vertrauen",
      title: "4.8/5 Bewertung",
      copy: "Positive Rückmeldungen zu Verarbeitung, Optik und Gesamtwirkung.",
    },
    {
      icon: <Truck className="h-7 w-7" />,
      eyebrow: "Versand",
      title: `Gratis ab €${(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)}`,
      copy: "Schneller Versand aus Deutschland mit klarer Lieferzeit.",
    },
    {
      icon: <ShieldCheck className="h-7 w-7" />,
      eyebrow: "Service",
      title: `${RETURN_DAYS} Tage Rückgabe`,
      copy: "Mehr Sicherheit für Ihre Entscheidung auch nach dem Kauf.",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-r from-accent/5 to-accent/10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="rounded-[1.75rem] border border-border/70 bg-card/80 p-6 text-left shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                {stat.icon}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent/80">{stat.eyebrow}</p>
              <div className="mt-3 text-3xl font-bold text-foreground">{stat.title}</div>
              <p className="mt-3 text-muted-foreground">{stat.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
