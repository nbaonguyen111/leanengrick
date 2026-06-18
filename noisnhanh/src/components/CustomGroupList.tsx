"use client";

import { CustomGroup, Phrase } from "@/types";
import PhraseCard from "./PhraseCard";
import { useFavorites } from "@/hooks/useFavorites";

interface CustomGroupListProps {
  customGroups: CustomGroup[];
  getPhrasesByCustomGroup: (groupId: string) => Phrase[];
  isCustomPhrase: (id: number) => boolean;
  removePhrase: (id: number) => void;
  onEditPhrase?: (id: number) => void;
  currentUserName?: string;
}

export default function CustomGroupList({
  customGroups,
  getPhrasesByCustomGroup,
  isCustomPhrase,
  removePhrase,
  onEditPhrase,
  currentUserName,
}: CustomGroupListProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (customGroups.length === 0) return null;

  return (
    <div className="space-y-6 mb-6">
      {customGroups.map((group) => {
        const phrases = getPhrasesByCustomGroup(group.id);
        if (phrases.length === 0) return null;
        return (
          <div key={group.id}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-5 bg-emerald-500 rounded-full" />
              <h3 className="text-sm font-bold text-gray-800">
                {group.name}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                ({phrases.length} câu · @{group.author})
              </span>
            </div>
            <div className="space-y-3">
              {phrases.map((phrase) => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  isFavorite={isFavorite(phrase.id)}
                  isCustom={isCustomPhrase(phrase.id)}
                  currentUserName={currentUserName}
                  onToggleFavorite={toggleFavorite}
                  onEdit={isCustomPhrase(phrase.id) ? onEditPhrase : undefined}
                  onDelete={isCustomPhrase(phrase.id) ? removePhrase : undefined}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}