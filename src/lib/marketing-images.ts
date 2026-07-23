// Marketing "master" imagery. These are public-domain paintings drawn from the
// same /public/paintings set the readers/educators hero sections use, so the
// look stays consistent across the site. Each carries an `attribution` caption
// ("Artist, Title, Year") rendered in the hero style beneath/over the image.
export const marketingMasterImages = {
  faq: {
    src: "/paintings/astronomer.jpg",
    alt: "The Astronomer by Johannes Vermeer, 1668 — a scholar at work in a warmly lit study.",
    attribution: "Johannes Vermeer, The Astronomer, 1668",
    width: 900,
    height: 1020,
  },
  pricing: {
    src: "/paintings/among-sierra-nevada.jpg",
    alt: "Among the Sierra Nevada, California by Albert Bierstadt, 1868 — a luminous panoramic landscape.",
    attribution: "Albert Bierstadt, Among the Sierra Nevada, California, 1868",
    width: 1916,
    height: 1150,
  },
} as const
