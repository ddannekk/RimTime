import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Filter, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high">("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const search = useSearch();

  const { data: productsData } = trpc.products.getAll.useQuery();

  useEffect(() => {
    if (productsData) {
      setProducts(productsData as Product[]);
      setLoading(false);
    }
  }, [productsData]);

  const updateSearchInUrl = (nextValue: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(search);
    const normalized = nextValue.trim();

    if (normalized) {
      params.set("q", normalized);
    } else {
      params.delete("q");
    }

    const nextUrl = params.toString() ? `/products?${params.toString()}` : "/products";
    window.history.replaceState(window.history.state, "", nextUrl);
  };

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.style.toLowerCase().includes(normalizedQuery) ||
          (product.description ?? "").toLowerCase().includes(normalizedQuery)
      );
    }

    if (selectedSize) {
      filtered = filtered.filter((product) => product.size === selectedSize);
    }
    if (selectedStyle) {
      filtered = filtered.filter((product) => product.style === selectedStyle);
    }
    if (sortBy === "popular") {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    }

    setFilteredProducts(filtered);
  }, [products, selectedSize, selectedStyle, sortBy, searchQuery]);

  const sizes = ["30cm", "45cm"];
  const styles = ["Motorsport", "Classic", "Black/Chrome"];

  return (
    <div className="w-full">
      <div className="container py-8">
        <div className="mb-8 rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.38))] p-8 shadow-sm dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.74),rgba(15,23,42,0.35))]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Felgenuhren</p>
          <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">Produkte</h1>
          <p className="text-muted-foreground">Entdecke unsere Kollektion von hochwertigen Felgenuhren.</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Suche nach Modell, Größe oder Finish"
              value={searchQuery}
              onChange={(event) => {
                const nextValue = event.target.value;
                setSearchQuery(nextValue);
                updateSearchInUrl(nextValue);
              }}
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              {filteredProducts.length} Produkt{filteredProducts.length !== 1 ? "e" : ""} gefunden
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-24 rounded-[1.75rem] border border-border/70 bg-card/88 p-5 shadow-sm backdrop-blur lg:p-6 dark:border-white/10 dark:bg-white/[0.03]">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Filter className="h-5 w-5" />
                Filter
              </h2>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-foreground">Größe</h3>
                <div className="space-y-2">
                  {sizes.map((size) => (
                    <label key={size} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSize === size}
                        onChange={(event) => setSelectedSize(event.target.checked ? size : null)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-foreground">Style</h3>
                <div className="space-y-2">
                  {styles.map((style) => (
                    <label key={style} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedStyle === style}
                        onChange={(event) => setSelectedStyle(event.target.checked ? style : null)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(selectedSize || selectedStyle || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSize(null);
                    setSelectedStyle(null);
                    setSearchQuery("");
                    updateSearchInUrl("");
                  }}
                  className="w-full rounded-xl border border-accent px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
                >
                  Filter löschen
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex items-center gap-2 rounded border border-border px-3 py-2 transition-colors hover:bg-muted lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                className="w-full rounded border border-border bg-background px-3 py-2 text-foreground sm:w-auto"
              >
                <option value="popular">Beliebtheit</option>
                <option value="price-low">Preis: Niedrig zu Hoch</option>
                <option value="price-high">Preis: Hoch zu Niedrig</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="mb-4 h-48 w-full rounded bg-muted" />
                    <div className="mb-2 h-4 rounded bg-muted" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} compact />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-border/70 bg-card/85 px-6 py-16 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-lg font-semibold text-foreground">Keine passenden Produkte gefunden</p>
                <p className="mt-2 text-muted-foreground">Versuche einen anderen Suchbegriff oder lösche die aktiven Filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
