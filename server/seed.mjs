import { drizzle } from "drizzle-orm/mysql2";
import { products, reviews } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const sampleProducts = [
  {
    name: "RIMtime Motorsport 30cm",
    description:
      "Aggressive Motorsport-Optik mit dynamischen Speichen. Perfekt für Rennfans und Tuning-Enthusiasten.",
    basePrice: 3990,
    image: "/images/rimtime/motorsport-clock.png",
    size: "30cm",
    style: "Motorsport",
    upvotes: 145,
    downvotes: 5,
    isBestseller: 1,
  },
  {
    name: "RIMtime Classic 45cm",
    description:
      "Zeitlose Eleganz im großen Format. Die 45cm Variante wirkt besonders stark an großen Wänden.",
    basePrice: 5990,
    image: "/images/rimtime/classic-clock.png",
    size: "45cm",
    style: "Classic",
    upvotes: 128,
    downvotes: 3,
    isBestseller: 1,
  },
  {
    name: "RIMtime Black/Chrome 30cm",
    description:
      "Modernes Design mit Chrom-Akzenten. Passt perfekt zu Gaming-Setups und modernen Räumen.",
    basePrice: 4490,
    image: "/images/rimtime/black-chrome-clock.png",
    size: "30cm",
    style: "Black/Chrome",
    upvotes: 98,
    downvotes: 2,
    isBestseller: 1,
  },
  {
    name: "RIMtime Motorsport 45cm",
    description:
      "Die große Motorsport-Variante. Spektakuläre Wanddeko für echte Auto-Fans mit großzügigen Platzverhältnissen.",
    basePrice: 6990,
    image: "/images/rimtime/motorsport-clock.png",
    size: "45cm",
    style: "Motorsport",
    upvotes: 112,
    downvotes: 4,
    isBestseller: 0,
  },
  {
    name: "RIMtime Classic 30cm",
    description:
      "Klassisches Design im kompakten Format. Ideal für Schreibtische und kleinere Räume.",
    basePrice: 3490,
    image: "/images/rimtime/classic-clock.png",
    size: "30cm",
    style: "Classic",
    upvotes: 87,
    downvotes: 1,
    isBestseller: 0,
  },
  {
    name: "RIMtime Black/Chrome 45cm",
    description:
      "Premium-Variante mit Chrom-Details. Die richtige Wahl für Gaming-Zimmer und moderne Büros.",
    basePrice: 6490,
    image: "/images/rimtime/black-chrome-clock.png",
    size: "45cm",
    style: "Black/Chrome",
    upvotes: 105,
    downvotes: 2,
    isBestseller: 0,
  },
];

const sampleReviews = [
  {
    productId: 1,
    rating: 5,
    comment:
      "Absolut begeistert! Die Uhr sieht noch besser aus als auf den Fotos. Perfekt für mein Gaming-Setup!",
    author: "Max K.",
  },
  {
    productId: 1,
    rating: 5,
    comment:
      "Hochwertige Verarbeitung und super schneller Versand. Das beste Geschenk für meinen Bruder!",
    author: "Sarah M.",
  },
  {
    productId: 2,
    rating: 5,
    comment:
      "Läuft leise, sieht toll aus und die Qualität ist wirklich beeindruckend. Sehr empfehlenswert!",
    author: "Thomas L.",
  },
  {
    productId: 2,
    rating: 4,
    comment:
      "Sehr schöne Uhr, nur die Montage war etwas knifflig. Aber das Ergebnis ist fantastisch.",
    author: "Julia W.",
  },
  {
    productId: 3,
    rating: 5,
    comment:
      "Genau das, was ich gesucht habe! Moderne Optik und perfekt für meinen Arbeitsplatz.",
    author: "Andreas B.",
  },
];

async function seed() {
  try {
    console.log("Starte Seeding...");

    // Insert products
    console.log("Fuege Produkte ein...");
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
    }
    console.log(`${sampleProducts.length} Produkte eingefuegt`);

    // Insert reviews
    console.log("Fuege Bewertungen ein...");
    for (const review of sampleReviews) {
      await db.insert(reviews).values(review);
    }
    console.log(`${sampleReviews.length} Bewertungen eingefuegt`);

    console.log("Seeding erfolgreich abgeschlossen!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding-Fehler:", error);
    process.exit(1);
  }
}

seed();
