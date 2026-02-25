import { MapView } from "@/components/Map";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [messages, setMessages] = useState<Array<{name: string; email: string; subject: string; message: string; timestamp: string}>>([]);
  const [showMessages, setShowMessages] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('contactMessages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMessage = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      timestamp: new Date().toLocaleString('de-DE'),
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    // Save to localStorage
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
    (e.target as HTMLFormElement).reset();
    alert('Nachricht gesendet! Sie können sie hier ansehen oder im Admin-Panel.');
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-2">Kontakt</h1>
      <p className="text-muted-foreground mb-12">Besuchen Sie uns oder kontaktieren Sie unser Team</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <div className="card mb-6">
            <div className="flex gap-4 mb-6">
              <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                <p className="text-muted-foreground">
                  Walter-Eucken-Gymnasium<br />
                  Freiburg, Deutschland
                </p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Telefon</h3>
                <p className="text-muted-foreground">+49 (0) 761 123-4567</p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground">info@rimtime.de</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Öffnungszeiten</h3>
                <p className="text-muted-foreground">
                  Mo - Fr: 09:00 - 17:00<br />
                  Sa: 10:00 - 14:00<br />
                  So: Geschlossen
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="card overflow-hidden h-96">
          <MapView className="w-full h-full"
            onMapReady={(mapData: any) => {
              const map = mapData.map || mapData;
              const google = mapData.google || window.google;
              
              // Center map on Walter-Eucken-Gymnasium, Freiburg (correct coordinates)
              const location = { lat: 48.0197, lng: 7.8409 };
              map.setCenter(location);
              map.setZoom(16);

              // Add marker
              if (google && google.maps) {
                new google.maps.Marker({
                  position: location,
                  map: map,
                  title: "Walter-Eucken-Gymnasium",
                });
              }
            }}
          />
        </div>
      </div>

      {/* Contact Form & Messages */}
      <div className="card mt-12 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Nachricht senden</h2>
          {messages.length > 0 && (
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="text-sm px-3 py-1 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
            >
              Nachrichten ({messages.length})
            </button>
          )}
        </div>

        {showMessages && messages.length > 0 && (
          <div className="mb-6 p-4 bg-muted rounded-lg max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-foreground mb-4">Eingegangene Nachrichten:</h3>
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-4 p-3 bg-background rounded border border-border">
                <p className="text-sm font-semibold text-foreground">{msg.name} ({msg.email})</p>
                <p className="text-xs text-muted-foreground mb-2">{msg.timestamp}</p>
                <p className="text-sm font-medium text-accent mb-1">Betreff: {msg.subject}</p>
                <p className="text-sm text-foreground">{msg.message}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Ihr Name"
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Ihre Email"
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Betreff</label>
            <input
              type="text"
              name="subject"
              placeholder="Betreff"
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nachricht</label>
            <textarea
              placeholder="Ihre Nachricht"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            Nachricht senden
          </button>
        </form>
      </div>
    </div>
  );
}
