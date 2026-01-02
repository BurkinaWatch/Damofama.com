import { db } from "./db";
import { press, videos } from "../shared/schema";

async function main() {
  console.log("Starting seed process...");

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
    },
    {
      title: "IN-OUT Dance and World Arts Festival : le public émerveillé à la clôture",
      source: "Infos Culture du Faso",
      url: "https://www.infosculturedufaso.net/in-out-dance-and-world-arts-festival-le-public-emerveille-a-la-cloture-de-la-11%E1%B5%89-edition/",
      snippet: "Damo Fama s'est produit lors de la clôture du IN-OUT Dance and World Arts Festival 2024 à Bobo-Dioulasso, plongeant le public dans une ambiance festive.",
      date: new Date("2024-12-23"),
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
    },
    {
      title: "Sissan (Clip Officiel)",
      youtubeUrl: "https://www.youtube.com/watch?v=P2f8M_u2W9o",
      thumbnailUrl: "https://img.youtube.com/vi/P2f8M_u2W9o/hqdefault.jpg",
      category: "music_video",
      isFeatured: false,
      hidden: false
    },
    {
      title: "Damo Fama - Live IN-OUT Festival 2024",
      youtubeUrl: "https://www.youtube.com/watch?v=Live_InOut_2024",
      thumbnailUrl: "https://img.youtube.com/vi/Live_InOut_2024/hqdefault.jpg",
      category: "live",
      isFeatured: false,
      hidden: false
    },
    {
      title: "Damo Fama - Performance au MASA Abidjan",
      youtubeUrl: "https://www.youtube.com/watch?v=MASA_Abidjan_2024",
      thumbnailUrl: "https://img.youtube.com/vi/MASA_Abidjan_2024/hqdefault.jpg",
      category: "live",
      isFeatured: false,
      hidden: false
    },
    {
      title: "Damo Fama - Interview leFaso.net",
      youtubeUrl: "https://www.youtube.com/watch?v=Interview_leFaso",
      thumbnailUrl: "https://img.youtube.com/vi/Interview_leFaso/hqdefault.jpg",
      category: "interview",
      isFeatured: false,
      hidden: false
    }
  ];

  console.log("Cleaning existing data...");
  // Clear existing to avoid duplicates if re-run
  await db.delete(press);
  await db.delete(videos);

  console.log("Inserting press articles...");
  for (const article of pressArticles) {
    await db.insert(press).values(article);
  }

  console.log("Inserting videos...");
  for (const video of videoData) {
    await db.insert(videos).values(video);
  }

  console.log("Seed completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
