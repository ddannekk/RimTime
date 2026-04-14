import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Moon, Sun, Heart, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { CART_BUMP_EVENT } from "@/lib/cartEffects";

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [cartBumping, setCartBumping] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { items: wishlistItems } = useWishlist();

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = headerSearch.trim();
    navigate(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    let timeout = 0;
    const handleBump = () => {
      setCartBumping(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setCartBumping(false), 420);
    };

    window.addEventListener(CART_BUMP_EVENT, handleBump);
    return () => {
      window.removeEventListener(CART_BUMP_EVENT, handleBump);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur supports-[backdrop-filter]:bg-background/72 dark:border-white/10 dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
      <div className="container flex items-center justify-between py-4">
        <Link href="/">
          <div className="flex cursor-pointer items-center gap-2 text-xl font-bold text-accent transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#fb923c,#c2410c_58%,#7c2d12)] text-sm font-bold text-white shadow-[0_10px_24px_rgba(234,88,12,0.35)]">
              RIM
            </div>
            <span className="hidden sm:inline">RIMtime</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/products">
            <div className="cursor-pointer text-sm font-medium text-foreground transition-colors hover:text-accent">Produkte</div>
          </Link>
          <Link href="/gallery">
            <div className="cursor-pointer text-sm font-medium text-foreground transition-colors hover:text-accent">Galerie</div>
          </Link>
          <Link href="/faq">
            <div className="cursor-pointer text-sm font-medium text-foreground transition-colors hover:text-accent">FAQ</div>
          </Link>
          <Link href="/contact">
            <div className="cursor-pointer text-sm font-medium text-foreground transition-colors hover:text-accent">Kontakt</div>
          </Link>
        </nav>

        <form onSubmit={submitSearch} className="mx-6 hidden max-w-sm flex-1 lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={headerSearch}
              onChange={(event) => setHeaderSearch(event.target.value)}
              placeholder="Produkte suchen..."
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(headerSearch.trim() ? `/products?q=${encodeURIComponent(headerSearch.trim())}` : "/products")}
            className="p-2 text-foreground transition-colors hover:text-accent lg:hidden"
            title="Suche"
          >
            <Search className="h-5 w-5" />
          </button>

          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground transition-colors hover:text-accent"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          )}

          <Link href="/wishlist">
            <div className="relative cursor-pointer p-2 text-foreground transition-colors hover:text-accent">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </div>
          </Link>

          <Link href="/cart">
            <div
              data-cart-icon-target="true"
              className={`relative cursor-pointer rounded-full p-2 text-foreground transition-all hover:text-accent ${cartBumping ? "scale-110 bg-accent/12 text-accent shadow-[0_10px_24px_rgba(234,88,12,0.28)]" : ""}`}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          <button
            className="p-2 text-foreground transition-colors hover:text-accent md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="flex flex-col gap-3 border-t border-border bg-card p-4 md:hidden">
          <Link href="/products">
            <div className="cursor-pointer py-2 text-sm font-medium text-foreground transition-colors hover:text-accent">Produkte</div>
          </Link>
          <Link href="/gallery">
            <div className="cursor-pointer py-2 text-sm font-medium text-foreground transition-colors hover:text-accent">Galerie</div>
          </Link>
          <Link href="/faq">
            <div className="cursor-pointer py-2 text-sm font-medium text-foreground transition-colors hover:text-accent">FAQ</div>
          </Link>
          <Link href="/contact">
            <div className="cursor-pointer py-2 text-sm font-medium text-foreground transition-colors hover:text-accent">Kontakt</div>
          </Link>
          <Link href="/wishlist">
            <div className="cursor-pointer py-2 text-sm font-medium text-foreground transition-colors hover:text-accent">Wishlist</div>
          </Link>
        </nav>
      )}
    </header>
  );
}
