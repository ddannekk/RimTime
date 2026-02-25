import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

interface Product {
  id?: number;
  name: string;
  basePrice: number;
  image: string;
  size: string;
  style: string;
  description: string;
  stock: number;
}

export default function AdminProductEditor() {
  const [, params] = useRoute("/admin-dashboard/product/:id");
  const [, navigate] = useLocation();
  const productId = params?.id;
  const isEditing = productId && productId !== "new";

  const [formData, setFormData] = useState<Product>({
    name: "",
    basePrice: 0,
    image: "",
    size: "30cm",
    style: "Motorsport",
    description: "",
    stock: 10,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Load all products from tRPC
  const { data: productsData } = trpc.products.getAll.useQuery();

  useEffect(() => {
    if (isEditing && productId && productsData) {
      // Find the product in the tRPC data
      const product = (productsData as any[]).find((p: any) => p.id === parseInt(productId));
      if (product) {
        setFormData({
          id: product.id,
          name: product.name,
          basePrice: product.basePrice,
          image: product.image,
          size: product.size,
          style: product.style,
          description: product.description || "",
          stock: product.stock || 10,
        });
        setImagePreview(product.image || "");
      } else {
        toast.error("Produkt nicht gefunden!");
      }
    }
  }, [isEditing, productId, productsData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "basePrice" || name === "stock" ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      try {
        // Save to localStorage for demo purposes
        let products = [];
        const stored = localStorage.getItem("products");
        if (stored) {
          products = JSON.parse(stored);
        }

        if (isEditing && productId) {
          // Update existing product
          const index = products.findIndex((p: any) => p.id === parseInt(productId));
          if (index !== -1) {
            products[index] = { ...formData, id: parseInt(productId) };
            toast.success("Produkt aktualisiert!");
          }
        } else {
          // Add new product
          const newId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
          products.push({ ...formData, id: newId });
          toast.success("Produkt hinzugefügt!");
        }

        localStorage.setItem("products", JSON.stringify(products));
        setLoading(false);

        // Navigate back to admin dashboard
        navigate("/admin-dashboard");
      } catch (error) {
        console.error("Error saving product:", error);
        toast.error("Fehler beim Speichern!");
        setLoading(false);
      }
    }, 1000);
  };

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurück zum Admin Panel
        </button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            {isEditing ? "Produkt bearbeiten" : "Neues Produkt erstellen"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border border-border">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Produktname
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="z.B. RIMtime Motorsport 30cm"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Beschreibung
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Produktbeschreibung..."
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Preis (€)
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  placeholder="99.99"
                  step="0.01"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Lagerbestand
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="10"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
            </div>

            {/* Size & Style */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Größe
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="30cm">30cm</option>
                  <option value="45cm">45cm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Style
                </label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Motorsport">Motorsport</option>
                  <option value="Classic">Classic</option>
                  <option value="Black/Chrome">Black/Chrome</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Produktbild
              </label>
              
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-xs h-64 object-cover rounded-lg border border-border"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                    <Upload className="w-5 h-5" />
                    <span>Datei hochladen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Oder URL eingeben..."
                    onBlur={(e) => e.target.value && handleImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Speichern..." : isEditing ? "Änderungen speichern" : "Produkt erstellen"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
