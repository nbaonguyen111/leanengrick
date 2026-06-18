"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Group, Phrase } from "@/types";

export function usePhrases() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Fetch groups
    const { data: groupsData, error: groupsError } = await supabase
      .from("groups")
      .select("*")
      .order("id");

    if (groupsError) {
      setError(groupsError.message);
      setLoading(false);
      return;
    }

    // Fetch phrases
    const { data: phrasesData, error: phrasesError } = await supabase
      .from("phrases")
      .select("*")
      .order("id");

    if (phrasesError) {
      setError(phrasesError.message);
      setLoading(false);
      return;
    }

    setGroups(groupsData || []);
    setPhrases(
      (phrasesData || []).map((p) => ({
        id: p.id,
        group_id: p.group_id,
        english_text: p.english_text,
        vietnamese_text: p.vietnamese_text,
        keywords: p.keywords || [],
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: { groups, phrases },
    loading,
    error,
    refetch: fetchData,
  };
}