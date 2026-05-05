import { Link } from "wouter";
import { getMerchantAddressLine, merchantProfile } from "@/lib/legal";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg text-accent mb-4">RIMtime</h3>
            <p className="text-sm text-muted-foreground">
              Die Felgenuhr für Auto-Fans. Hochwertige Wanduhren im Felgen-Design.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-accent transition-colors">
                  Alle Produkte
                </Link>
              </li>
              <li>
                <Link href="/products?size=30cm" className="text-muted-foreground hover:text-accent transition-colors">
                  30cm Uhren
                </Link>
              </li>
              <li>
                <Link href="/products?size=45cm" className="text-muted-foreground hover:text-accent transition-colors">
                  45cm Uhren
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-accent transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>E-Mail: {merchantProfile.email}</li>
              <li>Telefon: {merchantProfile.phone}</li>
              <li>Adresse: {getMerchantAddressLine()}</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 RIMtime. Alle Rechte vorbehalten.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Datenschutz
              </Link>
              <Link href="/imprint" className="hover:text-accent transition-colors">
                Impressum
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
