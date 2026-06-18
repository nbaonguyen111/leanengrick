"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Phrase, CustomGroup } from "@/types";

export function useCustomPhrases() {
  const [customPhrases, setCustomPhrases] = useState<Phrase[]>([]);
  const [customGroups, setCustomGroups] = useState<CustomGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const [groupsRes, phrasesRes] = await Promise.all([
      supabase.from("custom_groups").select("*").order("created_at"),
      supabase.from("custom_phrases").select("*").order("created_at"),
    ]);

    if (groupsRes.error) console.error("Error fetching custom groups:", groupsRes.error);
    if (phrasesRes.error) console.error("Error fetching custom phrases:", phrasesRes.error);

    setCustomGroups(
      (groupsRes.data || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        parent_group_id: g.parent_group_id,
        author: g.author,
      }))
    );

    setCustomPhrases(
      (phrasesRes.data || []).map((p: any) => ({
        id: p.id,
        group_id: p.group_id,
        english_text: p.english_text,
        vietnamese_text: p.vietnamese_text,
        keywords: p.keywords || [],
        author: p.author || "",
        custom_group_id: p.custom_group_id,
      }))
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addCustomGroup = useCallback(
    async (group: Omit<CustomGroup, "id">) => {
      const newGroup: CustomGroup = {
        ...group,
        id: "cg_" + Date.now() + Math.floor(Math.random() * 1000),
      };
      const { error } = await supabase.from("custom_groups").insert({
        id: newGroup.id,
        name: newGroup.name,
        parent_group_id: newGroup.parent_group_id,
        author: newGroup.author,
      });

      if (!error) {
        setCustomGroups((prev) => [...prev, newGroup]);
      }
      return newGroup;
    },
    []
  );

  const removeCustomGroup = useCallback(
    async (groupId: string) => {
      const { error } = await supabase
        .from("custom_groups")
        .delete()
        .eq("id", groupId);

      if (!error) {
        setCustomGroups((prev) => prev.filter((g) => g.id !== groupId));
        setCustomPhrases((prev) =>
          prev.map((p) =>
            p.custom_group_id === groupId ? { ...p, custom_group_id: undefined } : p
          )
        );
      }
    },
    []
  );

  const addPhrase = useCallback(
    async (phrase: Omit<Phrase, "id">) => {
      const newPhrase: Phrase = {
        ...phrase,
        id: Date.now() + Math.floor(Math.random() * 1000),
      };
      const { error } = await supabase.from("custom_phrases").insert({
        id: newPhrase.id,
        group_id: newPhrase.group_id,
        english_text: newPhrase.english_text,
        vietnamese_text: newPhrase.vietnamese_text,
        keywords: newPhrase.keywords,
        author: newPhrase.author,
        custom_group_id: newPhrase.custom_group_id,
      });

      if (!error) {
        setCustomPhrases((prev) => [...prev, newPhrase]);
      }
      return newPhrase;
    },
    []
  );

  const updatePhrase = useCallback(
    async (id: number, updates: Partial<Omit<Phrase, "id">>) => {
      const { error } = await supabase
        .from("custom_phrases")
        .update({
          english_text: updates.english_text,
          vietnamese_text: updates.vietnamese_text,
          keywords: updates.keywords,
          author: updates.author,
          custom_group_id: updates.custom_group_id,
        })
        .eq("id", id);

      if (!error) {
        setCustomPhrases((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
      }
    },
    []
  );

  const removePhrase = useCallback(async (id: number) => {
    const { error } = await supabase
      .from("custom_phrases")
      .delete()
      .eq("id", id);

    if (!error) {
      setCustomPhrases((prev) => prev.filter((p) => p.id !== id));
    }
  }, []);

  const isCustomPhrase = useCallback(
    (id: number) => customPhrases.some((p) => p.id === id),
    [customPhrases]
  );

  const getCustomGroupsByParent = useCallback(
    (parentGroupId: string) =>
      customGroups.filter((g) => g.parent_group_id === parentGroupId),
    [customGroups]
  );

  const getCustomGroupsByAuthor = useCallback(
    (author: string) =>
      customGroups.filter(
        (g) => g.author.toLowerCase() === author.toLowerCase()
      ),
    [customGroups]
  );

  const getPhrasesByCustomGroup = useCallback(
    (customGroupId: string) =>
      customPhrases.filter((p) => p.custom_group_id === customGroupId),
    [customPhrases]
  );

  const getPhrasesByAuthor = useCallback(
    (author: string) =>
      customPhrases.filter(
        (p) => p.author?.toLowerCase() === author.toLowerCase()
      ),
    [customPhrases]
  );

  return {
    customPhrases,
    customGroups,
    loading,
    addPhrase,
    updatePhrase,
    removePhrase,
    isCustomPhrase,
    addCustomGroup,
    removeCustomGroup,
    getCustomGroupsByParent,
    getCustomGroupsByAuthor,
    getPhrasesByCustomGroup,
    getPhrasesByAuthor,
    refetch: fetchData,
  };
}