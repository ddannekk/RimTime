import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { X, ArrowLeft } from "lucide-react";

interface CompareProduct {
  id: number;
  name: string;
  basePrice: number;
  image: string;
  size: string;
  style: string;
  upvotes: number;
  description: string;
}

export default function Compare() {
  const [selectedProducts, setSelectedProducts] = useState<CompareProduct[]>([]);
  const [allProducts, setAllProducts] = useState<CompareProduct[]>([]);
  const { data: productsData } = trpc.products.getAll.useQuery();

  useEffect(() => {
    if (productsData) {
      setAllProducts(productsData as CompareProduct[]);
    }
  }, [productsData]);

  const handleAddProduct = (product: CompareProduct) => {
    if (selectedProducts.length < 3 && !selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const availableProducts = allProducts.filter((p) => !selectedProducts.find((sp) => sp.id === p.id));

  return (
    <div className="container py-12">
      <Link href="/products" className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity mb-4">
        <ArrowLeft className="w-5 h-5" />
        Zurück zu Produkten
      </Link>

      <h1 className="text-4xl font-bold text-foreground mb-8">Produkte vergleichen</h1>

      {selectedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">Wählen Sie bis zu 3 Produkte zum Vergleichen</p>
        </div>
      ) : (
        <div className="mb-12 overflow-x-auto">
          <table className="w-full border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Eigenschaft</th>
                {selectedProducts.map((product) => (
                  <th key={product.id} className="px-4 py-3 text-center font-semibold text-foreground min-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                      <p className="font-semibold">{product.name}</p>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 font-semibold text-foreground">Preis</td>
                {selectedProducts.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center text-accent font-bold">
                    €{(product.basePrice / 100).toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 font-semibold text-foreground">Größe</td>
                {selectedProducts.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center text-foreground">
                    {product.size}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 font-semibold text-foreground">Stil</td>
                {selectedProducts.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center text-foreground">
                    {product.style}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 font-semibold text-foreground">Bewertungen</td>
                {selectedProducts.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center text-foreground">
                    {product.upvotes} ⬆️
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <h2 className="text-2xl font-bold text-foreground mb-6">Produkte hinzufügen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableProducts.map((product) => (
            <div key={product.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-3" />
              <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{product.size} • {product.style}</p>
              <p className="text-lg font-bold text-accent mb-3">€{(product.basePrice / 100).toFixed(2)}</p>
              <button
                onClick={() => handleAddProduct(product)}
                disabled={selectedProducts.length >= 3}
                className="w-full px-3 py-2 bg-accent text-accent-foreground rounded font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedProducts.length >= 3 ? "Max. erreicht" : "Vergleichen"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
