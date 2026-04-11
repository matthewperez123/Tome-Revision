#!/usr/bin/env node
/**
 * Add remaining paintings from the user's master list that aren't yet in the manifest.
 * Looks up correct Wikimedia URLs via their API.
 *
 * Run: node scripts/add-remaining-paintings.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, "..", "public/paintings/manifest.json");
const UA = "TomeApp/1.0 (https://tome.app; contact@tome.app)";

async function getThumbUrl(filename, width = 1280) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json&formatversion=2`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const data = await r.json();
  const page = data.query.pages[0];
  if (page.missing) return null;
  return page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url || null;
}

async function searchAndGetUrl(query, width = 1280) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json&formatversion=2`;
  const r = await fetch(searchUrl, { headers: { "User-Agent": UA } });
  const data = await r.json();
  const results = data.query?.search || [];
  for (const result of results) {
    const filename = result.title.replace("File:", "");
    // Skip SVGs, PDFs, tiny thumbnails
    if (/\.(svg|pdf|tif)$/i.test(filename)) continue;
    const thumbUrl = await getThumbUrl(filename, width);
    if (thumbUrl) return thumbUrl;
  }
  return null;
}

// All remaining paintings to add
const newPaintings = [
  // ─── Missing Northern Renaissance ────────────────────────────────────
  { id: "knight-death-and-devil", title: "Knight, Death and the Devil", artist: "Albrecht Durer", year: "1513", tradition: "northern-renaissance", category: "classical-renaissance", mood: "contemplative", focalPoint: "center", themes: ["mortality", "faith", "courage"], pairedBooks: ["meditations"], dominantColor: "#5A5A48", aspectRatio: 0.77, wikiSearch: "Knight Death Devil Durer engraving", institution: "Multiple collections", license: "PD-Art" },
  { id: "four-horsemen-durer", title: "The Four Horsemen of the Apocalypse", artist: "Albrecht Durer", year: "1498", tradition: "northern-renaissance", category: "classical-renaissance", mood: "dramatic", focalPoint: "center", themes: ["apocalypse", "death", "judgment"], pairedBooks: ["paradise-lost"], dominantColor: "#6A6A58", aspectRatio: 0.72, wikiSearch: "Four Horsemen Apocalypse Durer", institution: "Multiple collections", license: "PD-Art" },
  { id: "temptation-st-anthony-bosch", title: "The Temptation of St. Anthony", artist: "Hieronymus Bosch", year: "c.1501", tradition: "northern-renaissance", category: "classical-renaissance", mood: "sublime", focalPoint: "center", themes: ["temptation", "demons", "faith"], pairedBooks: ["paradise-lost"], dominantColor: "#4A4A30", aspectRatio: 1.72, wikiSearch: "Temptation Saint Anthony Bosch triptych", institution: "Museu Nacional de Arte Antiga", license: "PD-Art" },
  { id: "ghent-altarpiece-adoration", title: "The Adoration of the Mystic Lamb (Ghent Altarpiece)", artist: "Jan van Eyck", year: "1432", tradition: "northern-renaissance", category: "classical-renaissance", mood: "epic", focalPoint: "center", themes: ["divinity", "paradise", "lamb"], pairedBooks: ["paradise-lost"], dominantColor: "#4A6A3A", aspectRatio: 1.45, wikiSearch: "Ghent Altarpiece Mystic Lamb van Eyck", institution: "St Bavo's Cathedral", license: "PD-Art" },

  // ─── Missing Renaissance ─────────────────────────────────────────────
  { id: "paradise-tintoretto", title: "Paradise", artist: "Tintoretto", year: "1588", tradition: "renaissance", category: "classical-renaissance", mood: "epic", focalPoint: "center", themes: ["heaven", "glory", "salvation"], pairedBooks: ["paradise-lost", "the-divine-comedy"], dominantColor: "#5A5A40", aspectRatio: 2.44, wikiSearch: "Tintoretto Paradise Palazzo Ducale", institution: "Palazzo Ducale, Venice", license: "PD-Art" },
  { id: "last-supper-tintoretto", title: "The Last Supper", artist: "Tintoretto", year: "1594", tradition: "renaissance", category: "classical-renaissance", mood: "dramatic", focalPoint: "center", themes: ["communion", "light", "divine"], pairedBooks: [], dominantColor: "#2A2818", aspectRatio: 2.16, wikiSearch: "Tintoretto Last Supper San Giorgio Maggiore", institution: "San Giorgio Maggiore, Venice", license: "PD-Art" },

  // ─── Missing Baroque ─────────────────────────────────────────────────
  { id: "prometheus-bound-rubens", title: "Prometheus Bound", artist: "Peter Paul Rubens", year: "c.1612", tradition: "baroque", category: "baroque-dutch", mood: "dramatic", focalPoint: "center", themes: ["punishment", "defiance", "myth"], pairedBooks: ["metamorphoses"], dominantColor: "#3A2818", aspectRatio: 0.83, wikiSearch: "Prometheus Bound Rubens Snyders", institution: "Philadelphia Museum of Art", license: "PD-Art" },
  { id: "descent-from-cross-rubens", title: "The Descent from the Cross", artist: "Peter Paul Rubens", year: "1614", tradition: "baroque", category: "baroque-dutch", mood: "dramatic", focalPoint: "center", themes: ["grief", "sacrifice", "devotion"], pairedBooks: [], dominantColor: "#3A2818", aspectRatio: 0.67, wikiSearch: "Descent Cross Rubens Antwerp Cathedral", institution: "Cathedral of Our Lady, Antwerp", license: "PD-Art" },
  { id: "death-of-germanicus", title: "The Death of Germanicus", artist: "Nicolas Poussin", year: "1627", tradition: "baroque", category: "baroque-dutch", mood: "dramatic", focalPoint: "center", themes: ["death", "honor", "mourning"], pairedBooks: ["the-histories"], dominantColor: "#5A4A38", aspectRatio: 1.53, wikiSearch: "Death Germanicus Poussin", institution: "Minneapolis Institute of Art", license: "PD-Art" },

  // ─── Missing Romantic ────────────────────────────────────────────────
  { id: "burning-houses-lords-commons", title: "The Burning of the Houses of Lords and Commons", artist: "J.M.W. Turner", year: "1835", tradition: "romantic", category: "romantic-sublime", mood: "sublime", focalPoint: "center", themes: ["fire", "spectacle", "destruction"], pairedBooks: [], dominantColor: "#8A5A30", aspectRatio: 1.31, wikiSearch: "Turner Burning Houses Lords Commons Philadelphia", institution: "Philadelphia Museum of Art", license: "PD-Art" },
  { id: "hamlet-horatio-graveyard", title: "Hamlet and Horatio in the Graveyard", artist: "Eugene Delacroix", year: "1839", tradition: "romantic", category: "romantic-sublime", mood: "contemplative", focalPoint: "center", themes: ["mortality", "philosophy", "fate"], pairedBooks: ["hamlet"], dominantColor: "#4A5A3A", aspectRatio: 1.24, wikiSearch: "Delacroix Hamlet Horatio graveyard", institution: "Musee du Louvre", license: "PD-Art" },
  { id: "derby-at-epsom", title: "The Derby at Epsom", artist: "Theodore Gericault", year: "1821", tradition: "romantic", category: "romantic-sublime", mood: "dramatic", focalPoint: "center", themes: ["speed", "competition", "motion"], pairedBooks: [], dominantColor: "#5A5A48", aspectRatio: 1.36, wikiSearch: "Gericault Derby Epsom", institution: "Musee du Louvre", license: "PD-Art" },
  { id: "great-red-dragon-blake", title: "The Great Red Dragon and the Woman Clothed in Sun", artist: "William Blake", year: "c.1805", tradition: "romantic", category: "romantic-sublime", mood: "sublime", focalPoint: "center", themes: ["apocalypse", "evil", "prophecy"], pairedBooks: ["paradise-lost"], dominantColor: "#4A3A20", aspectRatio: 0.78, wikiSearch: "Blake Great Red Dragon Woman clothed sun", institution: "Brooklyn Museum", license: "PD-Art" },
  { id: "newton-blake", title: "Newton", artist: "William Blake", year: "1795", tradition: "romantic", category: "romantic-sublime", mood: "contemplative", focalPoint: "center", themes: ["reason", "science", "limitation"], pairedBooks: [], dominantColor: "#3A4A4A", aspectRatio: 1.42, wikiSearch: "William Blake Newton monotype Tate", institution: "Tate Britain", license: "PD-Art" },

  // ─── Missing Pre-Raphaelites & Victorian ─────────────────────────────
  { id: "autumn-leaves-millais", title: "Autumn Leaves", artist: "John Everett Millais", year: "1856", tradition: "pre-raphaelite", category: "pre-raphaelite-victorian", mood: "contemplative", focalPoint: "center", themes: ["mortality", "beauty", "twilight"], pairedBooks: [], dominantColor: "#3A4A30", aspectRatio: 0.78, wikiSearch: "Millais Autumn Leaves Manchester", institution: "Manchester Art Gallery", license: "PD-Art" },
  { id: "light-of-the-world", title: "The Light of the World", artist: "William Holman Hunt", year: "1854", tradition: "pre-raphaelite", category: "pre-raphaelite-victorian", mood: "contemplative", focalPoint: "center", themes: ["faith", "light", "salvation"], pairedBooks: [], dominantColor: "#2A3A20", aspectRatio: 0.53, wikiSearch: "Holman Hunt Light World Keble", institution: "Keble College, Oxford", license: "PD-Art" },
  { id: "scapegoat-hunt", title: "The Scapegoat", artist: "William Holman Hunt", year: "1856", tradition: "pre-raphaelite", category: "pre-raphaelite-victorian", mood: "sublime", focalPoint: "center", themes: ["sacrifice", "wilderness", "atonement"], pairedBooks: [], dominantColor: "#7A6A50", aspectRatio: 1.77, wikiSearch: "Holman Hunt Scapegoat painting", institution: "Lady Lever Art Gallery", license: "PD-Art" },
  { id: "work-ford-madox-brown", title: "Work", artist: "Ford Madox Brown", year: "1865", tradition: "pre-raphaelite", category: "pre-raphaelite-victorian", mood: "epic", focalPoint: "center", themes: ["labor", "society", "morality"], pairedBooks: ["hard-times"], dominantColor: "#5A5A40", aspectRatio: 1.43, wikiSearch: "Ford Madox Brown Work painting Manchester", institution: "Manchester Art Gallery", license: "PD-Art" },
  { id: "last-of-england-brown", title: "The Last of England", artist: "Ford Madox Brown", year: "1855", tradition: "pre-raphaelite", category: "pre-raphaelite-victorian", mood: "contemplative", focalPoint: "center", themes: ["emigration", "farewell", "hope"], pairedBooks: [], dominantColor: "#4A5A5A", aspectRatio: 0.92, wikiSearch: "Ford Madox Brown Last of England", institution: "Birmingham Museum", license: "PD-Art" },
  { id: "king-cophetua-beggar-maid", title: "King Cophetua and the Beggar Maid", artist: "Edward Burne-Jones", year: "1884", tradition: "pre-raphaelite", category: "pre-raphaelite-victorian", mood: "intimate", focalPoint: "center", themes: ["love", "humility", "beauty"], pairedBooks: [], dominantColor: "#3A3A28", aspectRatio: 0.5, wikiSearch: "Burne-Jones King Cophetua Beggar Maid Tate", institution: "Tate Britain", license: "PD-Art" },
  { id: "garden-of-hesperides", title: "The Garden of the Hesperides", artist: "Frederic Leighton", year: "1892", tradition: "pre-raphaelite", category: "pre-raphaelite-victorian", mood: "serene", focalPoint: "center", themes: ["myth", "paradise", "golden apples"], pairedBooks: ["metamorphoses"], dominantColor: "#5A6A4A", aspectRatio: 1.0, wikiSearch: "Leighton Garden Hesperides painting", institution: "Lady Lever Art Gallery", license: "PD-Art" },

  // ─── Missing American Masters ────────────────────────────────────────
  { id: "niagara-church", title: "Niagara", artist: "Frederic Edwin Church", year: "1857", tradition: "hudson-river-school", category: "romantic-sublime", mood: "sublime", focalPoint: "center", themes: ["waterfall", "power", "nature"], pairedBooks: ["walden"], dominantColor: "#5A7A6A", aspectRatio: 2.22, wikiSearch: "Frederic Church Niagara painting", institution: "National Gallery of Art", license: "PD-Art" },
  { id: "fog-warning-homer", title: "The Fog Warning", artist: "Winslow Homer", year: "1885", tradition: "realist", category: "impressionist-modern", mood: "dramatic", focalPoint: "center", themes: ["sea", "danger", "labor"], pairedBooks: ["moby-dick"], dominantColor: "#4A5A5A", aspectRatio: 1.47, wikiSearch: "Winslow Homer Fog Warning painting", institution: "Museum of Fine Arts, Boston", license: "PD-Art" },
  { id: "gross-clinic-eakins", title: "The Gross Clinic", artist: "Thomas Eakins", year: "1875", tradition: "realist", category: "impressionist-modern", mood: "dramatic", focalPoint: "center", themes: ["medicine", "knowledge", "realism"], pairedBooks: [], dominantColor: "#2A2418", aspectRatio: 0.83, wikiSearch: "Thomas Eakins Gross Clinic", institution: "Philadelphia Museum of Art", license: "PD-Art" },
  { id: "carnation-lily-sargent", title: "Carnation, Lily, Lily, Rose", artist: "John Singer Sargent", year: "1886", tradition: "realist", category: "impressionist-modern", mood: "serene", focalPoint: "center", themes: ["twilight", "innocence", "beauty"], pairedBooks: [], dominantColor: "#3A5A3A", aspectRatio: 0.99, wikiSearch: "Sargent Carnation Lily Rose Tate", institution: "Tate Britain", license: "PD-Art" },

  // ─── Missing Russian & Eastern European ──────────────────────────────
  { id: "moonlit-night-bosphorus", title: "Moonlit Night on the Bosphorus", artist: "Ivan Aivazovsky", year: "1894", tradition: "romantic", category: "romantic-sublime", mood: "serene", focalPoint: "center", themes: ["moonlight", "sea", "tranquility"], pairedBooks: [], dominantColor: "#1A2A3A", aspectRatio: 1.33, wikiSearch: "Aivazovsky moonlit night Bosphorus", institution: "Private Collection", license: "PD-Art" },
  { id: "boyarynya-morozova", title: "Boyarynya Morozova", artist: "Vasily Surikov", year: "1887", tradition: "realist", category: "impressionist-modern", mood: "epic", focalPoint: "center", themes: ["defiance", "faith", "history"], pairedBooks: [], dominantColor: "#6A6A58", aspectRatio: 1.89, wikiSearch: "Surikov Boyarynya Morozova", institution: "Tretyakov Gallery", license: "PD-Art" },
  { id: "golden-autumn-levitan", title: "Golden Autumn", artist: "Isaac Levitan", year: "1895", tradition: "realist", category: "impressionist-modern", mood: "serene", focalPoint: "center", themes: ["autumn", "river", "beauty"], pairedBooks: ["walden"], dominantColor: "#7A8A4A", aspectRatio: 1.55, wikiSearch: "Levitan Golden Autumn painting", institution: "Tretyakov Gallery", license: "PD-Art" },

  // ─── Missing Symbolist ───────────────────────────────────────────────
  { id: "apparition-moreau", title: "The Apparition", artist: "Gustave Moreau", year: "c.1876", tradition: "symbolist", category: "pre-raphaelite-victorian", mood: "sublime", focalPoint: "center", themes: ["vision", "death", "desire"], pairedBooks: [], dominantColor: "#4A3A20", aspectRatio: 0.71, wikiSearch: "Gustave Moreau Apparition painting", institution: "Musee Gustave Moreau", license: "PD-Art" },
  { id: "sacred-grove-puvis", title: "The Sacred Grove", artist: "Pierre Puvis de Chavannes", year: "1884", tradition: "symbolist", category: "pre-raphaelite-victorian", mood: "serene", focalPoint: "center", themes: ["muses", "art", "paradise"], pairedBooks: [], dominantColor: "#6A7A5A", aspectRatio: 2.1, wikiSearch: "Puvis Chavannes Sacred Grove Arts Muses", institution: "Art Institute of Chicago", license: "PD-Art" },
  { id: "poor-fisherman-puvis", title: "The Poor Fisherman", artist: "Pierre Puvis de Chavannes", year: "1881", tradition: "symbolist", category: "pre-raphaelite-victorian", mood: "contemplative", focalPoint: "center", themes: ["poverty", "stillness", "resignation"], pairedBooks: [], dominantColor: "#7A8A7A", aspectRatio: 1.28, wikiSearch: "Puvis Chavannes Poor Fisherman painting", institution: "Musee d'Orsay", license: "PD-Art" },

  // ─── Missing Impressionist & Post-Impressionist ──────────────────────
  { id: "olympia-manet", title: "Olympia", artist: "Edouard Manet", year: "1863", tradition: "impressionist", category: "impressionist-modern", mood: "dramatic", focalPoint: "center", themes: ["scandal", "gaze", "modernity"], pairedBooks: [], dominantColor: "#4A4A38", aspectRatio: 1.32, wikiSearch: "Edouard Manet Olympia painting Orsay", institution: "Musee d'Orsay", license: "PD-Art" },
  { id: "absinthe-drinker-degas", title: "L'Absinthe", artist: "Edgar Degas", year: "1876", tradition: "impressionist", category: "impressionist-modern", mood: "contemplative", focalPoint: "center", themes: ["alienation", "urban", "addiction"], pairedBooks: [], dominantColor: "#7A7A68", aspectRatio: 0.76, wikiSearch: "Degas Absinthe painting Orsay", institution: "Musee d'Orsay", license: "PD-Art" },
  { id: "dance-class-degas", title: "The Dance Class", artist: "Edgar Degas", year: "1874", tradition: "impressionist", category: "impressionist-modern", mood: "serene", focalPoint: "center", themes: ["ballet", "practice", "movement"], pairedBooks: [], dominantColor: "#7A8A6A", aspectRatio: 0.85, wikiSearch: "Degas Dance Class Metropolitan painting", institution: "Metropolitan Museum of Art", license: "PD-Art" },
  { id: "self-portrait-bandaged-ear", title: "Self-Portrait with Bandaged Ear", artist: "Vincent van Gogh", year: "1889", tradition: "post-impressionist", category: "impressionist-modern", mood: "contemplative", focalPoint: "top", themes: ["suffering", "art", "identity"], pairedBooks: [], dominantColor: "#5A6A5A", aspectRatio: 0.79, wikiSearch: "Van Gogh Self-Portrait Bandaged Ear", institution: "Courtauld Gallery", license: "PD-Art" },
  { id: "large-bathers-cezanne", title: "The Large Bathers", artist: "Paul Cezanne", year: "1906", tradition: "post-impressionist", category: "impressionist-modern", mood: "contemplative", focalPoint: "center", themes: ["nature", "body", "structure"], pairedBooks: [], dominantColor: "#6A7A6A", aspectRatio: 1.29, wikiSearch: "Cezanne Large Bathers Philadelphia", institution: "Philadelphia Museum of Art", license: "PD-Art" },
  { id: "vision-after-sermon-gauguin", title: "Vision After the Sermon", artist: "Paul Gauguin", year: "1888", tradition: "post-impressionist", category: "impressionist-modern", mood: "dramatic", focalPoint: "center", themes: ["faith", "vision", "color"], pairedBooks: [], dominantColor: "#8A3A2A", aspectRatio: 1.38, wikiSearch: "Gauguin Vision Sermon Jacob Angel", institution: "National Gallery of Scotland", license: "PD-Art" },
  { id: "haystacks-sunset-monet", title: "Haystacks (End of Summer)", artist: "Claude Monet", year: "1891", tradition: "impressionist", category: "impressionist-modern", mood: "serene", focalPoint: "center", themes: ["light", "seasons", "landscape"], pairedBooks: [], dominantColor: "#8A7A50", aspectRatio: 1.33, wikiSearch: "Monet Haystacks sunset meules painting", institution: "Musee d'Orsay", license: "PD-Art" },

  // ─── Missing Japanese ────────────────────────────────────────────────
  { id: "kajikazawa-hokusai", title: "Kajikazawa in Kai Province", artist: "Katsushika Hokusai", year: "c.1831", tradition: "ukiyo-e", category: "impressionist-modern", mood: "dramatic", focalPoint: "center", themes: ["fishing", "mountain", "wave"], pairedBooks: [], dominantColor: "#4A6A7A", aspectRatio: 1.49, wikiSearch: "Hokusai Kajikazawa Kai Province Thirty-six Views Fuji", institution: "Multiple collections", license: "PD-Art" },
  { id: "plum-estate-kameido", title: "Plum Park in Kameido", artist: "Utagawa Hiroshige", year: "1857", tradition: "ukiyo-e", category: "impressionist-modern", mood: "serene", focalPoint: "center", themes: ["spring", "blossoms", "beauty"], pairedBooks: [], dominantColor: "#3A5A4A", aspectRatio: 0.67, wikiSearch: "Hiroshige Plum Park Kameido woodblock", institution: "Brooklyn Museum", license: "PD-Art" },

  // ─── Missing Spanish Golden Age ──────────────────────────────────────
  { id: "still-life-lemons-zurbaran", title: "Still Life with Lemons, Oranges and a Rose", artist: "Francisco de Zurbaran", year: "1633", tradition: "baroque", category: "baroque-dutch", mood: "contemplative", focalPoint: "center", themes: ["stillness", "devotion", "purity"], pairedBooks: [], dominantColor: "#1A1A10", aspectRatio: 1.65, wikiSearch: "Zurbaran Still Life Lemons Oranges Rose", institution: "Norton Simon Museum", license: "PD-Art" },

  // ─── Missing Additional Canonical ────────────────────────────────────
  { id: "grande-galerie-louvre-robert", title: "Design for the Grande Galerie of the Louvre", artist: "Hubert Robert", year: "1796", tradition: "neoclassical", category: "classical-renaissance", mood: "epic", focalPoint: "center", themes: ["architecture", "ruin", "art"], pairedBooks: [], dominantColor: "#6A6A50", aspectRatio: 1.31, wikiSearch: "Hubert Robert Grande Galerie Louvre painting", institution: "Musee du Louvre", license: "PD-Art" },
  { id: "slave-market-gerome", title: "The Slave Market", artist: "Jean-Leon Gerome", year: "1866", tradition: "academic", category: "pre-raphaelite-victorian", mood: "dramatic", focalPoint: "center", themes: ["slavery", "power", "body"], pairedBooks: [], dominantColor: "#6A5A40", aspectRatio: 0.76, wikiSearch: "Gerome Slave Market painting", institution: "Clark Art Institute", license: "PD-Art" },
  { id: "dante-inferno-dore", title: "Gustave Dore's Inferno: The Empyrean", artist: "Gustave Dore", year: "1868", tradition: "romantic", category: "romantic-sublime", mood: "sublime", focalPoint: "center", themes: ["paradise", "light", "vision"], pairedBooks: ["the-divine-comedy"], dominantColor: "#1A1A18", aspectRatio: 0.74, wikiSearch: "Gustave Dore Divine Comedy Empyrean illustration", institution: "Multiple collections", license: "PD-Art" },
  { id: "paradise-lost-dore", title: "Satan in Council (Paradise Lost)", artist: "Gustave Dore", year: "1866", tradition: "romantic", category: "romantic-sublime", mood: "sublime", focalPoint: "center", themes: ["Satan", "rebellion", "hell"], pairedBooks: ["paradise-lost"], dominantColor: "#2A2818", aspectRatio: 0.76, wikiSearch: "Gustave Dore Paradise Lost Satan Council", institution: "Multiple collections", license: "PD-Art" },
  { id: "the-cradle-morisot", title: "The Cradle", artist: "Berthe Morisot", year: "1872", tradition: "impressionist", category: "impressionist-modern", mood: "intimate", focalPoint: "center", themes: ["motherhood", "tenderness", "quiet"], pairedBooks: [], dominantColor: "#5A5A48", aspectRatio: 0.83, wikiSearch: "Berthe Morisot Cradle painting Orsay", institution: "Musee d'Orsay", license: "PD-Art" },
  { id: "odysseus-polyphemus-bocklin", title: "Odysseus and Polyphemus", artist: "Arnold Bocklin", year: "1896", tradition: "symbolist", category: "pre-raphaelite-victorian", mood: "dramatic", focalPoint: "center", themes: ["myth", "escape", "cunning"], pairedBooks: ["the-odyssey"], dominantColor: "#3A5A5A", aspectRatio: 1.58, wikiSearch: "Bocklin Odysseus Polyphemus painting", institution: "Museum of Fine Arts, Boston", license: "PD-Art" },
  { id: "opening-fifth-seal-el-greco", title: "Opening of the Fifth Seal", artist: "El Greco", year: "c.1610", tradition: "renaissance", category: "classical-renaissance", mood: "sublime", focalPoint: "center", themes: ["apocalypse", "ecstasy", "vision"], pairedBooks: [], dominantColor: "#3A4A4A", aspectRatio: 0.57, wikiSearch: "El Greco Opening Fifth Seal painting", institution: "Metropolitan Museum of Art", license: "PD-Art" },
];

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const existingIds = new Set(manifest.map((p) => p.id));

  let added = 0;
  let failed = 0;

  for (const p of newPaintings) {
    if (existingIds.has(p.id)) {
      console.log(`⊘ ${p.id}: already exists`);
      continue;
    }

    // Look up URL via Wikimedia API
    const thumbUrl = await searchAndGetUrl(p.wikiSearch);
    await new Promise((r) => setTimeout(r, 200));

    if (!thumbUrl) {
      console.log(`✗ ${p.id}: NOT FOUND (search: "${p.wikiSearch}")`);
      failed++;
      continue;
    }

    // Build the entry
    const entry = {
      id: p.id,
      filename: "",
      src: thumbUrl,
      title: p.title,
      artist: p.artist,
      year: p.year,
      focalPoint: p.focalPoint,
      dominantColor: p.dominantColor,
      aspectRatio: p.aspectRatio,
      category: p.category,
      mood: p.mood,
      tradition: p.tradition,
      themes: p.themes || [],
      pairedBooks: p.pairedBooks || [],
      era: parseInt(p.year) < 1500 ? "renaissance" : parseInt(p.year) < 1600 ? "renaissance" : parseInt(p.year) < 1700 ? "17th-century" : parseInt(p.year) < 1800 ? "18th-century" : "19th-century",
      medium: "Oil on canvas",
      institution: p.institution || "",
      sourceUrl: "",
      imageUrl: thumbUrl,
      license: p.license || "PD-Art",
      caption: "",
    };

    manifest.push(entry);
    existingIds.add(p.id);
    added++;
    console.log(`✓ ${p.id}`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n=== Results ===`);
  console.log(`Added: ${added}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total paintings: ${manifest.length}`);
}

main().catch(console.error);
