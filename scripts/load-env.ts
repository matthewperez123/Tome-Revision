/**
 * Side-effect module: load .env.local BEFORE any app module is evaluated.
 *
 * `@/lib/supabase/admin` reads SUPABASE_URL / SERVICE_ROLE_KEY at MODULE-EVAL
 * time (top-level consts), and ESM hoists `import` statements above inline code
 * — so a plain `config()` call in a script body runs too late. Importing THIS
 * module first guarantees env is populated before the admin client's module
 * body evaluates. Import it as the very first line of a verification script.
 */
import path from "node:path"
import { config } from "dotenv"

config({ path: path.resolve(__dirname, "../.env.local"), quiet: true })
