import { Link } from "wouter";
import { useLocation } from "wouter";
import { ShoppingCart, Menu, X, Moon, Sun, Heart, Search } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { items: wishlistItems } = useWishlist();

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = headerSearch.trim();
    navigate(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 font-bold text-xl text-accent hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
              RIM
            </div>
            <span className="hidden sm:inline">RIMtime</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors cursor-pointer">
              Produkte
            </div>
          </Link>
          <Link href="/gallery">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors cursor-pointer">
              Galerie
            </div>
          </Link>
          <Link href="/faq">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors cursor-pointer">
              FAQ
            </div>
          </Link>
          <Link href="/contact">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors cursor-pointer">
              Kontakt
            </div>
          </Link>
        </nav>

        {/* Global Search (Desktop) */}
        <form onSubmit={submitSearch} className="hidden lg:block flex-1 max-w-sm mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={headerSearch}
              onChange={(event) => setHeaderSearch(event.target.value)}
              placeholder="Produkte suchen..."
              className="w-full h-10 rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(headerSearch.trim() ? `/products?q=${encodeURIComponent(headerSearch.trim())}` : "/products")}
            className="lg:hidden p-2 text-foreground hover:text-accent transition-colors"
            title="Suche"
          >
            <Search className="w-5 h-5" />
          </button>

          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground hover:text-accent transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          )}

          <Link href="/wishlist">
            <div className="relative p-2 text-foreground hover:text-accent transition-colors cursor-pointer">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </div>
          </Link>

          <Link href="/cart">
            <div className="relative p-2 text-foreground hover:text-accent transition-colors cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-3">
          <Link href="/products">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors py-2 cursor-pointer">
              Produkte
            </div>
          </Link>
          <Link href="/gallery">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors py-2 cursor-pointer">
              Galerie
            </div>
          </Link>
          <Link href="/faq">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors py-2 cursor-pointer">
              FAQ
            </div>
          </Link>
          <Link href="/contact">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors py-2 cursor-pointer">
              Kontakt
            </div>
          </Link>
          <Link href="/wishlist">
            <div className="text-sm font-medium text-foreground hover:text-accent transition-colors py-2 cursor-pointer">
              Wishlist
            </div>
          </Link>
        </nav>
      )}
    </header>
  );
}
