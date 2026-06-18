import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kpvsjtcixwstoqcdozop.supabase.co";
const supabaseKey =
  "sb_publishable_iQmKwLujTdnNPxPoousiZA_P_OvgdBN";

export async function POST() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const results: string[] = [];

  // 1. Create groups
  const { error: gError } = await supabase.from("groups").upsert(
    [
      { id: "restaurant", name: "Nhà hàng", icon: "UtensilsCrossed", name_en: "Restaurant" },
      { id: "hotel", name: "Khách sạn", icon: "Hotel", name_en: "Hotel" },
      { id: "taxi", name: "Taxi", icon: "Car", name_en: "Taxi" },
      { id: "shopping", name: "Mua sắm", icon: "ShoppingBag", name_en: "Shopping" },
      { id: "emergency", name: "Cấp cứu", icon: "Ambulance", name_en: "Emergency" },
      { id: "dating", name: "Hẹn hò", icon: "Heart", name_en: "Dating" },
      { id: "travel", name: "Du lịch", icon: "Plane", name_en: "Travel" },
    ],
    { onConflict: "id", ignoreDuplicates: false }
  );

  if (gError) {
    results.push(`❌ Groups error: ${gError.message}`);
    return NextResponse.json({ success: false, results, hint: "Tables chưa được tạo. Vào Supabase Dashboard > SQL Editor, paste nội dung file supabase/init.sql và chạy trước." });
  }
  results.push("✅ Groups created");

  // 2. Read phrases from JSON and insert
  const { readFileSync } = await import("fs");
  const { join } = await import("path");
  const dataPath = join(process.cwd(), "public", "data", "phrases.json");
  const raw = readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);

  // Insert phrases in batches
  const batchSize = 20;
  for (let i = 0; i < data.phrases.length; i += batchSize) {
    const batch = data.phrases.slice(i, i + batchSize).map((p: any) => ({
      id: p.id,
      group_id: p.group_id,
      english_text: p.english_text,
      vietnamese_text: p.vietnamese_text,
      keywords: p.keywords,
    }));
    const { error: pError } = await supabase.from("phrases").upsert(batch, {
      onConflict: "id",
      ignoreDuplicates: false,
    });
    if (pError) {
      results.push(`❌ Phrases batch error: ${pError.message.substring(0, 80)}`);
      return NextResponse.json({ success: false, results });
    }
  }
  results.push(`✅ ${data.phrases.length} phrases inserted`);

  return NextResponse.json({ success: true, results });
}