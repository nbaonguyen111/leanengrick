"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useUserProfile } from "./useUserProfile";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const { name: userName } = useUserProfile();

  const fetchFavorites = useCallback(async () => {
    if (!userName) {
      setFavorites(new Set());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("phrase_id, custom_phrase_id")
      .eq("user_name", userName);

    if (error) {
      console.error("Error fetching favorites:", error);
      setLoading(false);
      return;
    }

    const favSet = new Set<number>();
    (data || []).forEach((fav: any) => {
      if (fav.phrase_id) favSet.add(fav.phrase_id);
      if (fav.custom_phrase_id) favSet.add(fav.custom_phrase_id);
    });

    setFavorites(favSet);
    setLoading(false);
  }, [userName]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (id: number) => {
      if (!userName) return;

      const isFav = favorites.has(id);

      if (isFav) {
        // Remove
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_name", userName)
          .or(`phrase_id.eq.${id},custom_phrase_id.eq.${id}`);

        if (!error) {
          setFavorites((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      } else {
        // Add
        const { error } = await supabase.from("favorites").insert({
          user_name: userName,
          phrase_id: id,
        });

        if (!error) {
          setFavorites((prev) => new Set(prev).add(id));
        }
      }
    },
    [favorites, userName]
  );

  const isFavorite = useCallback(
    (id: number) => favorites.has(id),
    [favorites]
  );

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
}