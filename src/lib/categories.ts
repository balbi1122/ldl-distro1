export interface CategoryDef {
  name: string;
  slug: string;
  type: "album" | "tour" | "special";
  color: string;
  year_info: string;
  description: string;
}

export const CATEGORY_DEFINITIONS: CategoryDef[] = [
  // Albums
  {
    name: "Taylor Swift",
    slug: "taylor-swift-album",
    type: "album",
    color: "#2d6a4f",
    year_info: "2006",
    description:
      "Inspired by Taylor's self-titled debut album — country roots, teen heartache, and storytelling magic.",
  },
  {
    name: "Fearless",
    slug: "fearless",
    type: "album",
    color: "#c8a165",
    year_info: "2008",
    description:
      "Inspired by Fearless — gold-spun love songs, dancing in the rain, and the reckless joy of first loves.",
  },
  {
    name: "Speak Now",
    slug: "speak-now",
    type: "album",
    color: "#7b2d8b",
    year_info: "2010",
    description:
      "Inspired by Speak Now — entirely self-written, theatrical, and full of enchanted moments.",
  },
  {
    name: "Red",
    slug: "red",
    type: "album",
    color: "#c0392b",
    year_info: "2012",
    description:
      "Inspired by Red — burning, all-consuming love stories that hurt so good.",
  },
  {
    name: "1989",
    slug: "1989",
    type: "album",
    color: "#5ba4cf",
    year_info: "2014",
    description:
      "Inspired by 1989 — synth-pop dreams, New York nights, and shaking off the past.",
  },
  {
    name: "reputation",
    slug: "reputation",
    type: "album",
    color: "#2c2c2c",
    year_info: "2017",
    description:
      "Inspired by reputation — dark, defiant, and reborn from the ashes of public persona.",
  },
  {
    name: "Lover",
    slug: "lover",
    type: "album",
    color: "#f06292",
    year_info: "2019",
    description:
      "Inspired by Lover — pastel-soft, joyful, and bursting with rainbow love.",
  },
  {
    name: "folklore",
    slug: "folklore",
    type: "album",
    color: "#78909c",
    year_info: "2020",
    description:
      "Inspired by folklore — indie-folk imagination, lost loves, and storytelling from the woods.",
  },
  {
    name: "evermore",
    slug: "evermore",
    type: "album",
    color: "#a0522d",
    year_info: "2020",
    description:
      "Inspired by evermore — the companion sister album, autumn leaves, and bittersweet epiphanies.",
  },
  {
    name: "Midnights",
    slug: "midnights",
    type: "album",
    color: "#1a237e",
    year_info: "2022",
    description:
      "Inspired by Midnights — sleepless introspection, glitter and ghosts at 3am.",
  },
  {
    name: "The Tortured Poets Department",
    slug: "tortured-poets-department",
    type: "album",
    color: "#616161",
    year_info: "2024",
    description:
      "Inspired by TTPD — raw grief, poetic fury, and the ache of loving the wrong person.",
  },
  // Tours
  {
    name: "Taylor Swift Tour",
    slug: "taylor-swift-tour",
    type: "tour",
    color: "#2d6a4f",
    year_info: "2007–2008",
    description: "Inspired by Taylor's debut headline tour.",
  },
  {
    name: "Fearless Tour",
    slug: "fearless-tour",
    type: "tour",
    color: "#c8a165",
    year_info: "2009–2010",
    description:
      "Inspired by the Fearless Tour — sparkles, curls, and fairy-tale magic.",
  },
  {
    name: "Speak Now World Tour",
    slug: "speak-now-tour",
    type: "tour",
    color: "#7b2d8b",
    year_info: "2011–2012",
    description:
      "Inspired by the Speak Now World Tour — purple gowns and enchanted forests.",
  },
  {
    name: "The Red Tour",
    slug: "red-tour",
    type: "tour",
    color: "#c0392b",
    year_info: "2013–2014",
    description:
      "Inspired by The Red Tour — stadium spectacle and all-the-feels emotion.",
  },
  {
    name: "The 1989 World Tour",
    slug: "1989-tour",
    type: "tour",
    color: "#5ba4cf",
    year_info: "2015",
    description:
      "Inspired by The 1989 World Tour — pop perfection and surprise guest after surprise guest.",
  },
  {
    name: "reputation Stadium Tour",
    slug: "reputation-tour",
    type: "tour",
    color: "#2c2c2c",
    year_info: "2018",
    description:
      "Inspired by the reputation Stadium Tour — serpents, screens, and the phoenix rising.",
  },
  {
    name: "The Eras Tour",
    slug: "eras-tour",
    type: "tour",
    color: "#d4af37",
    year_info: "2023–2024",
    description:
      "Inspired by The Eras Tour — a journey through every chapter of Taylor's musical history.",
  },
  // Special
  {
    name: "The Late Show Story",
    slug: "late-show-story",
    type: "special",
    color: "#6c3483",
    year_info: "Special",
    description:
      "Content inspired by the story concept Taylor Swift described on The Late Show with Stephen Colbert — a tale she outlined about a young woman finding her voice. Share your imaginings of how this story could unfold.",
  },
];
