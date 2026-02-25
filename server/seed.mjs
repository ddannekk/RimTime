import { drizzle } from "drizzle-orm/mysql2";
import { products, reviews } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const sampleProducts = [
  {
    name: "RIMtime Motorsport 30cm",
    description:
      "Aggressive Motorsport-Optik mit dynamischen Speichen. Perfekt für Rennfans und Tuning-Enthusiasten.",
    basePrice: 3990,
    image:
      "https://private-us-east-1.manuscdn.com/sessionFile/IcIHVxFJ0hE6S3lPjRsrxS/sandbox/5eIpQ3FDb1EyHzfVZdWmWr-img-1_1771945624000_na1fn_cmltdGltZS1tb3RvcnNwb3J0LTMwY20.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWNJSFZ4RkowaEU2UzNsUGpSc3J4Uy9zYW5kYm94LzVlSXBRM0ZEYjFFeUh6ZlZaZFdtV3ItaW1nLTFfMTc3MTk0NTYyNDAwMF9uYTFmbl9jbWx0ZEdsdFpTMXRiM1J2Y25Od2IzSjBMVE13WTIwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OWJIdrebow40fRgMm78-ctkZ~V6~J-817zY~2yprmejrFeTiAqajf5lSOMkzUv0fBtJCXSxfAM-bXa2I~i-sHftOOpO3eelhDxAwtL4nEGOAQ5l2HuBpfvKwLmBCh3rGRKyCXS1nlCQunJpkSblo0o4jbsXAJRm-SzynoOvdk6GklnanvSSb~XPXnAKroaVMHkJb94Uh-qjMKJagtEmyc88uOTIW1Pq2lZy-iCnzJBWy-sgdsa0NV7B6Hw-qFZ-ExnzO05PPSbjQRSWwutoMchxn4hL~uXAflI4s0RymFvsXCaIaceII7d~XXwmLMbohPvE5a2OEyhUewfjU9~wr7A__",
    size: "30cm",
    style: "Motorsport",
    upvotes: 145,
    downvotes: 5,
    isBestseller: 1,
  },
  {
    name: "RIMtime Classic 45cm",
    description:
      "Zeitlose Eleganz im großen Format. Die 45cm Variante ist ein echtes Statement-Piece für große Wände.",
    basePrice: 5990,
    image:
      "https://private-us-east-1.manuscdn.com/sessionFile/IcIHVxFJ0hE6S3lPjRsrxS/sandbox/5eIpQ3FDb1EyHzfVZdWmWr-img-4_1771945628000_na1fn_cmltdGltZS1jbGFzc2ljLTQ1Y20.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWNJSFZ4RkowaEU2UzNsUGpSc3J4Uy9zYW5kYm94LzVlSXBRM0ZEYjFFeUh6ZlZaZFdtV3ItaW1nLTRfMTc3MTk0NTYyODAwMF9uYTFmbl9jbWx0ZEdsdFpTMWpiR0Z6YzJsakxUUTFZMjAucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=SdYF~7xECKJfe2dEpcyaQup5mRBvHtg9WzFVQz3JHbPmUIvkr3HJdE5mQZN5sAXIhsbFv8R3rd22knGRw2YjsPr79xV6C1Wp7HxuCt9zRaSp~GuoDTY1rmmRmiYs7fkn9inKp4Gp8sIAO1yMPzom2pS10OW2qr~U2ulbf90XJARfmOLYUPEC0WNjAs1h~dtSDU7s~6qOYK-5LZd9HzcxOwkcmeQno3dhwt9egKUx0CyA0yE-xzI58SBfLxeCEp3UNLH7Za-bqgqnYj9bsUcS4rZ~Kz9MkrlxOau0GvMNdRWqtqJlcqCVotIrD9EYt6z~ZmkmixVvQvAjVpj1sNutNg__",
    size: "45cm",
    style: "Classic",
    upvotes: 128,
    downvotes: 3,
    isBestseller: 1,
  },
  {
    name: "RIMtime Black/Chrome 30cm",
    description:
      "Modernes Design mit Chrom-Akzenten. Passt perfekt zu Gaming-Setups und modernen Interiors.",
    basePrice: 4490,
    image:
      "https://private-us-east-1.manuscdn.com/sessionFile/IcIHVxFJ0hE6S3lPjRsrxS/sandbox/5eIpQ3FDb1EyHzfVZdWmWr-img-5_1771945624000_na1fn_cmltdGltZS1ibGFja2Nocm9tZS0zMGNt.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWNJSFZ4RkowaEU2UzNsUGpSc3J4Uy9zYW5kYm94LzVlSXBRM0ZEYjFFeUh6ZlZaZFdtV3ItaW1nLTVfMTc3MTk0NTYyNDAwMF9uYTFmbl9jbWx0ZEdsdFpTMWliR0ZqYTJOb2NtOXRaUzB6TUdOdC5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rye5YXZZELpMjFVIaRwXSeebXWYA~9iIU39zqIVBu4wvjytjNu~hkKOBoNvHB1~SN3KcmAQDBRlByULbK96J8ZLGfqGKmxLzZoULoitqoG~hJ~rCwfehRAP4zA1bYIy1hjFAEUorcEhuXacTXzfuzH7s55sG4S4kCbLLLapXQfcLor3BTKVMLs9JzI4Wb~B4Cw6X9C2go6hcc1HDsPxnJxgCHy9~mrZejPTGsViGHN-iKNve3pBHawpDAtH6e7cKoHPyIk~U9jQhHVTesZtQ5lDsvM4bdrQ3R8vzsghqdrUu63typN8O~dyEQx7PFvWBdAKGp6Aggi3HPoTq~b1mvQ__",
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
    image:
      "https://private-us-east-1.manuscdn.com/sessionFile/IcIHVxFJ0hE6S3lPjRsrxS/sandbox/5eIpQ3FDb1EyHzfVZdWmWr-img-2_1771945627000_na1fn_cmltdGltZS1tb3RvcnNwb3J0LTQ1Y20.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWNJSFZ4RkowaEU2UzNsUGpSc3J4Uy9zYW5kYm94LzVlSXBRM0ZEYjFFeUh6ZlZaZFdtV3ItaW1nLTJfMTc3MTk0NTYyNzAwMF9uYTFmbl9jbWx0ZEdsdFpTMXRiM1J2Y25Od2IzSjBMVFExWTIwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=k8qhGXriMl4FCbBkIo9mrqWP-Y3MQSUaCLKTQtKOeNlUdUuPXoMPosaDvm288ms29KSPEYlcWlvgmV2xqEUO6uYyOB3OkiQz~G7tEPhkJXHSZBFtu-foExtI58js27YUIg7BC8JhrILWFZIRjoONPtVRo7qtNdtaEaiQvG5Zve2CoP~pbAk8OmdCrkRGq2-PInndewDSaMEMslO9CKa5s~FIptHGPjWdccGstvTLjYJGqmJEh97077lY74LIquBK2PGcaSVJz7IwoXzlTUDKCvk81aHxc95J2rhekTOLguXh~b8IRtinspkb5YFFKvjIzia-O9uxI2aMM1vlrA2sBw__",
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
    image:
      "https://private-us-east-1.manuscdn.com/sessionFile/IcIHVxFJ0hE6S3lPjRsrxS/sandbox/5eIpQ3FDb1EyHzfVZdWmWr-img-3_1771945626000_na1fn_cmltdGltZS1jbGFzc2ljLTMwY20.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWNJSFZ4RkowaEU2UzNsUGpSc3J4Uy9zYW5kYm94LzVlSXBRM0ZEYjFFeUh6ZlZaZFdtV3ItaW1nLTNfMTc3MTk0NTYyNjAwMF9uYTFmbl9jbWx0ZEdsdFpTMWpiR0Z6YzJsakxUTXdZMjAucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=vv7ri~QjXerUXImbNk6QFU9xRLNcd8UhRtGFEOlGXsj3W~d4KlgnwloNgD1N33~luJj74sQI9fNpQWRgWMdCP7oyKdA-txGRbdQwVVI1ebsKeSnp82~bwurju7bk4JP3mxjbUhdmHjBqtXfFletMPzl-zUWFnn7gEk09CR~MeWY91HhYabLF8~5ctqjpgfKD0avmSRWX2PGvxj407SF794yrpW0eUb2lU0LbAgKxMtrKHGXHeHf~JMBEOZqmBlLy7Iq4ihSUl3Oz3VXyuMmERg6p7R5RqsOmNb7SOiA-UW7RM4mdTMJHLMeotR8JvqORM~qsfVYT5QUDOk~SSqarwA__",
    size: "30cm",
    style: "Classic",
    upvotes: 87,
    downvotes: 1,
    isBestseller: 0,
  },
  {
    name: "RIMtime Black/Chrome 45cm",
    description:
      "Premium-Variante mit Chrom-Details. Die perfekte Wahl für Gaming-Rooms und moderne Büros.",
    basePrice: 6490,
    image:
      "https://private-us-east-1.manuscdn.com/sessionFile/IcIHVxFJ0hE6S3lPjRsrxS/sandbox/96h5vVJPWqRtP3vGiq0O6L-img-1_1771945652000_na1fn_cmltdGltZS1ibGFja2Nocm9tZS00NWNt.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWNJSFZ4RkowaEU2UzNsUGpSc3J4Uy9zYW5kYm94Lzk2aDV2VkpQV3FSdFAzdkdpcTBPNkwtaW1nLTFfMTc3MTk0NTY1MjAwMF9uYTFmbl9jbWx0ZEdsdFpTMWliR0ZqYTJOb2NtOXRaUzAwTldOdC5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=UsQalP503OQ08GRCVC5mnmyDWj~GxNQy~NbiuT4HrV~0TAIAkgfw-oKzRdTOxg83NkRSMs14tTMei0Dt5InIBVwbx9A4Izz~wTW5hHYkoWGzkrJrwfIYlW8pe3Z0JxZTJaA~3yp01rT0wiRDoghF5vafVwG9m50KoZNgY9w3ko5NEgnHUwTkDeyC0el5YbqEnbdKj8Y0AtO1Eqr0IU519yVWrW9rH0OkYIivk70tHJ1OSEG3NozC2AIkvJowLGfzy3BT0FfXjBZfCnxr8ySK3n~w4GjE19TGHVe2OV~vVeJDu1UCAM8ZNq6HP5jB5KrPXZ95A3GGJ-b7of3K-AxAgw__",
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
    console.log("🌱 Starte Seeding...");

    // Insert products
    console.log("📦 Füge Produkte ein...");
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
    }
    console.log(`✅ ${sampleProducts.length} Produkte eingefügt`);

    // Insert reviews
    console.log("⭐ Füge Bewertungen ein...");
    for (const review of sampleReviews) {
      await db.insert(reviews).values(review);
    }
    console.log(`✅ ${sampleReviews.length} Bewertungen eingefügt`);

    console.log("🎉 Seeding erfolgreich abgeschlossen!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding-Fehler:", error);
    process.exit(1);
  }
}

seed();
