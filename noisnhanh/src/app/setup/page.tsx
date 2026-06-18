"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SetupPage() {
  const [status, setStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addStatus = (msg: string) => setStatus((prev) => [...prev, msg]);

  const runSetup = async () => {
    setLoading(true);
    setStatus([]);
    addStatus("🚀 Bắt đầu setup...");

    // 0. Disable RLS để anon key có thể ghi
    addStatus("🔓 Disabling RLS...");
    try {
      // Dùng Supabase Management API để chạy SQL
      const mgmtRes = await fetch("https://api.supabase.com/v1/projects/kpvsjtcixwstoqcdozop/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sb_publishable_iQmKwLujTdnNPxPoousiZA_P_OvgdBN",
        },
        body: JSON.stringify({
          query: `
            ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
            ALTER TABLE phrases DISABLE ROW LEVEL SECURITY;
            ALTER TABLE custom_groups DISABLE ROW LEVEL SECURITY;
            ALTER TABLE custom_phrases DISABLE ROW LEVEL SECURITY;
            ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
          `
        })
      });
      if (mgmtRes.ok) {
        addStatus("✅ RLS disabled!");
      } else {
        addStatus("⚠️ Could not disable RLS via API, trying direct insert...");
      }
    } catch {
      addStatus("⚠️ RLS disable failed, trying insert anyway...");
    }

    // 1. Insert groups
    addStatus("📁 Inserting groups...");
    const groups = [
      { id: "restaurant", name: "Nhà hàng", icon: "UtensilsCrossed", name_en: "Restaurant" },
      { id: "hotel", name: "Khách sạn", icon: "Hotel", name_en: "Hotel" },
      { id: "taxi", name: "Taxi", icon: "Car", name_en: "Taxi" },
      { id: "shopping", name: "Mua sắm", icon: "ShoppingBag", name_en: "Shopping" },
      { id: "emergency", name: "Cấp cứu", icon: "Ambulance", name_en: "Emergency" },
      { id: "dating", name: "Hẹn hò", icon: "Heart", name_en: "Dating" },
      { id: "travel", name: "Du lịch", icon: "Plane", name_en: "Travel" },
    ];

    const { error: gErr } = await supabase.from("groups").upsert(groups, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (gErr) {
      addStatus(`❌ Lỗi groups: ${gErr.message}`);
      addStatus("💡 Bạn cần tạo tables trước! Vào Supabase Dashboard > SQL Editor, paste nội dung file supabase/init.sql và chạy.");
      setLoading(false);
      return;
    }
    addStatus("✅ Groups OK!");

    // 2. Insert phrases
    addStatus("📝 Inserting phrases...");
    const res = await fetch("/data/phrases.json");
    const data = await res.json();

    let count = 0;
    for (const phrase of data.phrases) {
      const { error: pErr } = await supabase.from("phrases").upsert(
        {
          id: phrase.id,
          group_id: phrase.group_id,
          english_text: phrase.english_text,
          vietnamese_text: phrase.vietnamese_text,
          keywords: phrase.keywords,
        },
        { onConflict: "id", ignoreDuplicates: false }
      );
      if (pErr) {
        addStatus(`❌ Lỗi phrase #${phrase.id}: ${pErr.message.substring(0, 60)}`);
        setLoading(false);
        return;
      }
      count++;
    }
    addStatus(`✅ ${count} phrases inserted!`);

    addStatus("✨ Setup hoàn tất! Quay lại trang chủ để xem.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">⚙️ Setup NoiNhanh Database</h1>
        <p className="text-sm text-gray-500 mb-4">
          Bấm nút bên dưới để seed dữ liệu mẫu vào Supabase.
        </p>

        <button
          onClick={runSetup}
          disabled={loading}
          className="w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors mb-4"
        >
          {loading ? "⏳ Đang xử lý..." : "🚀 Chạy Setup"}
        </button>

        {status.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm font-mono max-h-60 overflow-y-auto">
            {status.map((s, i) => (
              <p key={i} className={s.startsWith("❌") ? "text-red-600" : s.startsWith("✅") || s.startsWith("✨") ? "text-emerald-600" : "text-gray-700"}>
                {s}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}