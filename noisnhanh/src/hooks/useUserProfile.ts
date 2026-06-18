"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "noisnhanh_user_profile";

export function useUserProfile() {
  const [name, setName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.name) setName(parsed.name);
      } catch {
        // ignore
      }
    }
  }, []);

  const updateName = useCallback((newName: string) => {
    const trimmed = newName.trim();
    setName(trimmed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: trimmed }));
  }, []);

  const hasProfile = name.trim().length > 0;

  return { name, updateName, hasProfile };
}