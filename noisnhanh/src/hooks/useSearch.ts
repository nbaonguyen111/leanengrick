"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Phrase } from "@/types";

export function useSearch(phrases: Phrase[]) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(phrases, {
      keys: [
        { name: "english_text", weight: 0.35 },
        { name: "vietnamese_text", weight: 0.3 },
        { name: "keywords", weight: 0.15 },
        { name: "author", weight: 0.15 },
        { name: "group_id", weight: 0.05 },
      ],
      threshold: 0.3,
      minMatchCharLength: 1,
      shouldSort: true,
    });
  }, [phrases]);

  const results = useMemo(() => {
    if (!query.trim()) return phrases;
    return fuse.search(query.trim()).map((r) => r.item);
  }, [query, fuse, phrases]);

  return {
    query,
    setQuery,
    results,
  };
}