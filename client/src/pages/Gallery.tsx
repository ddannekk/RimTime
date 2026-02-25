import { useState, useEffect } from "react";
import { Heart, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface GalleryItem {
  id: number;
  author: string;
  imageUrl: string;
  title: string;
  description?: string;
  likes: number;
  createdAt: Date;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    author: "",
    imageUrl: "",
    title: "",
    description: "",
  });

  const { data: galleryData } = trpc.gallery.getAll.useQuery();
  const uploadMutation = trpc.gallery.upload.useMutation();

  useEffect(() => {
    if (galleryData) {
      setItems(galleryData as GalleryItem[]);
      setLoading(false);
    }
  }, [galleryData]);

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadData.author || !uploadData.imageUrl || !uploadData.title) {
      toast.error("Bitte füllen Sie alle erforderlichen Felder aus");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        author: uploadData.author,
        imageUrl: uploadData.imageUrl,
        title: uploadData.title,
        description: uploadData.description,
      });

      toast.success("Foto erfolgreich hochgeladen!");
      setUploadData({ author: "", imageUrl: "", title: "", description: "" });
      setUploadModalOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Fehler beim Hochladen des Fotos");
    }
  };

  return (
    <div className="w-full">
      <div className="container py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Community Galerie</h1>
            <p className="text-lg text-muted-foreground">
              Teile deine RIMtime Felgenuhr mit der Community
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Foto hochladen
          </button>
        </div>

        {/* Upload Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-foreground mb-4">Foto hochladen</h2>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dein Name *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={uploadData.author}
                    onChange={handleUploadChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Max Mustermann"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bild-URL *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={uploadData.imageUrl}
                    onChange={handleUploadChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Titel *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={uploadData.title}
                    onChange={handleUploadChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Meine RIMtime im Gaming-Setup"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Beschreibung
                  </label>
                  <textarea
                    name="description"
                    value={uploadData.description}
                    onChange={handleUploadChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Erzähle etwas über dein Foto..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Hochladen
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="flex-1 border border-border px-4 py-2 rounded-lg font-semibold hover:bg-muted transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
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
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="card hover:shadow-lg transition-shadow overflow-hidden">
                <div className="w-full h-48 bg-muted rounded mb-4 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">von {item.author}</p>

                {item.description && (
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 fill-accent text-accent" />
                  <span>{item.likes}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-6">
              Noch keine Fotos in der Galerie
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Erstes Foto hochladen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
