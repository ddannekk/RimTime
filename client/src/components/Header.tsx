import { Link } from "wouter";
import { ShoppingCart, Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

interface HeaderProps {
  cartCount: number;
}

const notifications = [
  "🛒 Max hat gerade RIMtime Motorsport gekauft",
  "❤️ Sarah hat dieses Produkt zu Favoriten hinzugefügt",
  "⭐ Thomas hat eine 5-Stern Bewertung hinterlassen",
  "🛍️ Lisa hat 2x RIMtime Classic bestellt",
  "👀 David schaut sich gerade die Produkte an",
  "💬 Anna hat einen Kommentar hinterlassen",
  "🎉 Michael hat einen Gutschein gewonnen",
  "🔥 Julia hat ein Produkt in den Warenkorb gelegt",
];

export default function Header({ cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Simulate live notifications (only on first load, rarely)
  useEffect(() => {
    // Show only 1-2 notifications on page load
    const showInitialNotifications = () => {
      setTimeout(() => {
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        toast.info(randomNotification, {
          duration: 4000,
          position: "top-right",
        });
      }, 3000);
    };

    showInitialNotifications();
  }, []);

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

        {/* Cart, Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-4">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground hover:text-accent transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          )}

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
        </nav>
      )}
    </header>
  );
}
