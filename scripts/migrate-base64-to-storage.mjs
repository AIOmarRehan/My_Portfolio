/**
 * One-time migration: uploads base64 images from the database to Supabase
 * Storage and replaces the DB records with public URLs.
 *
 * Run: node scripts/migrate-base64-to-storage.mjs
 * Requires .env.local with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envPath = resolve(__dirname, '..', '.env.local')
const envRaw = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envRaw
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const SUPABASE_URL = env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'images'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const TABLES = ['projects', 'fullstack_projects', 'data_analytics_projects', 'articles']

async function migrate() {
  console.log('Starting base64 → Supabase Storage migration...\n')

  for (const table of TABLES) {
    console.log(`\n--- Processing table: ${table} ---`)

    const { data: rows, error } = await supabase
      .from(table)
      .select('id, image')
      .not('image', 'is', null)

    if (error) {
      console.error(`  Error fetching ${table}:`, error.message)
      continue
    }

    const base64Rows = (rows || []).filter(
      (r) => typeof r.image === 'string' && r.image.startsWith('data:')
    )

    if (base64Rows.length === 0) {
      console.log('  No base64 images found.')
      continue
    }

    console.log(`  Found ${base64Rows.length} base64 image(s). Uploading...`)

    for (const row of base64Rows) {
      const match = row.image.match(/^data:([^;]+);base64,(.+)$/)
      if (!match) {
        console.log(`  Skipping row ${row.id}: invalid base64 format`)
        continue
      }

      const contentType = match[1]
      const ext = contentType.split('/')[1] || 'png'
      const buffer = Buffer.from(match[2], 'base64')
      const fileName = `${table}/${Date.now()}-${row.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, buffer, {
          contentType,
          upsert: false,
        })

      if (uploadError) {
        console.error(`  Failed to upload row ${row.id}:`, uploadError.message)
        continue
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
      const publicUrl = urlData.publicUrl

      const { error: updateError } = await supabase
        .from(table)
        .update({ image: publicUrl })
        .eq('id', row.id)

      if (updateError) {
        console.error(`  Failed to update row ${row.id}:`, updateError.message)
      } else {
        console.log(`  Row ${row.id} → ${publicUrl}`)
      }
    }
  }

  console.log('\nMigration complete!')
}

migrate().catch(console.error)
