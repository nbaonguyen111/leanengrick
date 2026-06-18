// Script seed dữ liệu vào Supabase
// Chạy: node scripts/seed.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = "https://kpvsjtcixwstoqcdozop.supabase.co";
const supabaseKey =
  "sb_publishable_iQmKwLujTdnNPxPoousiZA_P_OvgdBN";
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("🚀 Bắt đầu seed dữ liệu vào Supabase...\n");

  // Đọc file JSON
  const dataPath = join(__dirname, "..", "public", "data", "phrases.json");
  const raw = readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);

  // 1. Insert groups
  console.log("📁 Insert groups...");
  for (const group of data.groups) {
    const { error } = await supabase.from("groups").upsert(
      { id: group.id, name: group.name, icon: group.icon, name_en: group.nameEn },
      { onConflict: "id" }
    );
    if (error) {
      console.error(`  ❌ Error inserting group ${group.id}:`, error.message);
    } else {
      console.log(`  ✅ ${group.name}`);
    }
  }

  // 2. Insert phrases
  console.log("\n📝 Insert phrases...");
  let count = 0;
  for (const phrase of data.phrases) {
    const { error } = await supabase.from("phrases").upsert(
      {
        id: phrase.id,
        group_id: phrase.group_id,
        english_text: phrase.english_text,
        vietnamese_text: phrase.vietnamese_text,
        keywords: phrase.keywords,
      },
      { onConflict: "id" }
    );
    if (error) {
      console.error(`  ❌ Error inserting phrase #${phrase.id}:`, error.message);
    } else {
      count++;
    }
  }
  console.log(`  ✅ ${count} phrases inserted`);

  console.log("\n✨ Seed hoàn tất!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});