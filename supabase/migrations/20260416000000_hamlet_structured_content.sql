-- ═══════════════════════════════════════════════════════════════════════
-- Hamlet Structured Content
-- Line-level drama content with glosses, annotations, and trials
-- ═══════════════════════════════════════════════════════════════════════

-- Works (book-level metadata for structured-content works)
CREATE TABLE IF NOT EXISTS public.works (
  id TEXT PRIMARY KEY,                -- e.g. 'hamlet'
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Standard Ebooks',
  source_url TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  year INTEGER,
  genre TEXT,
  tradition TEXT,
  difficulty TEXT,
  section_count INTEGER NOT NULL DEFAULT 0,
  total_lines INTEGER NOT NULL DEFAULT 0,
  total_words INTEGER NOT NULL DEFAULT 0,
  est_read_minutes INTEGER NOT NULL DEFAULT 0,
  structural_unit_type TEXT NOT NULL DEFAULT 'chapter',
  cover_met_object_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sections (scenes for drama, chapters for prose)
CREATE TABLE IF NOT EXISTS public.sections (
  id TEXT PRIMARY KEY,                -- e.g. 'hamlet_act3_scene1'
  work_id TEXT NOT NULL
    REFERENCES public.works(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  act INTEGER,
  scene INTEGER,
  scene_title TEXT,
  line_count INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER NOT NULL DEFAULT 0,
  est_read_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sections_work ON public.sections(work_id, sequence);

-- Lines (individual verse/prose lines with speaker)
CREATE TABLE IF NOT EXISTS public.lines (
  section_id TEXT NOT NULL
    REFERENCES public.sections(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  array_index INTEGER NOT NULL,       -- preserves shared-line ordering
  speaker TEXT,
  text TEXT NOT NULL,
  PRIMARY KEY (section_id, array_index)
);

CREATE INDEX IF NOT EXISTS idx_lines_section_number ON public.lines(section_id, number);

-- Stage directions
CREATE TABLE IF NOT EXISTS public.stage_directions (
  id BIGSERIAL PRIMARY KEY,
  section_id TEXT NOT NULL
    REFERENCES public.sections(id) ON DELETE CASCADE,
  after_line INTEGER NOT NULL,
  text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stage_directions_section ON public.stage_directions(section_id, after_line);

-- Glosses (word/phrase-level definitions)
CREATE TABLE IF NOT EXISTS public.glosses (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL
    REFERENCES public.sections(id) ON DELETE CASCADE,
  line INTEGER NOT NULL,
  phrase TEXT NOT NULL,
  definition TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_glosses_section_line ON public.glosses(section_id, line);

-- Scene annotations (scholarly footnotes for the structured-content system;
-- renamed from "annotations" because that name is taken by the legacy
-- chapter-based annotation table).
CREATE TABLE IF NOT EXISTS public.scene_annotations (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL
    REFERENCES public.sections(id) ON DELETE CASCADE,
  line_start INTEGER NOT NULL,
  line_end INTEGER NOT NULL,
  citation_display TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sources TEXT[] DEFAULT '{}'::TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_scene_annotations_section ON public.scene_annotations(section_id, line_start);

-- Trials (comprehension quizzes)
CREATE TABLE IF NOT EXISTS public.trials (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL
    REFERENCES public.sections(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  prompt TEXT NOT NULL,
  options TEXT[] NOT NULL,
  answer_index INTEGER NOT NULL,
  wisdom_reward INTEGER NOT NULL DEFAULT 10,
  anchor_line_start INTEGER NOT NULL,
  anchor_line_end INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trials_section ON public.trials(section_id);

-- RLS: all content is public-read
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glosses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read works" ON public.works FOR SELECT USING (true);
CREATE POLICY "Anyone can read sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Anyone can read lines" ON public.lines FOR SELECT USING (true);
CREATE POLICY "Anyone can read stage_directions" ON public.stage_directions FOR SELECT USING (true);
CREATE POLICY "Anyone can read glosses" ON public.glosses FOR SELECT USING (true);
CREATE POLICY "Anyone can read scene_annotations" ON public.scene_annotations FOR SELECT USING (true);
CREATE POLICY "Anyone can read trials" ON public.trials FOR SELECT USING (true);
