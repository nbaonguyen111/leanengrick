"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "noisnhanh_subscription";

export interface Subscription {
  isActive: boolean;
  expiresAt: string | null;
  plan: "free" | "monthly";
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription>({
    isActive: false,
    expiresAt: null,
    plan: "free",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Subscription;
        // Check if subscription is still valid
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setSubscription(parsed);
        } else {
          // Reset expired subscription
          setSubscription({
            isActive: false,
            expiresAt: null,
            plan: "free",
          });
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const purchaseSubscription = useCallback(() => {
    const now = new Date();
    const expiresAt = new Date(now.setMonth(now.getMonth() + 1)); // 1 month from now
    
    const newSubscription: Subscription = {
      isActive: true,
      expiresAt: expiresAt.toISOString(),
      plan: "monthly",
    };
    
    setSubscription(newSubscription);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubscription));
  }, []);

  const cancelSubscription = useCallback(() => {
    const newSubscription: Subscription = {
      isActive: false,
      expiresAt: null,
      plan: "free",
    };
    setSubscription(newSubscription);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubscription));
  }, []);

  const canAddPhrase = subscription.isActive;

  return {
    subscription,
    purchaseSubscription,
    cancelSubscription,
    canAddPhrase,
  };
}