import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Star, Filter, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high">("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productsData } = trpc.products.getAll.useQuery();

  useEffect(() => {
    if (productsData) {
      setProducts(productsData as Product[]);
      setLoading(false);
    }
  }, [productsData]);

  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.style.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (selectedSize) {
      filtered = filtered.filter((p) => p.size === selectedSize);
    }
    if (selectedStyle) {
      filtered = filtered.filter((p) => p.style === selectedStyle);
    }
    if (selectedRating) {
      filtered = filtered.filter((p) => p.upvotes >= selectedRating);
    }

    // Apply sorting
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Produkte</h1>
          <p className="text-muted-foreground">
            Entdecke unsere Kollektion von hochwertigen Felgenuhren
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Nach Produkten suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              {filteredProducts.length} Produkt{filteredProducts.length !== 1 ? 'e' : ''} gefunden
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:block ${mobileFiltersOpen ? "block" : "hidden"}`}>
            <div className="card sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter
              </h2>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Größe</h3>
                <div className="space-y-2">
                  {sizes.map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSize === size}
                        onChange={(e) => setSelectedSize(e.target.checked ? size : null)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Style Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Style</h3>
                <div className="space-y-2">
                  {styles.map((style) => (
                    <label key={style} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStyle === style}
                        onChange={(e) => setSelectedStyle(e.target.checked ? style : null)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Bewertung</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRating === rating}
                        onChange={(e) => setSelectedRating(e.target.checked ? rating : null)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{rating}+ Sterne</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedSize || selectedStyle || selectedRating || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSize(null);
                    setSelectedStyle(null);
                    setSelectedRating(null);
                    setSearchQuery("");
                  }}
                  className="w-full py-2 px-3 text-sm font-medium text-accent border border-accent rounded hover:bg-accent/10 transition-colors"
                >
                  Filter löschen
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & Mobile Filter Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-border rounded hover:bg-muted transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <Link href="/compare" className="flex items-center gap-2 px-3 py-2 border border-border rounded hover:bg-muted transition-colors text-foreground">
                  Vergleichen
                </Link>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-border rounded bg-background text-foreground"
              >
                <option value="popular">Beliebtheit</option>
                <option value="price-low">Preis: Niedrig zu Hoch</option>
                <option value="price-high">Preis: Hoch zu Niedrig</option>
              </select>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="w-full h-48 bg-muted rounded mb-4" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="card hover:shadow-lg hover:border-accent transition-all cursor-pointer group">
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
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Keine Produkte mit diesen Filtern gefunden</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
