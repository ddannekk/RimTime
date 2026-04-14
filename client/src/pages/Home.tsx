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

const HERO_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/IcIHVxFJ0hE6S3lPjRsrxS/sandbox/5eIpQ3FDb1EyHzfVZdWmWr-img-1_1771945624000_na1fn_cmltdGltZS1tb3RvcnNwb3J0LTMwY20.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWNJSFZ4RkowaEU2UzNsUGpSc3J4Uy9zYW5kYm94LzVlSXBRM0ZEYjFFeUh6ZlZaZFdtV3ItaW1nLTFfMTc3MTk0NTYyNDAwMF9uYTFmbl9jbWx0ZEdsdFpTMXRiM1J2Y25Od2IzSjBMVE13WTIwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OWJIdrebow40fRgMm78-ctkZ~V6~J-817zY~2yprmejrFeTiAqajf5lSOMkzUv0fBtJCXSxfAM-bXa2I~i-sHftOOpO3eelhDxAwtL4nEGOAQ5l2HuBpfvKwLmBCh3rGRKyCXS1nlCQunJpkSblo0o4jbsXAJRm-SzynoOvdk6GklnanvSSb~XPXnAKroaVMHkJb94Uh-qjMKJagtEmyc88uOTIW1Pq2lZy-iCnzJBWy-sgdsa0NV7B6Hw-qFZ-ExnzO05PPSbjQRSWwutoMchxn4hL~uXAflI4s0RymFvsXCaIaceII7d~XXwmLMbohPvE5a2OEyhUewfjU9~wr7A__";

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
                Garage attitude for your wall
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
                Die Felgenuhr für dein Setup
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-8 text-muted-foreground">
                RIMtime bringt Motorsport-Ästhetik an die Wand. Metallischer Look, echtes Uhrgefühl und eine Präsenz, die Garage, Gaming-Room oder Office sofort aufwertet.
              </p>
              <div className="mb-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                  Jetzt entdecken
                </Link>
                <Link href="#bestsellers" className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted">
                  Bestseller ansehen
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ["Echter Blickfang", "Felgen-Optik mit Tiefe"],
                  ["Silent Clock", "Kein störendes Ticken"],
                  ["Setup Upgrade", "Garage, Office, Gaming"],
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
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ["30 cm", "Desk / Shelf"],
                    ["45 cm", "Feature Wall"],
                    ["Live Clock", "läuft in Echtzeit"],
                  ].map(([title, copy]) => (
                    <div key={title} className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy}</p>
                    </div>
                  ))}
                </div>
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
              <p className="text-muted-foreground">Silent-Clock Mechanismus mit ruhigem Lauf. Präsenz im Raum, ohne akustischen Stress.</p>
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

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-accent">Größenvergleich</p>
              <h2 className="mt-3 text-3xl font-bold text-foreground">Die richtige Präsenz für deinen Raum</h2>
            </div>
            <p className="max-w-xl text-muted-foreground">30 cm wirkt präzise und clean auf Desk-Setups. 45 cm macht die Uhr zur dominanten Wandfläche im Garage- oder Office-Look.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex min-h-[17rem] items-center justify-center rounded-[1.75rem] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_50%),linear-gradient(180deg,rgba(148,163,184,0.08),rgba(148,163,184,0.02))]">
                <div className="relative h-52 w-52 rounded-full border-[16px] border-slate-700/85 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.55),rgba(15,23,42,0.2)_46%,rgba(15,23,42,0.72))] shadow-[inset_0_12px_35px_rgba(255,255,255,0.16),0_20px_50px_rgba(15,23,42,0.24)]">
                  <div className="absolute inset-[18%] rounded-full border border-white/15" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">30 cm</p>
                  <p className="mt-1 text-sm text-muted-foreground">Ideal für Schreibtisch, Shelf oder kleinere Wandflächen.</p>
                </div>
                <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Desk Focus</div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex min-h-[17rem] items-center justify-center rounded-[1.75rem] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_50%),linear-gradient(180deg,rgba(148,163,184,0.08),rgba(148,163,184,0.02))]">
                <div className="relative h-72 w-72 rounded-full border-[18px] border-slate-800/90 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.62),rgba(15,23,42,0.24)_48%,rgba(15,23,42,0.82))] shadow-[inset_0_16px_40px_rgba(255,255,255,0.16),0_22px_60px_rgba(15,23,42,0.28)]">
                  <div className="absolute inset-[18%] rounded-full border border-white/15" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">45 cm</p>
                  <p className="mt-1 text-sm text-muted-foreground">Für große Wände, Garage-Spaces und dominante Platzierung.</p>
                </div>
                <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Wall Statement</div>
              </div>
            </div>
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
            {[
              { title: "Garage Corner", copy: "Dunkle Wände, Werkzeug, metallische Lichtkante.", bg: "from-slate-900 via-slate-800 to-slate-700" },
              { title: "Gaming Setup", copy: "Neon-Kante, Monitor-Light, fokussierter Desk-Look.", bg: "from-slate-950 via-sky-950 to-slate-900" },
              { title: "Office Wall", copy: "Sauberer Kontrast, strukturierte Wand, Statement-Piece.", bg: "from-stone-200 via-stone-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" },
            ].map((scene, index) => (
              <motion.div
                key={scene.title}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className={`relative h-80 overflow-hidden bg-gradient-to-br ${scene.bg}`}>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-black/15" />
                  <div className="absolute bottom-8 left-8 h-16 w-28 rounded-t-3xl border border-white/20 bg-white/10 backdrop-blur-sm" />
                  <div className="absolute right-8 top-10 h-24 w-16 rounded-full bg-accent/12 blur-2xl" />
                  <div className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full border-[12px] border-slate-800/90 shadow-[0_25px_45px_rgba(0,0,0,0.28)]">
                    <img src={HERO_IMAGE} alt={scene.title} className="h-full w-full rounded-full object-cover" />
                  </div>
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
              <p className="mb-4 text-foreground">"Hochwertige Verarbeitung und schneller Versand. Wirkt nicht wie Deko von der Stange, sondern wie ein richtiges Statement-Piece."</p>
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
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Bereit für deine RIMtime?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">Entdecke unsere Kollektion und finde die Felgenuhr, die aus einer Wand ein Statement macht.</p>
          <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-accent-foreground px-8 py-3 text-base font-medium text-accent transition-colors hover:bg-opacity-90">
            Jetzt bestellen
          </Link>
        </div>
      </section>

      <section className="border-t border-border/70 py-8">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Sichere Zahlung", copy: "Visa, PayPal, Klarna-ready" },
              { icon: Truck, title: "Versand-Info", copy: "Schneller Versand aus Deutschland" },
              { icon: GaugeCircle, title: "Silent Movement", copy: "Leises Uhrwerk ohne Tick-Geräusch" },
              { icon: Sparkles, title: "Premium Finish", copy: "Metallischer Look mit Tiefenwirkung" },
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
