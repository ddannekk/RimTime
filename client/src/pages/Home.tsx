import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, Zap, Gift } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import StatsCounter from "@/components/StatsCounter";

interface Product {
  id: number;
  name: string;
  basePrice: number;
  image: string;
  size: string;
  style: string;
  upvotes: number;
  downvotes: number;
}

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
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-accent/10 to-accent/5 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Die Felgenuhr für dein Setup
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                RIMtime – hochwertige Wanduhren im Felgen-Design. Perfekt für Garage, Gaming-Room, Büro oder als Geschenk für jeden Auto-Fan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground hover:bg-accent/90 transition-colors">
                  Jetzt entdecken
                </Link>
                <Link href="#bestsellers" className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors">
                  Bestseller ansehen
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm aspect-square bg-card rounded-lg border border-border overflow-hidden shadow-lg">
                <img
                  src="https://private-us-east-1.manuscdn.com/sessionFile/IcIHVxFJ0hE6S3lPjRsrxS/sandbox/5eIpQ3FDb1EyHzfVZdWmWr-img-1_1771945624000_na1fn_cmltdGltZS1tb3RvcnNwb3J0LTMwY20.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWNJSFZ4RkowaEU2UzNsUGpSc3J4Uy9zYW5kYm94LzVlSXBRM0ZEYjFFeUh6ZlZaZFdtV3ItaW1nLTFfMTc3MTk0NTYyNDAwMF9uYTFmbl9jbWx0ZEdsdFpTMXRiM1J2Y25Od2IzSjBMVE13WTIwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OWJIdrebow40fRgMm78-ctkZ~V6~J-817zY~2yprmejrFeTiAqajf5lSOMkzUv0fBtJCXSxfAM-bXa2I~i-sHftOOpO3eelhDxAwtL4nEGOAQ5l2HuBpfvKwLmBCh3rGRKyCXS1nlCQunJpkSblo0o4jbsXAJRm-SzynoOvdk6GklnanvSSb~XPXnAKroaVMHkJb94Uh-qjMKJagtEmyc88uOTIW1Pq2lZy-iCnzJBWy-sgdsa0NV7B6Hw-qFZ-ExnzO05PPSbjQRSWwutoMchxn4hL~uXAflI4s0RymFvsXCaIaceII7d~XXwmLMbohPvE5a2OEyhUewfjU9~wr7A__"
                  alt="RIMtime Felgenuhr Motorsport"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <StatsCounter />

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Warum RIMtime?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Realistische Felgen-Optik
              </h3>
              <p className="text-muted-foreground">
                Hochwertige Verarbeitung mit echtem Felgen-Design. Speichen, Tiefbett-Optik und professionelles Uhrwerk.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Leise & Zuverlässig
              </h3>
              <p className="text-muted-foreground">
                Silent-Clock Mechanismus. Keine störenden Tickgeräusche. Batteriebetrieb mit langer Laufzeit.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Perfektes Geschenk
              </h3>
              <p className="text-muted-foreground">
                Für Geburtstag, Weihnachten oder Einzug. Jeder Auto-Fan wird diese Uhr lieben.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section id="bestsellers" className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Top Bestseller
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="w-full h-48 bg-muted rounded mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : bestsellers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestsellers.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <a className="card hover:shadow-lg hover:border-accent transition-all cursor-pointer group">
                    <div className="w-full h-48 bg-muted rounded mb-4 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.size} • {product.style}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-accent">
                        €{(product.basePrice / 100).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span>{product.upvotes}</span>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Produkte verfügbar</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <a className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground hover:bg-accent/90 transition-colors">
                Alle Produkte anschauen
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Was Kunden sagen
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="card">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "Absolut begeistert! Die Uhr sieht noch besser aus als auf den Fotos. Perfekt für mein Gaming-Setup!"
              </p>
              <p className="text-sm font-semibold text-foreground">Max K.</p>
              <p className="text-xs text-muted-foreground">Verifizierter Käufer</p>
            </div>

            {/* Review 2 */}
            <div className="card">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "Hochwertige Verarbeitung und super schneller Versand. Das beste Geschenk für meinen Bruder!"
              </p>
              <p className="text-sm font-semibold text-foreground">Sarah M.</p>
              <p className="text-xs text-muted-foreground">Verifizierter Käufer</p>
            </div>

            {/* Review 3 */}
            <div className="card">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "Läuft leise, sieht toll aus und die Qualität ist wirklich beeindruckend. Sehr empfehlenswert!"
              </p>
              <p className="text-sm font-semibold text-foreground">Thomas L.</p>
              <p className="text-xs text-muted-foreground">Verifizierter Käufer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent text-accent-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für deine RIMtime?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Entdecke unsere Kollektion und finde die perfekte Felgenuhr für dein Setup.
          </p>
          <Link href="/products">
            <a className="inline-flex items-center justify-center rounded-md bg-accent-foreground px-8 py-3 text-base font-medium text-accent hover:bg-opacity-90 transition-colors">
              Jetzt bestellen
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
