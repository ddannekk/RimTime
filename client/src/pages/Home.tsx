import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Star, Truck, Zap, Gift, GaugeCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import StatsCounter from "@/components/StatsCounter";
import LiveWheelClock from "@/components/LiveWheelClock";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  description?: string | null;
  basePrice: number;
  image: string;
  size: string;
  style: string;
  upvotes: number;
  downvotes: number;
}

const HERO_IMAGE = "/images/rimtime/motorsport-clock.png";
const INSPIRATION_SCENES = [
  {
    title: "Garage",
    copy: "Ideal für Werkstatt, Garage oder Hobbyraum. Die Uhr wirkt hier wie ein echtes Performance-Teil an der Wand.",
    image: "/images/rimtime/inspiration-garage.png",
  },
  {
    title: "Gaming-Zimmer",
    copy: "Passt stark in moderne Gaming-Setups mit RGB, Monitoren und klarer Tech-Atmosphäre.",
    image: "/images/rimtime/inspiration-gaming.png",
  },
  {
    title: "Office",
    copy: "Auch im Office ein markanter Blickfang. Sauber, hochwertig und deutlich stärker als eine gewöhnliche Wanduhr.",
    image: "/images/rimtime/inspiration-office.png",
  },
] as const;

export default function Home() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: bestsellersData } = trpc.products.getBestsellers.useQuery();

  useEffect(() => {
    if (bestsellersData) {
      setBestsellers(bestsellersData as Product[]);
      setLoading(false);
    }
  }, [bestsellersData]);

  const scrollToBestsellers = () => {
    const target = document.getElementById("bestsellers");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full">
      <section className="relative overflow-hidden border-b border-border/70 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(15,23,42,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.25))] dark:bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.22),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(56,189,248,0.12),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.82),rgba(15,23,42,0.4))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/55 to-transparent" />
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-background/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Motorsport-Design für Ihre Wand
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
                Die Felgenuhr für Ihr Setup
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-8 text-muted-foreground">
                RIMtime bringt Motorsport-Ästhetik an die Wand. Metallischer Look, echtes Uhrgefühl und eine Präsenz, die Garage, Gaming-Zimmer oder Office sofort aufwertet.
              </p>
              <div className="mb-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                  Jetzt entdecken
                </Link>
                <button
                  type="button"
                  onClick={scrollToBestsellers}
                  className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Bestseller ansehen
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ["Echter Blickfang", "Felgen-Optik mit Tiefe"],
                  ["Lautloses Uhrwerk", "Kein störendes Ticken"],
                  ["Starker Raum-Effekt", "Passt zu Garage, Office und Gaming-Zimmer"],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center"
            >
              <div className="w-full max-w-xl">
                <LiveWheelClock image={HERO_IMAGE} name="RIMtime Felgenuhr Motorsport" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <StatsCounter />

      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Warum RIMtime?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45 }} className="card flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Realistische Felgen-Optik</h3>
              <p className="text-muted-foreground">Hochwertige Verarbeitung mit Tiefe, Speichenstruktur und dem Look eines echten Performance-Parts.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: 0.08 }} className="card flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Leise & zuverlässig</h3>
              <p className="text-muted-foreground">Leises Uhrwerk mit ruhigem Lauf. Präsenz im Raum, ohne akustischen Stress.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: 0.16 }} className="card flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Gift className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Perfektes Geschenk</h3>
              <p className="text-muted-foreground">Für Geburtstag, Einzug oder Weihnachten. Ein Objekt, das nicht generisch wirkt.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="bestsellers" className="border-y border-border bg-card py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-foreground">Top Bestseller</h2>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="mb-4 h-48 w-full rounded bg-muted" />
                  <div className="mb-2 h-4 rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : bestsellers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Keine Produkte verfügbar</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90">
              Alle Produkte anschauen
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-accent">Inspiration</p>
              <h2 className="mt-3 text-3xl font-bold text-foreground">Wie die Uhr im Raum wirkt</h2>
            </div>
            <p className="max-w-2xl text-muted-foreground">Menschen kaufen nicht nur die Uhr. Sie kaufen die Wirkung an der Wand. Deshalb zeigen wir den Look in drei klaren Setups.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {INSPIRATION_SCENES.map((scene, index) => (
              <motion.div
                key={scene.title}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="relative h-80 overflow-hidden">
                  <img src={scene.image} alt={scene.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-slate-950/10" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground">{scene.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{scene.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-foreground">Was Kunden sagen</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="card">
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-4 text-foreground">"Absolut begeistert. Die Uhr wirkt an der Wand noch hochwertiger als auf den Fotos. Perfekt für mein Gaming-Setup."</p>
              <p className="text-sm font-semibold text-foreground">Max K.</p>
              <p className="text-xs text-muted-foreground">Verifizierter Käufer</p>
            </div>
            <div className="card">
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-4 text-foreground">"Hochwertige Verarbeitung und schneller Versand. Wirkt nicht wie Deko von der Stange, sondern wie ein echtes Designobjekt."</p>
              <p className="text-sm font-semibold text-foreground">Sarah M.</p>
              <p className="text-xs text-muted-foreground">Verifizierter Käufer</p>
            </div>
            <div className="card">
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-4 text-foreground">"Leise, sauber verarbeitet und optisch massiv. Genau die Mischung aus Motorsport und Interior, die ich gesucht habe."</p>
              <p className="text-sm font-semibold text-foreground">Thomas L.</p>
              <p className="text-xs text-muted-foreground">Verifizierter Käufer</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent py-16 text-accent-foreground md:py-24">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Bereit für Ihre RIMtime?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">Entdecken Sie unsere Kollektion und finden Sie die Felgenuhr, die Ihre Wand zum klaren Blickfang macht.</p>
          <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-accent-foreground px-8 py-3 text-base font-medium text-accent transition-colors hover:bg-opacity-90">
            Jetzt bestellen
          </Link>
        </div>
      </section>

      <section className="border-t border-border/70 py-8">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Sichere Zahlung", copy: "Zahlung mit Visa, PayPal, Klarna oder Vorkasse" },
              { icon: Truck, title: "Versand aus Deutschland", copy: "Klare Lieferzeiten und gratis Versand ab €49" },
              { icon: GaugeCircle, title: "Lautloses Uhrwerk", copy: "Leiser Lauf ohne störendes Tick-Geräusch" },
              { icon: Sparkles, title: "Hochwertiges Finish", copy: "Metallischer Look mit spürbarer Tiefenwirkung" },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card/80 px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
