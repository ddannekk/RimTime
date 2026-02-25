import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Privacy from "./pages/Privacy";
import Imprint from "./pages/Imprint";
import Terms from "./pages/Terms";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Contact from "./pages/Contact";
import AdminProductEditor from "./pages/AdminProductEditor";
import { WishlistProvider } from "./contexts/WishlistContext";
import StatsCounter from "./components/StatsCounter";

function RouterContent() {
  const { getTotalItems } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Header cartCount={getTotalItems()} />
      <main className="flex-1">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/products"} component={Products} />
          <Route path={"/products/:id"} component={ProductDetail} />
          <Route path={"/cart"} component={Cart} />
          <Route path={"/checkout"} component={Checkout} />
          <Route path={"/order-confirmation/:orderNumber"} component={OrderConfirmation} />
          <Route path={"/wishlist"} component={Wishlist} />
          <Route path={"/compare"} component={Compare} />
          <Route path={"/contact"} component={Contact} />
          <Route path={"/gallery"} component={Gallery} />
          <Route path={"/faq"} component={FAQ} />
          <Route path={"/admin"} component={Admin} />
          <Route path={"/admin-dashboard/product/:id"} component={AdminProductEditor} />
          <Route path={"/admin-dashboard"} component={AdminDashboard} />
          <Route path={"/privacy"} component={Privacy} />
          <Route path={"/imprint"} component={Imprint} />
          <Route path={"/terms"} component={Terms} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <CartProvider>
            <WishlistProvider>
              <RouterContent />
            </WishlistProvider>
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;