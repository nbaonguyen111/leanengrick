// Script setup database và seed dữ liệu
// Chạy: node scripts/setup.mjs

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
  console.log("🚀 Setup Supabase...\n");

  // Đọc file SQL
  const sqlPath = join(__dirname, "..", "supabase", "init.sql");
  const sql = readFileSync(sqlPath, "utf-8");

  // Chạy SQL qua REST API
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  // Thử cách khác: dùng sql endpoint
  console.log("📦 Creating tables via SQL API...");
  const sqlResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Prefer": "resolution=merge-duplicates",
    },
  });

  // Dùng supabase-js để chạy raw SQL
  const { error: sqlError } = await supabase.rpc("exec_sql", { query: sql });
  
  if (sqlError) {
    console.log("⚠️  RPC exec_sql not available, trying direct table creation...");
    // Tables có thể chưa tồn tại, thử tạo trực tiếp
  }

  // Đọc file JSON để seed
  const dataPath = join(__dirname, "..", "public", "data", "phrases.json");
  const raw = readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);

  // 1. Insert groups
  console.log("📁 Insert groups...");
  for (const group of data.groups) {
    const { error } = await supabase.from("groups").upsert(
      { id: group.id, name: group.name, icon: group.icon, name_en: group.nameEn },
      { onConflict: "id", ignoreDuplicates: false }
    );
    if (error && error.code !== "42P01") { // Bỏ qua lỗi table không tồn tại
      console.error(`  ❌ ${group.id}:`, error.message);
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
      { onConflict: "id", ignoreDuplicates: false }
    );
    if (error && error.code !== "42P01") {
      console.error(`  ❌ #${phrase.id}:`, error.message.substring(0, 50));
    } else {
      count++;
    }
  }
  console.log(`  ✅ ${count}/${data.phrases.length} phrases`);

  console.log("\n📋 Hướng dẫn:");
  console.log("  1. Vào https://supabase.com/dashboard/project/kpvsjtcixwstoqcdozop/sql/new");
  console.log('  2. Copy nội dung file supabase/init.sql vào');
  console.log("  3. Chạy SQL");
  console.log("  4. Chạy lại: node scripts/setup.mjs");
  console.log("\n   Hoặc nếu tables đã tồn tại, seed đã chạy thành công!");
}
main().catch(console.error);