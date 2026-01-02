import { db } from "./db";
import { press, videos, photos } from "../shared/schema";

async function main() {
  console.log("Starting full seed process...");

  const pressArticles = [
    {
      title: "Damo Fama : 2024 fut une année de révélations, et 2025 sera encore plus grande !",
      source: "Infos Culture du Faso",
      url: "https://www.infosculturedufaso.net/damo-fama-2024-fut-une-annee-de-revelations-et-2025-sera-encore-plus-grande/",
      snippet: "Damo Fama qualifie 2024 comme une année de révélations marquée par le clip à succès Tounganata, sa participation à la pièce Héritage au CITO et ses prix aux ZECA d'OR 2024.",
      date: new Date("2025-01-14"),
      hidden: false
    },
    {
      title: "Musique au Burkina : « Je souhaite collaborer avec Salif Keïta », lance Damo Fama",
      source: "leFaso.net",
      url: "https://lefaso.net/spip.php?article115124",
      snippet: "Dans cette interview, Damo Fama partage son parcours depuis le groupe Kilé en 2010 jusqu'à sa carrière solo lancée en 2021, exprimant son souhait de collaborer avec la légende Salif Keïta.",
      date: new Date("2022-04-01"),
      hidden: false
    },
    {
      title: "MUSIQUE : Damo Fama lance sa carrière solo à travers un EP intitulé « Sissan »",
      source: "Infos Culture du Faso",
      url: "https://www.infosculturedufaso.net/musique-damo-fama-lance-sa-carriere-solo-a-travers-un-ep-intitule-sissan/",
      snippet: "Le 25 février 2022, Damo Fama a officiellement lancé sa carrière solo avec l'EP Sissan (Maintenant en Dioula), un hommage spirituel à ses parents.",
      date: new Date("2022-03-16"),
      hidden: false
    }
  ];

  const videoData = [
    {
      title: "TOUNGANATA (Clip Officiel)",
      youtubeUrl: "https://www.youtube.com/watch?v=A_0uXmK8IuE",
      thumbnailUrl: "https://img.youtube.com/vi/A_0uXmK8IuE/hqdefault.jpg",
      category: "music_video",
      isFeatured: true,
      hidden: false
    }
  ];

  const photoData = [
    { title: "Damo Fama en concert - Performance live", imageUrl: "/attached_assets/optimized/LS2C6649_1766230961643.webp", category: "concert" },
    { title: "Damo Fama - Portrait officiel", imageUrl: "/attached_assets/optimized/DAMO_FAMA-3_1766384989330.webp", category: "portrait" },
    { title: "Damo Fama sur scène", imageUrl: "/attached_assets/optimized/LS2C6650_1766230961643.webp", category: "concert" },
    { title: "Damo Fama avec sa guitare", imageUrl: "/attached_assets/optimized/LS2C6651_1766230961643.webp", category: "portrait" }
  ];

  console.log("Cleaning existing data...");
  await db.delete(press);
  await db.delete(videos);
  await db.delete(photos);

  console.log("Inserting press...");
  for (const item of pressArticles) await db.insert(press).values(item);
  
  console.log("Inserting videos...");
  for (const item of videoData) await db.insert(videos).values(item);

  console.log("Inserting photos...");
  for (const item of photoData) await db.insert(photos).values(item);

  console.log("Seed completed!");
  process.exit(0);
}

main().catch(console.error);
